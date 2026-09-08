import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

// Compile only the pure TypeScript domain into an isolated folder; no browser or added test dependency.
const temporary = await mkdtemp(join(tmpdir(), 'nasp-palliative-test-'))
await writeFile(join(temporary, 'package.json'), '{"type":"module"}')
for (const name of ['types', 'domain', 'demo-data', 'store']) {
  const source = await readFile(new URL(`./${name}.ts`, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.js'").replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
  await writeFile(join(temporary, `${name}.js`), compiled)
}
const d = await import(pathToFileURL(join(temporary, 'domain.js')).href)
const { createDemoState } = await import(pathToFileURL(join(temporary, 'demo-data.js')).href)
after(() => rm(temporary, { recursive: true, force: true }))
const NOW = new Date('2026-09-08T12:00:00+05:00')
function fixture() { const state = createDemoState(NOW); return { state, api: d.createPalliativeDomain(state, () => NOW), find: status => state.cases.find(c => c.status === status) } }
const decision = (c, more = {}) => ({ outcome: 'APPROVE', date: '2026-09-08', number: 'TEST-MK-01', members: 'Shifokor, psixolog, ijtimoiy xodim', reason: 'Konsiliumning inson tomonidan kiritilgan xulosasi', service: c.requestedService, safeCare: true, safeTransport: true, consent: c.requestedService === 'MOBILE', consentPerson: c.guardianName, ...more })
function newChild(api, more = {}) { return api.createCase({ childName: 'Test bola', birthDate: '2016-03-12', sex: 'MALE', region: 'SAMARQAND', district: 'Samarqand', address: 'Test manzil', guardianName: 'Test vakil', relationship: 'Onasi', phone: '000', familyDoctor: 'Test shifokor', clinic: 'Test poliklinika', diagnosis: 'Test tashxis', medicalIndication: 'Inson tasdiqlagan ko‘rsatma', requestedService: 'INPATIENT', urgency: 'ROUTINE', ...more }) }

test('seed contains broad fictional scenario coverage, finite beds and two teams', () => {
  const { state } = fixture(); assert.ok(state.cases.length >= 18); assert.equal(state.teams.length, 2)
  assert.ok(new Set(state.cases.map(c => c.status)).size >= 12)
  assert.ok(state.cases.every(c => c.childName.includes('(namuna)')))
  assert.ok(state.cases.find(c => c.status === 'MOBILE').assessments.some(a => a.type === 'HOME'))
})
test('invalid and future birth dates, NaN score and invalid JShShIR are rejected without adding cases', () => {
  const { api, state, find } = fixture(); const count = state.cases.length
  for (const birthDate of ['2026-02-30', '2027-01-01', '2008-09-08']) assert.equal(newChild(api, { birthDate }).ok, false)
  assert.equal(newChild(api, { pinfl: 'bad' }).ok, false); assert.equal(state.cases.length, count)
  assert.equal(api.recordAssessment(find('INTAKE').id, { type: 'PAPAS', score: NaN, date: '2026-09-08', assessor: 'A', methodology: 'B', document: 'C' }).ok, false)
})
test('PaPaS 14 leads to observation while PaPaS 15 only progresses to referral', () => {
  const { api, find } = fixture(); const c = find('INTAKE')
  const input = { type: 'PAPAS', score: 14, date: '2026-09-08', assessor: 'A', methodology: 'B', document: 'C' }
  assert.equal(api.recordAssessment(c.id, input).ok, true); assert.equal(c.status, 'OBSERVATION')
  assert.equal(api.recordAssessment(c.id, { ...input, score: 15 }).ok, true); assert.equal(c.status, 'REFERRAL'); assert.equal(c.decisions.length, 0)
})
test('referral requires source consilium, Z51.5, history extract and PaPaS; no clinical auto-approval', () => {
  const { api, find } = fixture(); const c = find('CONSILIUM'); const valid = { ...c.referral }
  for (const bad of [{ sourceConsiliumEligible: false }, { diagnosisCode: 'Z00.0' }, { historyExtract: '' }, { historyPages: 0 }, { papasDocument: '' }]) {
    assert.equal(api.saveReferral(c.id, { ...valid, ...bad }).ok, true)
    assert.equal(api.submitReferral(c.id).ok, false)
  }
  assert.equal(api.saveReferral(c.id, valid).ok, true); assert.equal(api.submitReferral(c.id).ok, true)
  assert.equal(c.status, 'CONSILIUM'); assert.equal(c.decisions.length, 0); assert.ok(c.referralHistory.length >= 5)
})
test('source consilium never substitutes for centre decision; pause remains reviewable', () => {
  const { api, find } = fixture(); const c = find('CONSILIUM')
  assert.equal(api.startEpisode(c.id, { service: 'INPATIENT', startDate: '2026-09-08', plannedEndDate: '2026-09-15', bedId: 'bed-2', admissionType: 'TEMPORARY', decisionNumber: 'X', decisionReason: 'Y' }).ok, false)
  assert.equal(api.recordDecision(c.id, decision(c, { outcome: 'PAUSE', destination: 'Boshqa shifoxona', reviewDate: '2026-09-10' })).ok, true)
  assert.equal(c.status, 'PAUSED'); assert.equal(api.recordDecision(c.id, decision(c)).ok, true); assert.equal(c.status, 'APPROVED')
})
test('bed cannot be allocated twice and 15-day initial admission cannot bypass normal limit', () => {
  const { api, find } = fixture(); const c = find('CONSILIUM'); api.recordDecision(c.id, decision(c))
  const input = { service: 'INPATIENT', startDate: '2026-09-08', plannedEndDate: '2026-09-21', bedId: 'bed-1', admissionType: 'TEMPORARY', decisionNumber: 'MK', decisionReason: 'Sabab' }
  assert.equal(api.startEpisode(c.id, input).ok, false)
  assert.equal(api.startEpisode(c.id, { ...input, bedId: 'bed-2', plannedEndDate: '2026-09-22' }).ok, false)
  assert.equal(api.startEpisode(c.id, { ...input, bedId: 'bed-2' }).ok, true)
  assert.equal(api.startEpisode(c.id, { ...input, bedId: 'bed-3' }).ok, false)
})
test('extension requires documented human decision and rejects over-28 total days', () => {
  const { api, find } = fixture(); const c = find('INPATIENT'); const e = d.activeEpisode(c)
  const input = { plannedEndDate: d.addDays(e.startDate, 27), decisionNumber: 'UZ-1', decisionDate: '2026-09-08', reason: 'Konsilium xulosasi' }
  assert.equal(api.extendEpisode(c.id, { ...input, reason: '' }).ok, false)
  assert.equal(api.extendEpisode(c.id, { ...input, plannedEndDate: d.addDays(e.startDate, 28) }).ok, false)
  assert.equal(api.extendEpisode(c.id, input).ok, true); assert.equal(e.extensions.length, 1)
})
test('repeat episode counts previous inpatient days in same year', () => {
  const { api, find } = fixture(); const c = find('FOLLOW_UP')
  api.saveReferral(c.id, { ...c.referral, number: 'NEW-Y', date: '2026-09-08' }); api.submitReferral(c.id); api.recordDecision(c.id, decision(c))
  assert.equal(api.startEpisode(c.id, { service: 'INPATIENT', startDate: '2026-09-08', plannedEndDate: '2026-09-21', bedId: 'bed-3', admissionType: 'TEMPORARY', decisionNumber: 'MK', decisionReason: 'Takroriy qabul' }).ok, false)
})
test('adult exception applies only to existing inpatient continuation and never beyond 21', () => {
  const { api, find } = fixture(); const c = find('INPATIENT'); c.birthDate = '2008-09-09'
  const input = { plannedEndDate: '2026-09-20', decisionNumber: 'UZ-18', decisionDate: '2026-09-08', reason: 'Davom ettirish' }
  assert.equal(api.extendEpisode(c.id, input).ok, false)
  assert.equal(api.extendEpisode(c.id, { ...input, adultContinuation: true }).ok, true)
  c.birthDate = '2005-09-21'
  assert.equal(api.extendEpisode(c.id, { ...input, plannedEndDate: '2026-09-21', adultContinuation: true }).ok, false)
})
test('terminal admission has no invented six-month discharge deadline', () => {
  const { api, find } = fixture(); const c = find('CONSILIUM'); api.recordDecision(c.id, decision(c))
  assert.equal(api.startEpisode(c.id, { service: 'INPATIENT', startDate: '2026-09-08', bedId: 'bed-2', admissionType: 'TERMINAL', decisionNumber: 'MK-TERM', decisionReason: 'Muddatsiz qabul bo‘yicha konsilium klinik xulosasi' }).ok, true)
  assert.equal(d.activeEpisode(c).plannedEndDate, undefined)
})
test('home-frequency thresholds are separate from PaPaS; override needs reason', () => {
  assert.deepEqual([14, 15, 20, 21, 24, 25].map(d.suggestedWeeklyVisits), [undefined, 1, 1, 2, 2, 3])
  const { api, find } = fixture(); const c = find('MOBILE'); const input = { type: 'HOME', score: 20, date: '2026-09-08', assessor: 'A', methodology: 'Uy usuli', document: 'X', weeklyVisits: 3 }
  assert.equal(api.recordAssessment(c.id, input).ok, false)
  assert.equal(api.recordAssessment(c.id, { ...input, overrideReason: 'MK-22 qarori; klinik holat bo‘yicha 3 tashrif' }).ok, true)
  assert.equal(d.latestAssessment(c, 'PAPAS').score, 24)
})
test('team and patient visit time overlaps are blocked; remote consultation stays separate', () => {
  const { api, find, state } = fixture(); const c = find('MOBILE')
  const input = { caseId: c.id, teamId: 'team-1', scheduledAt: '2026-09-09T14:15', durationMinutes: 60, type: 'HOME', purpose: 'Tashrif' }
  assert.equal(api.scheduleVisit(input).ok, false)
  const result = api.scheduleVisit({ ...input, scheduledAt: '2026-09-09T15:00' }); assert.equal(result.ok, true)
  assert.equal(api.startVisit(result.id).ok, false)
  assert.equal(state.visits.filter(v => v.caseId === c.id && v.type === 'REMOTE').length, 1)
})
test('equipment requires contract, prevents reissue, and retains allocation on return', () => {
  const { api, find, state } = fixture(); const c = find('MOBILE')
  assert.equal(api.issueEquipment('equipment-3', find('INPATIENT').id, 'SH-INPATIENT').ok, false)
  assert.equal(state.equipment.find(e => e.id === 'equipment-3').status, 'AVAILABLE')
  assert.equal(api.issueEquipment('equipment-3', c.id, '').ok, false)
  assert.equal(api.issueEquipment('equipment-3', c.id, 'SH-TEST').ok, true)
  assert.equal(api.issueEquipment('equipment-3', c.id, 'SH-OTHER').ok, false)
  assert.equal(api.returnEquipment('equipment-3', 'Dalolatnoma; soz').ok, true)
  const equipment = state.equipment.find(e => e.id === 'equipment-3'); assert.equal(equipment.allocations.length, 1); assert.ok(equipment.allocations[0].returnedAt)
})
test('death closes clinical episode and planned visits, frees bed, preserves separate family support', () => {
  const { api, find } = fixture(); const c = find('INPATIENT'); const before = JSON.stringify(c.timeline[0])
  const input = { endDate: '2026-09-08', reason: 'DEATH', summary: 'Vafot qaydi', document: 'Epikriz', deathObjection: true }
  assert.equal(api.closeEpisode(c.id, input).ok, false)
  assert.equal(api.closeEpisode(c.id, { ...input, pathologyReferral: 'Patologiya yo‘nalishi' }).ok, true)
  assert.equal(d.activeEpisode(c), undefined); assert.equal(c.status, 'BEREAVEMENT'); assert.equal(c.familySupport.deadline, '2026-12-08')
  assert.equal(JSON.stringify(c.timeline[0]), before)
  assert.equal(api.scheduleVisit({ caseId: c.id, teamId: 'team-2', scheduledAt: '2026-12-09T10:00', durationMinutes: 60, type: 'HOME', purpose: 'Oilaga yordam' }).ok, false)
})
test('calendar-month deadline clamps end of month and family closure preserves clinical history', () => {
  assert.equal(d.addCalendarMonths('2026-01-31', 3), '2026-04-30')
  const { api, find } = fixture(); const c = find('BEREAVEMENT'); const episodeCount = c.episodes.length
  for (const task of c.careTasks) assert.equal(api.completeCareTask(c.id, task.id, 'Oilaviy yordam yakunlandi').ok, true)
  assert.equal(api.closeFamilySupport(c.id).ok, true); assert.equal(c.episodes.length, episodeCount); assert.equal(c.status, 'CLOSED')
})
test('followup requires explicit handoff with receiving doctor and dates', () => {
  const { api, find } = fixture(); const c = find('INPATIENT')
  assert.equal(api.closeEpisode(c.id, { endDate: '2026-09-08', reason: 'DISCHARGE', summary: 'Kuzatuvga', document: 'EPI' }).ok, true)
  assert.equal(c.handoffs.length, 0)
  const input = { date: '2026-09-08', doctor: 'Oilaviy shifokor', clinic: 'Poliklinika', document: 'TOP', nextReviewDate: '2026-09-10', note: 'Qabul tasdig‘i' }
  assert.equal(api.recordHandoff(c.id, { ...input, doctor: '' }).ok, false)
  assert.equal(api.recordHandoff(c.id, input).ok, true); assert.equal(c.handoffs.length, 1)
})
test('historical intake supports earlier PaPaS and retains the actual system registration timestamp', () => {
  const { api } = fixture()
  for (const intakeDate of ['2026-02-30', '2026-09-09', '2016-03-11']) assert.equal(newChild(api, { intakeDate }).ok, false)
  const result = newChild(api, { intakeDate: '2026-09-01' }); assert.equal(result.ok, true)
  const c = api.getCase(result.id); const registeredAt = c.createdAt
  assert.equal(c.intakeDate, '2026-09-01'); assert.equal(c.assessmentDueDate, '2026-09-04'); assert.equal(registeredAt, NOW.toISOString())
  const assessment = { type: 'PAPAS', score: 19, date: '2026-09-02', assessor: 'Shifokor', methodology: 'PaPaS hujjati', document: 'OLD-PAPAS' }
  assert.equal(api.recordAssessment(c.id, { ...assessment, date: '2026-08-31' }).ok, false)
  assert.equal(api.recordAssessment(c.id, assessment).ok, true)
  const update = { ...c, intakeDate: undefined, guardianName: 'Yangilangan vakil' }
  assert.equal(api.updateCase(c.id, update).ok, true)
  assert.equal(c.intakeDate, '2026-09-01'); assert.equal(c.assessmentDueDate, '2026-09-04'); assert.equal(c.createdAt, registeredAt)
  assert.equal(api.updateCase(c.id, { ...update, intakeDate: '2026-09-03' }).ok, false)
})
test('expired family support blocks new and completed family tasks using actual current date', () => {
  const { state, find } = fixture(); const c = find('BEREAVEMENT'); const task = c.careTasks[0]
  const expired = d.createPalliativeDomain(state, () => new Date(`${d.addDays(c.familySupport.deadline, 1)}T12:00:00+05:00`))
  assert.equal(expired.addCareTask(c.id, { title: 'Oilaga maslahat', category: 'FAMILY', assignee: 'Psixolog', dueDate: c.familySupport.deadline, target: 'FAMILY' }).ok, false)
  assert.equal(expired.completeCareTask(c.id, task.id, 'Kechikkan xizmat').ok, false); assert.equal(task.status, 'PLANNED')
  const onDeadline = d.createPalliativeDomain(state, () => new Date(`${c.familySupport.deadline}T12:00:00+05:00`))
  assert.equal(onDeadline.completeCareTask(c.id, task.id, 'Muddatning oxirgi kunida bajarildi').ok, true)
})
test('closing expired family support explicitly cancels unfinished tasks and keeps completed services unchanged', () => {
  const { state, api, find } = fixture(); const c = find('BEREAVEMENT'); const completed = c.careTasks[0]
  assert.equal(api.completeCareTask(c.id, completed.id, 'Psixologik maslahat bajarildi').ok, true)
  const added = api.addCareTask(c.id, { title: 'Keyingi oilaviy maslahat', category: 'FAMILY', assignee: 'Psixolog', dueDate: '2026-09-20', target: 'FAMILY' }); assert.equal(added.ok, true)
  const pending = c.careTasks.find(t => t.id === added.id)
  const expired = d.createPalliativeDomain(state, () => new Date(`${d.addDays(c.familySupport.deadline, 1)}T12:00:00+05:00`))
  assert.equal(expired.closeFamilySupport(c.id).ok, true)
  assert.equal(c.status, 'CLOSED'); assert.equal(pending.status, 'CANCELLED'); assert.ok(pending.cancellationNote.includes('bajarilmagan'))
  assert.equal(pending.completedAt, undefined); assert.equal(completed.status, 'DONE'); assert.equal(completed.completionNote, 'Psixologik maslahat bajarildi')
  assert.ok(c.timeline.some(event => event.title === 'Bajarilmagan oilaviy vazifalar bekor qilindi'))
  assert.ok(state.visits.filter(v => v.caseId === c.id).every(v => !['PLANNED', 'IN_PROGRESS'].includes(v.status)))
})
test('demo actions work without accessing browser storage and preserve old prototype data', async () => {
  const originalWindow = globalThis.window
  let storageAccesses = 0
  globalThis.window = { get localStorage() { storageAccesses++; throw new Error('Browser storage is unavailable') } }
  try {
    const module = await import(`${pathToFileURL(join(temporary, 'store.js')).href}?memory`)
    const store = module.usePalliativeStore(); const count = store.cases.length
    const created = newChild(store)
    assert.equal(created.ok, true); assert.equal(store.cases.length, count + 1)
    assert.equal(store.getCase(created.id).childName, 'Test bola')
    assert.equal(storageAccesses, 0)
  } finally { globalThis.window = originalWindow }
})
test('reset restores every demo collection in the same reactive session and discards trial actions', async () => {
  const module = await import(`${pathToFileURL(join(temporary, 'store.js')).href}?reset`)
  const store = module.usePalliativeStore(); const state = store.state
  const count = store.cases.length
  const initial = ['cases', 'visits', 'beds', 'teams', 'equipment'].map(key => store[key].length)
  const created = newChild(store); assert.equal(created.ok, true)
  store.beds[0].available = false
  store.resetDemo()
  assert.equal(store, module.usePalliativeStore()); assert.equal(store.state, state)
  assert.equal(store.cases.length, count); assert.equal(store.getCase(created.id), undefined)
  assert.deepEqual(['cases', 'visits', 'beds', 'teams', 'equipment'].map(key => store[key].length), initial)
  assert.equal(store.beds[0].available, true)
  const newAction = newChild(store, { childName: 'Resetdan keyingi sinov' })
  assert.equal(newAction.ok, true); assert.equal(store.getCase(newAction.id).childName, 'Resetdan keyingi sinov')
})
