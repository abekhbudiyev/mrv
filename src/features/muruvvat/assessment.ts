export type AssessmentScale = 'barthel' | 'lawton'

export type AssessmentOption = {
  id: string
  label: string
  score: number
  suggestedService?: string
}

export type AssessmentQuestion = {
  id: string
  scale: AssessmentScale
  order: number
  title: string
  options: AssessmentOption[]
}

export type AssessmentCategory = {
  id: string
  label: string
  rangeLabel: string
  min: number
  max: number
}

export const assessmentCategories: AssessmentCategory[] = [
  {
    id: 'independent',
    label: 'Uyda parvarish qilish talab etilmaydi',
    rangeLabel: '116 ball va undan ortiq',
    min: 116,
    max: Number.POSITIVE_INFINITY,
  },
  {
    id: 'slight',
    label: "O'zganing yordamiga ozgina bog'liq",
    rangeLabel: '88 — 115 ball',
    min: 88,
    max: 115,
  },
  {
    id: 'moderate',
    label: "O'zganing yordamiga mo'tadil bog'liqlik",
    rangeLabel: '63 — 87 ball',
    min: 63,
    max: 87,
  },
  {
    id: 'visible',
    label: "O'zganing yordamiga ayon ko'rinib turgan bog'liqlik",
    rangeLabel: '54 — 62 ball',
    min: 54,
    max: 62,
  },
  {
    id: 'significant',
    label: "O'zganing yordamiga ancha bog'liqlik",
    rangeLabel: '0 — 53 ball',
    min: 0,
    max: 53,
  },
]

export function getAssessmentCategory(total: number) {
  return assessmentCategories.find((category) => total >= category.min && total <= category.max)
    ?? assessmentCategories[assessmentCategories.length - 1]!
}

export const barthelAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'barthel-eating',
    scale: 'barthel',
    order: 1,
    title: 'Ovqatlanish',
    options: [
      { id: 'independent', score: 10, label: "Ovqatlanish va tayyorgarlikni qiyinchiliksiz mustaqil bajaradi." },
      { id: 'slow-independent', score: 9, label: 'Ovqatlanish va tayyorgarlikni mustaqil bajaradi, ammo ancha vaqt ketadi.' },
      { id: 'assistive-independent', score: 8, label: "Maxsus idish-tovoq yoki RTV bilan mustaqil bajaradi." },
      { id: 'assistive-difficult', score: 7, label: "RTV bilan katta qiyinchilik bilan bajaradi.", suggestedService: "Ovqat tayyorlashda ko'maklashish" },
      { id: 'can-eat-only', score: 6, label: "Ovqatni qabul qiladi, ammo tayyorgarlik ko'ra olmaydi.", suggestedService: "Ovqat tayyorlashda ko'maklashish" },
      { id: 'minor-help', score: 5, label: "Qarab turish yoki ozgina yordam talab etiladi.", suggestedService: "Ovqat tayyorlashda ko'maklashish" },
      { id: 'partial-help', score: 3, label: 'Doimiy qarab turish yoki qisman yordam zarur.', suggestedService: 'Ovqat va yarim tayyor ovqatlarni tayyorlab berish' },
      { id: 'major-help', score: 1, label: 'Ovqatlanishda ancha yordam talab etiladi.', suggestedService: 'Ovqat tayyorlash va ovqatlantirish' },
      { id: 'dependent', score: 0, label: "O'zi mustaqil ovqatlana olmaydi.", suggestedService: 'Ovqat tayyorlash va ovqatlantirish' },
    ],
  },
  {
    id: 'barthel-bathing',
    scale: 'barthel',
    order: 2,
    title: "Cho'milish",
    options: [
      { id: 'independent', score: 5, label: 'Vanna yoki dushni qiyinchiliksiz mustaqil qabul qiladi.' },
      { id: 'difficult', score: 4, label: 'Vanna yoki dushni mustaqil, ammo qiyinchilik bilan qabul qiladi.' },
      { id: 'minor-help', score: 3, label: "Vanna yoki dushda qarab turish yoki ozgina yordam kerak.", suggestedService: "Tayyorgarlik ko'rishda ko'maklashish, moslashtirish xizmati" },
      { id: 'partial-help', score: 2, label: "Vanna yoki dush qabul qilishda yordam talab etiladi.", suggestedService: "Tayyorgarlik ko'rishda ko'maklashish, moslashtirish xizmati" },
      { id: 'major-help', score: 1, label: "Vanna yoki dush qabul qilishda ancha yordam talab etiladi.", suggestedService: "Cho'miltirish xizmati, moslashtirish xizmati" },
      { id: 'bed-only', score: 0, label: "Cho'milish faqat krovat atrofida o'zga yordamida amalga oshiriladi.", suggestedService: "Cho'miltirish xizmati, moslashtirish xizmati" },
    ],
  },
  {
    id: 'barthel-grooming',
    scale: 'barthel',
    order: 3,
    title: "Hojatga chiqish (yuvinish, soch tarash, tish tozalash, soqol olish, protezlar)",
    options: [
      { id: 'independent', score: 5, label: 'Qiyinchiliksiz mustaqil amalga oshiriladi.' },
      { id: 'difficult', score: 4, label: 'Mustaqil, ammo qiyinchilik bilan amalga oshiriladi.' },
      { id: 'minor-help', score: 3, label: "Qarab turish yoki ozgina yordam talab etiladi.", suggestedService: "Harakatlanishida ko'maklashish" },
      { id: 'partial-help', score: 2, label: "O'zgalarning yordami talab etiladi.", suggestedService: "Harakatlanishida ko'maklashish, sartarosh xizmatini jalb qilish" },
      { id: 'major-help', score: 1, label: "O'zgalarning ancha yordami talab etiladi.", suggestedService: "Harakatlanishida ko'maklashish, sartarosh xizmatini jalb qilish" },
      { id: 'cannot', score: 0, label: 'Hojatga mustaqil borolmaydi.', suggestedService: "Sartarosh xizmatini jalb qilish, yordamchi vositalar bilan ta'minlash" },
    ],
  },
  {
    id: 'barthel-dressing',
    scale: 'barthel',
    order: 4,
    title: 'Kiyinish va poyabzal kiyish',
    options: [
      { id: 'independent', score: 10, label: 'Qiyinchiliksiz mustaqil kiyinadi va poyabzal kiyadi.' },
      { id: 'assistive-easy', score: 9, label: "RTV bilan qiyinchiliksiz mustaqil kiyinadi va poyabzal kiyadi." },
      { id: 'slow-independent', score: 8, label: "Sekinlik bilan, shu jumladan RTV bilan mustaqil kiyinadi." },
      { id: 'assistive-difficult', score: 7, label: "RTV bilan katta qiyinchilik bilan mustaqil kiyinadi." },
      { id: 'minor-help', score: 5, label: "Tugma qadash, bog'ich bog'lash kabi ishlar uchun ozgina yordam kerak.", suggestedService: "Qulay kiyimlar xarid qilishda ko'maklashish" },
      { id: 'partial-help', score: 3, label: "Kiyinishda va poyabzal kiyishda yordam talab etiladi.", suggestedService: "Qulay kiyimlar xarid qilishda ko'maklashish, kiyimlarini almashtirishda ko'maklashish" },
      { id: 'major-help', score: 1, label: "Kiyinishda va poyabzal kiyishda ancha yordam talab etiladi.", suggestedService: "Qulay kiyimlar xarid qilishda ko'maklashish, kiyimlarini almashtirishda ko'maklashish" },
      { id: 'dependent', score: 0, label: "Mustaqil ravishda kiyinolmaydi va poyabzal kiyolmaydi.", suggestedService: "Qulay kiyimlar xarid qilishda ko'maklashish, kiyimlarini almashtirishda ko'maklashish" },
    ],
  },
  {
    id: 'barthel-bowel',
    scale: 'barthel',
    order: 5,
    title: 'Defekatsiya nazorati',
    options: [
      { id: 'fully-controlled', score: 10, label: "Harakatlarini to'liq nazorat qiladi, sham yoki huqnadan mustaqil foydalanadi." },
      { id: 'colostoma-self', score: 8, label: "Funksiyalashtiruvchi kolostomani najas qabul qilgich bilan mustaqil nazorat qiladi." },
      { id: 'weekly-incident', score: 5, label: "Tasodifiy noxush holatlar bo'lib turadi yoki sham/huqna uchun yordam kerak.", suggestedService: "Huqna yoki shamchadan foydalanishda patronaj hamshira xizmatini jalb qilish" },
      { id: 'partial-control', score: 2, label: "Haftada 2-3 marta nazorat qila olmaydi yoki kolostomani qisman yordam bilan nazorat qiladi.", suggestedService: "Huqna yoki shamcha yoki kolostomadan foydalanishda patronaj hamshira xizmatini jalb qilish" },
      { id: 'mostly-uncontrolled', score: 1, label: "Amalda o'zini nazorat qila olmaydi, bu haftada uch martadan ko'p yuz beradi.", suggestedService: "Tagliklar xaridida ko'maklashish, patronaj hamshira xizmatini jalb qilish" },
      { id: 'chronic-uncontrolled', score: 0, label: "Surunkali nazorat qilolmaydi yoki doimiy huqna/kolostoma parvarishiga ehtiyoj sezadi.", suggestedService: "Patronaj hamshira xizmatini jalb qilish, tagliklar xaridida ko'maklashish, o'rin ko'rpalarni tozalash" },
    ],
  },
  {
    id: 'barthel-bladder',
    scale: 'barthel',
    order: 6,
    title: 'Peshob chiqishini nazorat qilish',
    options: [
      { id: 'fully-controlled', score: 10, label: "O'zgalar yordamisiz to'liq nazorat qiladi." },
      { id: 'device-self', score: 8, label: "Peshob qabul qilgich, urostoma yoki kateterni mustaqil boshqaradi." },
      { id: 'incident', score: 5, label: 'Tasodifiy noxush holatlar bir kecha-kunduzda kamida bir marta kuzatiladi.' },
      { id: 'partial-control', score: 2, label: "Bir kecha-kunduzda 2-3 marta nazorat qila olmaydi yoki qisman yordam bilan nazorat qiladi.", suggestedService: "Harakatlarni amalga oshirishda ko'maklashish xizmati" },
      { id: 'mostly-uncontrolled', score: 1, label: "Amalda nazorat qila olmaydi, urostomani mustaqil boshqara olmaydi va tagliklardan foydalanadi.", suggestedService: "Harakatlarni amalga oshirishda ko'maklashish, patronaj hamshira xizmatini jalb qilish, tagliklarni xaridida ko'maklashish" },
      { id: 'chronic-uncontrolled', score: 0, label: "Surunkali nazorat qila olmaydi yoki kateterdan mustaqil foydalana olmaydi.", suggestedService: "Zarur vositalarni xarid qilish, tagliklarni almashtirish, o'rin ko'rpalarni tozalash, kursi-hojatxona so'rovi" },
    ],
  },
  {
    id: 'barthel-toilet',
    scale: 'barthel',
    order: 7,
    title: 'Hojatga borish va uni amalga oshirish',
    options: [
      { id: 'independent', score: 10, label: 'Qiyinchiliksiz mustaqil hojatga boradi va amalga oshiradi.' },
      { id: 'assistive', score: 9, label: "RTV bilan mustaqil hojatga boradi va amalga oshiradi." },
      { id: 'assistive-difficult', score: 7, label: "Kursi-hojatxona yoki RTV bilan katta qiyinchilik bilan mustaqil bajaradi." },
      { id: 'minor-help', score: 5, label: "Muvozanat, yechinish, kiyinish uchun ozgina yordam yoki qarab turish kerak.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'maklashish xizmati, kursi-hojatxona ajratilishi uchun so'rov" },
      { id: 'major-help', score: 3, label: "Hojatga borish va uni amalga oshirishda ancha yordam talab etiladi.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'maklashish xizmati, kursi-hojatxona ajratilishi uchun so'rov" },
      { id: 'constant-help', score: 2, label: "Doimiy yordam talab etiladi.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'maklashish xizmati, kursi-hojatxona ajratilishi uchun so'rov" },
      { id: 'bed-only', score: 0, label: "Hojat krovatda tuvak yoki taglik yordamida amalga oshiriladi.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'maklashish xizmati, kursi-hojatxona ajratilishi uchun so'rov" },
    ],
  },
  {
    id: 'barthel-transfer',
    scale: 'barthel',
    order: 8,
    title: "O'rindan turish va krovatga o'tish",
    options: [
      { id: 'independent', score: 15, label: "Qiyinchiliksiz mustaqil o'rnidan turadi va krovatdan qo'zg'aladi." },
      { id: 'assistive', score: 12, label: "RTV yordamida o'rnidan turadi va krovatdan qo'zg'aladi." },
      { id: 'supervised', score: 10, label: "Qo'zg'alishda qarab turish yoki ozgina yordam talab etiladi.", suggestedService: 'Moslashtirish xizmati' },
      { id: 'difficult', score: 7, label: "Mustaqil yoki RTV bilan, biroq qiyinchilik bilan qo'zg'aladi.", suggestedService: 'Moslashtirish xizmati' },
      { id: 'partial-help', score: 5, label: "Krovatda o'tirishi mumkin, lekin qo'zg'alishda qisman yordam zarur.", suggestedService: 'Moslashtirish xizmati' },
      { id: 'major-help', score: 3, label: "Qo'zg'alishni doimiy yordam bilan amalga oshiradi.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'mak xizmati" },
      { id: 'supported-only', score: 1, label: "Faqat qo'llab-quvvatlanganda o'tiradi va doimiy yordamda qo'zg'aladi.", suggestedService: "Moslashtirish xizmati, harakatlanishida ko'mak xizmati" },
      { id: 'cannot', score: 0, label: "Hatto yordam bilan ham krovatga o'tirolmaydi va tura olmaydi.", suggestedService: "Harakatlanishida ko'maklashish xizmati" },
    ],
  },
  {
    id: 'barthel-mobility',
    scale: 'barthel',
    order: 9,
    title: 'Harakatlanish',
    options: [
      { id: 'independent', score: 15, label: "O'zgalar yordamisiz 500 metrdan ortiq yuradi, xonada ham mustaqil yuradi." },
      { id: 'assistive', score: 14, label: "RTV bilan 500 metrdan ortiq mustaqil harakatlanadi, xonada mustaqil." },
      { id: 'assistive-slow', score: 11, label: "RTV bilan sekin va qiyinchilik bilan 500 metrdan ortiq yuradi.", suggestedService: 'Ijtimoiy kuzatuv xizmati, tyutorlik xizmati' },
      { id: 'help-500', score: 10, label: "500 metr doirasida o'zga yordami bilan yuradi, xonada mustaqil.", suggestedService: 'Ijtimoiy kuzatuv xizmati, tyutorlik xizmati' },
      { id: '100m', score: 5, label: "100 metrgacha mustaqil yuradi yoki kursi-kolyaskada harakatlanadi.", suggestedService: 'Ijtimoiy kuzatuv, uyni tozalash xizmati' },
      { id: 'assistive-100m', score: 3, label: "RTV bilan 100 metrgacha yuradi, xonada qiyinchilik bilan harakatlanadi.", suggestedService: 'Ijtimoiy kuzatuv, uyni tozalash xizmati' },
      { id: 'help-100m', score: 2, label: "Faqat o'zga yordamida 100 metrgacha yuradi, xonada ham yordam kerak.", suggestedService: 'Ijtimoiy kuzatuv, uyni tozalash xizmati, moslashtirish xizmati' },
      { id: 'cannot', score: 0, label: "50 metrdan ortiq mustaqil harakatlana olmaydi yoki umuman harakatlanish imkoniyati yo'q.", suggestedService: 'Uyni tozalash, doimiy parvarish xizmati' },
    ],
  },
  {
    id: 'barthel-stairs',
    scale: 'barthel',
    order: 10,
    title: "Zinalar bo'ylab yuqoriga ko'tarilish",
    options: [
      { id: 'independent', score: 10, label: 'Zinalardan mustaqil ko‘tarila oladi.' },
      { id: 'assistive', score: 9, label: 'Zinalardan RTV bilan mustaqil ko‘tarila oladi.' },
      { id: 'slow', score: 7, label: 'Mustaqil ko‘tariladi, biroq ko‘p vaqt talab etadi.', suggestedService: 'Moslashtirish xizmati' },
      { id: 'minor-help', score: 5, label: "O'zgalarning ozgina yordami yoki nazorati talab etiladi.", suggestedService: "Moslashtirish xizmati, harakatda ko'maklashish xizmati" },
      { id: 'major-help', score: 2, label: "Faqat o'zgalarning yordami bilan zinadan ko'tariladi.", suggestedService: 'Moslashtirish xizmati, ijtimoiy kuzatuv' },
      { id: 'cannot', score: 0, label: "Hatto o'zga yordami bilan ham zinaga ko'tarila olmaydi.", suggestedService: "Moslashtirish xizmati va ko'mak xizmati" },
    ],
  },
]

export const lawtonAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'lawton-phone',
    scale: 'lawton',
    order: 1,
    title: 'Telefondan foydalanish',
    options: [
      { id: 'independent', score: 3, label: 'Telefondan mustaqil foydalanishi mumkin.' },
      { id: 'special-only', score: 2.5, label: "Faqat maxsus jihozlangan telefondan foydalana oladi." },
      { id: 'minor-help', score: 2, label: "Ozgina yordam bilan yoki faqat tanish raqamlarni terib foydalana oladi.", suggestedService: "Raqamlarni saqlash, qo'llashda ko'mak" },
      { id: 'dialed-for', score: 1.5, label: "Kimdir raqamni terib bersa, telefonda gapirishi mumkin.", suggestedService: "Raqamlarni saqlash, qo'llashda ko'mak" },
      { id: 'cannot', score: 1, label: 'Telefondan foydalana olmaydi.' },
    ],
  },
  {
    id: 'lawton-transport',
    scale: 'lawton',
    order: 2,
    title: "Piyoda borib bo'lmaydigan joygacha harakatlanish",
    options: [
      { id: 'independent', score: 3, label: 'Jamoat transporti yoki taksida mustaqil harakatlanadi, safarni o‘zi rejalashtiradi.' },
      { id: 'explained', score: 2.5, label: "Og'zaki batafsil tushuntirishdan keyin mustaqil harakatlanadi." },
      { id: 'minor-help', score: 2, label: "O'zgalarning ozgina yordami bilan mustaqil harakatlanadi.", suggestedService: 'Ijtimoiy kuzatuv' },
      { id: 'escorted', score: 1.5, label: "Faqat doimiy hamrohlik sharti bilan transportda harakatlanadi.", suggestedService: 'Ijtimoiy kuzatuv' },
      { id: 'cannot', score: 1, label: 'Harakatlana olmaydi.', suggestedService: 'Ijtimoiy kuzatuv, tegishli yordamni jalb qilish' },
    ],
  },
  {
    id: 'lawton-shopping',
    scale: 'lawton',
    order: 3,
    title: "Do'kondan mahsulotlar xarid qilish",
    options: [
      { id: 'independent', score: 3, label: 'Xaridni mustaqil amalga oshiradi.' },
      { id: 'minor-help', score: 2, label: "O'zgalarning ozgina yordami bilan xarid qiladi.", suggestedService: "Xaridlarda ko'mak" },
      { id: 'escorted', score: 1.5, label: "O'zga yordami va hamrohligida xarid qiladi.", suggestedService: "Xaridlarda ko'mak" },
      { id: 'cannot', score: 1, label: 'Xarid qilish imkoniyatiga ega emas.', suggestedService: "Xaridlarda ko'mak" },
    ],
  },
  {
    id: 'lawton-cooking',
    scale: 'lawton',
    order: 4,
    title: 'Ovqat tayyorlash',
    options: [
      { id: 'independent', score: 3, label: 'Mustaqil ravishda ovqat tayyorlay oladi.' },
      { id: 'semi-ready', score: 2.5, label: 'Yarim tayyor mahsulotlardan ovqat tayyorlay oladi.', suggestedService: "Ovqat tayyorlashda ko'mak" },
      { id: 'minor-help', score: 2, label: "Ozgina yordam bilan ovqat tayyorlay oladi.", suggestedService: "Ovqat tayyorlashda ko'mak" },
      { id: 'heat-only', score: 1.5, label: 'Ovqatni faqat isitishi mumkin.', suggestedService: "Ovqat tayyorlashda ko'mak" },
      { id: 'cannot', score: 1, label: "Ovqat tayyorlash imkoniyatiga ega emas.", suggestedService: "Ovqat tayyorlashda ko'mak" },
    ],
  },
  {
    id: 'lawton-household',
    scale: 'lawton',
    order: 5,
    title: "Uy xo'jaligini yuritish",
    options: [
      { id: 'independent', score: 3, label: "Uy xo'jaligini mustaqil yuritadi." },
      { id: 'light-only', score: 2.5, label: "Mehnatni ko'p talab qilmaydigan ishlarni mustaqil bajaradi." },
      { id: 'minor-help', score: 2, label: "Ozgina yordam bilan uy xo'jaligini yuritadi.", suggestedService: "Ko'maklashish xizmati" },
      { id: 'partial', score: 1.5, label: 'Ishlarning bir qismini bajarishda yordam talab etiladi.', suggestedService: 'Uy tozalash, xarid xizmati' },
      { id: 'cannot', score: 1, label: "Uy xo'jaligini yuritish imkoniyatiga ega emas.", suggestedService: 'Uy tozalash, xarid xizmati' },
    ],
  },
  {
    id: 'lawton-leisure',
    scale: 'lawton',
    order: 6,
    title: "Dam olish, shu jumladan qo'lda bajariladigan ishlar",
    options: [
      { id: 'independent', score: 3, label: "Dam olishni va mashg'ulotlarni mustaqil tashkil etadi." },
      { id: 'partial-independent', score: 2.5, label: "Dam olishni tashkil etadi va ayrim qo'l mehnati turlari bilan shug'ullana oladi.", suggestedService: "Nuroniy maskaniga yo'naltirish" },
      { id: 'minor-help', score: 2, label: "Dam olishni tashkil etadi, qo'l mehnatida ozgina yordam bilan qatnashadi.", suggestedService: "Nuroniy maskaniga yo'naltirish" },
      { id: 'cannot', score: 1, label: "Dam olishni tashkil etishi va mustaqil shug'ullanish imkoniyati yo'q.", suggestedService: 'Uyda muloqot xizmati' },
    ],
  },
  {
    id: 'lawton-laundry',
    scale: 'lawton',
    order: 7,
    title: 'Kir yuvish',
    options: [
      { id: 'independent', score: 3, label: 'Mustaqil ravishda kir yuvadi.' },
      { id: 'machine-only', score: 2.5, label: 'Faqat kir yuvish mashinasi yordamida mustaqil yuvadi.' },
      { id: 'minor-help', score: 2, label: "Kirlarni dorga osishda ozgina yordam bilan mustaqil yuvadi." },
      { id: 'major-help', score: 1.5, label: "O'zgalarning katta yordami talab etiladi.", suggestedService: 'Kir yuvish xizmati' },
      { id: 'cannot', score: 1, label: 'Kir yuvish bilan mustaqil shug‘ullana olmaydi.', suggestedService: 'Kir yuvish xizmati' },
    ],
  },
  {
    id: 'lawton-medicine',
    scale: 'lawton',
    order: 8,
    title: 'Dori vositalarini qabul qilish',
    options: [
      { id: 'independent', score: 3, label: "Dori vositalarini mustaqil va to'g'ri qabul qiladi." },
      { id: 'minor-help', score: 2, label: "Kimdir dozani belgilasa va eslatsa, mustaqil qabul qiladi." },
      { id: 'supervised', score: 1.5, label: "Kimdir doimiy nazorat qilib tursa, dori qabul qila oladi.", suggestedService: "Dorilarni qabul qilishni nazorat qilish xizmati" },
      { id: 'cannot', score: 1, label: "Dorilarni mustaqil qabul qilish imkoniyatiga ega emas.", suggestedService: "Dorilarni qabul qilishni nazorat qilish xizmati" },
    ],
  },
  {
    id: 'lawton-finance',
    scale: 'lawton',
    order: 9,
    title: "Shaxsiy mablag'larini tasarruf etish",
    options: [
      { id: 'independent', score: 3, label: "O'z mablag'larini mustaqil tasarruf etadi." },
      { id: 'minor-help', score: 2, label: "Ozgina yordam bilan o'z mablag'larini mustaqil tasarruf etadi.", suggestedService: 'Xarid qilishda ijtimoiy kuzatuv' },
      { id: 'current-only', score: 1.5, label: "Joriy xarajatlarni boshqaradi, ammo oylik budjetni taqsimlay olmaydi.", suggestedService: "Oylik budjetni taqsimlashda ko'maklashish" },
      { id: 'cannot', score: 1, label: "O'z mablag'larini tasarruf etishga qodir emas.", suggestedService: "Moddiy ta'minotini nazorat qilish va qo'llab quvvatlash" },
    ],
  },
]

export const allAssessmentQuestions = [
  ...barthelAssessmentQuestions,
  ...lawtonAssessmentQuestions,
]
