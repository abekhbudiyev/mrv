import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const temporary = await mkdtemp(join(tmpdir(), 'nasp-palliative-demo-'))
await writeFile(join(temporary, 'package.json'), '{"type":"module"}')
for (const name of ['types', 'domain', 'demo-data']) {
  const source = await readFile(new URL(`./${name}.ts`, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.js'")
  await writeFile(join(temporary, `${name}.js`), compiled)
}
const { createDemoState } = await import(pathToFileURL(join(temporary, 'demo-data.js')).href)
const { activeEpisode, ageOn, today, addCalendarMonths, latestAssessment, referralErrors } = await import(pathToFileURL(join(temporary, 'domain.js')).href)
after(() => rm(temporary, { recursive: true, force: true }))
const reference = new Date('2026-09-08T12:00:00+05:00')
const scenario = (state, code) => state.cases.find(c => c.demoScenario?.code === code)

test('22 scenario cards cover all 13 lifecycle states and preserve each initial scenario explanation', () => {
  const s = createDemoState(reference)
  assert.equal(s.cases.length, 22)
  assert.equal(new Set(s.cases.map(c => c.status)).size, 13)
  assert.equal(new Set(s.cases.map(c => c.demoScenario.code)).size, 22)
  assert.ok(s.cases.every(c => c.childName.includes('(namuna)') && c.demoScenario.title && c.demoScenario.summary && c.demoScenario.checkpoints.length >= 3))
  assert.ok(new Set(s.cases.map(c => c.guardianName)).size >= 20)
  assert.ok(new Set(s.cases.map(c => c.familyDoctor)).size >= 8)
  assert.ok(s.cases.filter(c => activeEpisode(c)).every(c => c.careTasks.length > 0))
  assert.deepEqual(new Set(s.cases.map(c => c.region)), new Set(['SAMARQAND', 'JIZZAX', 'QASHQADARYO', 'NAVOIY']))
})

test('scenario metadata matches concrete workflow evidence', () => {
  const s = createDemoState(reference)
  const observed = scenario(s, 'PAPAS_OBSERVATION'); assert.equal(latestAssessment(observed, 'PAPAS').score, 14); assert.equal(observed.status, 'OBSERVATION')
  const incomplete = scenario(s, 'REFERRAL_INCOMPLETE'); assert.equal(incomplete.referral.status, 'DRAFT'); assert.ok(referralErrors(incomplete).some(error => error.includes('ko‘chirma')))
  const mobilePending = scenario(s, 'APPROVED_MOBILE_ASSESSMENT'); assert.equal(mobilePending.status, 'APPROVED'); assert.equal(latestAssessment(mobilePending, 'HOME'), undefined); assert.equal(activeEpisode(mobilePending), undefined)
  for (const [code, expected] of [['MOBILE_ONE_VISIT', 1], ['MOBILE_TWO_VISITS', 2], ['MOBILE_THREE_VISITS', 3]]) assert.equal(latestAssessment(scenario(s, code), 'HOME').suggestedVisits, expected)
  const extended = activeEpisode(scenario(s, 'INPATIENT_EXTENDED')); assert.equal(extended.extensions.length, 1); assert.ok(extended.extensions[0].reason)
  const terminal = activeEpisode(scenario(s, 'INPATIENT_TERMINAL')); assert.equal(terminal.admissionType, 'TERMINAL'); assert.equal(terminal.plannedEndDate, undefined)
  const renewed = scenario(s, 'REASSESSMENT_RESUBMISSION'); assert.deepEqual(renewed.assessments.filter(a => a.type === 'PAPAS').map(a => a.score), [13, 17, 20]); assert.ok(renewed.referralHistory.length); assert.equal(latestAssessment(renewed, 'HOME').weeklyVisits, 2); assert.ok(latestAssessment(renewed, 'HOME').overrideReason)
  const paper = scenario(s, 'PAPER_REFERRAL'); assert.equal(paper.referral.source, 'PAPER'); assert.ok(paper.referral.outageReason); assert.ok(paper.intakeDate < today(reference)); assert.ok(paper.referral.date < today(reference)); assert.equal(today(new Date(paper.createdAt)), today(reference))
  assert.ok(scenario(s, 'DISCHARGE_HANDOFF').handoffs.length)
  const transferred = scenario(s, 'TRANSFER_HANDOFF'); assert.equal(transferred.episodes[0].closure.reason, 'TRANSFER'); assert.equal(transferred.handoffs.length, 0)
})

test('visits, equipment and completed or cancelled family tasks provide truthful report examples', () => {
  const s = createDemoState(reference)
  assert.deepEqual(new Set(s.visits.map(v => v.status)), new Set(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']))
  assert.ok(s.visits.some(v => v.type === 'REMOTE' && v.status === 'COMPLETED'))
  assert.ok(s.visits.some(v => v.target === 'FAMILY' && v.status === 'COMPLETED'))
  assert.ok(s.visits.some(v => v.target === 'CHILD' && v.status === 'COMPLETED'))
  assert.ok(new Set(s.visits.map(v => v.scheduledAt.slice(0, 7))).size >= 3)
  assert.deepEqual(new Set(s.equipment.map(e => e.status)), new Set(['AVAILABLE', 'ISSUED', 'MAINTENANCE']))
  assert.ok(s.equipment.some(e => e.status === 'AVAILABLE' && e.allocations.some(a => a.returnedAt)))
  assert.ok(s.equipment.some(e => e.status === 'MAINTENANCE' && e.allocations.some(a => a.returnedAt && a.returnNote)))
  const closed = scenario(s, 'FAMILY_SUPPORT_CLOSED'); assert.equal(closed.familySupport.status, 'CLOSED')
  assert.ok(closed.careTasks.some(t => t.status === 'DONE' && t.completionNote))
  assert.ok(closed.careTasks.some(t => t.status === 'CANCELLED' && t.cancellationNote && !t.completedAt))
  assert.ok(s.cases.some(c => c.contacts.some(contact => contact.type === 'COMPLAINT')))
})

test('reference dates are deterministic and scenario detail links stay stable across days', () => {
  assert.deepEqual(createDemoState(reference), createDemoState(reference))
  const ids = createDemoState(reference).cases.map(c => [c.demoScenario.code, c.id])
  const later = createDemoState(new Date('2027-01-01T00:05:00+05:00')).cases.map(c => [c.demoScenario.code, c.id])
  assert.deepEqual(later, ids)
  assert.ok(ids.every(([, id]) => id.startsWith('demo-case-')))
})

const boundaries = ['2026-09-08T12:00:00+05:00', '2026-09-08T00:05:00+05:00', '2026-12-31T23:55:00+05:00', '2027-01-01T00:05:00+05:00', '2027-01-01T12:00:00+05:00', '2028-02-29T12:00:00+05:00', '2028-03-01T12:00:00+05:00']
for (const instant of boundaries) test(`seed chronology and resource invariants at ${instant}`, () => {
  const ref = new Date(instant); const s = createDemoState(ref); const byId = new Map(s.cases.map(c => [c.id, c]))
  assert.equal(s.cases.length, 22); assert.equal(byId.size, 22)
  const occupied = s.cases.map(activeEpisode).filter(e => e?.service === 'INPATIENT').map(e => e.bedId)
  assert.equal(new Set(occupied).size, occupied.length)
  for (const c of s.cases) {
    assert.ok(c.intakeDate >= c.birthDate && c.intakeDate <= today(ref))
    assert.ok(Date.parse(c.createdAt) <= ref.getTime())
    assert.ok(c.assessments.every(a => a.date >= c.intakeDate && a.date <= today(ref)))
    assert.ok(c.timeline.every((event, i) => Date.parse(event.at) >= Date.parse(c.createdAt) && Date.parse(event.at) <= ref.getTime() && (i === 0 || c.timeline[i - 1].at <= event.at)))
    assert.ok(c.episodes.filter(e => e.status === 'ACTIVE').length <= 1)
    for (const e of c.episodes) {
      assert.ok(e.startDate >= c.intakeDate && e.startDate <= today(ref)); assert.ok(ageOn(c.birthDate, e.startDate) < 18)
      assert.ok(!e.endDate || e.endDate >= e.startDate)
      assert.ok(!e.plannedEndDate || e.plannedEndDate >= e.startDate)
      if (e.status === 'ACTIVE' && e.service === 'MOBILE') assert.ok(latestAssessment(c, 'HOME'))
    }
    if (c.familySupport) assert.equal(c.familySupport.deadline, addCalendarMonths(c.familySupport.startDate, 3))
  }
  const adult = scenario(s, 'INPATIENT_ADULT_CONTINUATION'); assert.equal(ageOn(adult.birthDate, today(ref)), 18); assert.ok(activeEpisode(adult).extensions[0].adultContinuation)
  const rejected = scenario(s, 'REJECTED_NEW_ADULT'); assert.equal(ageOn(rejected.birthDate, rejected.decisions[0].date), 18); assert.equal(rejected.episodes.length, 0)
  for (const v of s.visits) {
    assert.ok(byId.has(v.caseId)); assert.ok(s.teams.some(t => t.id === v.teamId))
    if (v.startedAt) assert.ok(Date.parse(v.startedAt) >= Date.parse(v.scheduledAt) && Date.parse(v.startedAt) <= ref.getTime())
    if (v.completedAt) assert.ok(Date.parse(v.completedAt) >= Date.parse(v.startedAt))
    const c = byId.get(v.caseId)
    if (v.target === 'FAMILY') assert.ok(v.scheduledAt.slice(0, 10) >= c.familySupport.startDate && v.scheduledAt.slice(0, 10) <= c.familySupport.deadline)
  }
  const activeVisits = s.visits.filter(v => v.status !== 'CANCELLED')
  for (let i = 0; i < activeVisits.length; i++) for (let j = i + 1; j < activeVisits.length; j++) {
    const a = activeVisits[i]; const b = activeVisits[j]
    if (a.teamId !== b.teamId && a.caseId !== b.caseId) continue
    assert.ok(Date.parse(a.scheduledAt) + a.durationMinutes * 60000 <= Date.parse(b.scheduledAt) || Date.parse(b.scheduledAt) + b.durationMinutes * 60000 <= Date.parse(a.scheduledAt))
  }
  for (const item of s.equipment) {
    const allocations = item.allocations.filter(a => !a.returnedAt)
    assert.equal(allocations.length, item.status === 'ISSUED' ? 1 : 0)
    for (const a of item.allocations) {
      assert.ok(byId.has(a.caseId) && a.agreement); assert.ok(!a.returnedAt || a.returnedAt >= a.issuedAt)
      if (!a.returnedAt) assert.equal(activeEpisode(byId.get(a.caseId)).service, 'MOBILE')
    }
  }
})
