import type { GuideRole, GuideTerm, GuideTopic } from './guides-types'
import { guideDetails } from './guide-details'
import { withGuideSemanticPalette } from './guide-semantics'

const root = '/apps/palliative-care'
const cases = `${root}/cases`
const examples = `${cases}?view=scenarios`

export const guideRoles: GuideRole[] = [
  { id: 'doctor', title: 'Oilaviy shifokor', description: 'Dastlabki ko‘rik, PaPaS natijasi, poliklinika kuzatuvi va xizmatdan keyingi topshirishni yuritadi.' },
  { id: 'referrer', title: 'Yo‘llanma beruvchi muassasa', description: 'Vakolatli muassasa konsiliumi xulosasi, klinik asos, yo‘llanma va ilovalarni rasmiylashtiradi.' },
  { id: 'consilium', title: 'Markaz konsiliumi', description: 'Qabul, yordam shakli, vaqtincha to‘xtatish, rad etish va davom ettirish qarorlarini qabul qiladi.' },
  { id: 'coordinator', title: 'Bosh hamshira / muvofiqlashtiruvchi', description: 'O‘rin, brigada, tashrif vaqti va ochiq xizmat vazifalarini muvofiqlashtiradi.' },
  { id: 'team', title: 'Yordam ko‘rsatuvchi mutaxassis', description: 'Shifokor, hamshira, psixolog va ijtimoiy xodim o‘z xizmatlari hamda natijalarini qayd etadi.' },
  { id: 'equipment', title: 'Jihozlar uchun mas’ul', description: 'Bepul foydalanish shartnomasi, jihoz birligi, berish, qaytarish va texnik holatni yuritadi.' },
  { id: 'manager', title: 'Rahbar / monitoring xodimi', description: 'Yordamning bajarilishi, muddatlar, resurslar va davriy hisobotlarni ko‘rib chiqadi.' },
  { id: 'operator', title: 'Qabul xodimi / operator', description: 'Bola va vakil kartasi, hujjatlar to‘liqligi hamda kelgan murojaatlarni qayd etadi; klinik qarorni almashtirmaydi.' },
]

export const guideTerms: GuideTerm[] = [
  { term: 'Palliativ yordam', description: 'Hayotni cheklovchi og‘ir kasallikda bola va oilaning hayot sifatini yaxshilashga qaratilgan tibbiy, psixologik va ijtimoiy yordam.' },
  { term: 'Bola va oila ishi', description: 'Murojaat, baholar, yo‘llanmalar, qarorlar, xizmatlar va keyingi yordam birlashgan yagona karta.' },
  { term: 'PaPaS', description: 'Qabul oldidan ehtiyojni baholash natijasi. Prototip shifokor bergan ballni, sana va hujjatni qayd etadi; savollar yoki ball formulasini hisoblamaydi.' },
  { term: 'Uyda yordam ehtiyoji bahosi', description: 'Mobil yordam tashriflarini rejalashda ishlatiladigan alohida baho. Ushbu modulda PaPaS bilan bir xil deb olinmaydi.' },
  { term: 'Z51.5', description: 'Yo‘llanma beruvchi vakolatli tibbiyot muassasasi konsiliumi qo‘yadigan XKT-10 kodi. Kodning o‘zi Markaz qabul qarori hisoblanmaydi.' },
  { term: 'Manba konsiliumi', description: 'Yo‘llanma beruvchi tibbiyot muassasasining konsiliumi: tibbiy asos va yordam yo‘nalishini belgilaydi.' },
  { term: 'Markaz konsiliumi', description: 'Palliativ yordam shifokori, psixolog va ijtimoiy xodim ishtirokidagi alohida qabul qarori bosqichi.' },
  { term: 'Xizmat epizodi', description: 'Muayyan qaror asosida boshlangan statsionar yoki mobil yordam davri. Bitta ishda turli davrlardagi epizodlar saqlanishi mumkin.' },
  { term: 'Individual yordam rejasi', description: 'Bola yoki oilaga ko‘rsatiladigan xizmat, mas’ul, muddat va bajarilish natijasi ko‘rsatilgan vazifalar.' },
  { term: 'Vaqtincha to‘xtatish', description: 'Boshqa tibbiy yordam va qayta ko‘rish talab qilingandagi holat. Yakuniy rad etishdan alohida yuritiladi.' },
  { term: 'Topshirish', description: 'Xizmatdan keyingi kuzatuvni qabul qilgan oilaviy shifokor, tashkilot, hujjat va keyingi ko‘rikni ochiq qayd etish.' },
  { term: 'Oilaga keyingi yordam', description: 'Bola vafotidan keyin oilaga uch oygacha davom etishi mumkin bo‘lgan, klinik epizoddan alohida yordam.' },
  { term: 'E-palliative', description: 'Buyruqda elektron yo‘llanma berish uchun tilga olingan tizim. Ushbu frontend prototip unga hujjat yubormaydi va undan ma’lumot olmaydi.' },
  { term: 'Demo ssenariy', description: 'Muayyan jarayonni ko‘rsatadigan sun’iy bola va hujjatlar to‘plami. Ssenariy tavsifi boshlang‘ich vaziyatni, karta holati esa sinovdagi joriy natijani ko‘rsatadi.' },
  { term: 'Qonuniy vakil', description: 'Bola nomidan murojaat qiladigan, aloqasi va qarindoshligi kartada qayd etilgan shaxs. Tizimga ism kiritish vakillik huquqini avtomatik tekshirmaydi; manba hujjat mas’ul xodim tomonidan ko‘riladi.' },
  { term: 'Dastlabki murojaat sanasi', description: 'Bola bo‘yicha poliklinikaga haqiqiy murojaat qilingan kun. Tarixiy hujjatni bugun tizimga kiritish bu sanani bugungi kunga almashtirmaydi.' },
  { term: 'Qoralama yo‘llanma', description: 'Hali Markaz konsiliumiga yuborilmagan yo‘llanma. Qoralamani saqlash, hujjatlarning to‘liqligi va yuborish uch xil tushuncha.' },
  { term: 'Yo‘llanma to‘liqligi', description: 'Talab etilgan maydonlar, manba konsiliumi xulosasi va ilovalar qaydi mavjudligi. To‘liq hujjat qabulning klinik jihatdan tasdiqlanganini anglatmaydi.' },
  { term: 'Individual reja vazifasi', description: 'Nima bajarilishi, bola yoki oilaga tegishliligi, kim bajarishi va muddati ko‘rsatilgan ish. Bajarildi holatiga o‘tkazishda natija alohida yoziladi.' },
  { term: 'Rejalashtirilgan va haqiqiy sana', description: 'Rejalashtirilgan sana kelgusi ishni belgilaydi; haqiqiy sana bajarilgan voqeani qayd etadi. Muddatning kelishi xizmatning bajarilganini bildirmaydi.' },
  { term: 'Masofaviy maslahat', description: 'Uyga borilmasdan ko‘rsatilgan maslahat turi. Mobil yordam jadvalida uyga tashrifdan alohida tanlanadi va hisoblanadi.' },
  { term: 'Tashrif natijasi', description: 'Muayyan tashrifda bajarilgan yordam va kuzatuv qaydi. Uni saqlash individual rejadagi barcha vazifalarni avtomatik bajarmaydi.' },
  { term: 'Inventar birligi', description: 'Inventar raqami bilan ajratilgan aniq jihoz. Jihoz turi bir xil bo‘lsa ham, har bir birlikning holati va foydalanish tarixi alohida saqlanadi.' },
  { term: 'Jihozni biriktirish', description: 'Aniq inventar birligini bola ishi va bepul foydalanish shartnomasi bilan bog‘lash. Xizmat yakunlanishi jihoz jismonan qaytarilganini anglatmaydi.' },
  { term: 'Epikriz va yakun hujjati', description: 'Xizmatning yakuni va tegishli klinik xulosani tasdiqlovchi hujjat. Prototipda uning rekviziti va mazmuni qayd etiladi; rasmiy hujjatning o‘zi avtomatik yaratilmaydi.' },
  { term: 'Takrorsiz bola soni', description: 'Tanlangan mezonga kirgan bolalar ishini bittadan hisoblash. Bitta bolada bir nechta epizod yoki tashrif bo‘lsa ham, bola soni epizodlar soniga tenglashtirilmaydi.' },
  { term: 'Hisobot davri', description: 'Oy, chorak yoki yil bo‘yicha tanlangan vaqt oralig‘i. Har bir ko‘rsatkichning o‘z sana mezoni bor; barcha jadvallarning satr soni bir xil bo‘lishi shart emas.' },
  { term: 'CSV', description: 'Hisobotdagi tanlangan davr qaydlarini jadval dasturida ochishga mo‘ljallangan matn fayli. Bu modulning barcha ma’lumotlarini tiklash uchun zaxira nusxa emas.' },
  { term: 'Markdown va SVG', description: 'Markdown — matn, jadvallar va sxema manbasini saqlaydigan qo‘llanma fayli. SVG — kattalashtirganda sifatini saqlaydigan alohida sxema tasviri.' },
]

const baseGuideTopics: GuideTopic[] = [
  {
    id: 'overview', title: 'Modulning maqsadi va umumiy jarayon', category: 'start',
    summary: 'Bola va oilaga yordamni murojaatdan keyingi kuzatuvgacha bir ish doirasida muvofiqlashtiring.',
    roles: ['doctor', 'referrer', 'consilium', 'coordinator', 'team', 'manager', 'operator'],
    sections: [
      { title: 'Qanday natijaga xizmat qiladi?', paragraphs: ['Maqsad — palliativ yordamga muhtoj bola va uning oilasiga zarur yordamning o‘z vaqtida boshlanishi va uzluksiz davom etishi. Karta orqali bola qaysi bosqichda ekani, keyingi harakat uchun kim mas’ulligi va qanday yordam bajarilgani ko‘rinadi.', 'Bitta ishda murojaat, baholash, manba yo‘llanmasi, Markaz qarori, statsionar yoki mobil yordam, jihoz va keyingi kuzatuv tarixi saqlanadi. Yangi yo‘llanma yoki takroriy epizod oldingi tarixni yo‘qotmasligi kerak.'] },
      { title: 'Qaror va xizmat alohida bosqichlar', paragraphs: ['Poliklinika dastlabki baholaydi; vakolatli muassasa konsiliumi yo‘llanma beradi; Markaz konsiliumi qabul haqida alohida qaror qiladi. Qabul tasdiqlangach mas’ul xodim o‘rin yoki brigadani biriktirib xizmat epizodini boshlaydi.', 'Yordam tugagach oilaviy shifokorga topshirish qayd etiladi. Bola vafotidan keyingi oilaviy yordam klinik epizod yopilishidan alohida yuritiladi.'] },
      { title: 'Buyruq doirasi va hozirgi namuna', paragraphs: ['Nizomda Samarqand, Jizzax, Qashqadaryo va Navoiy hududlari hamda 2027-yil 31-dekabrgacha amal qilish davri ko‘rsatilgan. Mazkur sana faol yordamni o‘z-o‘zidan yopish yoki tarixni o‘chirish uchun asos sifatida talqin qilinmaydi; keyingi tartib vakolatli tomon bilan aniqlashtiriladi.', 'Bu modul frontend prototipidir. Undagi shaxslar va hujjatlar sun’iy, amallar ochiq sahifadagi namuna holatini o‘zgartiradi. Klinik xulosa, rasmiy hujjat yuborish yoki tashqi tizim tasdig‘i avtomatik yaratilmaydi.'] },
    ],
    steps: [
      { title: 'Murojaatni toping yoki oching', actor: 'Operator va oilaviy shifokor', action: 'Bolalar va yo‘llanmalar bo‘limida bola, vakil, dastlabki murojaat sanasi va mas’ul shifokorni qayd eting.', result: 'Bola va oila uchun yagona ish ochiladi.', route: cases },
      { title: 'Baholash va yo‘llanmani tayyorlang', actor: 'Oilaviy shifokor va manba konsiliumi', action: 'Tasdiqlangan baho va tibbiy asosni kiritib, yo‘llanma hamda ilovalar to‘liqligini tekshiring.', result: 'Poliklinika kuzatuvi yoki Markaz konsiliumiga tayyor ish aniqlanadi.', route: cases },
      { title: 'Markaz qarorini qayd eting', actor: 'Markaz konsiliumi', action: 'Mezonlar, xavfsiz yordam, transport va xizmat shaklini ko‘rib, asosli qarorni kiriting.', result: 'Qabul, vaqtincha to‘xtatish yoki rad etish qaydi paydo bo‘ladi.', route: `${root}/consilium` },
      { title: 'Yordamni tashkil eting va bajaring', actor: 'Muvofiqlashtiruvchi va mutaxassislar', action: 'Statsionar o‘rin yoki mobil brigadani belgilang, individual reja va bajarilish natijalarini yuriting.', result: 'Yordamning ijrochisi, muddati va amaldagi natijasi ko‘rinadi.', route: `${root}/inpatient` },
      { title: 'Keyingi mas’ulni belgilang', actor: 'Oilaviy shifokor va Markaz mutaxassisi', action: 'Chiqarish hujjati, topshirish va keyingi kuzatuvni, zarur holatda esa oilaviy yordamni qayd eting.', result: 'Xizmatdan keyingi yordam uzluksiz davom etishi uchun mas’ul saqlanadi.', route: cases },
    ],
    checklist: ['Bola va vakil bir ishda bog‘langan.', 'Joriy bosqich va keyingi mas’ul aniq.', 'Manba va Markaz konsiliumlari farqlangan.', 'Qarordan keyin xizmat alohida boshlangan.', 'Yakun va keyingi kuzatuv yoki oilaviy yordam qayd etilgan.'],
    rules: [
      { tone: 'action', condition: 'Bitta bola takror murojaat qiladi', action: 'Mavjud kartani topib, oldingi baho, yo‘llanma va epizodlar bilan ishlang.', owner: 'Operator', basis: 'Yagona ish va tarixni saqlash — prototip yechimi; 34-band qayta yo‘naltirish jarayoni.' },
      { tone: 'waiting', condition: 'Tibbiy qaror talab qilinadi', action: 'Vakolatli shifokor yoki tegishli konsilium xulosasini qayd eting.', owner: 'Shifokor / konsilium', basis: 'Nizom 18–24-bandlari.' },
      { tone: 'action', condition: 'Xizmat tugaydi', action: 'Keyingi kuzatuv yoki oilaviy yordam mas’ulini alohida belgilang.', owner: 'Markaz va oilaviy shifokor', basis: 'Nizom 33–34-bandlari.' },
    ],
    faq: [
      { question: 'Modulning markaziy obyekti arizami yoki bola kartasimi?', answer: 'Bola va oilaning yagona ishi. Murojaat, yo‘llanma, qaror, xizmat va jihozlar shu ishning bog‘langan qismlaridir.' },
      { question: 'Tasdiqlangan qabul xizmat boshlanganini bildiradimi?', answer: 'Yo‘q. O‘rin yoki brigada va boshlanish sanasi belgilanib, xizmat epizodi alohida ochiladi.' },
      { question: 'Rollar bo‘yicha ko‘rsatmalar real kirish huquqini bildiradimi?', answer: 'Bu qo‘llanmadagi rollar kim nima qilishini tushuntiradi. Prototipda ularni haqiqiy tashkilot vakolati yoki klinik huquq tasdig‘i deb qabul qilmang.' },
    ],
    scenarioCodes: ['INTAKE_NEW', 'CENTRE_CONSILIUM', 'INPATIENT_TEMPORARY', 'MOBILE_TWO_VISITS', 'DISCHARGE_HANDOFF', 'FAMILY_SUPPORT_ACTIVE'],
    sources: [{ label: '316-son buyruq; nizom 17–25-bandlari', page: 4 }, { label: 'Nizom 26–34-bandlari', page: 7 }, { label: 'Prototipdagi amaldagi ekranlar va ish holatlari' }],
    flowchart: `flowchart TD
  A["Bola va vakil murojaati"] --> B["Poliklinika baholashi"]
  B --> C{"Keyingi yo‘nalish"}
  C -->|"Kuzatuv"| D["Poliklinikada yordam"]
  C -->|"Tibbiy asos bor"| E["Manba konsiliumi va yo‘llanma"]
  E --> F["Markaz konsiliumi qarori"]
  F -->|"Qabul tasdiqlansa"| G{"Qabul shakli"}
  G -->|"Statsionar"| H["O‘rin va individual reja"]
  G -->|"Mobil"| I["Brigada va uy tashriflari"]
  H --> J["Yakun va keyingi yordam"]
  I --> J
  class A,B,E,H,I,J guide_action;
  class C,D,F,G guide_waiting;`,
  },
  {
    id: 'intake', title: 'Murojaat, bola kartasi va PaPaS', category: 'start',
    summary: 'Dastlabki murojaat sanasini saqlang, shifokor tasdiqlagan PaPaS natijasini to‘g‘ri qayd eting.',
    roles: ['doctor', 'operator'],
    sections: [
      { title: 'Kartani to‘ldirish', paragraphs: ['Bolaning F.I.Sh., tug‘ilgan sanasi, jinsi, hududi va manzilini; qonuniy vakilning ismi, qarindoshligi va aloqa ma’lumotlarini kiriting. Mas’ul oilaviy shifokor va poliklinikani belgilang. Klinik ma’lumotni vakolatli shifokor xulosasiga tayangan holda qayd eting.', 'Dastlabki poliklinika murojaati oldin bo‘lgan bo‘lsa, aynan o‘sha sanani kiriting. Bugun tizimga kiritish sanasi tarixiy murojaat yoki baholash sanasini almashtirmaydi. Prototipda mavjud shaxs ma’lumotlari avtomatik tekshirilmaydi.'] },
      { title: 'Bahoni qayd etish', paragraphs: ['Poliklinika murojaatdan keyin uch ish kuni ichida tibbiy tekshiruv va PaPaS baholashini o‘tkazadi. Natijani oilaviy shifokor yoki palliativ yordam bo‘yicha o‘qitilgan shifokor beradi. Prototipga ball, sana, baholovchi, metodika va natija hujjati qaydini kiriting.', 'PaPaS 14 yoki undan past bo‘lsa, poliklinikada kuzatuv davom etadi. 15 yoki undan yuqori ball bilan birga 1-ilova bo‘yicha tibbiy ko‘rsatma mavjud bo‘lsa, vakil tanlagan vakolatli muassasaga yo‘naltirish ko‘riladi. Ballning o‘zi Markazga avtomatik qabul qilmaydi.'] },
      { title: 'Prototipdagi muddat va cheklov', paragraphs: ['Uch ish kunlik muddat prototipda dushanba–juma bo‘yicha hisoblanadi; rasmiy bayramlar kalendari ulanmagan. Ekrandagi kechikish ishni ko‘rib chiqish uchun belgi bo‘lib, alohida klinik xulosa hisoblanmaydi.', 'PaPaSning to‘liq savollari va hisoblash formulasi tasdiqlangan manba sifatida kiritilmagan. Ushbu ekran tayyor, tasdiqlangan natijani yozishga mo‘ljallangan.'] },
    ],
    steps: [
      { title: 'Takroriy kartani tekshiring', actor: 'Operator', action: 'Reyestrdan bola ismini va tug‘ilgan sanasini tekshirib, mavjud ish bo‘lsa uni oching.', result: 'Bitta bola uchun keraksiz takror karta yaratilmaydi.', route: cases },
      { title: 'Murojaat ma’lumotlarini kiriting', actor: 'Operator / oilaviy shifokor', action: 'Bola, vakil, haqiqiy dastlabki murojaat sanasi va mas’ullarni to‘ldiring.', result: 'Karta va baholash muddati ko‘rinadi.', route: cases },
      { title: 'PaPaS natijasini qayd eting', actor: 'Baholovchi shifokor', action: 'Baholash turida PaPaSni tanlab, tasdiqlangan ball, sana, metodika va hujjatni kiriting.', result: 'Mustaqil baholash yozuvi tarixga qo‘shiladi.', route: cases },
      { title: 'Keyingi yo‘nalishni belgilang', actor: 'Oilaviy shifokor', action: 'Past ballda kuzatuv vazifasini, asos mavjud bo‘lsa vakil tanlagan muassasaga yo‘naltirishni qayd eting.', result: 'Kuzatuv yoki yo‘llanma tayyorlash bosqichi ochiq bo‘ladi.', route: cases },
    ],
    checklist: ['Bola va vakil ma’lumotlari to‘liq.', 'Dastlabki murojaat sanasi manbaga mos.', 'Baholovchi, metodika va natija hujjati qayd etilgan.', 'PaPaS uy ehtiyoji bahosi bilan aralashtirilmagan.', 'Kuzatuv yoki keyingi yo‘nalish mas’uli aniq.'],
    rules: [
      { tone: 'waiting', condition: 'Murojaat ro‘yxatga olingan', action: 'Uch ish kuni ichidagi tibbiy tekshiruv va baholashni tashkil eting.', owner: 'Poliklinika', basis: 'Nizom 18-bandi; prototip kalendari faqat dushanba–juma.' },
      { tone: 'waiting', condition: 'PaPaS 14 yoki past', action: 'Poliklinika kuzatuvini davom ettiring; ishni yakuniy rad etish deb yopmang.', owner: 'Oilaviy shifokor', basis: 'Nizom 19-bandi.' },
      { tone: 'action', condition: 'PaPaS kamida 15 va tibbiy ko‘rsatma mavjud', action: 'Vakil tanlagan vakolatli muassasaga yo‘naltirishni ko‘rib chiqing.', owner: 'Oilaviy shifokor', basis: 'Nizom 19-bandi va 1-ilova.' },
      { tone: 'waiting', condition: 'Oldingi sanali baholash bugun kiritilmoqda', action: 'Tarixiy murojaat va baholash sanasini saqlang; tizimga kiritish vaqti alohida qoladi.', owner: 'Operator / shifokor', basis: 'Hujjat sanalarini saqlash — prototip yechimi.' },
    ],
    faq: [
      { question: '15 ball bo‘lsa darhol xospisga qabul qilinadimi?', answer: 'Yo‘q. Tibbiy ko‘rsatma, manba konsiliumi, yo‘llanma va Markaz konsiliumining alohida qarori ham kerak.' },
      { question: '14 ball chiqqan ishni qayta ko‘rish mumkinmi?', answer: 'Ha. Kuzatuv davomida shifokor yangi baholashni qayd etishi mumkin; avvalgi natijalar tarixda saqlanadi.' },
      { question: 'Kechagi bahoni bugun kiritish nega rad etilishi mumkin?', answer: 'Avval kartadagi dastlabki murojaat sanasini tekshiring. Baho murojaatdan oldin yoki kelajakda bo‘lmasligi kerak.' },
    ],
    scenarioCodes: ['INTAKE_NEW', 'ASSESSMENT_PENDING', 'PAPAS_OBSERVATION', 'REASSESSMENT_RESUBMISSION', 'PAPER_REFERRAL'],
    sources: [{ label: 'Nizom 17–19-bandlari', page: 4 }, { label: '1-ilova: tibbiy ko‘rsatmalar', page: 10 }, { label: 'Prototipdagi sana va ish kuni hisobi' }],
    flowchart: `flowchart TD
  A["Murojaat va vakil"] --> B["Shifokor ko‘rigi va PaPaS"]
  B --> C{"PaPaS natijasi"}
  C -->|"14 yoki past"| D["Poliklinika kuzatuvi"]
  D -->|"Holat qayta ko‘riladi"| B
  C -->|"15 va yuqori"| E{"Tibbiy ko‘rsatma tasdiqlanganmi?"}
  E -->|"Hali yo‘q"| F["Shifokor ko‘rib chiqadi"]
  E -->|"Ha"| G["Vakil tanlagan muassasaga yo‘nalish"]
  class A,B,G guide_action;
  class C,D,E,F guide_waiting;`,
  },
  {
    id: 'referral', title: 'Yo‘llanma va hujjatlar to‘liqligi', category: 'start',
    summary: 'Manba konsiliumi xulosasi, ilovalar va yozma yo‘llanma sababini bir joyda tekshiring.',
    roles: ['referrer', 'operator', 'doctor'],
    sections: [
      { title: 'Yo‘llanmani kim beradi?', paragraphs: ['Vakil tanlagan vakolatli tibbiyot muassasasi konsiliumi hujjatlarni ko‘radi, asos bo‘lsa Z51.5 tashxisini qo‘yadi, klinik yo‘nalishni belgilaydi va yo‘llanma beradi. Vakolatli muassasalar tarkibi 19-bandda ko‘rsatilgan; oddiy operator kiritgan yozuv klinik vakolatni yaratmaydi.', 'Manba konsiliumi raqami, sanasi, tarkibi va palliativ yordamga muvofiqlik xulosasini yo‘llanmaga bog‘lang. Qaysi yordam shakli so‘ralgani va mobil xizmat uchun zarur jihozlarni qayd eting.'] },
      { title: 'Qaysi ma’lumotlar tekshiriladi?', paragraphs: ['Bola va vakil rekvizitlari, asosiy tashxis, PaPaS natijasi, simptom va ehtiyojlar, yo‘llanma raqami/sanasi, tashkilot, manba konsiliumi va tasdiqlovchi shaxslar to‘liq bo‘lishi kerak. Kasallik tarixidan ko‘chirma hamda varaqlar soni majburiy; tekshiruv va PaPaS natijalari ham ilova qilinadi.', 'Prototipda hujjat nomi yoki raqami qayd etiladi. Bu maydon haqiqiy fayl yuklanganini, imzo tekshirilganini yoki hujjat E-palliative orqali yuborilganini anglatmaydi.'] },
      { title: 'Yozma va qayta yo‘llanma', paragraphs: ['21-band texnik nosozlikda yozma yo‘llanma rasmiylashtirishga yo‘l qo‘yadi. Yozma manbani tanlaganda haqiqiy hujjat raqami/sanasi va texnik nosozlik sababini kiriting. Prototipda integratsiya yo‘qligini o‘z-o‘zidan tibbiyot muassasasidagi nosozlik deb qayd etmang.', 'Hujjatlar yetishmasa qoralamani saqlab, nimani to‘ldirish kerakligini aniqlang. Qayta yo‘llanma mavjud bolaning ishida yuritiladi; oldingi nusxa tarixda qoladi. Bir manba hujjatini boshqa bola ishi sifatida takror kiritmang.'] },
    ],
    steps: [
      { title: 'Bola kartasini oching', actor: 'Operator / yo‘llanma beruvchi xodim', action: 'Bola, vakil, klinik ma’lumot va PaPaS qaydini tekshiring.', result: 'Yo‘llanma qaysi ishga tegishli ekani aniq bo‘ladi.', route: cases },
      { title: 'Manba xulosasini kiriting', actor: 'Yo‘llanma beruvchi muassasa', action: 'Konsilium raqami, sanasi, tarkibi, muvofiqlik xulosasi va Z51.5 kodini qayd eting.', result: 'Yo‘llanmaning klinik asosi saqlanadi.', route: cases },
      { title: 'Ilovalar va tasdiqlarni tekshiring', actor: 'Yo‘llanma beruvchi xodim / operator', action: 'Ko‘chirma, tekshiruv, PaPaS hujjatlari, varaqlar soni va mas’ul shaxslar qaydlarini to‘ldiring.', result: 'Hujjatlar to‘liqligi ko‘rinadi.', route: cases },
      { title: 'Qoralamadan konsiliumga o‘tkazing', actor: 'Qabul xodimi', action: 'Xatolar bo‘lsa to‘ldiring; to‘liq bo‘lgach Markaz konsiliumiga yuborish amalini bajaring.', result: 'Ish Markazning mustaqil qarorini kutadi.', route: `${root}/consilium` },
    ],
    checklist: ['Yo‘llanma raqami, sana va muassasa bor.', 'Manba konsiliumi xulosasi va Z51.5 qayd etilgan.', 'PaPaS kamida 15 va klinik ko‘rsatma tasdig‘i bor.', 'Ko‘chirma, tekshiruv va PaPaS hujjatlari qayd etilgan.', 'Yozma manbada nosozlik sababi bor.', 'Avvalgi karta yoki yo‘llanma takrorlanmagan.'],
    rules: [
      { tone: 'waiting', condition: 'Kasallik tarixidan ko‘chirma yetishmaydi', action: 'Yo‘llanmani to‘liq deb yubormang; hujjatni to‘ldirish uchun qoralamada saqlang.', owner: 'Yo‘llanma beruvchi xodim', basis: 'Nizom 21-bandi; qoralama holati — prototip yechimi.' },
      { tone: 'waiting', condition: 'Manba konsiliumi yoki Z51.5 qaydi yetishmaydi', action: 'Vakolatli muassasa xulosasini aniqlashtiring; tizimda xulosa to‘qimang.', owner: 'Manba konsiliumi', basis: 'Nizom 20–21-bandlari.' },
      { tone: 'waiting', condition: 'Texnik nosozlik sabab yozma yo‘llanma kelgan', action: 'Yozma manba, sana/raqam va nosozlik sababini qayd eting.', owner: 'Operator', basis: 'Nizom 21-bandi.' },
      { tone: 'waiting', condition: 'Yangi yoki tuzatilgan yo‘llanma olingan', action: 'Bolaning mavjud ishida yangi nusxani saqlang, avvalgi hujjat tarixini saqlab qoling.', owner: 'Operator', basis: 'Takror hujjat va tarix nazorati — prototip yechimi.' },
    ],
    faq: [
      { question: 'Qoralamani saqlash qabulga rozilikmi?', answer: 'Yo‘q. Bu kiritilgan ma’lumotni saqlash bosqichi. Markaz konsiliumiga yuborish va qabul qarori alohida amallardir.' },
      { question: 'Tashqi manba identifikatori haqiqiy integratsiyani bildiradimi?', answer: 'Yo‘q. Prototipda bu hujjatning manba qaydi xolos; tashqi tizim bilan avtomatik almashinuv bajarilmaydi.' },
      { question: 'Yo‘llanma to‘liq bo‘lmasa klinik rad etish kiritsam bo‘ladimi?', answer: 'Hujjat kamchiligini tuzatish va klinik rad etish turli masalalar. Avval yetishmagan hujjatni aniqlashtiring; klinik qarorni vakolatli konsilium beradi.' },
    ],
    scenarioCodes: ['REFERRAL_INCOMPLETE', 'CENTRE_CONSILIUM', 'PAPER_REFERRAL', 'REASSESSMENT_RESUBMISSION'],
    sources: [{ label: 'Nizom 19–21-bandlari', page: 5 }, { label: '2-ilova: yo‘llanma shakli', page: 12 }, { label: 'Prototipdagi qoralama va takror hujjat nazorati' }],
    flowchart: `flowchart TD
  A["Manba konsiliumi xulosasi"] --> B["Yo‘llanma ma’lumotlarini kiritish"]
  B --> C{"Manba turi"}
  C -->|"Yozma"| D["Nosozlik sababi va hujjat sanasi"]
  C -->|"Boshqa manba qaydi"| E["Ilovalar va tasdiqlar"]
  D --> E
  E --> F{"Hujjatlar to‘liqmi?"}
  F -->|"Yo‘q"| G["Qoralamani to‘ldirish"]
  G --> E
  F -->|"Ha"| H["Markaz konsiliumiga yuborish"]
  class A,B,D,E,H guide_action;
  class C,F,G guide_waiting;`,
  },
  {
    id: 'consilium', title: 'Markaz konsiliumi qarori', category: 'start',
    summary: 'Qabul, vaqtincha to‘xtatish va rad etishni asoslari bilan farqlang.',
    roles: ['consilium', 'operator', 'coordinator'],
    sections: [
      { title: 'Mustaqil qaror bosqichi', paragraphs: ['Markaz konsiliumi palliativ yordam shifokori, psixolog va ijtimoiy xodimdan tashkil topadi. U manba konsiliumi hujjatlarini ko‘rib chiqadi, ammo manba xulosasi Markazning qabul qarorini almashtirmaydi.', 'Qarorda raqam, sana, tarkib, asos, xizmat shakli, xavfsiz yordam va transport imkoniyati qayd etiladi. Mobil yo‘nalishda vakil yoki boshqa yaqin qarindosh roziligi ham aniq qayd etiladi.'] },
      { title: 'Qaysi natijani tanlash kerak?', paragraphs: ['Qabul mezonlari bajarilganda konsilium qabul va yordam shaklini belgilaydi. Yangi qabulda 18 yoshga to‘lganlik yoki tegishli mezonlar bajarilmaganligi bo‘yicha asosli rad etish alohida qaror sifatida saqlanadi.', '24-band bo‘yicha boshqa tibbiy yordam zarur bo‘lsa, vaqtincha to‘xtatish natijasini, tegishli muassasaga yo‘nalishni va qayta ko‘rish sanasini kiriting. Bu holat yakuniy rad etish emas.'] },
      { title: 'Noaniq klinik shartni avtomatlashtirmang', paragraphs: ['24-bandning «a» kichik bandi ifodasida matniy nomuvofiqlik bor. Mazkur kichik banddan mustaqil avtomatik qabul yoki rad etish mezoni chiqarilmagan. Vakolatli klinik va uslubiy mas’ul ko‘rib chiqishi hamda xulosasini hujjatlashtirishi kerak.', 'O‘rin yo‘qligi o‘z-o‘zidan klinik rad etish emas. Tegishli mezonlar va rozilik mavjud bo‘lsa, mobil yordam yo‘nalishini konsilium ko‘rib chiqishi mumkin; prototip bolani o‘zi mobil xizmatga o‘tkazmaydi.'] },
    ],
    steps: [
      { title: 'Konsiliumga kelgan ishni oching', actor: 'Markaz konsiliumi', action: 'Yo‘llanma va manba konsiliumi xulosasini, PaPaS va ilovalarni ko‘rib chiqing.', result: 'Qaror uchun manba hujjatlar ochiq bo‘ladi.', route: `${root}/consilium` },
      { title: 'Qabul shartlarini tekshiring', actor: 'Markaz konsiliumi', action: 'Tashxis/yo‘llanma, ball, yosh, xavfsiz yordam va transport imkoniyatini ko‘rib chiqing.', result: 'Inson bergan klinik va tashkiliy baho qarorga asos bo‘ladi.', route: `${root}/consilium` },
      { title: 'Natija va asosni kiriting', actor: 'Markaz konsiliumi', action: 'Qabul, vaqtincha to‘xtatish yoki rad etishni tanlang; raqam, sana, tarkib va sababni yozing. Tanlovga mos Qabulni tasdiqlash, Vaqtincha to‘xtatishni qayd etish yoki Rad etishni qayd etish tugmasini bosing.', result: 'Qaror tarixda alohida yozuv sifatida saqlanadi.', route: `${root}/consilium` },
      { title: 'Keyingi harakatni belgilang', actor: 'Konsilium va muvofiqlashtiruvchi', action: 'Qabulda xizmat shaklini; vaqtincha to‘xtatishda muassasa va qayta ko‘rishni; rad etishda keyingi yo‘nalish haqidagi qaydni aniqlang.', result: 'Bola va vakilning keyingi qadami aniq bo‘ladi.', route: cases },
    ],
    checklist: ['Manba va Markaz xulosalari ajratilgan.', 'Qaror sanasidagi yosh tekshirilgan.', 'Qaror tarkibi, raqami va sababi bor.', 'Mobil shaklda rozilik bergan shaxs qayd etilgan.', 'Vaqtincha to‘xtatishda yo‘nalish va qayta ko‘rish sanasi bor.', '24(a) bo‘yicha taxminiy avtomatik xulosa chiqarilmagan.'],
    rules: [
      { tone: 'success', condition: 'Qabul mezonlari bajarilgan', action: 'Konsiliumning qabul qarori va yordam shaklini qayd eting.', owner: 'Markaz konsiliumi', basis: 'Nizom 22–23-bandlari.' },
      { tone: 'rejected', condition: 'Yangi qabul sanasida 18 yoshga to‘lgan', action: 'Yangi qabulni statsionardagi davom ettirish istisnosi bilan aralashtirmang; asosli qarorni kiriting.', owner: 'Markaz konsiliumi', basis: 'Nizom 23 va 39-bandlari.' },
      { tone: 'waiting', condition: 'Boshqa tibbiy yordam va qayta ko‘rish zarur', action: 'Vaqtincha to‘xtatish, tashqi muassasa va qayta ko‘rish qaydini kiriting.', owner: 'Markaz konsiliumi', basis: 'Nizom 24-bandi; qayta ko‘rish sanasi — prototip nazorat maydoni.' },
      { tone: 'waiting', condition: '24(a) talqini aniq emas', action: 'Vakolatli klinik/uslubiy ko‘rib chiqishga chiqaring; avtomatik tasniflamang.', owner: 'Vakolatli klinik va uslubiy mas’ul', basis: 'Manbadagi matniy nomuvofiqlik; aniqlashtiriladigan masala.' },
      { tone: 'waiting', condition: 'O‘rin yo‘q, mobil yo‘nalish ko‘rilmoqda', action: 'Mezonlar va vakil/yaqin qarindosh roziligi asosida alohida qaror kiriting.', owner: 'Markaz konsiliumi', basis: 'Nizom 23-bandi.' },
    ],
    faq: [
      { question: 'Vaqtincha to‘xtatilgan ish yana ko‘riladimi?', answer: 'Ha. Tegishli holat bartaraf etilgach Markaz konsiliumi qayta ko‘radi. Oldingi qaror tarixda saqlanadi.' },
      { question: 'O‘rin band bo‘lsa rad etish tanlanadimi?', answer: 'O‘rin bandligi alohida tashkiliy masala. Tegishli mezonlar va rozilik bo‘lsa mobil yo‘nalishni konsilium ko‘rib chiqadi; tizim avtomatik qaror bermaydi.' },
      { question: 'Qarorni saqlash qanday yordamni boshlaydi?', answer: 'Hech bir xizmat avtomatik boshlanmaydi. Tasdiqlangan qaror asosida statsionar yoki mobil epizod alohida ochiladi.' },
    ],
    scenarioCodes: ['CENTRE_CONSILIUM', 'TEMPORARY_PAUSE', 'REJECTED_NEW_ADULT', 'APPROVED_WAITING_BED', 'APPROVED_MOBILE_ASSESSMENT', 'REASSESSMENT_RESUBMISSION'],
    sources: [{ label: 'Nizom 22–24-bandlari', page: 5 }, { label: '24(a) matniy nomuvofiqligi', page: 6 }, { label: 'Nizom 39-bandi', page: 9 }],
    flowchart: `flowchart TD
  A["To‘liq yo‘llanma"] --> B["Markaz konsiliumi ko‘rigi"]
  B --> C{"Konsilium xulosasi"}
  C -->|"Qabul mezonlari bor"| D["Qabul va xizmat shakli"]
  C -->|"Boshqa yordam zarur"| E["Vaqtincha to‘xtatish"]
  C -->|"Qabulga asos yo‘q"| F["Asosli rad etish"]
  E --> G["Muassasaga yo‘nalish va qayta ko‘rish"]
  G -->|"Holat qayta ko‘riladi"| B
  D --> H["O‘rin yoki brigadani biriktirish"]
  class A,H guide_action;
  class D guide_success;
  class F guide_rejected;
  class B,C,E,G guide_waiting;`,
  },
  {
    id: 'inpatient', title: 'Statsionar: o‘rin, muddat va chiqarish', category: 'care',
    summary: 'Qabuldan chiqarishgacha o‘rin bandligini, individual yordamni va konsilium belgilagan muddatni yuriting.',
    roles: ['consilium', 'coordinator', 'team', 'operator'],
    sections: [
      { title: 'Xizmatni boshlash', paragraphs: ['Statsionar epizod uchun Markazning shu xizmat shakliga qabul qarori bo‘lishi kerak. Boshlanish sanasi, foydalanishga tayyor bo‘sh o‘rin, qaror raqami/asosi va hamroh qaydini kiriting. Bitta o‘rin bir paytda ikki bolaga ajratilmaydi.', 'Bola kartasida parvarish, psixologik, ijtimoiy va oilaviy vazifalarni belgilang. O‘rin ajratilishi individual reja va ko‘rsatilgan xizmat natijalarining o‘rnini bosmaydi.'] },
      { title: '14/28 kunni qanday tushunish kerak?', paragraphs: ['25-band vaqtinchalik joylashtirishni bir kalendar yilida 14 kungacha, konsilium qarori bilan umumiy qolishni 28 kungacha uzaytirishni nazarda tutadi. Oldingi yotishlar hisobga olinadi; yangi epizod ochish orqali hisobni chetlab o‘tish mumkin emas.', 'Kunlarni sanash, yil almashishi va 28 kunning aynan qaysi davrga tatbiqi aniqlashtirilishi kerak. Prototip kirish/chiqish kunini qo‘shadi va 14/28 kunni kalendar yilidagi jami vaqtinchalik yotishga qo‘llaydi. Bu tasdiqlangan yakuniy uslubiy tartib deb ko‘rsatilmaydi.'] },
      { title: 'Muddatsiz va yosh bo‘yicha davom ettirish', paragraphs: ['Hayotining oxirgi olti oyini yashashi kutilayotgan holatda muddatsiz qabul vakolatli klinik xulosa va konsilium qarori bilan rasmiylashtiriladi. Prototip bunday epizodga olti oylik avtomatik chiqarish sanasini qo‘ymaydi.', 'Statsionarda yordam olayotgan bola 18 yoshga to‘lsa, konsilium belgilagan muddatgacha, eng ko‘pi bilan 21 yoshgacha davom ettirish alohida qayd etiladi. Bu 18 yoshdan keyin yangi qabul ochish huquqi emas.'] },
    ],
    steps: [
      { title: 'Tasdiqlangan ishni tanlang', actor: 'Qabul xodimi / muvofiqlashtiruvchi', action: 'Statsionar bo‘limida qabul qarori bor bolani toping va uning kartasini tekshiring.', result: 'To‘g‘ri qaror asosida joylashtirish boshlanadi.', route: `${root}/inpatient` },
      { title: 'O‘rin va davrni belgilang', actor: 'Muvofiqlashtiruvchi', action: 'Bo‘sh o‘rin, boshlanish sanasi, vaqtinchalik yoki muddatsiz qabul turi hamda qaror asosini kiriting.', result: 'Faol statsionar epizod va o‘rin bandligi paydo bo‘ladi.', route: `${root}/inpatient` },
      { title: 'Yordam rejasini yuriting', actor: 'Statsionar mutaxassislari', action: 'Bola kartasida vazifalar, ijrochilar, muddatlar va natijalarni qayd eting.', result: 'Amalda ko‘rsatilgan parvarish va yordam ko‘rinadi.', route: cases },
      { title: 'Zarur bo‘lsa muddatni uzaytiring', actor: 'Markaz konsiliumi', action: 'Alohida qaror raqami, sana, sabab va yangi yakunni kiriting; 18 yoshdan keyingi davom ettirishni alohida tasdiqlang.', result: 'Uzaytirish tarix va chegara bilan saqlanadi.', route: `${root}/inpatient` },
      { title: 'Yakun va topshirishni qayd eting', actor: 'Shifokor va qabul xodimi', action: 'Haqiqiy yakun sanasi, sabab, xulosa va epikrizni qayd etib, bola kartasida keyingi mas’ulni belgilang.', result: 'O‘rin bo‘shaydi; kuzatuv yoki oilaviy yordam jarayoni ochiladi.', route: `${root}/inpatient` },
    ],
    checklist: ['Markazning statsionar qarori bor.', 'O‘rin bo‘sh va foydalanishga tayyor.', 'Yil ichidagi oldingi yotishlar hisobga olingan.', 'Uzaytirish yoki muddatsiz qabulga inson qarori bor.', '18 yoshdan keyingi davom ettirish yangi qabuldan ajratilgan.', 'Chiqarish hujjati va keyingi mas’ul qayd etilgan.'],
    rules: [
      { tone: 'waiting', condition: 'Vaqtinchalik qabul boshlanmoqda', action: '14 kunlik boshlang‘ich hisob va oldingi yotishlarni tekshiring.', owner: 'Muvofiqlashtiruvchi / konsilium', basis: 'Nizom 25-bandi; kunlar talqini prototipda alohida izohlangan.' },
      { tone: 'waiting', condition: 'Qolish muddati uzaytiriladi', action: 'Konsilium qarorini yozing; 28 kunlik chegarani hisobga oling.', owner: 'Markaz konsiliumi', basis: 'Nizom 25-bandi.' },
      { tone: 'action', condition: 'Muddatsiz qabul uchun klinik xulosa bor', action: 'Muddatsiz turni asos bilan qayd eting; avtomatik olti oylik yakun qo‘ymang.', owner: 'Markaz konsiliumi', basis: 'Nizom 25-bandi.' },
      { tone: 'waiting', condition: 'Statsionarda 18 yoshga to‘lgan', action: 'Davom ettirish muddatini alohida qaror bilan qayd eting; 21 yosh chegarasini tekshiring.', owner: 'Markaz konsiliumi', basis: 'Nizom 23 va 39-bandlari.' },
    ],
    faq: [
      { question: '14 kun o‘tgach tizim bolani avtomatik chiqaradimi?', answer: 'Yo‘q. Haqiqiy chiqarish shifokor hujjati bilan qayd etiladi. Muddat masalasini konsilium ko‘radi; prototip yangi yoki uzaytirilayotgan muddatning chegarasini tekshiradi.' },
      { question: 'Muddatsiz qabulda chiqarish sanasi nega yo‘q?', answer: 'Bu hujjatlashtirilgan alohida qabul turi. Buyruqdagi kutilayotgan olti oylik davr avtomatik chiqarish muddati qilib olinmaydi.' },
      { question: '18 yoshli yangi shaxsga davom ettirishni belgilash mumkinmi?', answer: 'Yo‘q. Davom ettirish istisnosi 18 yoshga to‘lmasdan boshlangan statsionar yordamga tegishli.' },
    ],
    scenarioCodes: ['APPROVED_WAITING_BED', 'INPATIENT_TEMPORARY', 'INPATIENT_EXTENDED', 'INPATIENT_TERMINAL', 'INPATIENT_ADULT_CONTINUATION', 'DISCHARGE_HANDOFF', 'TRANSFER_HANDOFF'],
    sources: [{ label: 'Nizom 23 va 25-bandlari', page: 6 }, { label: 'Nizom 34-bandi', page: 8 }, { label: 'Nizom 39–40-bandlari', page: 9 }, { label: '14/28 kunni hisoblash — ochiq uslubiy masala va prototip talqini' }],
    flowchart: `flowchart TD
  A["Statsionar qabul qarori"] --> B["Bo‘sh o‘rin va boshlanish"]
  B --> C{"Qabul turi"}
  C -->|"Vaqtinchalik"| D["14 kun va oldingi davrlar hisobi"]
  C -->|"Klinik asosli muddatsiz"| E["Avtomatik yakun sanasisiz yordam"]
  D --> F{"Uzaytirish zarurmi?"}
  F -->|"Ha"| G["Konsilium qarori va 28 kun nazorati"]
  F -->|"Yo‘q"| H["Haqiqiy chiqarish va hujjat"]
  G --> H
  E -->|"Klinik yakun qayd etiladi"| H
  H --> I["Keyingi kuzatuv yoki oilaga yordam"]
  class B,E,H,I guide_action;
  class A guide_success;
  class C,D,F,G guide_waiting;`,
  },
  {
    id: 'mobile', title: 'Mobil yordam va tashriflar', category: 'care',
    summary: 'Uy bahosi, rozilik, brigada, tashrif va natijani alohida qayd eting.',
    roles: ['consilium', 'coordinator', 'team'],
    sections: [
      { title: 'Mobil yordamga tayyorgarlik', paragraphs: ['Mobil brigada tarkibiga palliativ yordam shifokori, psixolog, ijtimoiy xodim va hamshira kiradi. Xizmat uyga tashrif va masofaviy maslahat orqali tashkil etiladi. Qabul qarori va vakil yoki boshqa yaqin qarindosh roziligi qayd etilgan bo‘lishi kerak.', 'Prototipda mobil epizodni boshlashdan oldin alohida uy ehtiyoji bahosi va tashrif rejasi bo‘lishi talab etiladi. Qabuldagi PaPaS natijasini uy bahosi o‘rniga ko‘chirmang.'] },
      { title: 'Haftalik tashriflar', paragraphs: ['Uy bahosi 15–20 bo‘lsa haftasiga bir, 21–24 bo‘lsa ikki, 25 va undan yuqori bo‘lsa uch uy tashrifi ko‘zda tutilgan. Konsilium sog‘liq holatiga qarab sonni o‘zgartirishi mumkin; o‘zgartirilgan son bilan birga qaror va sababni yozing.', 'Bahodan chiqqan son reja tavsiyasidir: u taqvimdagi tashriflarni avtomatik yaratmaydi. Muvofiqlashtiruvchi brigada, sana, vaqt, davomiylik va maqsadni alohida belgilaydi. Bitta brigada yoki bola uchun ustma-ust vaqt tanlanmaydi.'] },
      { title: 'Tashrifni bajarish va GPS', paragraphs: ['Rejalashtirilgan tashrifni vaqti kelganda boshlang, amalda bajarilgach natijasini yozib yakunlang. Masofaviy maslahatni o‘z turi bilan belgilang; u o‘z-o‘zidan uyga tashrif o‘rnini bosmaydi.', '32-band bosh hamshiraning GPS orqali muvofiqlashtirishini nazarda tutadi. Hozirgi prototipda GPS ulanmagan va real joylashuv ko‘rsatilmaydi. GPS yo‘qligidan xizmat bajarilmagan degan klinik yoki operatsion xulosa chiqarmang; natija qaydini tekshiring.'] },
    ],
    steps: [
      { title: 'Qaror va rozilikni tekshiring', actor: 'Muvofiqlashtiruvchi', action: 'Markaz qarorida mobil shakl va rozilik bergan shaxsni tekshiring.', result: 'Mobil yordamga asos mavjud bo‘ladi.', route: `${root}/mobile` },
      { title: 'Uy bahosini kiriting', actor: 'Baholovchi mutaxassis / konsilium', action: 'Uy ehtiyoji balli, sana, metodika va hujjatni qayd eting; son o‘zgarsa konsilium sababini yozing.', result: 'Haftalik uy tashriflari tavsiyasi va kelishilgan son ko‘rinadi.', route: `${root}/mobile` },
      { title: 'Epizod va brigadani belgilang', actor: 'Muvofiqlashtiruvchi', action: 'Boshlanish sanasi va brigadani tanlab, qaror asosida xizmatni boshlang.', result: 'Faol mobil yordam epizodi ochiladi.', route: `${root}/mobile` },
      { title: 'Tashriflarni rejalashtiring', actor: 'Bosh hamshira / muvofiqlashtiruvchi', action: 'Uy tashrifi yoki maslahat turini, brigada, vaqt, davomiylik va maqsadni kiriting.', result: 'Brigada va bolaning taqvimi kelishiladi.', route: `${root}/mobile` },
      { title: 'Amaldagi natijani yozing', actor: 'Mobil brigada', action: 'Tashrifni boshlang, xizmat bajarilgach natija va keyingi ehtiyojlarni qayd eting.', result: 'Rejalashtirilgan va bajarilgan xizmat ajratiladi.', route: `${root}/mobile` },
    ],
    checklist: ['Mobil qabul va rozilik qaydi bor.', 'Uy bahosi PaPaSdan alohida.', 'Haftalik son yoki konsilium o‘zgartirishi ko‘rinadi.', 'Brigada va vaqt boshqa tashrif bilan to‘qnashmaydi.', 'Uy tashrifi va maslahat turi to‘g‘ri.', 'Yakunlangan xizmatda natija yozilgan.'],
    rules: [
      { tone: 'action', condition: 'Uy bahosi 15–20 / 21–24 / 25 va yuqori', action: 'Mos ravishda haftasiga 1 / 2 / 3 uy tashrifini rejalashtiring.', owner: 'Brigada va muvofiqlashtiruvchi', basis: 'Nizom 30–31-bandlari.' },
      { tone: 'waiting', condition: 'Tavsiya qilingan son o‘zgartiriladi', action: 'Konsilium belgilagan son, qaror va sababni kiriting.', owner: 'Markaz konsiliumi', basis: 'Nizom 31-bandi.' },
      { tone: 'success', condition: 'Telefon yoki masofaviy maslahat bajarilgan', action: 'Uni maslahat sifatida qayd eting; uy tashrifiga avtomatik tenglashtirmang.', owner: 'Mobil brigada', basis: 'Nizom 28–31-bandlaridagi xizmat shakllari; hisobni ajratish — prototip yechimi.' },
      { tone: 'waiting', condition: 'Brigada yoki bolaning shu vaqtda boshqa tashrifi bor', action: 'Boshqa vaqt yoki tegishli brigadani tanlang.', owner: 'Muvofiqlashtiruvchi', basis: 'Bir vaqtning o‘zida resurs bandligini nazorat qilish — prototip yechimi.' },
    ],
    faq: [
      { question: 'Uy bahosini kiritish uchta tashrifni avtomatik yaratadimi?', answer: 'Yo‘q. Baho haftalik sonni taklif qiladi; haqiqiy sana, brigada va vaqtni alohida belgilaysiz.' },
      { question: 'PaPaS 23 bo‘lsa uy bahosi ham 23 bo‘ladimi?', answer: 'Bunday tenglik tasdiqlanmagan. Har bir bahoning turi, natijasi, metodikasi va hujjati alohida qayd etiladi.' },
      { question: 'Tashrif tugadi, lekin GPS ko‘rinmayapti. Nima qilish kerak?', answer: 'Prototipda GPS ulanmagan. Amaldagi xizmat natijasini qayd eting; ushbu ekrandagi aloqa holatini real GPS dalili deb qabul qilmang.' },
    ],
    scenarioCodes: ['APPROVED_MOBILE_ASSESSMENT', 'MOBILE_ONE_VISIT', 'MOBILE_TWO_VISITS', 'MOBILE_THREE_VISITS', 'REASSESSMENT_RESUBMISSION'],
    sources: [{ label: 'Nizom 23-bandi: mobil yo‘nalish va rozilik', page: 6 }, { label: 'Nizom 26–31-bandlari', page: 7 }, { label: 'Nizom 32-bandi: GPS muvofiqlashtirish', page: 8 }],
    flowchart: `flowchart TD
  A["Mobil qaror va rozilik"] --> B["Uy ehtiyojini alohida baholash"]
  B --> C{"Uy bahosi"}
  C -->|"15–20"| D["Haftasiga 1 tashrif"]
  C -->|"21–24"| E["Haftasiga 2 tashrif"]
  C -->|"25 va yuqori"| F["Haftasiga 3 tashrif"]
  D --> G["Konsilium o‘zgartirsa asosni yozish"]
  E --> G
  F --> G
  G --> H["Brigada va vaqtni rejalash"]
  H --> I["Tashrifni boshlash va natijani qayd etish"]
  class B,D,E,F,H,I guide_action;
  class A guide_success;
  class C,G guide_waiting;`,
  },
  {
    id: 'care-plan', title: 'Individual reja, xizmat va aloqa qaydlari', category: 'care',
    summary: 'Har bir vazifaga maqsad, ijrochi, muddat va amaldagi natijani bog‘lang.',
    roles: ['team', 'doctor', 'coordinator', 'manager'],
    sections: [
      { title: 'Reja kim uchun tuziladi?', paragraphs: ['Bola va oila ehtiyojlari birgalikda ko‘riladi. Rejada tibbiy, hamshiralik, psixologik, ijtimoiy yoki oilaviy xizmatni, vazifa bola yoki oilaga tegishliligini, mas’ul va muddatni belgilang. Vazifa nomi qanday yordam bajarilishi kerakligini tushunarli aytsin.', 'Parvarish bo‘yicha maslahat, oilani o‘qitish, ijtimoiy va psixologik yordam kabi ishlarni alohida yuritishingiz mumkin. Dori yoki davolash tayinlovini qo‘llanma yoki prototip ishlab chiqmaydi; klinik ko‘rsatma vakolatli tibbiyot xodimida qoladi.'] },
      { title: 'Bajarilish va aloqa', paragraphs: ['Vazifa bajarilgach natijasini yozib yakunlang. Rejaga qo‘shilgan, muddati kelgan yoki tashrif bilan bog‘langan vazifa o‘z-o‘zidan bajarilgan hisoblanmaydi. Qaydni yozishda ko‘rsatilgan yordam va kelishilgan keyingi qadamni ajrating.', 'Qo‘ng‘iroq, masofaviy maslahat, izoh yoki shikoyatni bola ishiga bog‘lab, muallif va mazmunini kiriting. Shikoyatga javob muddati ushbu buyruqdan taxmin qilinmaydi; amaldagi murojaatlar tartibiga rioya qilinadi.'] },
      { title: 'Rejadan tashqaridagi rasmiy hisoblar', paragraphs: ['11–14-bandlardagi dori ta’minoti, retseptlar, maxsus hisob jurnallari va klinik protokollar alohida rasmiy tartiblarni talab qiladi. Oddiy xizmat natijasi ushbu jurnallar o‘rnini bosmaydi. Tunu-kun ishonch telefoni, navbatchilik va telefoniya ham ushbu aloqa qaydi bilan avtomatik tashkil etilmaydi.', 'Xodimlarni o‘qitish va qo‘llab-quvvatlash, ruxsat etilgan hamkor xizmatlari, xona xavfsizligi va sanitariya, ovqatlanish hamda moliyalashtirish bo‘yicha vazifalar o‘z tashkiliy tartibida bajariladi. Prototipdagi vazifalar ro‘yxatini shu hisoblarning rasmiy jurnali deb ishlatmang.'] },
    ],
    steps: [
      { title: 'Ehtiyojni aniqlang', actor: 'Mutaxassis va oila', action: 'Baholash va suhbatdan kelib chiqib, bola yoki oilaga kerakli yordamni belgilang.', result: 'Rejaga kiritiladigan aniq xizmat tanlanadi.', route: cases },
      { title: 'Vazifani kiriting', actor: 'Mas’ul mutaxassis', action: 'Karta ichida vazifa nomi, xizmat turi, bola/oila yo‘nalishi, ijrochi va muddatni yozing.', result: 'Kuzatiladigan individual reja vazifasi ochiladi.', route: cases },
      { title: 'Yordamni tashkil eting', actor: 'Muvofiqlashtiruvchi / mutaxassis', action: 'Kerakli uchrashuv yoki tashrifni kelishing; aloqa va shikoyat qaydlarini tegishli ishga bog‘lang.', result: 'Oila bilan kelishilgan bajarish tartibi saqlanadi.', route: `${root}/mobile` },
      { title: 'Natijani yakunlang', actor: 'Ijrochi mutaxassis', action: 'Vazifa amalda bajarilgach natijasini yozib yakunlang, zarur keyingi vazifani alohida oching.', result: 'Reja va bajarilgan xizmat o‘rtasidagi farq ko‘rinadi.', route: cases },
    ],
    checklist: ['Vazifa bola yoki oilaga to‘g‘ri yo‘naltirilgan.', 'Mas’ul va muddat belgilangan.', 'Yakunlashda mazmunli xizmat natijasi bor.', 'Tashrif natijasi va reja bajarilishi alohida tekshirilgan.', 'Aloqa yoki shikoyat muallifi qayd etilgan.', 'Rasmiy tibbiy hisoblar oddiy izoh bilan almashtirilmagan.'],
    rules: [
      { tone: 'action', condition: 'Individual yordam ehtiyoji aniqlandi', action: 'Xizmat, mas’ul va muddat bilan reja vazifasini yarating.', owner: 'Tegishli mutaxassis', basis: 'Nizom 8–9 va 29-bandlari; vazifa maydonlari — prototip yechimi.' },
      { tone: 'success', condition: 'Vazifa amalda bajarildi', action: 'Natijani yozib yakunlang; faqat muddat kelganiga qarab bajarilgan demang.', owner: 'Ijrochi', basis: 'Ko‘rsatilgan xizmatni ajratib hisoblash — prototip yechimi.' },
      { tone: 'action', condition: 'Shikoyat yoki ishonch telefoni murojaati bor', action: 'Mazmun, muallif va keyingi mas’ulni qayd eting; amaldagi tashkiliy tartibni qo‘llang.', owner: 'Navbatchi / mas’ul xodim', basis: 'Nizom 9 va 44–45-bandlari.' },
      { tone: 'action', condition: 'Dori, retsept yoki maxsus klinik hisob talab qilinadi', action: 'Tegishli rasmiy jurnal va klinik hujjat tartibini bajaring.', owner: 'Vakolatli tibbiyot va hisob xodimi', basis: 'Nizom 11–14-bandlari.' },
    ],
    faq: [
      { question: 'Tashrif yakunlansa vazifa ham avtomatik bajariladimi?', answer: 'Yo‘q. Tashrif natijasi va individual reja vazifasi alohida yozuvlardir. Vazifani amaldagi bajarilishiga qarab natija bilan yakunlaysiz.' },
      { question: 'Oila uchun vazifani bola kartasiga yozish to‘g‘rimi?', answer: 'Ha. Yagona ish bola va oilani qamrab oladi. Vazifaning yo‘nalishini Oila deb tanlang.' },
      { question: 'Bekor qilingan vazifa bajarilgan xizmatga qo‘shiladimi?', answer: 'Yo‘q. Oilaviy yordam yakunlanganda ochiq vazifa bekor qilinsa, uning sababi saqlanadi va u bajarilgan deb belgilanmaydi.' },
    ],
    scenarioCodes: ['INPATIENT_TEMPORARY', 'INPATIENT_ADULT_CONTINUATION', 'MOBILE_ONE_VISIT', 'REASSESSMENT_RESUBMISSION', 'FAMILY_SUPPORT_CLOSED'],
    sources: [{ label: 'Nizom 8–16-bandlari', page: 3 }, { label: 'Nizom 29-bandi', page: 7 }, { label: 'Nizom 35–38-bandlari', page: 8 }, { label: 'Nizom 44–45-bandlari', page: 9 }, { label: 'Prototipdagi vazifa, natija va aloqa qaydlari' }],
    flowchart: `flowchart TD
  A["Bola va oila ehtiyoji"] --> B["Xizmat, mas’ul va muddat"]
  B --> C["Yordamni kelishish va bajarish"]
  C --> D{"Xizmat bajarildimi?"}
  D -->|"Ha"| E["Natijani yozib yakunlash"]
  D -->|"Hali yo‘q"| F["Ochiq vazifa va mas’ul bilan ishlash"]
  F --> C
  E --> G{"Keyingi yordam kerakmi?"}
  G -->|"Ha"| B
  G -->|"Hozircha yo‘q"| H["Natija tarixda saqlanadi"]
  class A,B,C,H guide_action;
  class E guide_success;
  class D,F,G guide_waiting;`,
  },
  {
    id: 'equipment', title: 'Jihozlarni bepul foydalanishga berish', category: 'care',
    summary: 'Faol mobil yordam olayotgan bola, vakil shartnomasi va aniq jihoz birligini bog‘lang.',
    roles: ['equipment', 'coordinator', 'team'],
    sections: [
      { title: 'Berish uchun asos', paragraphs: ['Uyda yordam uchun zarur jihoz Markaz va qonuniy vakil o‘rtasidagi shartnoma asosida tekin foydalanishga beriladi. Yo‘llanma va individual ehtiyojni tekshirib, kerakli jihoz turini aniqlang.', 'Prototipda berish amali faol mobil xizmat olayotgan bolaga mo‘ljallangan. Bepul foydalanish shartnomasi qaydi, aniq inventar birligi va bola ishi bitta ajratish yozuvida bog‘lanadi. Shartnoma raqamini kiritish haqiqiy imzolangan faylni yaratmaydi.'] },
      { title: 'Jihozning amaldagi holati', paragraphs: ['Mavjud, foydalanishga berilgan va texnik xizmatdagi birliklarni farqlang. Bitta jihoz ayni paytda ikki oilaga ajratilmaydi. Berilgan jihozda bola, shartnoma va berilgan sana ko‘rinadi.', 'Qaytarishda jihozning holati va dalolatnoma qaydini yozing. Ta’mir talab qilsa tegishli belgi bilan texnik xizmat holatiga o‘tkazing; uni mavjud jihoz sifatida qayta bermang. Oldingi foydalanish va qaytarish tarixi saqlanadi.'] },
      { title: 'Hisob chegarasi', paragraphs: ['Inventar raqami, qaytarish va texnik holat yozuvlari hisobni yuritish uchun prototipda qo‘shilgan. Buyruq jihoz qaytarishning aniq shakli, muddati yoki avtomatik jarima formulasini bermaydi; bularni taxmin qilmang.', 'Bolaga xizmat yakunlanishi jihoz qaytarilganini anglatmaydi. Mas’ul xodim qolgan jihoz majburiyatini tekshiradi va haqiqiy qaytarishni alohida qayd etadi.'] },
    ],
    steps: [
      { title: 'Ehtiyoj va xizmatni tekshiring', actor: 'Brigada / jihozlar mas’uli', action: 'Bolaning faol mobil epizodi, yo‘llanma yoki rejasidagi jihoz ehtiyojini ko‘rib chiqing.', result: 'Jihoz kimga va nima uchun kerakligi aniq bo‘ladi.', route: `${root}/mobile` },
      { title: 'Mavjud birlikni tanlang', actor: 'Jihozlar mas’uli', action: 'Jihozlar bo‘limida tur, inventar raqami va holatini tekshiring.', result: 'Berishga tayyor aniq birlik tanlanadi.', route: `${root}/equipment` },
      { title: 'Shartnoma bilan bering', actor: 'Jihozlar mas’uli', action: 'Bolani va bepul foydalanish shartnomasi qaydini kiriting.', result: 'Jihoz foydalanishga berilgan holatga o‘tadi.', route: `${root}/equipment` },
      { title: 'Qaytarish holatini qayd eting', actor: 'Jihozlar mas’uli', action: 'Qaytarib olishda holatni yozing; nosozlik bo‘lsa texnik xizmat belgisini tanlang.', result: 'Jihoz mavjud yoki texnik xizmat holatiga o‘tadi, tarixi saqlanadi.', route: `${root}/equipment` },
    ],
    checklist: ['Faol mobil yordam ishi tanlangan.', 'Zarur jihoz turi va inventar birligi mos.', 'Vakil bilan bepul foydalanish shartnomasi qaydi bor.', 'Birlik boshqa bolaga berilmagan.', 'Qaytarishdagi haqiqiy holat yozilgan.', 'Nosoz jihoz mavjud deb belgilanmagan.'],
    rules: [
      { tone: 'action', condition: 'Jihoz uyda foydalanish uchun beriladi', action: 'Markaz va qonuniy vakil shartnomasi asosida rasmiylashtiring.', owner: 'Jihozlar mas’uli', basis: 'Nizom 36-bandi.' },
      { tone: 'waiting', condition: 'Jihoz boshqa bolaga berilgan yoki texnik xizmatda', action: 'Uni qayta ajratmang; mavjud birlikni tanlang.', owner: 'Jihozlar mas’uli', basis: 'Resursning bir martalik bandligi — prototip yechimi.' },
      { tone: 'success', condition: 'Jihoz qaytarildi', action: 'Holat va qaytarish qaydini yozib, tarixni saqlang.', owner: 'Jihozlar mas’uli', basis: 'Qaytarish va inventar tarixi — prototip yechimi.' },
      { tone: 'waiting', condition: 'Qaytarilgan jihoz ta’mir talab qiladi', action: 'Texnik xizmat belgisini qo‘llang; mavjud jihoz sifatida bermang.', owner: 'Jihozlar mas’uli', basis: 'Texnik holat nazorati — prototip yechimi.' },
    ],
    faq: [
      { question: 'Shartnomasiz berishni saqlash mumkinmi?', answer: 'Yo‘q. Prototip bepul foydalanish shartnomasi qaydini talab qiladi.' },
      { question: 'Statsionarda yotgan bolaga shu amal bilan jihoz beriladimi?', answer: 'Ushbu berish amali faol mobil yordam oluvchiga uyda bepul foydalanish uchun mo‘ljallangan. Statsionar jihozlarining umumiy ichki hisobini shu amal bilan almashtirmang.' },
      { question: 'Xizmat yakunlanganda jihoz avtomatik qaytadimi?', answer: 'Yo‘q. Faqat haqiqiy qaytarish qaydi jihozni bo‘shatadi yoki texnik xizmatga o‘tkazadi.' },
    ],
    scenarioCodes: ['MOBILE_ONE_VISIT', 'MOBILE_TWO_VISITS', 'MOBILE_THREE_VISITS'],
    sources: [{ label: 'Nizom 21-bandi va 2-ilova: mobil jihoz ehtiyoji', page: 5 }, { label: 'Nizom 36-bandi: bepul foydalanish shartnomasi', page: 8 }, { label: 'Prototipdagi inventar va qaytarish hisobi' }],
    flowchart: `flowchart TD
  A["Faol mobil ish va jihoz ehtiyoji"] --> B{"Jihoz mavjudmi?"}
  B -->|"Yo‘q"| C["Boshqa mavjud birlikni tekshirish"]
  C --> B
  B -->|"Ha"| D["Vakil shartnomasi bilan berish"]
  D --> E["Haqiqiy qaytarish va holat qaydi"]
  E --> F{"Ta’mir kerakmi?"}
  F -->|"Ha"| G["Texnik xizmat"]
  F -->|"Yo‘q"| H["Mavjud jihoz"]
  class A,D,E guide_action;
  class H guide_success;
  class B,C,F,G guide_waiting;`,
  },
  {
    id: 'follow-up', title: 'Chiqarish, kuzatuv va oilaga keyingi yordam', category: 'care',
    summary: 'Klinik xizmat yakunini oilaviy shifokorga topshirish va oilaga yordamdan ajrating.',
    roles: ['doctor', 'team', 'coordinator', 'operator'],
    sections: [
      { title: 'Yakun va topshirish', paragraphs: ['Statsionar yoki mobil yordam yakunlanganda haqiqiy sana, sabab, xulosa va epikriz yoki tegishli hujjat qaydini yozing. Ko‘chirish, oddiy chiqarish va vafot natijalarini to‘g‘ri farqlang.', '34-bandga muvofiq xizmatdan so‘ng bola oilaviy shifokor nazoratiga o‘tadi. Karta ichida kuzatuvni qabul qilgan shifokor, poliklinika, topshirish hujjati, sana va keyingi ko‘rikni qayd eting. Epizodni yopish topshirish bajarilganini avtomatik anglatmaydi.'] },
      { title: 'Vafot holatida', paragraphs: ['Markazdagi vafotda o‘lim epikrizi rasmiylashtiriladi va chiqarish amalga oshiriladi. Qonuniy vakil o‘lim sababiga e’tiroz bildirsa, Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining Patologoanatomiya va murdalarni saqlash bo‘limiga yo‘naltirish qayd etiladi.', 'Bola vafotidan keyin oilaga, jumladan psixologik yordam uch oygacha davom etishi mumkin. Klinik epizod yopilishi oilaviy yordamni o‘z-o‘zidan tugatmaydi. Prototip klinik yakundan so‘ng oilaviy reja uchun alohida faol holat ochadi; bu amaldagi yordam bajarilganining tasdig‘i emas.'] },
      { title: 'Oilaviy muddat va yakun', paragraphs: ['Prototip uch oylik muddatni kalendar oylar bilan hisoblaydi va oy oxirini moslashtiradi. Oilaga yangi xizmat va tashriflarni shu muddat ichida rejalang. Muddat tugagach yangi vazifa yoki hozir bajarilgan xizmatni qayd etish cheklanadi; mas’ul yakunlashni ko‘rib chiqadi.', 'Oilaviy yordamni yakunlashda bajarilgan vazifalar saqlanadi. Ochiq oilaviy vazifa va tashriflar bajarilgan deb belgilanmaydi: yakun sababiga ko‘ra bekor qilingan holatda qoladi. Berilgan jihoz bo‘lsa, qaytarishni alohida tekshiring.'] },
    ],
    steps: [
      { title: 'Haqiqiy klinik yakunni kiriting', actor: 'Vakolatli shifokor', action: 'Faol epizodda yakun sanasi, sabab, xulosa va hujjatni qayd eting.', result: 'Klinik xizmat davri yakunlanadi; statsionar o‘rin bo‘shaydi.', route: `${root}/inpatient` },
      { title: 'Kuzatuvga topshiring', actor: 'Markaz va oilaviy shifokor', action: 'Oddiy chiqarishdan so‘ng karta ichida qabul qilgan shifokor, tashkilot, hujjat va keyingi ko‘rikni kiriting.', result: 'Keyingi mas’ul ochiq qayd etiladi.', route: cases },
      { title: 'Vafotdagi hujjatlarni saqlang', actor: 'Shifokor / operator', action: 'Vafot epikrizi qaydini kiriting; e’tiroz bo‘lsa tegishli patologiya yo‘nalishini qayd eting.', result: 'Klinik yakun va kerakli tashqi yo‘nalish saqlanadi.', route: cases },
      { title: 'Oilaviy yordamni yuriting', actor: 'Psixolog, ijtimoiy xodim va brigada', action: 'Oila uchun vazifalar, tashriflar, aloqa va natijalarni alohida yuriting.', result: 'Klinik xizmatdan mustaqil oilaviy yordam ko‘rinadi.', route: `${root}/mobile` },
      { title: 'Oilaviy ishni yakunlang', actor: 'Mas’ul mutaxassis', action: 'Natijalar va ochiq rejalarga qarab yakunlashni bajaring; bekor qilinadigan vazifa/tashriflarni tekshiring.', result: 'Bajarilgan va bekor qilingan ishlar tarixda farqlanib qoladi.', route: cases },
    ],
    checklist: ['Yakun sababi va hujjati to‘g‘ri.', 'Chiqarishdan keyingi shifokor alohida qayd etilgan.', 'Vafotga e’tiroz bo‘lsa tegishli yo‘nalish bor.', 'Oilaviy reja klinik xizmatdan ajratilgan.', 'Uch kalendar oylik muddat tekshirilgan.', 'Ochiq vazifalar bajarilgan deb ko‘rsatilmagan.', 'Jihoz qaytarish majburiyati tekshirilgan.'],
    rules: [
      { tone: 'action', condition: 'Statsionar yoki mobil yordam tugagan', action: 'Oilaviy shifokorga kuzatuvni topshirish qaydini kiriting.', owner: 'Markaz va oilaviy shifokor', basis: 'Nizom 34-bandi.' },
      { tone: 'action', condition: 'Markazda vafot qayd etilgan', action: 'O‘lim epikrizi va chiqarishni rasmiylashtiring.', owner: 'Vakolatli shifokor', basis: 'Nizom 40-bandi.' },
      { tone: 'action', condition: 'Vakil o‘lim sababiga e’tiroz bildiradi', action: 'Belgilangan patologiya bo‘limiga yo‘naltirishni qayd eting.', owner: 'Markazning mas’ul xodimi', basis: 'Nizom 40-bandi.' },
      { tone: 'action', condition: 'Vafotdan keyin oilaviy yordam davom etadi', action: 'Uni klinik epizoddan alohida, uch oygacha bo‘lgan davrda yuriting.', owner: 'Mobil brigada va oilaviy yordam mutaxassislari', basis: 'Nizom 33-bandi; kalendar hisobi — prototip yechimi.' },
      { tone: 'cancelled', condition: 'Oilaviy yordam yakunlanmoqda', action: 'Bajarilgan ishni saqlang, bajarilmagan rejalarni aniq bekor qilingan deb qoldiring.', owner: 'Mas’ul mutaxassis', basis: 'Natijalarni aralashtirmaslik va tarix — prototip yechimi.' },
    ],
    faq: [
      { question: 'Bola vafot etsa oilaviy vazifalar ham yopiladimi?', answer: 'Yo‘q. Oilaga yordam alohida davom etadi. Klinik epizodning yakuni oilaviy xizmatlar bajarilganini yoki tugaganini anglatmaydi.' },
      { question: 'Uch oy 90 kunmi?', answer: 'Prototip kalendar oylarini hisoblaydi. Boshlanish sanasiga uch oy qo‘shiladi; maqsad oyida shu kun bo‘lmasa oy oxiriga moslanadi.' },
      { question: 'Kuzatuvga o‘tgan bola yana yo‘llanma olishi mumkinmi?', answer: 'Zaruratda qayta baholash va yo‘llash mavjud ishda qayd etiladi. Avvalgi epizod, hujjat va qarorlar tarixda qoladi.' },
    ],
    scenarioCodes: ['DISCHARGE_HANDOFF', 'TRANSFER_HANDOFF', 'FAMILY_SUPPORT_ACTIVE', 'FAMILY_SUPPORT_CLOSED', 'REASSESSMENT_RESUBMISSION'],
    sources: [{ label: 'Nizom 33–34-bandlari', page: 8 }, { label: 'Nizom 40-bandi', page: 9 }, { label: 'Prototipdagi oilaviy muddat, vazifa bekor qilish va topshirish qaydi' }],
    flowchart: `flowchart TD
  A["Klinik epizod yakuni"] --> B{"Yakun sababi"}
  B -->|"Chiqarish yoki ko‘chirish"| C["Xulosa va keyingi yo‘nalish"]
  C --> D["Oilaviy shifokorga topshirish"]
  B -->|"Vafot"| E["Epikriz; e’tiroz bo‘lsa yo‘naltirish"]
  E --> F["Oilaga alohida yordam rejasi"]
  F --> G["Uch oygacha yordam va natijalar"]
  G --> H["Oilaviy yordamni yakunlash"]
  H --> I["Bajarilgan va bekor qilingan rejalar tarixi"]
  class A,C,D,E,F,G,H,I guide_action;
  class B guide_waiting;`,
  },
  {
    id: 'reports', title: 'Hisobotlar va ko‘rsatkichlarni o‘qish', category: 'management',
    summary: 'Tanlangan davrda bola, epizod, tashrif va oilaviy xizmatni bir-biriga aralashtirmasdan baholang.',
    roles: ['manager', 'coordinator', 'operator'],
    sections: [
      { title: 'Hisobotning manbasi', paragraphs: ['41-band mobil brigadalarning bosh shifokor va tegishli bo‘lim boshlig‘iga oylik, choraklik va yillik hisobot berishini belgilaydi. Buyruqda tayyor hisobot shakli, barcha ko‘rsatkichlar yoki topshirish sanasi berilmagan.', 'Hozirgi sahifa prototipdagi yo‘llanma, epizod, tashrif va jihoz berish yozuvlaridan natija chiqaradi. Uni tasdiqlangan rasmiy hisobot shakli yoki tashqi tashkilotga yuborilgan hujjat deb qabul qilmang. Individual vazifalarni bola kartasidan tekshirishingiz mumkin.'] },
      { title: 'Birlik va holatni to‘g‘ri solishtiring', paragraphs: ['Bola soni, xizmat epizodi soni va tashrif soni turli birliklardir. Bir bola bir necha xizmat yoki tashrif olishi mumkin. Oilaga vafotdan keyin ko‘rsatilgan xizmatlar bolaga ko‘rsatilgan klinik xizmatga qo‘shib talqin qilinmaydi.', 'Rejalashtirilgan, jarayondagi, bajarilgan va bekor qilingan tashriflarni farqlang. Masofaviy maslahat uy tashrifidan alohida ko‘rinadi. Jihozning hozirgi bandligi, berish harakati va qaytarish harakati bir xil ko‘rsatkich emas.'] },
      { title: 'Raqamdan amaliy savolga o‘tish', paragraphs: ['Oylik, choraklik yoki yillik davrni tanlang; hududlar jadvalidagi satrlarni va xizmat yozuvlarini solishtiring. Kutilmagan son bo‘lsa, tegishli bola kartasi yoki tashrif yozuviga qaytib sana, xizmat turi va yakun holatini tekshiring.', 'Yordam sifati faqat tashrif yoki GPS soni bilan baholanmaydi. Bola kartasidagi individual reja natijalari va vakolatli mutaxassis bahosini birga ko‘ring. Ma’lumotlardan bolaga va oilaga yordam ko‘rsatish maqsadida foydalanish talabi saqlanadi.'] },
    ],
    steps: [
      { title: 'Davrni belgilang', actor: 'Rahbar / monitoring xodimi', action: 'Hisobot sahifasida oy, chorak yoki yilni tanlang, keyin hududlar jadvali satrlarini ko‘ring.', result: 'Barcha hududlar bir xil davr doirasida solishtiriladi.', route: `${root}/reports` },
      { title: 'Ko‘rsatkich birligini o‘qing', actor: 'Monitoring xodimi', action: 'Son bola, epizod, tashrif yoki jihozga tegishli ekanini aniqlang.', result: 'Turli birliklar noto‘g‘ri yig‘ilmaydi.', route: `${root}/reports` },
      { title: 'Xizmat holatini solishtiring', actor: 'Rahbar va muvofiqlashtiruvchi', action: 'Bajarilgan xizmatni rejalashtirilgan va bekor qilingan holatlardan, uy tashrifini maslahatdan ajrating.', result: 'Amaldagi xizmat hajmi va ochiq ishlar farqlanadi.', route: `${root}/reports` },
      { title: 'Manba yozuvini tekshiring', actor: 'Mas’ul xodim', action: 'Farq topilsa bola kartasi, epizod yoki tashrifning sanasi va natijasini ko‘rib chiqing.', result: 'Tuzatish yoki keyingi harakat manbaga tayangan bo‘ladi.', route: cases },
    ],
    checklist: ['Kerakli oy, chorak yoki yil tanlangan.', 'Hududlar jadvali bir xil davr bo‘yicha o‘qilgan.', 'Bola, epizod va tashrif sonlari ajratilgan.', 'Oilaviy yordam alohida talqin qilingan.', 'Bajarilgan va bekor qilingan xizmat aralashtirilmagan.', 'Maslahat uy tashrifi deb olinmagan.', 'Raqam manba yozuvi bilan tekshirilgan.'],
    rules: [
      { tone: 'action', condition: 'Davriy hisobot tayyorlanadi', action: 'Oylik, choraklik yoki yillik davrni rahbariyatning amaldagi tartibiga muvofiq belgilang.', owner: 'Mobil brigada / rahbariyat', basis: 'Nizom 41-bandi; aniq shakl va topshirish sanasi buyruqda berilmagan.' },
      { tone: 'action', condition: 'Bir bola bir necha epizod yoki tashrif olgan', action: 'Bola va xizmatlar sonini alohida o‘qing; bolani xizmatlar soniga tenglashtirmang.', owner: 'Monitoring xodimi', basis: 'Takrorlarni ajratib hisoblash — prototip yechimi.' },
      { tone: 'waiting', condition: 'Tashrif bekor qilingan yoki hali rejalashtirilgan', action: 'Uni bajarilgan yordam deb hisoblamang.', owner: 'Monitoring xodimi', basis: 'Amaldagi xizmat holatlari — prototip yechimi.' },
      { tone: 'action', condition: 'Ma’lumot ko‘rilmoqda yoki natija ulashilmoqda', action: 'Bolaga va oilaga yordam ko‘rsatish maqsadiga doir ma’lumotdan foydalaning.', owner: 'Barcha mas’ul foydalanuvchilar', basis: 'Nizom 42–43-bandlari.' },
    ],
    faq: [
      { question: 'Nega tashriflar soni bolalar sonidan ko‘p?', answer: 'Bitta bolaga bir nechta tashrif yoki maslahat bo‘lishi mumkin. Bola va xizmat soni alohida birliklardir.' },
      { question: 'Oilaga yordam tashrifi yangi bola sifatida sanaladimi?', answer: 'Oilaviy yordam alohida xizmat yo‘nalishidir. Uni yangi klinik xizmat oluvchi bola deb talqin qilmang.' },
      { question: 'Ko‘rsatkichlar rasmiy tasdiqlangan shaklmi?', answer: 'Hozirgi ko‘rsatkichlar prototip namunasidir. Rasmiy shakl va topshirish tartibi buyruqda to‘liq berilmagan.' },
    ],
    scenarioCodes: ['MOBILE_ONE_VISIT', 'MOBILE_TWO_VISITS', 'MOBILE_THREE_VISITS', 'TRANSFER_HANDOFF', 'FAMILY_SUPPORT_ACTIVE', 'FAMILY_SUPPORT_CLOSED'],
    sources: [{ label: 'Nizom 41–43-bandlari', page: 9 }, { label: 'Prototip hisobotlari: manba yozuvlari, davr va birliklar' }],
    flowchart: `flowchart TD
  A["Oy, chorak yoki yilni tanlash"] --> B["Hududlar jadvali va xizmat yozuvlari"]
  B --> C{"Ko‘rsatkich birligi"}
  C -->|"Bola yoki epizod"| D["Shaxs va xizmat davrini ajratish"]
  C -->|"Tashrif yoki maslahat"| E["Tur va bajarilish holatini tekshirish"]
  D --> F["Oilaviy yordamni alohida talqin qilish"]
  E --> F
  F --> G{"Natija tushunarlimi?"}
  G -->|"Yo‘q"| H["Manba kartasi va sanalarni tekshirish"]
  G -->|"Ha"| I["Rahbariyat bilan natija va keyingi ish"]
  class A,B,D,E,F,I guide_action;
  class C,G,H guide_waiting;`,
  },
  {
    id: 'demo', title: '22 ta namuna bilan ishlash', category: 'management',
    summary: 'Har bir muhim holatni namuna kartasida sinang va natijaning qanday o‘zgarishini kuzating.',
    roles: ['operator', 'doctor', 'referrer', 'consilium', 'coordinator', 'team', 'equipment', 'manager'],
    sections: [
      { title: 'Namuna nimani ko‘rsatadi?', paragraphs: ['Demoda murojaat, baholash, past ball kuzatuvi, hujjati yetishmagan yo‘llanma, ikkala konsilium, qabul kutishi, vaqtincha to‘xtatish va asosli rad etish kabi boshlang‘ich holatlar bor. Statsionarning vaqtinchalik, uzaytirilgan, muddatsiz va 18 yoshdan keyingi davom ettirish namunalari ham alohida berilgan.', 'Mobil yordamda haftasiga bir, ikki va uch tashrif, konsilium o‘zgartirgan chastota, maslahatlar, jihoz berish/qaytarish hamda oilaga faol va yakunlangan yordam misollari mavjud. Barcha bola, vakil, manzil va klinik hujjatlar sun’iy.'] },
      { title: 'Ssenariyni qanday sinash mumkin?', paragraphs: ['Bolalar va yo‘llanmalar bo‘limida Demo ssenariylar ko‘rinishini tanlang. Kartadagi boshlang‘ich tavsif va tekshirish nuqtalarini o‘qing, so‘ng ishni ochib tegishli amalni bajaring. Masalan, hujjati yetishmagan yo‘llanmada ko‘chirmani to‘ldirish yoki boshlangan tashrifda natijani yozishni sinashingiz mumkin.', 'Ssenariy tavsifi namunaning boshlang‘ich maqsadini tushuntiradi. Siz amal bajarganingizdan keyin haqiqiy joriy holatni kartaning statusi, xizmatlari va tarixidan tekshiring; tavsif bajarilgan amalning yangi tasdig‘i bo‘lib qolmaydi.'] },
      { title: 'Namuna holatini tiklash', paragraphs: ['Sinov o‘zgarishlari joriy ochiq sahifa xotirasida turadi. Sahifani yangilash yoki demo holatini tiklash amali boshlang‘ich namuna to‘plamini qayta yaratadi; ushbu sinovlarni doimiy ma’lumot saqlash deb qabul qilmang.', 'Namuna klinik hujjat yubormaydi, haqiqiy E-palliative yoki GPSga ulanmaydi va dori tayinlamaydi. Hujjat maydonlari tushunish va jarayonni sinash uchun nom/raqam qaydlaridir. Yangi sinov kartangiz yangilashdan keyin saqlanib qolmasligi tabiiy.'] },
    ],
    steps: [
      { title: 'Maqsadga mos misolni toping', actor: 'Istalgan demo foydalanuvchisi', action: 'Demo ssenariylar ko‘rinishida kerakli bosqich yoki xizmat holatini tanlang.', result: 'Aniq jarayonni ko‘rsatadigan namuna topiladi.', route: examples },
      { title: 'Boshlang‘ich vaziyatni o‘qing', actor: 'Istalgan demo foydalanuvchisi', action: 'Ssenariy tavsifi va tekshirish nuqtalarini ko‘rib chiqing.', result: 'Qaysi farq yoki qoidani tekshirish kerakligi aniq bo‘ladi.', route: examples },
      { title: 'Kartada amalni sinang', actor: 'Tegishli rol vazifasini sinovchi', action: 'Karta yoki xizmat ekranida mavjud formani to‘ldiring va natijani qayd eting.', result: 'Holat, tarix va tegishli resurs o‘zgarishi ko‘rinadi.', route: cases },
      { title: 'Natijani solishtiring', actor: 'Istalgan demo foydalanuvchisi', action: 'Karta statusi, xizmatlar, tarix va hisobotlarda amalingiz natijasini tekshiring.', result: 'Ekran nomi emas, amaldagi ish jarayoni tushuniladi.', route: `${root}/reports` },
      { title: 'Keyingi sinovga qayting', actor: 'Istalgan demo foydalanuvchisi', action: 'Kerak bo‘lsa demo holatini tiklash orqali boshlang‘ich misollarga qayting.', result: 'Sinov o‘zgarishlarisiz namuna qayta ochiladi.', route: examples },
    ],
    checklist: ['Namuna va haqiqiy ma’lumot farqi tushunilgan.', 'Ssenariyning boshlang‘ich holati o‘qilgan.', 'Tegishli amal amalda sinab ko‘rilgan.', 'Joriy natija karta va tarixda tekshirilgan.', 'Yangilash yoki tiklash sinov o‘zgarishlarini yo‘qotishi hisobga olingan.'],
    rules: [
      { tone: 'action', condition: 'Namuna kartasi ochilgan', action: 'Uni sun’iy o‘quv holati sifatida ishlating.', owner: 'Demo foydalanuvchisi', basis: 'Frontend prototipi va sun’iy ma’lumot to‘plami.' },
      { tone: 'action', condition: 'Siz holatni o‘zgartirdingiz', action: 'Natijani joriy karta statusi va tarixdan tekshiring.', owner: 'Demo foydalanuvchisi', basis: 'Ssenariy tavsifi boshlang‘ich kontekst; status esa amaldagi holat.' },
      { tone: 'cancelled', condition: 'Boshlang‘ich misollarga qaytish kerak', action: 'Demo holatini tiklang; sinovdagi o‘zgarishlar bekor bo‘lishini hisobga oling.', owner: 'Demo foydalanuvchisi', basis: 'Joriy sahifa xotirasidagi namuna — prototip ishlash tartibi.' },
      { tone: 'action', condition: 'Hujjat, imzo yoki GPS maydoni ko‘rinmoqda', action: 'Uni haqiqiy tashqi tasdiq yoki yuborilgan ma’lumot deb talqin qilmang.', owner: 'Demo foydalanuvchisi', basis: 'Hozirgi frontend namunasining chegarasi.' },
    ],
    faq: [
      { question: 'Yangi sinov kartam yangilagandan keyin qayerga ketdi?', answer: 'U joriy sahifa xotirasidagi sinov edi. Yangilash boshlang‘ich demo misollarini qayta ochadi; doimiy saqlash bajarilmaydi.' },
      { question: 'Bir xil nomli namuna har kuni ishlaydimi?', answer: 'Namuna identifikatorlari barqaror, sanalari esa joriy kunga nisbatan shakllanadi. Shu sabab bir xil jarayon misolini keyin ham topishingiz mumkin.' },
      { question: 'Bu qo‘llanma klinik qarorni qanday chiqarishni o‘rgatadimi?', answer: 'U moduldagi jarayon va qaydlarni tushuntiradi. Klinik baholash va davolashni vakolatli mutaxassis tegishli uslubiyot hamda protokol asosida bajaradi.' },
    ],
    scenarioCodes: ['INTAKE_NEW', 'ASSESSMENT_PENDING', 'PAPAS_OBSERVATION', 'REFERRAL_INCOMPLETE', 'CENTRE_CONSILIUM', 'APPROVED_WAITING_BED', 'APPROVED_MOBILE_ASSESSMENT', 'TEMPORARY_PAUSE', 'REJECTED_NEW_ADULT', 'INPATIENT_TEMPORARY', 'INPATIENT_EXTENDED', 'INPATIENT_TERMINAL', 'INPATIENT_ADULT_CONTINUATION', 'MOBILE_ONE_VISIT', 'MOBILE_TWO_VISITS', 'MOBILE_THREE_VISITS', 'DISCHARGE_HANDOFF', 'TRANSFER_HANDOFF', 'FAMILY_SUPPORT_ACTIVE', 'FAMILY_SUPPORT_CLOSED', 'PAPER_REFERRAL', 'REASSESSMENT_RESUBMISSION'],
    sources: [{ label: 'Frontend prototipidagi 22 ta sun’iy ssenariy va mavjud amallar' }, { label: '316-son buyruq asosidagi jarayon rejasi; buyruq talabi va prototip farqi' }],
    flowchart: `flowchart TD
  A["Demo ssenariylarni ochish"] --> B["Maqsadga mos ssenariy"]
  B --> C["Boshlang‘ich tavsif va tekshiruv nuqtalari"]
  C --> D["Kartada amalni sinash"]
  D --> E["Joriy holat va tarixni tekshirish"]
  E --> F{"Boshlang‘ich holat kerakmi?"}
  F -->|"Ha"| G["Demo holatini tiklash"]
  G --> B
  F -->|"Yo‘q"| H["Keyingi amal yoki hisobotni ko‘rish"]
  class A,B,C,D,E,H guide_action;
  class G guide_cancelled;
  class F guide_waiting;`,
  },
]

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  return [...new Map(items.map(item => [key(item), item])).values()]
}

export const guideTopics: GuideTopic[] = baseGuideTopics.map(topic => {
  const styledTopic = { ...topic, flowchart: withGuideSemanticPalette(topic.flowchart) }
  const detail = guideDetails[topic.id]
  if (!detail) return styledTopic
  return {
    ...styledTopic,
    detail: { ...detail, flows: detail.flows.map((flow,index) => ({ ...flow, id: index === 0 ? 'detailed' : flow.id, definition: withGuideSemanticPalette(flow.definition) })) },
    sections: uniqueBy([...topic.sections, ...detail.sections], item => item.title),
    steps: detail.steps.length ? detail.steps : topic.steps,
    rules: uniqueBy([...topic.rules, ...detail.rules], item => item.condition),
    faq: uniqueBy([...topic.faq, ...detail.faq], item => item.question),
    checklist: [...new Set([...topic.checklist, ...detail.checklist])],
  }
})
