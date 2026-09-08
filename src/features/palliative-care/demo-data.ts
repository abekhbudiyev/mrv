import { addCalendarMonths, addDays, createPalliativeDomain, today } from './domain'
import type { ActionResult, AssessmentInput, CaseInput, CareTaskInput, DecisionInput, DemoScenario, EpisodeInput, PalliativeState, ReferralInput, RegionCode, ServiceType } from './types'

/** Fictional local records only; no patient, organization, GPS or API lookup. */
export function createDemoState(reference = new Date()): PalliativeState {
  const state: PalliativeState = {
    schemaVersion: 1, cases: [], visits: [],
    beds: [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ id: `bed-${n}`, name: `${n}-o‘rin`, room: `${101 + Math.floor((n - 1) / 2)}-xona`, available: n !== 6 })),
    teams: [
      { id: 'team-1', name: '1-mobil brigada', vehicle: 'Demo avtomobil 01', members: ['Shifokor A. (namuna)', 'Hamshira B. (namuna)', 'Psixolog C. (namuna)', 'Ijtimoiy xodim D. (namuna)'], regions: ['SAMARQAND', 'JIZZAX'], gpsStatus: 'NOT_CONNECTED' },
      { id: 'team-2', name: '2-mobil brigada', vehicle: 'Demo avtomobil 02', members: ['Shifokor E. (namuna)', 'Hamshira F. (namuna)', 'Psixolog G. (namuna)', 'Ijtimoiy xodim H. (namuna)'], regions: ['QASHQADARYO', 'NAVOIY'], gpsStatus: 'NOT_CONNECTED' },
    ],
    equipment: ['Kislorod konsentratori', 'Pulsoksimetr', 'Funksional karavot', 'Antidekubit matras', 'Nebulayzer', 'Nogironlik aravachasi', 'Aspirator', 'Pulsoksimetr', 'Oziqlantirish pompasi', 'Kislorod konsentratori'].map((name, i) => ({ id: `equipment-${i + 1}`, name, inventoryNumber: `DEMO-JZ-${String(i + 1).padStart(3, '0')}`, status: 'AVAILABLE', condition: 'Ishga tayyor (namuna)', allocations: [] })),
  }
  const base = today(reference)
  let workingDate = reference
  const api = createPalliativeDomain(state, () => workingDate)
  const at = (offset: number, hour = 12) => { const candidate = new Date(`${addDays(base, offset)}T${String(hour).padStart(2, '0')}:00:00`); workingDate = new Date(Math.min(candidate.getTime(), reference.getTime())) }
  const use = (result: ActionResult) => { if (!result.ok) throw new Error(`Palliativ demo: ${result.error}`); return result.id! }
  const date = (offset: number) => addDays(base, offset)
  const patient = (caseId: string) => api.getCase(caseId)!
  const profiles = [
    ['Dilnoza Karimova', 'Nodira Hamidova', 'NEUROLOGICAL', 'Asab tizimining og‘ir surunkali shikastlanishi', 'Oziqlanishda yordam'],
    ['Gulbahor Saidova', 'Aziz Rahimov', 'NEUROLOGICAL', 'Surunkali nevrologik kasallik va kuzatuv ehtiyoji', 'Oilaga maslahat'],
    ['Shahnoza Ergasheva', 'Dilshod Nurmatov', 'GENETIC', 'Hayotni cheklovchi irsiy kasallik', 'Ijtimoiy yordam'],
    ['Otabek Mahmudov', 'Zulfiya Ismoilova', 'NEUROMUSCULAR', 'Progressiyalanuvchi nerv-mushak kasalligi', 'Nafas holatini kuzatish'],
    ['Feruza Rasulova', 'Murod Qodirov', 'ONCOLOGICAL', 'Palliativ ko‘rsatmasi bo‘lgan onkologik kasallik', 'Og‘riq va simptomlar kuzatuvi'],
    ['Mohira Usmonova', 'Malika Sobirova', 'GENETIC', 'Og‘ir metabolik kasallik va parvarish ehtiyoji', 'Vakilni parvarishga o‘qitish'],
    ['Zebo Tursunova', 'Javlon Mamatov', 'NEUROLOGICAL', 'Qaytmas nevrologik shikastlanish', 'Uy sharoitini moslashtirish'],
    ['Rustam Olimov', 'Saida Mirzayeva', 'GENETIC', 'Hayotni cheklovchi og‘ir irsiy kasallik', 'Oilaga psixologik yordam'],
  ]
  const create = (name: string, region: RegionCode, offset: number, service: ServiceType, age: number, overrides: Partial<CaseInput> = {}) => {
    at(offset)
    const n = state.cases.length; const profile = profiles[n % profiles.length]!
    const district = region === 'SAMARQAND' ? 'Samarqand tumani' : region === 'JIZZAX' ? 'Jizzax shahri' : region === 'QASHQADARYO' ? 'Qarshi shahri' : 'Navoiy shahri'
    return use(api.createCase({ childName: name, birthDate: addCalendarMonths(date(offset), -(age * 12 + 3)), sex: /Madina|Malika|Zarina|Sevara|Diyora|Shabnam|Rayhona|Maftuna|Shukrona/.test(name) ? 'FEMALE' : 'MALE', region, district, address: `Namuna-${n + 1} mahallasi, ${n + 10}-uy (shartli manzil)`, guardianName: `${profile[0]} (namuna ${n + 1})`, relationship: n % 4 === 3 ? 'Otasi' : 'Onasi', phone: `+998 00 000 00 ${String(n + 1).padStart(2, '0')}`, familyDoctor: `${profile[1]} (namuna)`, clinic: `${district} ${n % 4 + 1}-oilaviy poliklinikasi (namuna)`, diagnosis: `${profile[3]} — shartli klinik namuna`, medicalIndication: profile[2]!, requestedService: service, urgency: n % 4 === 0 ? 'PRIORITY' : 'ROUTINE', notes: 'Bu bola, vakil, manzil va barcha tibbiy hujjatlar sun’iy. Faqat frontend ssenariysini ko‘rsatish uchun.', identityType: 'BIRTH_CERTIFICATE', identityNumber: `DEMO-GUV-${String(n + 1).padStart(3, '0')}`, symptoms: ['Parvarishda yordamga ehtiyoj', profile[4]!], ...overrides }))
  }
  const assess = (caseId: string, score: number, offset: number, type: 'PAPAS' | 'HOME' = 'PAPAS', overrides: Partial<AssessmentInput> = {}) => { at(offset); use(api.recordAssessment(caseId, { type, score, date: addDays(base, offset), assessor: patient(caseId).familyDoctor, methodology: `${type === 'PAPAS' ? 'PaPaS' : 'Uy ehtiyojlari: PaPaSdan alohida baho'} — tayyor bahoni qayd qilish; metodika tasdiqlanmagan`, document: `${type}-DEMO-${patient(caseId).number.slice(-4)}`, notes: 'Shartli o‘quv qaydi; tizim klinik ballni hisoblamaydi.', ...overrides })) }
  const refer = (caseId: string, offset: number, overrides: Partial<ReferralInput> = {}, submit = true) => {
    at(offset); const c = api.getCase(caseId)!; const suffix = c.number.slice(-4)
    use(api.saveReferral(caseId, { number: `DEMO-Y-${suffix}`, date: addDays(base, offset), source: 'LOCAL', organization: `${c.district} bolalar tibbiyot markazi (namuna)`, sourceConsiliumNumber: `DEMO-TK-${suffix}`, sourceConsiliumDate: addDays(base, offset), sourceConsiliumMembers: `${c.familyDoctor}; profil mutaxassisi; bo‘lim mudiri (namuna)`, sourceConsiliumEligible: true, diagnosisCode: 'Z51.5', service: c.requestedService, historyExtract: `DEMO-KT-${suffix}`, historyPages: 3, examinationDocument: `DEMO-TEK-${suffix}`, examinationPages: 2, papasDocument: `PAPAS-DEMO-${suffix}`, referringDoctor: c.familyDoctor, doctorPosition: 'Palliativ yordam shifokori', doctorPhone: '+998 00 000 00 00', chiefDoctor: 'Bosh shifokor Sh. Akbarov (namuna)', sourceConfirmation: 'Demo qayd; haqiqiy imzo yoki tasdiq emas', requiredEquipment: c.requestedService === 'MOBILE' ? ['Pulsoksimetr'] : [], transportNotes: 'Xavfsiz transport imkoniyati konsilium tomonidan ko‘rilgan (namuna)', ...overrides })); if (submit) use(api.submitReferral(caseId))
  }
  const decide = (caseId: string, offset: number, pause = false, overrides: Partial<DecisionInput> = {}) => {
    at(offset); const c = api.getCase(caseId)!
    use(api.recordDecision(caseId, { outcome: pause ? 'PAUSE' : 'APPROVE', date: addDays(base, offset), number: `DEMO-MK-${c.number.slice(-4)}-${c.decisions.length + 1}`, members: 'Shifokor N. Hamidova; psixolog D. Karimov; ijtimoiy xodim U. Rahimova (namuna)', reason: pause ? 'Boshqa tibbiy yordamdan keyin qayta ko‘rish — shifokorning shartli xulosasi; §24(a) avtomatik qo‘llanmagan.' : 'Markaz konsiliumi kiritgan shartli qabul xulosasi', service: c.requestedService, safeCare: true, safeTransport: true, consent: c.requestedService === 'MOBILE', consentPerson: c.requestedService === 'MOBILE' ? c.guardianName : '', reviewDate: pause ? addDays(base, 2) : undefined, destination: pause ? 'Ixtisoslashgan tibbiyot muassasasi (namuna)' : undefined, ...overrides }))
  }
  const start = (caseId: string, offset: number, bedId?: string, teamId?: string, overrides: Partial<EpisodeInput> = {}) => {
    at(offset); const c = api.getCase(caseId)!
    use(api.startEpisode(caseId, { service: c.requestedService, startDate: addDays(base, offset), plannedEndDate: c.requestedService === 'INPATIENT' ? addDays(base, offset + 13) : undefined, admissionType: 'TEMPORARY', decisionNumber: c.decisions.slice(-1)[0]!.number, decisionReason: 'Konsilium belgilagan xizmat rejasi (namuna)', bedId, teamId, companion: bedId ? c.guardianName : undefined, ...overrides }))
  }
  const intake = create('Aziz A. (namuna)', 'SAMARQAND', -1, 'INPATIENT', 8)
  const observed = create('Madina B. (namuna)', 'NAVOIY', -4, 'MOBILE', 6); assess(observed, 14, -3)
  const waiting = create('Javohir C. (namuna)', 'QASHQADARYO', -5, 'INPATIENT', 11); assess(waiting, 18, -4); refer(waiting, -3)
  const paused = create('Malika D. (namuna)', 'SAMARQAND', -8, 'INPATIENT', 5); assess(paused, 21, -7); refer(paused, -6); decide(paused, -5, true)
  const inpatient = create('Sardor E. (namuna)', 'SAMARQAND', -10, 'INPATIENT', 13); assess(inpatient, 22, -9); refer(inpatient, -8); decide(inpatient, -7); start(inpatient, -6, 'bed-1')
  const mobile = create('Zarina F. (namuna)', 'JIZZAX', -14, 'MOBILE', 9); assess(mobile, 24, -13); assess(mobile, 23, -13, 'HOME'); refer(mobile, -12); decide(mobile, -11); start(mobile, -10, undefined, 'team-1')
  const followup = create('Behruz G. (namuna)', 'NAVOIY', -14, 'INPATIENT', 15); assess(followup, 17, -13); refer(followup, -12); decide(followup, -11); start(followup, -10, 'bed-3'); at(-2); use(api.closeEpisode(followup, { endDate: addDays(base, -2), reason: 'DISCHARGE', summary: 'Oilaviy shifokor nazoratida yordam davom etadi (namuna).', document: 'DEMO-EPI-007' })); at(-1); use(api.recordHandoff(followup, { date: addDays(base, -1), doctor: 'Oilaviy shifokor (namuna)', clinic: 'Navoiy oilaviy poliklinikasi (namuna)', document: 'DEMO-TOP-007', nextReviewDate: addDays(base, 5), note: 'Shifokor kuzatuvni qabul qilganligi qayd etildi (namuna).' }))
  const family = create('Temur H. (namuna)', 'QASHQADARYO', -20, 'MOBILE', 7); assess(family, 27, -19); assess(family, 26, -19, 'HOME'); refer(family, -18); decide(family, -17); start(family, -16, undefined, 'team-2'); at(-5); use(api.closeEpisode(family, { endDate: addDays(base, -5), reason: 'DEATH', summary: 'Shartli klinik epizod yakunlandi. Oilaga psixologik yordam davom etadi.', document: 'DEMO-VAFOT-EPI-008' }))
  workingDate = reference
  use(api.addCareTask(intake, { title: 'Dastlabki ko‘rik va PaPaS baholashi', category: 'MEDICAL', assignee: 'Oilaviy shifokor (namuna)', dueDate: addDays(base, 1), target: 'CHILD' }))
  use(api.addCareTask(inpatient, { title: 'Parvarish va simptomlar kuzatuvi', category: 'NURSING', assignee: 'Bo‘lim hamshirasi (namuna)', dueDate: base, target: 'CHILD' }))
  use(api.addCareTask(mobile, { title: 'Vakilga uy parvarishi bo‘yicha maslahat', category: 'FAMILY', assignee: '1-mobil brigada', dueDate: addDays(base, -1), target: 'FAMILY' }))
  use(api.addCareTask(mobile, { title: 'Uy sharoitidagi ehtiyojlarni qayta ko‘rish', category: 'SOCIAL', assignee: 'Ijtimoiy xodim (namuna)', dueDate: addDays(base, 2), target: 'CHILD' }))
  use(api.addCareTask(family, { title: 'Oilaga psixologik yordam uchrashuvi', category: 'PSYCHOLOGICAL', assignee: '2-mobil brigada psixologi', dueDate: addDays(base, 2), target: 'FAMILY' }))
  at(-1, 11)
  const completedVisit = use(api.scheduleVisit({ caseId: mobile, teamId: 'team-1', scheduledAt: `${addDays(base, -1)}T09:00`, durationMinutes: 60, type: 'HOME', purpose: 'Uy parvarishi va oila ehtiyojlarini ko‘rish (namuna)' })); use(api.startVisit(completedVisit)); use(api.completeVisit(completedVisit, 'Parvarish bo‘yicha maslahat va ehtiyojlar qaydi (namuna).'))
  workingDate = reference
  use(api.scheduleVisit({ caseId: mobile, teamId: 'team-1', scheduledAt: `${base}T09:00`, durationMinutes: 60, type: 'HOME', purpose: 'Individual reja bo‘yicha uyga tashrif' }))
  use(api.scheduleVisit({ caseId: family, teamId: 'team-2', scheduledAt: `${addDays(base, 2)}T11:00`, durationMinutes: 60, type: 'HOME', purpose: 'Oilaga psixologik yordam' }))
  use(api.scheduleVisit({ caseId: mobile, teamId: 'team-1', scheduledAt: `${addDays(base, 1)}T14:00`, durationMinutes: 30, type: 'REMOTE', purpose: 'Vakil bilan masofaviy maslahat' }))
  use(api.issueEquipment('equipment-1', mobile, 'DEMO-SH-001 / bepul foydalanish'))
  use(api.issueEquipment('equipment-2', mobile, 'DEMO-SH-002 / bepul foydalanish'))

  const describe = (caseId: string, code: string, title: string, summary: string, checkpoints: string[]) => { patient(caseId).demoScenario = { code, title, summary, checkpoints } satisfies DemoScenario }
  const contact = (caseId: string, offset: number, type: 'CALL' | 'REMOTE' | 'NOTE' | 'COMPLAINT', note: string) => { at(offset, 16); use(api.addContact(caseId, { type, author: patient(caseId).familyDoctor, note })) }
  const task = (caseId: string, title: string, category: CareTaskInput['category'], createdOffset: number, dueOffset: number, target: 'CHILD' | 'FAMILY' = 'CHILD', completedOffset?: number) => {
    at(createdOffset)
    const taskId = use(api.addCareTask(caseId, { title, category, assignee: category === 'MEDICAL' ? patient(caseId).familyDoctor : category === 'PSYCHOLOGICAL' ? 'Psixolog Saida O. (namuna)' : category === 'SOCIAL' ? 'Ijtimoiy xodim Umida R. (namuna)' : 'Hamshira Maftuna S. (namuna)', dueDate: date(dueOffset), target }))
    if (completedOffset !== undefined) { at(completedOffset, 13); use(api.completeCareTask(caseId, taskId, 'Rejalashtirilgan xizmat bajarildi; vakilga tushuntirish va keyingi qadamlar kelishildi (namuna).')) }
    return taskId
  }
  const visit = (caseId: string, teamId: string, offset: number, hour: number, type: 'HOME' | 'REMOTE', purpose: string, complete = false, duration = 60) => {
    if (complete) at(offset, hour)
    const visitId = use(api.scheduleVisit({ caseId, teamId, scheduledAt: `${date(offset)}T${String(hour).padStart(2, '0')}:00`, durationMinutes: duration, type, purpose }))
    if (complete) { use(api.startVisit(visitId)); workingDate = new Date(workingDate.getTime() + duration * 60_000); use(api.completeVisit(visitId, `${purpose}. Natija va oila bilan kelishilgan keyingi qadam qayd etildi (namuna).`)) }
    return visitId
  }

  describe(intake, 'INTAKE_NEW', 'Yangi murojaat', 'Vakil murojaati qayd etilgan; klinik baho hali kiritilmagan.', ['Bola va vakil kartasi', 'Uch ish kunlik baholash muddati', 'Keyingi mas’ul va vazifa'])
  describe(observed, 'PAPAS_OBSERVATION', 'PaPaS 14: kuzatuv', 'Past ball sabab poliklinika kuzatuvi davom etadi; ish yakuniy rad etilmagan.', ['14 ball yakuniy rad etish emas', 'Kuzatuv rejasini qo‘shish mumkin', 'Qayta baholash yo‘li saqlanadi'])
  describe(waiting, 'CENTRE_CONSILIUM', 'Markaz konsiliumi kutilyapti', 'Manba konsiliumi ijobiy xulosa bergan, biroq Markazning qabul qarori hali yo‘q.', ['Ikki konsilium alohida', 'Z51.5 va 18 ball qaydi', 'Qarorsiz epizod ochilmaydi'])
  describe(paused, 'TEMPORARY_PAUSE', 'Vaqtincha to‘xtatish', 'Boshqa tibbiy yordamdan so‘ng ishni qayta ko‘rish belgilangan.', ['Sabab va tashqi muassasa', 'Qayta ko‘rish sanasi', 'Yakuniy rad etishdan farqli holat'])
  describe(inpatient, 'INPATIENT_TEMPORARY', '14 kunlik statsionar yordam', '1-o‘rinda vaqtinchalik yordam; parvarish vazifasi ochiq va vakilni o‘qitish bajarilgan.', ['O‘rin va hamroh', '14 kunlik boshlang‘ich muddat', 'Bajarilgan va ochiq individual vazifalar'])
  describe(mobile, 'MOBILE_TWO_VISITS', 'Haftasiga ikki uy tashrifi', 'Uy bahosi 23 ball: ikki tashrif tavsiya qilingan; jihoz shartnomalari va maslahatlar mavjud.', ['PaPaS 24 va uy bahosi 23 alohida', 'Uy tashrifi va masofaviy maslahat ajratilgan', 'Jihozlar shartnoma bilan berilgan'])
  describe(followup, 'DISCHARGE_HANDOFF', 'Chiqarish va shifokorga topshirish', 'Statsionar epizod tugagan; kuzatuvni qabul qilgan shifokor va keyingi ko‘rik belgilangan.', ['O‘rin bo‘shatilgan', 'Epikriz va topshirish hujjati', 'Keyingi ko‘rik va mas’ul'])
  describe(family, 'FAMILY_SUPPORT_ACTIVE', 'Vafotdan keyin oilaga yordam', 'Klinik epizod yopilgan; oilaviy reja uch kalendar oylik muddatda faol.', ['Klinik va oilaviy yordam alohida', 'Oilaviy tashrif rejalashtirilgan', 'Uch kalendar oylik muddat'])
  contact(intake, -1, 'CALL', 'Onasi dastlabki ko‘rik tartibini so‘radi. Shifokor va zarur hujjatlar tushuntirildi.')
  contact(observed, -2, 'NOTE', 'PaPaS 14 ball: kuzatuv davom etadi. Holat o‘zgarsa qayta baholash mumkin.')
  task(observed, 'Poliklinikada keyingi kuzatuv ko‘rigi', 'MEDICAL', -2, 5)
  contact(waiting, -2, 'NOTE', 'Ko‘chirma va tekshiruvlar to‘liq; Markazning alohida qarori kutilmoqda.')
  contact(paused, -3, 'CALL', 'Vakilga tashqi muassasa yo‘nalishi va qayta ko‘rish tartibi tushuntirildi.')
  task(inpatient, 'Vakilga xavfsiz parvarishni ko‘rsatish', 'FAMILY', -4, -3, 'FAMILY', -3)
  contact(inpatient, -2, 'NOTE', 'Bola bilan qonuniy vakil birga. Chiqarishdan oldin keyingi kuzatuv kelishiladi.')
  contact(family, -3, 'CALL', 'Oilaga psixologik yordam shakli va qulay aloqa vaqti vakil bilan kelishildi.')

  const assessing = create('Sevara I. (namuna)', 'JIZZAX', -5, 'MOBILE', 4, { medicalIndication: '' })
  task(assessing, 'Ko‘rikni yakunlash va tasdiqlangan PaPaS natijasini kiritish', 'MEDICAL', -4, -2)
  contact(assessing, -3, 'NOTE', 'Dastlabki tekshiruv boshlangan; natija hujjati hali kelmagan. Mas’ulga kechikish ko‘rinadi.')
  // An initial in-progress fixture: no unsupported clinical result is manufactured.
  patient(assessing).status = 'ASSESSMENT'
  describe(assessing, 'ASSESSMENT_PENDING', 'Baholash jarayoni va kechikish', 'Ko‘rik boshlangan, ammo tasdiqlangan PaPaS natijasi hali qayd etilmagan.', ['Taxminiy ball yozilmagan', 'Uch ish kunlik muddat', 'Kechikkan ko‘rik vazifasi'])

  const incomplete = create('Diyor J. (namuna)', 'SAMARQAND', -6, 'INPATIENT', 10)
  assess(incomplete, 19, -5); refer(incomplete, -4, { historyExtract: '', historyPages: 0, sourceConfirmation: '' }, false)
  contact(incomplete, -2, 'CALL', 'Muassasadan kasallik tarixidan ko‘chirma va tasdiq qaydi kutilmoqda.')
  describe(incomplete, 'REFERRAL_INCOMPLETE', 'Hujjati yetishmagan yo‘llanma', 'Yo‘llanma qoralama: kasallik tarixidan ko‘chirma va manba tasdig‘i yo‘q.', ['Yetishmagan hujjatlar ko‘rinadi', 'To‘liq bo‘lmaguncha yuborilmaydi', 'Hujjat kamchiligi klinik rad etish emas'])

  const bedWaiting = create('Muhammad K. (namuna)', 'QASHQADARYO', -6, 'INPATIENT', 6)
  assess(bedWaiting, 20, -5); refer(bedWaiting, -4); decide(bedWaiting, -3)
  contact(bedWaiting, -2, 'NOTE', 'Qabul tasdiqlangan. Vakil bilan kelishilgan joylashtirish va mos o‘rinni biriktirish kutilmoqda.')
  describe(bedWaiting, 'APPROVED_WAITING_BED', 'Qabul tasdiqlangan, joylashtirish kutilmoqda', 'Markaz qarori bor; xodim mos o‘rinni tanlab statsionar xizmatni boshlaydi.', ['Tasdiq epizodning o‘zi emas', 'O‘rin alohida ajratiladi', 'Bo‘sh o‘rinlar bilan ishlash'])

  const mobileWaiting = create('Diyora L. (namuna)', 'NAVOIY', -7, 'MOBILE', 12)
  assess(mobileWaiting, 21, -6); refer(mobileWaiting, -5); decide(mobileWaiting, -4)
  task(mobileWaiting, 'Uyda yordamga ehtiyojni kompleks baholash', 'SOCIAL', -3, 1, 'FAMILY')
  describe(mobileWaiting, 'APPROVED_MOBILE_ASSESSMENT', 'Mobil qabul: uy bahosi kutilmoqda', 'Vakil roziligi va qabul qarori bor; alohida uy bahosi hali kiritilmagan.', ['PaPaS uy bahosini almashtirmaydi', 'Rozilik qaydi bor', 'Uy bahosisiz epizod boshlanmaydi'])

  const adultBirthDate = addCalendarMonths(date(-1), -216)
  const eighteenthBirthday = addCalendarMonths(adultBirthDate, 216)
  const rejected = create('Shohruh M. (namuna)', 'SAMARQAND', -10, 'INPATIENT', 17, { birthDate: adultBirthDate })
  assess(rejected, 23, -9); refer(rejected, -8)
  decide(rejected, 0, false, { outcome: 'REJECT', reason: 'Murojaat vaqtida 17 yosh bo‘lgan, yangi qabul qarori sanasida 18 yoshga to‘lgan. Oldingi statsionar epizod yo‘q; davom ettirish istisnosi qo‘llanmaydi. Konsiliumning shartli asosli qarori.' })
  describe(rejected, 'REJECTED_NEW_ADULT', 'Yangi qabulda yosh chegarasi', 'Murojaat va qaror orasida 18 yoshga to‘lgan shaxs bo‘yicha konsilium asosli qaror bergan.', ['Yosh qaror sanasida hisoblanadi', '18 yoshdan keyingi yangi qabul', 'Davom ettirishdan farqli holat'])

  const extended = create('Akmal N. (namuna)', 'JIZZAX', -21, 'INPATIENT', 8)
  assess(extended, 25, -20); refer(extended, -19); decide(extended, -18); start(extended, -17, 'bed-4')
  task(extended, 'Parvarish ehtiyojlarini qayta baholash', 'MEDICAL', -8, -7, 'CHILD', -7)
  at(-5); use(api.extendEpisode(extended, { plannedEndDate: date(7), decisionNumber: 'DEMO-UZ-014', decisionDate: date(-5), reason: 'Konsilium vaqtinchalik yordamni 25 kunlik umumiy davrgacha uzaytirdi; prototipning 14/28 kun hisobi qo‘llanadi.' }))
  task(extended, 'Uzaytirilgan davr yakuniga oilaviy yordamni kelishish', 'SOCIAL', -3, 5, 'FAMILY')
  describe(extended, 'INPATIENT_EXTENDED', 'Konsilium bilan uzaytirish', 'Boshlang‘ich muddatdan keyingi davr alohida inson qarori bilan belgilangan.', ['Uzaytirish raqami va sababi', '25 kunlik rejalashtirilgan davr', '28 kunlik chegara va hisob izohi'])

  const terminal = create('Shabnam O. (namuna)', 'QASHQADARYO', -38, 'INPATIENT', 6)
  assess(terminal, 29, -37); refer(terminal, -36); decide(terminal, -35)
  start(terminal, -34, 'bed-5', undefined, { admissionType: 'TERMINAL', decisionReason: 'Hayotining oxirgi davri bo‘yicha konsiliumning hujjatlashtirilgan klinik xulosasi; muddatsiz yordam (namuna).' })
  task(terminal, 'Oila bilan individual yordam maqsadlarini kelishish', 'PSYCHOLOGICAL', -30, -29, 'FAMILY', -29)
  task(terminal, 'Qulaylik va simptomlarni kundalik kuzatish', 'NURSING', -2, 0)
  contact(terminal, -1, 'NOTE', 'Muddatsiz yordam konsilium xulosasiga asoslangan; sun’iy olti oylik chiqarish sanasi yo‘q.')
  describe(terminal, 'INPATIENT_TERMINAL', 'Muddatsiz statsionar yordam', 'Hujjatlashtirilgan terminal holat bo‘yicha yordam; rejalashtirilgan chiqarish sanasi yo‘q.', ['Konsilium klinik asosi', 'Olti oylik avtomatik yakun yo‘q', 'Bola va oila uchun parallel vazifalar'])

  const continuation = create('Abdulloh P. (namuna)', 'NAVOIY', -12, 'INPATIENT', 17, { birthDate: adultBirthDate })
  assess(continuation, 24, -11); refer(continuation, -10); decide(continuation, -9)
  start(continuation, -8, 'bed-7', undefined, { plannedEndDate: addDays(eighteenthBirthday, -1) })
  at(-1); use(api.extendEpisode(continuation, { plannedEndDate: date(12), decisionNumber: 'DEMO-UZ-18-016', decisionDate: date(-1), reason: 'Bola statsionar yordam davomida 18 yoshga to‘ldi. Mavjud epizod belgilangan muddatgacha davom ettiriladi.', adultContinuation: true }))
  task(continuation, 'Voyaga yetish davrida yordam maqsadlarini bola va vakil bilan kelishish', 'PSYCHOLOGICAL', -5, -4, 'FAMILY', -4)
  task(continuation, 'Davom ettirish muddati yakuniga kuzatuv va topshirish rejasini tayyorlash', 'SOCIAL', -1, 7, 'FAMILY')
  describe(continuation, 'INPATIENT_ADULT_CONTINUATION', 'Statsionarda 18 yoshga to‘lish', '18 yoshga to‘lmasdan boshlangan epizod alohida konsilium tasdig‘i bilan davom etmoqda.', ['Qabul paytida 17 yosh', 'Mavjud epizodga davom ettirish qarori', '21 yosh chegarasi yangi qabul yoshini oshirmaydi'])

  const oneVisit = create('Rayhona Q. (namuna)', 'SAMARQAND', -69, 'MOBILE', 5)
  assess(oneVisit, 18, -68); assess(oneVisit, 18, -68, 'HOME'); refer(oneVisit, -67); decide(oneVisit, -66); start(oneVisit, -65, undefined, 'team-1')
  at(-64); use(api.issueEquipment('equipment-5', oneVisit, 'DEMO-SH-017-A')); use(api.issueEquipment('equipment-6', oneVisit, 'DEMO-SH-017-B'))
  visit(oneVisit, 'team-1', -60, 10, 'HOME', 'Birinchi uy tashrifi: vakilni parvarishga o‘qitish', true)
  visit(oneVisit, 'team-1', -35, 11, 'HOME', 'O‘tgan oy rejasidagi uy ehtiyojlari kuzatuvi', true)
  at(-20); use(api.returnEquipment('equipment-5', 'DEMO-QAY-017-A: to‘liq va soz qaytarildi.')); use(api.returnEquipment('equipment-6', 'DEMO-QAY-017-B: g‘ildirak mexanizmi ta’mir talab qiladi.', true))
  visit(oneVisit, 'team-1', -15, 11, 'REMOTE', 'Vakilga masofaviy parvarish maslahati', true, 30)
  visit(oneVisit, 'team-1', -7, 14, 'HOME', 'Haftalik uy tashrifi va reja bajarilishi', true)
  task(oneVisit, 'Uy sharoitini moslashtirish bo‘yicha yordam', 'SOCIAL', -5, 3, 'FAMILY')
  contact(oneVisit, -2, 'COMPLAINT', 'Vakil tashrif vaqti o‘zgargani haqida murojaat qildi. Mas’ul belgilandi; qayta qo‘ng‘iroq vazifasi ochiq.')
  workingDate = reference; visit(oneVisit, 'team-1', 3, 10, 'HOME', 'Haftalik tashrif va vakil murojaatini ko‘rib chiqish')
  describe(oneVisit, 'MOBILE_ONE_VISIT', 'Bir tashrif va jihoz qaytarish', 'Uy bahosi 18; oldingi davrlardagi xizmatlar, murojaat va jihozlar harakati mavjud.', ['15–20 ball: bir uy tashrifi', 'Masofaviy maslahat alohida', 'Soz qaytarilgan va ta’mirga ajratilgan jihozlar'])

  const threeVisits = create('Ibrohim R. (namuna)', 'QASHQADARYO', -13, 'MOBILE', 3)
  assess(threeVisits, 28, -12); assess(threeVisits, 26, -12, 'HOME'); refer(threeVisits, -11, { requiredEquipment: ['Antidekubit matras', 'Aspirator'] }); decide(threeVisits, -10); start(threeVisits, -9, undefined, 'team-2')
  visit(threeVisits, 'team-2', -6, 10, 'HOME', 'Kundalik parvarishni oila bilan ko‘rish', true)
  visit(threeVisits, 'team-2', -4, 14, 'HOME', 'Jihozlardan foydalanish bo‘yicha yo‘riq', true)
  at(-3); use(api.issueEquipment('equipment-4', threeVisits, 'DEMO-SH-018-A')); use(api.issueEquipment('equipment-7', threeVisits, 'DEMO-SH-018-B'))
  task(threeVisits, 'Tashriflar orasida vakil bilan aloqa', 'NURSING', -2, 1, 'FAMILY')
  workingDate = reference; visit(threeVisits, 'team-2', 1, 10, 'HOME', 'Haftalik ikkinchi uy tashrifi'); visit(threeVisits, 'team-2', 3, 13, 'HOME', 'Haftalik uchinchi uy tashrifi')
  describe(threeVisits, 'MOBILE_THREE_VISITS', 'Uch tashrif va faol brigada', 'Uy bahosi 26; bir tashrif jarayonda, keyingilari rejalashtirilgan va jihozlar berilgan.', ['25 va yuqori ball: uch tashrif', 'Boshlangan tashrif natija kutmoqda', 'Brigada va jihozlar biriktirilgan'])

  const transfer = create('Maftuna S. (namuna)', 'JIZZAX', -48, 'INPATIENT', 10)
  assess(transfer, 22, -47); refer(transfer, -46); decide(transfer, -45); start(transfer, -44, 'bed-2')
  task(transfer, 'Boshqa muassasaga topshirish hujjatlarini tayyorlash', 'MEDICAL', -40, -39, 'CHILD', -39)
  at(-38); use(api.closeEpisode(transfer, { endDate: date(-38), reason: 'TRANSFER', summary: 'Konsilium boshqa tibbiyot muassasasiga ko‘chirishni kelishdi; hujjatlar qabul qiluvchi shifokorga berildi.', document: 'DEMO-KOCH-019' }))
  contact(transfer, -37, 'NOTE', 'Qabul qiluvchi muassasa bilan aloqa qaydi bor. Oilaviy shifokorga keyingi topshirish hali tasdiqlanmagan.')
  describe(transfer, 'TRANSFER_HANDOFF', 'Boshqa muassasaga ko‘chirish', 'Oldingi davr statsionar epizodi ko‘chirish sababi bilan yopilgan; keyingi topshirish ochiq.', ['Ko‘chirish va oddiy chiqarish farqi', 'Epikriz va xizmat sanalari', 'Topshirish avtomatik bajarilmagan'])

  const closedFamily = create('Jasur T. (namuna)', 'NAVOIY', -119, 'MOBILE', 9)
  assess(closedFamily, 27, -118); assess(closedFamily, 25, -118, 'HOME'); refer(closedFamily, -117); decide(closedFamily, -116); start(closedFamily, -115, undefined, 'team-2')
  visit(closedFamily, 'team-2', -110, 10, 'HOME', 'Bola va oilaga parvarish yordami', true)
  at(-105); use(api.closeEpisode(closedFamily, { endDate: date(-105), reason: 'DEATH', summary: 'Klinik yordam yakunlandi, oilaviy qo‘llab-quvvatlash rejasi ochildi.', document: 'DEMO-VAFOT-EPI-020' }))
  task(closedFamily, 'Oila bilan dastlabki psixologik suhbat', 'PSYCHOLOGICAL', -103, -101, 'FAMILY', -101)
  visit(closedFamily, 'team-2', -90, 11, 'HOME', 'Oilaga davomiy psixologik yordam', true)
  task(closedFamily, 'Yakuniy oilaviy uchrashuv', 'FAMILY', -80, -60, 'FAMILY')
  at(-75); visit(closedFamily, 'team-2', -60, 15, 'REMOTE', 'Oldindan belgilangan yakuniy oilaviy maslahat', false, 30)
  at(-70); use(api.closeFamilySupport(closedFamily))
  describe(closedFamily, 'FAMILY_SUPPORT_CLOSED', 'Oilaviy yordam yakunlangan', 'Yordam mas’ul xodim tomonidan yakunlangan; bajarilgan xizmatlar va bekor qilingan rejalar saqlangan.', ['Klinik va oilaviy yakun sanalari', 'Bajarilgan vazifa o‘zgarmagan', 'Bajarilmagan vazifa va tashrif sababi bilan bekor qilingan'])

  const paper = create('Shukrona U. (namuna)', 'SAMARQAND', 0, 'INPATIENT', 7, { intakeDate: date(-8) })
  // Old document dates and the actual registration timestamp stay separate.
  workingDate = reference
  use(api.recordAssessment(paper, { type: 'PAPAS', score: 20, date: date(-7), assessor: patient(paper).familyDoctor, methodology: 'PaPaS — yozma hujjatdagi tayyor namuna natija', document: 'PAPAS-DEMO-0021', notes: 'Natija oldin olingan; axborot tizimiga bugun qayd etildi.' }))
  refer(paper, 0, { number: 'DEMO-QOG-021', date: date(-6), source: 'PAPER', outageReason: 'Muassasada yo‘llanma rasmiylashtirish paytidagi aloqa uzilishi qaydi (namuna).', sourceConsiliumDate: date(-6), sourceConfirmation: 'Qog‘oz hujjatdagi imzo va muhr qaydi; haqiqiy fayl biriktirilmagan' })
  describe(paper, 'PAPER_REFERRAL', 'Oldingi sanali yozma yo‘llanma', 'Murojaat va qog‘oz hujjatlar oldin shakllangan, tizimga esa bugun kiritilgan.', ['Murojaat va kiritish sanasi farqli', 'Texnik nosozlik sababi saqlangan', 'Baholash va yo‘llanma tarixiy sanalari'])

  const reassessed = create('Farrux V. (namuna)', 'QASHQADARYO', -32, 'MOBILE', 11)
  assess(reassessed, 13, -31); contact(reassessed, -30, 'NOTE', 'PaPaS 13: poliklinika kuzatuvi davom ettirildi.')
  assess(reassessed, 17, -17); refer(reassessed, -16); decide(reassessed, -15, true)
  contact(reassessed, -10, 'NOTE', 'Qo‘shimcha ko‘rik yakunlandi, vakil yangilangan hujjatlarni taqdim etdi.')
  assess(reassessed, 20, -8); refer(reassessed, -7, { number: 'DEMO-Y-022-QAYTA', sourceConsiliumNumber: 'DEMO-TK-022-QAYTA', notes: 'Qayta yo‘llanma; avvalgi nusxa karta tarixida saqlanadi.' }); decide(reassessed, -6)
  assess(reassessed, 20, -5, 'HOME', { weeklyVisits: 2, overrideReason: 'DEMO-MK-022-QOSH: konsilium individual ehtiyoj sabab bir tashrif tavsiyasini ikki tashrifga o‘zgartirdi.' })
  start(reassessed, -4, undefined, 'team-2'); visit(reassessed, 'team-2', -2, 14, 'HOME', 'Qayta qabuldan keyingi birinchi uy tashrifi', true)
  task(reassessed, 'Qayta baholash asosida uy parvarishi rejasini vakil bilan yangilash', 'NURSING', -3, -2, 'FAMILY', -2)
  task(reassessed, 'Konsilium o‘zgartirgan tashrif chastotasi natijasini kuzatish', 'MEDICAL', -1, 3)
  workingDate = reference; visit(reassessed, 'team-2', 4, 10, 'HOME', 'Konsilium o‘zgartirgan chastota bo‘yicha tashrif')
  describe(reassessed, 'REASSESSMENT_RESUBMISSION', 'Qayta baholash va qayta yo‘llanma', 'Kuzatuvdan qayta yo‘llashgacha tarix saqlangan; konsilium tashrif sonini asos bilan o‘zgartirgan.', ['PaPaS 13 → 17 → 20 tarixi', 'Eski va qayta yo‘llanma nusxalari', 'Uy tavsiyasi bir; konsilium ikki tashrif belgilagan'])

  // Create the live visit last, after the historical completed visits have finished.
  workingDate = reference
  const started = new Date(reference.getTime() - 20 * 60_000)
  const inProgress = use(api.scheduleVisit({ caseId: threeVisits, teamId: 'team-2', scheduledAt: `${today(started)}T${String(started.getHours()).padStart(2, '0')}:${String(started.getMinutes()).padStart(2, '0')}`, durationMinutes: 60, type: 'HOME', purpose: 'Brigada hozir oilaga parvarish yordamini ko‘rsatmoqda (namuna)' }))
  use(api.startVisit(inProgress))

  const primary = [family, followup, mobile, inpatient, paused, waiting, observed, intake]
  const order = new Map(primary.map((caseId, index) => [caseId, index]))
  state.cases.sort((a, b) => (order.get(a.id) ?? 100 + Number(a.number.slice(-4))) - (order.get(b.id) ?? 100 + Number(b.number.slice(-4))))
  normalizeDemoIds(state)
  return state
}

/** Stable fixture identifiers preserve case-detail links across demo reloads. */
function normalizeDemoIds(state: PalliativeState) {
  const caseIds = new Map(state.cases.map(c => [c.id, `demo-case-${c.demoScenario!.code.toLowerCase().replace(/_/g, '-')}`]))
  const rewrite = (items: { id: string }[], prefix: string) => items.forEach((item, i) => { item.id = `${prefix}-${i + 1}` })
  for (const c of state.cases) {
    c.id = caseIds.get(c.id)!
    for (const key of ['assessments', 'decisions', 'careTasks', 'contacts', 'handoffs'] as const) rewrite(c[key], `${c.id}-${key}`)
    c.timeline = c.timeline.slice().sort((a, b) => a.at.localeCompare(b.at)).map((event, i) => ({ ...event, id: `${c.id}-event-${i + 1}` }))
    if (c.referral) c.referral.id = `${c.id}-referral-current`
    rewrite(c.referralHistory ?? [], `${c.id}-referral-history`)
    rewrite(c.episodes, `${c.id}-episode`)
    for (const episode of c.episodes) rewrite(episode.extensions, `${episode.id}-extension`)
  }
  rewrite(state.visits, 'demo-visit')
  state.visits.forEach(v => { v.caseId = caseIds.get(v.caseId)! })
  for (const item of state.equipment) { rewrite(item.allocations, `${item.id}-allocation`); item.allocations.forEach(a => { a.caseId = caseIds.get(a.caseId)! }) }
}
