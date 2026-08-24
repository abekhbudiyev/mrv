export type ReferenceKind = 'NORMATIVE_REFERENCE' | 'TECHNICAL_CONFIGURATION'
export type ReferenceStatus = 'ACTIVE' | 'DRAFT' | 'OPEN_DECISION' | 'HISTORICAL'
export type ReferenceCatalogFamily = 'CATEGORIES' | 'POLICIES' | 'TRANSPORT' | 'ORGANIZATIONS' | 'SYSTEM_CODES'

export interface ReferenceEntry {
  code: string
  name: string
  description?: string
  kind: ReferenceKind
  legalBasis?: string
  owner?: string
  effectiveFrom?: string
  effectiveTo?: string
  status: ReferenceStatus
  gateId?: string
  version: number
  attributes?: Record<string, string>
}

export interface ReferenceCatalog {
  id: string
  code: string
  title: string
  description: string
  family: ReferenceCatalogFamily
  readOnly: boolean
  warning?: string
  entries: ReferenceEntry[]
}

const technical = (
  code: string,
  name: string,
  description?: string,
  extra: Partial<ReferenceEntry> = {},
): ReferenceEntry => ({
  code,
  name,
  description,
  kind: 'TECHNICAL_CONFIGURATION',
  status: 'ACTIVE',
  version: 1,
  ...extra,
})

const normative = (
  code: string,
  name: string,
  description?: string,
  extra: Partial<ReferenceEntry> = {},
): ReferenceEntry => ({
  code,
  name,
  description,
  kind: 'NORMATIVE_REFERENCE',
  status: 'ACTIVE',
  version: 1,
  ...extra,
})

export const referenceCatalogs: ReferenceCatalog[] = [
  {
    id: 'legal-documents',
    code: 'legal_documents',
    title: 'Normativ hujjatlar',
    description: 'Qoida va ma’lumotnoma yozuvlari tayanadigan huquqiy manbalar.',
    family: 'CATEGORIES',
    readOnly: true,
    entries: [
      normative('VMQ-440', 'Vazirlar Mahkamasining 440-son qarori', 'Transport imtiyozlari modulining asosiy normativ manbasi.', { legalBasis: '2026-08-13 · 440-son', effectiveFrom: '2026-10-01', owner: 'O‘zbekiston Respublikasi Vazirlar Mahkamasi', version: 1, attributes: { source_url: 'https://lex.uz/docs/8400823' } }),
      normative('PF-34', 'Prezident Farmoni PF-34', 'Vatan himoyasi va el-yurt tinchligi yo‘lida halok bo‘lgan shaxslar ota-onasiga doir asos.', { legalBasis: 'PF-34', owner: 'O‘zbekiston Respublikasi Prezidenti', version: 1 }),
    ],
  },
  {
    id: 'benefit-profiles',
    code: 'benefit_profiles',
    title: 'Texnik imtiyoz profillari',
    description: 'Huquqiy asoslarni policy engine uchun normalizatsiya qiluvchi muhokama profillari.',
    family: 'CATEGORIES',
    readOnly: true,
    warning: 'C01–C11 rasmiy yopiq “11 toifa” katalogi emas. Bu texnik profillar faqat D-01 tasdiqlangach production policyga aylantiriladi.',
    entries: [
      technical('C01', 'Urush nogironi · I/II guruh', '1941–1945-yillardagi urush nogironi uchun texnik profil.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 1-ilova', version: 1 }),
      technical('C02', 'Urush nogironiga tenglashtirilgan · I/II guruh', 'Aniq tenglashtirish asosi DIS_EQ_01…04 orqali alohida saqlanadi.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 2-ilova', version: 1 }),
      technical('C03', 'Urush nogironi · III guruh', 'III guruh bo‘yicha alohida texnik profil.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 1-ilova', version: 1 }),
      technical('C04', 'Urush nogironiga tenglashtirilgan · III guruh', 'Aniq tenglashtirish asosi DIS_EQ_01…04 orqali alohida saqlanadi.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 2-ilova', version: 1 }),
      technical('C05', '1941–1945-yillardagi urush qatnashchisi', undefined, { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 1-ilova', version: 1 }),
      technical('C06', 'Sovet Ittifoqi Qahramoni / “Slava” ordeni', '“Slava” ordenining uchala darajasi sohiblari ham qamrab olinadi.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 1-ilova', version: 1 }),
      technical('C07', 'Chernobil nurlanish kasalligi', '4-ilovadagi CHERNOBYL_DISABLED_RAIL scope’i bilan avtomatik birlashtirilmaydi.', { status: 'OPEN_DECISION', gateId: 'D-06', legalBasis: 'VMQ-440', version: 1 }),
      technical('C08', 'Hamroh · principal safarga bog‘langan rol', 'Mustaqil kontingent/toifa emas; I guruh principalining ayni safariga bog‘lanadi.', { status: 'OPEN_DECISION', gateId: 'D-02', legalBasis: 'VMQ-440', version: 1 }),
      technical('C09', 'Urush qatnashchisiga tenglashtirilgan shaxs', 'Aniq PART_EQ asosi saqlanadi; C10 oilaviy asos bilan aralashtirilmaydi.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('C10', 'Halok bo‘lgan harbiyning ota-onasi / turmush o‘rtog‘i', 'Oilaviy asos uchun texnik profil.', { status: 'OPEN_DECISION', gateId: 'D-01', legalBasis: 'VMQ-440', version: 1 }),
      technical('C11', 'Vatan himoyachilarining ota-onasi', 'Ichki temir yo‘l va havo transportida “ikki marta” qoidasining talqini D-02 bilan yopiladi.', { status: 'OPEN_DECISION', gateId: 'D-02', legalBasis: 'PF-34 · VMQ-440', version: 1 }),
    ],
  },
  {
    id: 'disability-equivalence-bases',
    code: 'disability_equivalence_bases',
    title: 'Nogironlik bo‘yicha tenglashtirish asoslari',
    description: '2-ilovadagi normativ mazmunni yo‘qotmasdan saqlovchi texnik kodlar.',
    family: 'CATEGORIES',
    readOnly: true,
    warning: 'DIS_EQ_01…04 ichki kodlar; huquqiy mazmun VMQ-440 2-ilovasidan olinadi.',
    entries: [
      technical('DIS_EQ_01', 'Harbiy majburiyat, front yoki partizan otryadidagi jarohat', undefined, { legalBasis: 'VMQ-440 · 2-ilova', owner: 'Vakolatli manba idora', version: 1 }),
      technical('DIS_EQ_02', 'IIV yoki DXX xizmat vazifasidagi jarohat', undefined, { legalBasis: 'VMQ-440 · 2-ilova', owner: 'Ichki ishlar vazirligi / Davlat xavfsizlik xizmati', version: 1 }),
      technical('DIS_EQ_03', '1944–1951-yillardagi qiruvchi batalyon yoki otryad xizmati', undefined, { legalBasis: 'VMQ-440 · 2-ilova', owner: 'Vakolatli manba idora', version: 1 }),
      technical('DIS_EQ_04', 'Prezident hujjati bilan tenglashtirilgan shaxs', undefined, { legalBasis: 'VMQ-440 · 2-ilova', owner: 'Vakolatli manba idora', version: 1 }),
    ],
  },
  {
    id: 'participant-equivalence-bases',
    code: 'participant_equivalence_bases',
    title: 'Qatnashchi bo‘yicha tenglashtirish asoslari',
    description: '3-ilovadagi o‘nta normativ asosni alohida saqlovchi texnik kodlar.',
    family: 'CATEGORIES',
    readOnly: true,
    warning: 'PART_EQ_01…10 ichki kodlar; normativ mazmun VMQ-440 3-ilovasidan olinadi.',
    entries: [
      technical('PART_EQ_01', 'Armiya yoki partizan operatsiyalari qatnashchisi', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_02', '1941–1945 armiya, flot, IIV yoki DXX xizmati', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_03', 'Halok bo‘lgan harbiyning ota-onasi yoki beva turmush o‘rtog‘i', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_04', 'Leningrad korxona va muassasa xodimi', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_05', 'Afg‘oniston yoki boshqa davlatlardagi jangovar harakat qatnashchisi', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_06', 'Voyaga yetmagan sobiq mahbus', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_07', 'Antifashistik qarshilik harakati qatnashchisi', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_08', 'Front manfaatidagi maxsus tuzilma xodimi', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_09', 'Prezident hujjati bilan tenglashtirilgan shaxs', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
      technical('PART_EQ_10', 'Xorijdagi vakolatxona xavfsizligida jarohatlangan shaxs', undefined, { legalBasis: 'VMQ-440 · 3-ilova', version: 1 }),
    ],
  },
  {
    id: 'policy-parameters',
    code: 'benefit_policy_parameters',
    title: 'Imtiyoz policy parametrlari',
    description: 'Foiz, sikl, limit va principal/hamroh bog‘lanishini policy enginega uzatuvchi versiyalangan konfiguratsiya.',
    family: 'POLICIES',
    readOnly: true,
    warning: 'Yakuniy category × mode × geography × class × limit matritsasi D-01/D-02 tasdig‘iga bog‘liq.',
    entries: [
      technical('DISCOUNT_100', '100 foiz imtiyoz', 'Qoplanadigan bazaga qo‘llanadigan foiz.', { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { percent: '100' }, version: 1 }),
      technical('DISCOUNT_50', '50 foiz imtiyoz', 'Qoplanadigan bazaga qo‘llanadigan foiz.', { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { percent: '50' }, version: 1 }),
      technical('ANNUAL_OUTBOUND_RETURN', 'Yillik borish va qaytish juftligi', 'OUTBOUND va RETURN huquqlari alohida ledger holatida yuritiladi.', { status: 'OPEN_DECISION', gateId: 'D-02', version: 1 }),
      technical('BIENNIAL_OUTBOUND_RETURN', 'Ikki yillik borish va qaytish juftligi', 'Sikl boshlanishi va mixed-mode talqini D-02 bilan tasdiqlanadi.', { status: 'OPEN_DECISION', gateId: 'D-02', version: 1 }),
      technical('COMPANION_PRINCIPAL_LINK', 'Hamroh principal safarga bog‘langan', 'Mustaqil quota emas; service/date principal rezervi bilan atomar bog‘lanadi.', { status: 'OPEN_DECISION', gateId: 'D-02', version: 1 }),
    ],
  },
  {
    id: 'decision-gates',
    code: 'decision_gates',
    title: 'Ishga tushirish qaror-gate’lari',
    description: 'Normativ yoki metodik aniqlik talab qiladigan production blokatorlari.',
    family: 'POLICIES',
    readOnly: true,
    entries: [
      technical('D-01', 'Profil, subtoifa va source ownership', undefined, { status: 'OPEN_DECISION', gateId: 'D-01', owner: 'Agentlik + 6 manba idora', attributes: { latest_gate: 'API/policy contract freeze' }, version: 1 }),
      technical('D-02', 'Mixed-mode, benefit yili, cross-year, “ikki marta” va hamroh biennial', undefined, { status: 'OPEN_DECISION', gateId: 'D-02', owner: 'Agentlik + Transport vazirligi + yuridik ekspertiza', attributes: { latest_gate: 'Policy UAT boshlanishidan oldin' }, version: 1 }),
      technical('D-03', 'Settlement basis, return/no-show/deemed-provided, tarif, ERI va 10 ish kuni', undefined, { status: 'OPEN_DECISION', gateId: 'D-03', owner: 'Agentlik + Transport vazirligi + Iqtisodiyot va moliya vakillari', attributes: { latest_gate: '2026-10-01 go-live’dan oldin' }, version: 1 }),
      technical('D-04', 'Manual hujjatlar, tekshiruvchi vakolat va SLA', undefined, { status: 'OPEN_DECISION', gateId: 'D-04', owner: 'Agentlik + Transport vazirligi + tashuvchilar', attributes: { latest_gate: 'Carrier sertifikatsiyasidan oldin' }, version: 1 }),
      technical('D-05', 'Tarix manbasi, import sign-off yoki formal transition', undefined, { status: 'OPEN_DECISION', gateId: 'D-05', owner: 'Agentlik + tegishli eski reyestr egalari', attributes: { latest_gate: 'Ikki yillik policy faollashishidan oldin' }, version: 1 }),
      technical('D-06', '4-ilova 152-banddagi qo‘shimcha rail scope owner/API/fallbacki', undefined, { status: 'OPEN_DECISION', gateId: 'D-06', owner: 'Agentlik + Transport vazirligi + temir yo‘l', attributes: { latest_gate: 'Temir yo‘l integratsiyasi go-live’idan oldin' }, version: 1 }),
      technical('D-07', 'Oylik va Social Card real-time kanal chegarasi', undefined, { status: 'OPEN_DECISION', gateId: 'D-07', owner: 'Agentlik + Transport + Iqtisodiyot va moliya vakillari', attributes: { latest_gate: '2027-01-01 aktivatsiyasidan oldin' }, version: 1 }),
    ],
  },
  {
    id: 'benefit-policy-matrix',
    code: 'benefit_policy_matrix',
    title: 'Imtiyoz policy matritsasi',
    description: 'Texnik profil × transport × geografiya × chegirma × limit kesimidagi versiyalangan qaror qoidalari.',
    family: 'POLICIES',
    readOnly: true,
    warning: 'Bu C01–C11 texnik normalizatsiyasi; rasmiy yopiq toifa katalogi emas. Priority, deduplication va source ownership D-01/D-02 bilan tasdiqlanadi.',
    entries: [
      technical('POLICY_C01', 'C01 · urush nogironi I/II', undefined, { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C01', free_modes: 'RAIL', half_modes: 'AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C02', 'C02 · tenglashtirilgan I/II', undefined, { legalBasis: 'VMQ-440 · 2-ilova', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C02', free_modes: 'RAIL', half_modes: 'AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C03', 'C03 · urush nogironi III', undefined, { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C03', free_modes: 'RAIL', half_modes: 'AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C04', 'C04 · tenglashtirilgan III', undefined, { legalBasis: 'VMQ-440 · 2-ilova', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C04', free_modes: 'RAIL', half_modes: 'AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C05', 'C05 · urush qatnashchisi', undefined, { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C05', free_modes: 'RAIL', half_modes: 'AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C06', 'C06 · qahramon / “Slava” ordeni', undefined, { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C06', free_modes: 'RAIL,AIR,BUS', half_modes: '—', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C07', 'C07 · Chernobil nurlanish kasalligi', 'CHERNOBYL_DISABLED_RAIL yordamchi scope’i bilan avtomatik birlashtirilmaydi.', { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-06', attributes: { profile: 'C07', free_modes: 'RAIL,AIR,BUS', half_modes: '—', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C08', 'C08 · principalga bog‘langan hamroh', 'Mustaqil quota yoki kontingent yozuvi emas.', { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-02', attributes: { profile: 'C08', free_modes: '—', half_modes: 'RAIL,AIR,BUS', geography: 'PRINCIPAL_JOURNEY', cycle: 'ANNUAL', limit: 'PRINCIPAL OUTBOUND + RETURN', priority: 'PRINCIPAL_LINK' }, version: 1 }),
      technical('POLICY_C09', 'C09 · qatnashchiga tenglashtirilgan', undefined, { legalBasis: 'VMQ-440 · 3-ilova', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C09', free_modes: '—', half_modes: 'RAIL,AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C10', 'C10 · halok bo‘lgan harbiy oilasi', undefined, { legalBasis: 'VMQ-440', status: 'OPEN_DECISION', gateId: 'D-01', attributes: { profile: 'C10', free_modes: '—', half_modes: 'RAIL,AIR,BUS', geography: 'POLICY_SCOPE', cycle: 'ANNUAL', limit: '1 OUTBOUND + 1 RETURN', priority: 'PENDING_D01' }, version: 1 }),
      technical('POLICY_C11', 'C11 · Vatan himoyachilarining ota-onasi', '“Yiliga ikki marta” birligi D-02 bilan aniqlanadi.', { legalBasis: 'PF-34 · VMQ-440', status: 'OPEN_DECISION', gateId: 'D-02', attributes: { profile: 'C11', free_modes: 'RAIL,AIR', half_modes: '—', geography: 'UZ_DOMESTIC_ONLY', cycle: 'ANNUAL', limit: '2 TIMES · PENDING_D02', priority: 'PENDING_D01' }, version: 1 }),
    ],
  },
  {
    id: 'payment-channels',
    code: 'payment_channels',
    title: 'To‘lov kanallari',
    description: 'Bir safarning ikki marta qoplanishini oldini oluvchi o‘zaro istisno kanallar.',
    family: 'POLICIES',
    readOnly: true,
    entries: [
      technical('MONTHLY_CLAIM', 'Oylik reyestr va claim', 'Tashuvchi reyestri asosidagi qoplash kanali.', { effectiveFrom: '2026-10-01', version: 1 }),
      technical('SOCIAL_CARD_REALTIME', 'Ijtimoiy karta real-time to‘lovi', 'Anti-double-payment va reconciliation D-07 bilan yopilgach faollashadi.', { effectiveFrom: '2027-01-01', status: 'OPEN_DECISION', gateId: 'D-07', version: 1 }),
    ],
  },
  {
    id: 'regulatory-deadlines',
    code: 'regulatory_deadlines',
    title: 'Normativ muddatlar',
    description: 'Biznes sanalari va kalendar konfiguratsiyasiga kiruvchi asosiy muddatlar.',
    family: 'POLICIES',
    readOnly: true,
    entries: [
      normative('POLICY_GO_LIVE', 'VMQ-440 tartibi boshlanishi', undefined, { legalBasis: 'VMQ-440', effectiveFrom: '2026-10-01', version: 1 }),
      normative('REGISTRY_DUE_DAY', 'Reyestr keyingi oyning 10-sanasigacha', undefined, { legalBasis: 'VMQ-440', attributes: { day_of_month: '10' }, version: 1 }),
      normative('PAYMENT_SLA_WORKDAYS', 'Hujjatlar kelgach 10 ish kuni', 'SLA reyestr deadline’dan emas, hujjatlar taqdim etilgan vaqtdan hisoblanadi.', { legalBasis: 'VMQ-440', attributes: { workdays: '10' }, version: 1 }),
      normative('SOCIAL_CARD_START', 'Ijtimoiy karta real-time kanali boshlanishi', undefined, { legalBasis: 'VMQ-440', effectiveFrom: '2027-01-01', status: 'OPEN_DECISION', gateId: 'D-07', version: 1 }),
    ],
  },
  {
    id: 'transport-modes',
    code: 'transport_modes',
    title: 'Transport turlari',
    description: 'VMQ-440 scope’iga kiruvchi transport rejimlari.',
    family: 'TRANSPORT',
    readOnly: true,
    entries: [
      normative('RAIL', 'Temir yo‘l', 'Yo‘lovchi temir yo‘l transporti.', { legalBasis: 'VMQ-440', effectiveFrom: '2026-10-01', owner: 'Transport vazirligi', version: 1 }),
      normative('AIR', 'Havo transporti', 'Yo‘lovchi havo transporti.', { legalBasis: 'VMQ-440', effectiveFrom: '2026-10-01', owner: 'Transport vazirligi', version: 1 }),
      normative('BUS', 'Shaharlararo avtobus', 'Shaharlararo avtobus tashuvi; shahar ichki yo‘nalishi emas.', { legalBasis: 'VMQ-440', effectiveFrom: '2026-10-01', owner: 'Transport vazirligi', version: 1 }),
    ],
  },
  {
    id: 'fare-classes',
    code: 'fare_classes',
    title: 'Chipta klasslari',
    description: 'Transportga bog‘liq qoplanadigan bazaviy klass va yuqori klass top-up konfiguratsiyasi.',
    family: 'TRANSPORT',
    readOnly: true,
    warning: 'Avtobus klasslari va qoplanadigan tarif komponentlarining yakuniy ro‘yxati D-03 bilan tasdiqlanadi.',
    entries: [
      technical('ECONOMY', 'Ekonom', 'Havo va tegishli tarif siyosatidagi bazaviy klass.', { legalBasis: 'VMQ-440', owner: 'Transport vazirligi', attributes: { transport_modes: 'RAIL,AIR,BUS', base_eligible: 'true' }, version: 1 }),
      technical('PLATSKART', 'Platskart', 'Temir yo‘l klassi.', { legalBasis: 'VMQ-440', owner: 'Transport vazirligi', attributes: { transport_modes: 'RAIL', base_eligible: 'true' }, version: 1 }),
      technical('COUPE', 'Kupe', 'Temir yo‘l klassi.', { legalBasis: 'VMQ-440', owner: 'Transport vazirligi', attributes: { transport_modes: 'RAIL', base_eligible: 'true' }, version: 1 }),
      technical('STANDARD', 'Standart', 'Avtobus uchun demo konfiguratsiya; normativ yopiq klass katalogi emas.', { status: 'OPEN_DECISION', gateId: 'D-03', owner: 'Transport vazirligi', attributes: { transport_modes: 'BUS', base_eligible: 'true' }, version: 1 }),
      technical('BUSINESS', 'Biznes / yuqori klass', 'Bazaviy qoplanadigan summa ustidagi farq yo‘lovchi top-up’i sifatida ajratiladi.', { status: 'OPEN_DECISION', gateId: 'D-03', owner: 'Transport vazirligi', attributes: { transport_modes: 'RAIL,AIR,BUS', base_eligible: 'false' }, version: 1 }),
    ],
  },
  {
    id: 'countries',
    code: 'countries',
    title: 'Mamlakat va geografiya kodlari',
    description: 'Ichki va xalqaro safar scope’ini tekshirish uchun effective-dated mamlakat katalogi.',
    family: 'TRANSPORT',
    readOnly: true,
    warning: 'Bu yopiq Bitim davlatlari ro‘yxati emas. To‘liq tarkib va amal davrlari vakolatli ISO/Bitim ma’lumotnomasidan sinxronlanadi.',
    entries: [
      normative('UZ', 'O‘zbekiston', 'Ichki safar geography kodi.', { legalBasis: 'VMQ-440', owner: 'Vakolatli mamlakat ma’lumotnomasi', version: 1 }),
      technical('KZ', 'Qozog‘iston', 'Xalqaro yo‘nalish uchun demo yozuv; Bitim scope’i va amal davri manbadan tekshiriladi.', { status: 'DRAFT', owner: 'Vakolatli mamlakat ma’lumotnomasi', version: 1 }),
    ],
  },
  {
    id: 'currencies',
    code: 'currencies',
    title: 'Valyutalar',
    description: 'Tarif va settlement summalarini minor unit bilan uzatish uchun kodlar.',
    family: 'TRANSPORT',
    readOnly: true,
    entries: [technical('UZS', 'O‘zbekiston so‘mi', 'API summalari minor unit va currency_exponent bilan uzatiladi.', { attributes: { exponent: '2' }, version: 1 })],
  },
  {
    id: 'transport-nodes',
    code: 'transport_nodes',
    title: 'Bekat, aeroport va avtovokzallar',
    description: 'Journey origin/destination kodlari uchun transportga bog‘langan tugunlar registri.',
    family: 'TRANSPORT',
    readOnly: true,
    warning: 'Quyidagi yozuvlar MVP ssenariy kodlari. Production kodlar Transport vazirligining vakolatli manbasidan sinxronlanadi.',
    entries: [
      technical('TAS_RAIL', 'Toshkent temir yo‘l bekati', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'RAIL' }, version: 1 }),
      technical('SKD_RAIL', 'Samarqand temir yo‘l bekati', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'RAIL' }, version: 1 }),
      technical('BUX_RAIL', 'Buxoro temir yo‘l bekati', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'RAIL' }, version: 1 }),
      technical('TAS_AIR', 'Toshkent aeroporti', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'AIR' }, version: 1 }),
      technical('NCU_AIR', 'Nukus aeroporti', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'AIR' }, version: 1 }),
      technical('TAS_BUS', 'Toshkent avtovokzali', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'BUS' }, version: 1 }),
      technical('JZZ_BUS', 'Jizzax avtovokzali', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { country: 'UZ', transport_mode: 'BUS' }, version: 1 }),
    ],
  },
  {
    id: 'routes',
    code: 'routes',
    title: 'Yo‘nalishlar',
    description: 'Origin/destination tugunlari va transport turini birlashtiruvchi versiyalangan route yozuvlari.',
    family: 'TRANSPORT',
    readOnly: true,
    warning: 'Route yozuvlari MVP demo konfiguratsiyasi; productionda tashuvchi va vakolatli transport registri owner bo‘ladi.',
    entries: [
      technical('RAIL_TAS_SKD', 'Toshkent → Samarqand · temir yo‘l', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { origin: 'TAS_RAIL', destination: 'SKD_RAIL', transport_mode: 'RAIL' }, version: 1 }),
      technical('RAIL_BUX_TAS', 'Buxoro → Toshkent · temir yo‘l', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { origin: 'BUX_RAIL', destination: 'TAS_RAIL', transport_mode: 'RAIL' }, version: 1 }),
      technical('AIR_TAS_NCU', 'Toshkent → Nukus · havo', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { origin: 'TAS_AIR', destination: 'NCU_AIR', transport_mode: 'AIR' }, version: 1 }),
      technical('BUS_TAS_JZZ', 'Toshkent → Jizzax · avtobus', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { origin: 'TAS_BUS', destination: 'JZZ_BUS', transport_mode: 'BUS' }, version: 1 }),
    ],
  },
  {
    id: 'manual-documents',
    code: 'manual_document_types',
    title: 'Tasdiqlovchi hujjatlar',
    description: 'YAMIHda huquq topilmaganda manual fallback uchun hujjat turlari.',
    family: 'TRANSPORT',
    readOnly: true,
    warning: 'Temir yo‘l uchun uchta nomlangan hujjat bor; havo va avtobus kataloglari D-04 bilan ochilishi kerak.',
    entries: [
      normative('RAIL_WAR_DISABLED_CERT', 'Urush oqibatida nogironligi bo‘lgan shaxs guvohnomasi', undefined, { legalBasis: 'VMQ-440 · temir yo‘l fallback', owner: 'Vakolatli organ', version: 1, attributes: { transport_mode: 'RAIL' } }),
      normative('RAIL_WAR_PARTICIPANT_CERT', 'Urush qatnashchisi guvohnomasi', undefined, { legalBasis: 'VMQ-440 · temir yo‘l fallback', owner: 'Vakolatli organ', version: 1, attributes: { transport_mode: 'RAIL' } }),
      normative('RAIL_BENEFIT_RIGHT_CERT', 'Imtiyozga huquqi to‘g‘risidagi guvohnoma', undefined, { legalBasis: 'VMQ-440 · temir yo‘l fallback', owner: 'Vakolatli organ', version: 1, attributes: { transport_mode: 'RAIL' } }),
      technical('AIR_DOCUMENT_SET', 'Havo transporti hujjatlar to‘plami', 'Rasmiy yopiq ro‘yxat va tekshiruvchi vakolat kutilmoqda.', { status: 'OPEN_DECISION', gateId: 'D-04', version: 1, attributes: { transport_mode: 'AIR' } }),
      technical('BUS_DOCUMENT_SET', 'Avtobus hujjatlar to‘plami', 'Rasmiy yopiq ro‘yxat va tekshiruvchi vakolat kutilmoqda.', { status: 'OPEN_DECISION', gateId: 'D-04', version: 1, attributes: { transport_mode: 'BUS' } }),
    ],
  },
  {
    id: 'source-organizations',
    code: 'source_organizations',
    title: 'Kontingent manba tashkilotlari',
    description: 'Idoralararo integratsiyalashuv platformasi orqali huquq eventlarini yuboruvchi rasmiy manbalar.',
    family: 'ORGANIZATIONS',
    readOnly: true,
    entries: [
      normative('PENSION_FUND', 'Pensiya jamg‘armasi', undefined, { legalBasis: 'VMQ-440', owner: 'Pensiya jamg‘armasi', version: 1 }),
      normative('CUSTOMS_COMMITTEE', 'Bojxona qo‘mitasi', undefined, { legalBasis: 'VMQ-440', owner: 'Bojxona qo‘mitasi', version: 1 }),
      normative('DEFENCE_MINISTRY', 'Mudofaa vazirligi', undefined, { legalBasis: 'VMQ-440', owner: 'Mudofaa vazirligi', version: 1 }),
      normative('INTERNAL_AFFAIRS', 'Ichki ishlar vazirligi', undefined, { legalBasis: 'VMQ-440', owner: 'Ichki ishlar vazirligi', version: 1 }),
      normative('EMERGENCIES_MINISTRY', 'Favqulodda vaziyatlar vazirligi', undefined, { legalBasis: 'VMQ-440', owner: 'Favqulodda vaziyatlar vazirligi', version: 1 }),
      normative('STATE_SECURITY_SERVICE', 'Davlat xavfsizlik xizmati', undefined, { legalBasis: 'VMQ-440', owner: 'Davlat xavfsizlik xizmati', version: 1 }),
    ],
  },
  {
    id: 'carriers',
    code: 'carriers',
    title: 'Tashuvchilar',
    description: 'Transport turi, mTLS client va settlement payee bilan bog‘lanadigan operatsion tashuvchi registri.',
    family: 'ORGANIZATIONS',
    readOnly: true,
    warning: 'Quyidagi kodlar MVP demo konfiguratsiyasi. Production ro‘yxat va ownership Transport vazirligining vakolatli registridan olinadi.',
    entries: [
      technical('UZRAIL', 'O‘zbekiston temir yo‘llari', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { transport_mode: 'RAIL' }, version: 1 }),
      technical('UZBEKISTAN_AIRWAYS', 'Uzbekistan Airways', undefined, { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { transport_mode: 'AIR' }, version: 1 }),
      technical('INTERCITY_BUS', 'Toshkent avtovokzali', 'MVPdagi shaharlararo avtobus adapteri.', { status: 'DRAFT', owner: 'Transport vazirligi', attributes: { transport_mode: 'BUS' }, version: 1 }),
    ],
  },
  {
    id: 'applicant-roles',
    code: 'applicant_roles',
    title: 'Murojaatchi va yo‘lovchi rollari',
    description: 'Moslik, rezerv va chipta oqimida ishlatiladigan texnik rollar.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [
      technical('BENEFICIARY', 'Benefitsiar', 'Huquq egasi.', { version: 1 }),
      technical('LEGAL_REPRESENTATIVE', 'Qonuniy vakil', 'Vakolat hujjati va amal davri tekshiriladi.', { version: 1 }),
      technical('COMPANION', 'Hamroh', 'Mustaqil kontingent emas; principal safarga bog‘langan rol.', { gateId: 'D-02', version: 1 }),
    ],
  },
  {
    id: 'leg-types',
    code: 'leg_types',
    title: 'Safar yo‘nalishlari',
    description: 'Limit ledgerdagi mustaqil borish va qaytish huquqlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [technical('OUTBOUND', 'Borish', undefined, { version: 1 }), technical('RETURN', 'Qaytish', undefined, { version: 1 })],
  },
  {
    id: 'contingent-event-types',
    code: 'contingent_event_types',
    title: 'Kontingent event turlari',
    description: 'Barcha manba tashkilotlar yuboradigan yagona event envelope variantlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [
      technical('RIGHT_GRANTED', 'Huquq berildi', undefined, { version: 1 }),
      technical('RIGHT_CORRECTED', 'Huquq tuzatildi', undefined, { version: 1 }),
      technical('RIGHT_REVOKED', 'Huquq bekor qilindi', undefined, { version: 1 }),
      technical('RIGHT_REINSTATED', 'Huquq tiklandi', undefined, { version: 1 }),
    ],
  },
  {
    id: 'ticket-event-types',
    code: 'ticket_event_types',
    title: 'Chipta event turlari',
    description: 'Barcha transportlar uchun umumiy chipta lifecycle eventlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['ISSUED', 'RETURNED', 'VOIDED', 'RESCHEDULED', 'TRAVELLED', 'NO_SHOW'].map((code) => technical(code, ({ ISSUED: 'Chipta berildi', RETURNED: 'Qaytarildi', VOIDED: 'Bekor qilindi', RESCHEDULED: 'Boshqa sanaga ko‘chirildi', TRAVELLED: 'Foydalanildi', NO_SHOW: 'Foydalanilmadi' } as Record<string, string>)[code]!, undefined, { version: 1 })),
  },
  {
    id: 'return-reasons',
    code: 'return_reasons',
    title: 'Qaytarish va foydalanmaslik sabablari',
    description: 'Limitni tiklash qarori sabab va dalilga bog‘lanishi uchun texnik kodlar.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    warning: 'Yopiq sabab katalogi va settlement ta’siri D-03 bilan tasdiqlanadi. PASSENGER_REQUEST avtomatik limit restore qilmaydi.',
    entries: [
      technical('PASSENGER_REQUEST', 'Yo‘lovchi talabi', 'Avtomatik limit restore qilinmaydi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('TECHNICAL_NONUSE', 'Tasdiqlangan texnik nonuse', 'Bir haftalik shart va dalil bajarilganda restore reviewga kiradi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('NATURAL_NONUSE', 'Tasdiqlangan tabiiy nonuse', 'Bir haftalik shart va dalil bajarilganda restore reviewga kiradi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('OTHER_VERIFIED_NONUSE', 'Boshqa tasdiqlangan nonuse', 'Bir haftalik shart va dalil talab qilinadi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('CARRIER_CANCELLED', 'Tashuvchi bekor qilgan', 'Tashuvchi dalili va reconciliation bilan qayta ishlanadi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
    ],
  },
  {
    id: 'eligibility-results',
    code: 'eligibility_results',
    title: 'Moslik natijalari',
    description: 'Check-and-reserve servisining yuqori darajadagi natija kodlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [technical('ELIGIBLE', 'Mos', undefined, { version: 1 }), technical('NOT_ELIGIBLE', 'Mos emas', undefined, { version: 1 }), technical('MANUAL_DOCUMENT_REQUIRED', 'Tasdiqlovchi hujjat kerak', undefined, { gateId: 'D-04', version: 1 })],
  },
  {
    id: 'reservation-states',
    code: 'reservation_states',
    title: 'Rezerv holatlari',
    description: 'Huquq, ledger, rezerv va chipta state’lari alohida yuritiladi.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['HELD', 'CONSUMED', 'RESTORE_REVIEW', 'RELEASED', 'RESTORED'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'entitlement-leg-states',
    code: 'entitlement_leg_states',
    title: 'Limit ledger holatlari',
    description: 'OUTBOUND/RETURN huquq leglari rezervdan alohida yuritiladigan holatlar.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['AVAILABLE', 'HELD', 'CONSUMED', 'RESTORE_REVIEW', 'RESTORED'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'return-review-statuses',
    code: 'return_review_statuses',
    title: 'Qaytarishni ko‘rib chiqish holatlari',
    description: 'Vakolat, tashkilot va ERI claimi bilan boshqariladigan restore review state-machine.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [
      technical('PENDING', 'Ko‘rib chiqish kutilmoqda', undefined, { version: 1 }),
      technical('APPROVED', 'Tasdiqlandi', undefined, { version: 1 }),
      technical('REJECTED', 'Rad etildi', undefined, { version: 1 }),
      technical('METHODOLOGY_PENDING', 'Metodika kutilmoqda', 'Passenger-request avtomatik restore qilinmaydi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
    ],
  },
  {
    id: 'ticket-states',
    code: 'ticket_states',
    title: 'Chipta holatlari',
    description: 'Chipta aggregate’ining kanonik state-machine holatlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['ISSUED', 'TRAVELLED', 'RETURNED', 'RETURN_DEADLINE_EXPIRED', 'NO_SHOW', 'EXCHANGED', 'VOID'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'claim-statuses',
    code: 'claim_statuses',
    title: 'Claim holatlari',
    description: 'Payment state-machine’dan ajratilgan claim holatlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['SUBMITTED', 'PARTIALLY_ACCEPTED', 'ACCEPTED', 'REJECTED', 'ADJUSTMENT_REQUIRED', 'CLOSED'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'settlement-stages',
    code: 'settlement_stages',
    title: 'Settlement bosqichlari',
    description: 'Claim yaratilishidan oldingi settlement aggregate bosqichlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['DRAFT', 'VALIDATING', 'READY_TO_SUBMIT', 'CLAIM_CREATED'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'payment-statuses',
    code: 'payment_statuses',
    title: 'To‘lov holatlari',
    description: 'Aniq claim_id va immutable versiyaga bog‘langan payment state-machine.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: ['CREATED', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'PAYMENT_ORDER_CREATED', 'PROCESSING', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'RETRYING', 'REVERSED', 'RECONCILED'].map((code) => technical(code, code, undefined, { version: 1 })),
  },
  {
    id: 'authorization-sources',
    code: 'authorization_sources',
    title: 'Avtorizatsiya manbalari',
    description: 'Chipta rasmiylashtirishga asos bo‘lgan onlayn yoki manual qaror manbasi.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    entries: [
      technical('ONLINE', 'Onlayn check-and-reserve', undefined, { version: 1 }),
      technical('MANUAL_DOCUMENT', 'Tasdiqlangan manual hujjat', 'Opaque bir martalik authorization rezervga bog‘lanadi.', { gateId: 'D-04', version: 1 }),
      technical('LEGACY_MIGRATION', 'Tarixiy migratsiya', 'Faqat tarix importi; yangi chipta uchun avtorizatsiya emas.', { status: 'HISTORICAL', gateId: 'D-05', version: 1 }),
    ],
  },
  {
    id: 'evidence-types',
    code: 'evidence_types',
    title: 'Dalil va ilova turlari',
    description: 'Chipta, tarif va settlement qatorlarini tekshirishda ishlatiladigan himoyalangan reference turlari.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    warning: 'Majburiy/yordamchi dalillar va retention qoidalari D-03 bilan yakunlanadi.',
    entries: [
      technical('TICKET_COPY', 'Chipta nusxasi', undefined, { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('ROUTE_SHEET', 'Yo‘nalish qaydnomasi', undefined, { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
      technical('TARIFF_EVIDENCE', 'Tarif dalili', undefined, { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 }),
    ],
  },
  {
    id: 'settlement-basis',
    code: 'settlement_basis',
    title: 'Hisob-kitob asoslari',
    description: 'Claimga kiradigan chipta qatorini aniqlovchi transport-spetsifik asoslar.',
    family: 'SYSTEM_CODES',
    readOnly: true,
    warning: 'Yakuniy settlement_basis katalogi qarorda ochilmagan; D-03 yopilmaguncha faqat placeholder ishlatiladi.',
    entries: [technical('PENDING_D03', 'Metodika kutilmoqda', 'Productionda claimable holat sifatida ishlatilmaydi.', { status: 'OPEN_DECISION', gateId: 'D-03', version: 1 })],
  },
]

export function getReferenceCatalog(code: string) {
  return referenceCatalogs.find((catalog) => catalog.code === code)
}

const optionEntries = (catalogCode: string) => getReferenceCatalog(catalogCode)?.entries ?? []

export const sourceOrganizationOptions = optionEntries('source_organizations').map(({ code, name }) => ({ code, label: name }))
export const transportModeOptions = optionEntries('transport_modes').map(({ code, name }) => ({ code, label: name }))
export const fareClassOptions = optionEntries('fare_classes').map(({ code, name, attributes }) => ({
  code,
  label: name,
  transportModes: attributes?.transport_modes?.split(',') ?? [],
  baseEligible: attributes?.base_eligible === 'true',
}))
export const countryOptions = optionEntries('countries').map(({ code, name, status }) => ({ code, label: name, status }))
export const carrierOptions = optionEntries('carriers').map(({ code, name, attributes }) => ({ code, label: name, transportMode: attributes?.transport_mode }))
export const applicantRoleOptions = optionEntries('applicant_roles').map(({ code, name }) => ({ code, label: name }))
export const legTypeOptions = optionEntries('leg_types').map(({ code, name }) => ({ code, label: name }))
export const contingentEventTypeOptions = optionEntries('contingent_event_types').map(({ code, name }) => ({ code, label: name }))
export const ticketEventTypeOptions = optionEntries('ticket_event_types').map(({ code, name }) => ({ code, label: name }))
export const returnReasonOptions = optionEntries('return_reasons').map(({ code, name }) => ({ code, label: name }))
export const disabilityEquivalenceOptions = optionEntries('disability_equivalence_bases').map(({ code, name }) => ({ code, label: `${code} · ${name}` }))
export const participantEquivalenceOptions = optionEntries('participant_equivalence_bases').map(({ code, name }) => ({ code, label: `${code} · ${name}` }))
export const benefitProfileOptions = optionEntries('benefit_profiles')
  .filter(({ code }) => code !== 'C08')
  .map(({ code, name }) => ({ code, label: `${code} · ${name}` }))
