import type { GuideDetail } from './guides-types'

const root = '/apps/palliative-care'
const cases = `${root}/cases`
const examples = `${cases}?view=scenarios`

export const managementGuideDetails: Record<string, GuideDetail> = {
  overview: {
    prerequisites: [
      'Bola uchun mavjud karta bor-yo‘qligi reyestrdan tekshirilgan; takror murojaat yangi bola sifatida ochilmaydi.',
      'Bola, qonuniy vakil, dastlabki murojaat sanasi va mas’ul oilaviy shifokor haqidagi ma’lumotlar tayyor.',
      'Klinik ball, tibbiy ko‘rsatma va qarorlar vakolatli mutaxassis xulosasidan olinadi. Operator ularni o‘zicha aniqlamaydi.',
      'Ishni kim boshlashi, keyingi bosqichni kim qabul qilishi va qanday natija qayd etishi kelishilgan.',
      'Sinovda faqat sun’iy ma’lumot ishlatiladi: ushbu modul rasmiy yuborish, elektron imzo yoki tashqi tizim bilan tasdiqlashni bajarmaydi.',
    ],
    sections: [
      { title: 'Jarayonning boshlanishi va o‘lchanadigan natijasi', paragraphs: [
        'Jarayon vakil murojaati yoki bola ehtiyoji aniqlanishidan boshlanadi. Birinchi maqsad — kartani to‘ldirish bilan cheklanmasdan, baholashni kim va qachon o‘tkazishini belgilash. Reyestrdagi «Keyingi harakat va mas’ul» ustuni shu ishning davom etish nuqtasini ko‘rsatadi.',
        'Jarayonning amaliy natijasi — tegishli qaror asosida yordamning boshlanishi, aniq mutaxassis tomonidan bajarilishi va keyingi yordam mas’ulining ma’lum bo‘lishi. Yo‘llanma yuborilgani, qabul tasdiqlangani yoki tashrif rejalashtirilgani o‘z-o‘zidan xizmat bajarilganini bildirmaydi.',
        'Bosh sahifadagi raqamlar joriy ishlarni ko‘rsatadi. «Yordam olayotgan bolalar» faol epizodi bor kartalarni, «Keyingi harakat kutilmoqda» esa murojaat, baholash, yo‘llanma, konsilium, tasdiqlangan qabul va vaqtincha to‘xtatish bosqichlarini qamrab oladi. Bu ikkinchi ko‘rsatkich faqat konsilium navbati emas.',
      ] },
      { title: 'Kim nima uchun javob beradi?', paragraphs: [
        'Qabul xodimi bola va vakil kartasi hamda hujjat rekvizitlarini yuritadi. Oilaviy shifokor dastlabki ko‘rik, PaPaS natijasi va poliklinika kuzatuvi uchun mas’ul. Yo‘llanma beruvchi muassasa konsiliumi tibbiy asos, xulosa va yo‘llanmani rasmiylashtiradi.',
        'Markaz konsiliumi qabul va yordam shakli haqida alohida qaror beradi. Muvofiqlashtiruvchi tasdiqlangan qarorni o‘rin, brigada, sana va reja bilan amaliy xizmatga aylantiradi. Yordam ko‘rsatuvchi mutaxassis esa bajarilgan ishning natijasini yozadi.',
        'Jihozlar mas’uli aniq inventar birligini shartnoma bilan beradi va qaytarishda holatini qayd etadi. Chiqarishdan so‘ng Markaz xodimi bilan qabul qiluvchi oilaviy shifokor topshirishni rasmiylashtiradi. Rahbar raqamlarni manba yozuvlari bilan solishtiradi; hisobotning o‘zi klinik qaror bermaydi.',
      ] },
      { title: 'Ikki konsilium va ikkita baholash', paragraphs: [
        'Birinchi konsilium — yo‘llanma beruvchi vakolatli muassasaniki. Uning raqami, sanasi, tarkibi, muvofiqlik xulosasi va tasdiq rekviziti yo‘llanmada saqlanadi. Ikkinchisi — Markaz konsiliumi; uning qabul qilish, vaqtincha to‘xtatish yoki rad etish qarori boshqa yozuvdir.',
        'Shuning uchun manba konsiliumining ijobiy xulosasi bilan kelgan bola hali Markaz tomonidan qabul qilingan hisoblanmaydi. Markaz qarori saqlansa ham xizmatni boshlash uchun tegishli amaliy qadam qoladi.',
        'PaPaS palliativ yordamga ehtiyojni baholash yo‘lining bir qismi. Uyda yordam ehtiyoji esa mobil xizmat va haftalik tashrif rejasiga tegishli alohida natija. Bir bahoning balli ikkinchisiga ko‘chirilmaydi. Prototip tayyor tasdiqlangan natijani qayd etadi; to‘liq klinik savolnoma yoki tasdiqlangan hisoblash mexanizmi o‘rnini bosmaydi.',
      ] },
      { title: 'To‘xtash nuqtalarini to‘g‘ri talqin qilish', paragraphs: [
        'PaPaS 14 yoki undan past qayd etilganda poliklinika kuzatuvi yo‘li qoladi. Hujjati yetishmagan yo‘llanma to‘ldirishni talab qiladi. Bu ikki holat Markazning asosli rad etish qaroriga teng emas.',
        '«Vaqtincha to‘xtatilgan» ishda boshqa yordam muassasasi va qayta ko‘rish sanasi saqlanadi. Zarur yordam yoki qo‘shimcha ma’lumotdan keyin konsilium qayta ko‘rib chiqishi mumkin. «Qabul rad etilgan» holatda esa rad etish asosi saqlanadi va keyingi yordamni muloqot qaydi orqali aniq yozish mumkin.',
        '«Qabul tasdiqlangan» — tashkil etish bosqichi. Statsionarda bo‘sh va foydalanishga tayyor o‘rin, mobil xizmatda tegishli uy bahosi va brigada kerak. Joylashtirish yoki mobil epizod alohida boshlanganidan keyingina faol xizmat paydo bo‘ladi.',
      ] },
      { title: 'Yordamning kundalik bajarilishi', paragraphs: [
        '«Yordam rejasi»da yordam mazmuni, oluvchi, mas’ul mutaxassis va muddat belgilanadi. Bola uchun vazifa va oila uchun vazifa bir kartada bo‘lsa ham kimga ko‘rsatilishi aniq yoziladi. Bajarilgan vazifaga alohida natija kiritiladi; kalendardagi muddatning o‘tishi vazifani avtomatik bajarmaydi.',
        'Mobil xizmatda tashrif avval rejalashtiriladi, vaqti kelgach boshlanadi, keyin natijasi bilan yakunlanadi. Uyga tashrif va masofaviy maslahat alohida turdir. Oddiy muloqot qaydi avtomatik ravishda bajarilgan brigada tashrifi ko‘rsatkichini oshirmaydi.',
        'Jihoz ehtiyoji yo‘llanmada yozilishi bilan inventar ajratilmaydi. «Jihoz berish»da aniq birlik va bepul foydalanish shartnomasi biriktiriladi. Qaytarishda sozlik yoki texnik xizmatga ehtiyoj qayd etiladi; bu harakat klinik epizodni yakunlashdan alohida bajariladi.',
      ] },
      { title: 'Klinik yakun, topshirish va oilaviy yakun', paragraphs: [
        'Chiqarish yoki boshqa muassasaga ko‘chirishda faol epizod yakunlanadi, tegishli hujjat va xulosa saqlanadi, statsionar o‘rin bo‘shaydi. Shundan keyin oilaviy shifokorga topshirish alohida qayd etiladi. «Keyingi kuzatuv» holati topshirish allaqachon bajarilganini kafolatlamaydi; kartadagi qabul qiluvchi shifokor va sana yozuvini tekshiring.',
        'Vafotda klinik xizmat yopiladi, oilaga keyingi yordam esa alohida faol reja sifatida yuritilishi mumkin. Oilaviy muddatning mavjudligi xizmat bajarilganining dalili emas: vazifa, tashrif va natija alohida kerak. Prototip uch oylik muddatni kalendar oylar bilan hisoblaydi.',
        'Oilaviy yordamni yakunlash alohida amal. Bajarilgan vazifalar tarixda qoladi, ochiq oilaviy vazifa va tashriflar bajarilgan deb yozilmaydi, bekor qilinadi. Berilgan jihozni qaytarish zarurati alohida tekshiriladi. Yangi yo‘llanma kerak bo‘lsa oldingi baholash, yo‘llanma va epizod tarixi saqlangan o‘sha bola ishidan foydalaniladi.',
      ] },
      { title: 'Qayerdan qaysi ma’lumotni topish mumkin?', paragraphs: [
        '«Ish jarayoni» guruhida bolalar va yo‘llanmalar, konsilium, statsionar, mobil yordam va jihoz berish amallari joylashgan. «Ma’lumotnomalar → Kataloglar» hudud, xizmat turi, ish holati, brigada tarkibi va o‘rin tayyorligini o‘qish uchun xizmat qiladi. Katalogdagi tayyor o‘rin ayni paytda bo‘sh degani emas; bandlik statsionar sahifasida tekshiriladi.',
        '«Hisobotlar → Davriy hisobot» tanlangan davrdagi ko‘rsatkich va qaydlarni beradi. «Yordam» guruhida qisqa biznes jarayon hamda batafsil qo‘llanmalar bor. Karta yuqorisidagi kitob belgisi «Qo‘llanma» deb nomlanadi va joriy bosqichga mos mavzuni ochadi.',
        'Buyruqdan kelib chiqadigan klinik vakolat, rasmiy hujjat aylanishi, tasdiqlangan dori va davolash protokollari, moliyalashtirish, ovqatlanish, sanitariya, haqiqiy telefon va GPS ishlari bu namuna bilan to‘liq avtomatlashtirilgan deb talqin qilinmaydi. Uch ish kuni hamda 14/28 kun hisobining prototip talqinlari tegishli mavzularda alohida ko‘rsatilgan.',
      ] },
    ],
    steps: [
      { title: 'Bola ishini reyestrdan izlang', actor: 'Qabul xodimi', action: '«Bolalar va yo‘llanmalar»da ism, vakil yoki karta raqami bilan qidiring; tug‘ilgan sanani solishtiring.', result: 'Mavjud ish topiladi yoki yangi karta ochish zarurati aniqlanadi.', route: cases },
      { title: 'Murojaat va mas’ulni qayd eting', actor: 'Qabul xodimi va oilaviy shifokor', action: '«Yangi bola kartasi»da bola, vakil, haqiqiy dastlabki murojaat sanasi va mas’ul shifokorni kiriting.', result: 'Yagona karta va baholash muddati shakllanadi.', route: cases },
      { title: 'Tasdiqlangan PaPaS natijasini kiriting', actor: 'Baholovchi shifokor', action: 'Kartadagi «Baholash va yo‘llanma»dan PaPaS natijasi, sana, baholovchi, metodika va hujjat rekvizitini qayd eting.', result: 'Past ball uchun kuzatuv yoki yo‘llanma tayyorlash yo‘li ko‘rinadi.', route: cases },
      { title: 'Kuzatuv yoki yo‘llanma yo‘lini belgilang', actor: 'Oilaviy shifokor', action: 'Kuzatuv kerak bo‘lsa yordam vazifasi va muddatini yozing. Yo‘llash ko‘rilsa tibbiy ko‘rsatma va vakil tanlagan muassasa ma’lumotini aniqlang.', result: 'Keyingi harakat va uni bajaruvchi ma’lum bo‘ladi.', route: cases },
      { title: 'Manba konsiliumi va ilovalarni rasmiylashtiring', actor: 'Yo‘llanma beruvchi muassasa', action: 'Yo‘llanma shaklida manba xulosasi, klinik marshrut, ko‘chirma, tekshiruv, PaPaS hujjati va tasdiqlovchi shaxslarni kiriting.', result: 'Markaz qaroridan alohida manba hujjati saqlanadi.', route: cases },
      { title: 'To‘liqlikni tekshirib Markazga o‘tkazing', actor: 'Qabul xodimi', action: '«Yuborishdan oldingi tekshiruv»dagi kamchiliklarni tuzating va «Markaz konsiliumiga yuborish»ni bosing.', result: 'Ish Markaz qarorini kutish bosqichiga o‘tadi; tashqi jo‘natma bajarilmaydi.', route: cases },
      { title: 'Markazning mustaqil qarorini kiriting', actor: 'Markaz konsiliumi', action: 'Qabul, vaqtincha to‘xtatish yoki asosli rad etishni tanlab, sana, tarkib va sababni yozing. To‘xtatishda muassasa va qayta ko‘rish sanasini belgilang.', result: 'Qaror tarixi va unga mos keyingi yo‘l saqlanadi.', route: `${root}/consilium` },
      { title: 'Tasdiqlangan xizmatni tashkil eting', actor: 'Muvofiqlashtiruvchi', action: 'Statsionarda o‘rin, boshlanish va muddatni; mobil yordamda uy bahosi, brigada va boshlanish sanasini tekshirib, epizodni boshlang.', result: 'Tasdiqdan alohida faol yordam epizodi paydo bo‘ladi.', route: `${root}/inpatient` },
      { title: 'Bola va oila uchun individual reja tuzing', actor: 'Shifokor, hamshira, psixolog va ijtimoiy xodim', action: '«Yordam rejasi»da yordam mazmuni, oluvchi, ijrochi va muddatni kiriting; amalda bajarilganda natijani qayd eting.', result: 'Rejalashtirilgan va bajarilgan yordam farqlanadi.', route: cases },
      { title: 'Tashrif va zarur jihozni alohida yuriting', actor: 'Brigada va jihozlar mas’uli', action: 'Mobil jadvalda tashrifni rejalashtirib, boshlang va natijasini yozing. Zarur inventarni shartnoma bilan bering, qaytarishni alohida qayd eting.', result: 'Tashrif bajarilishi va resurs harakati o‘z manbasida saqlanadi.', route: `${root}/mobile` },
      { title: 'Davom ettirish yoki klinik yakunni qayd eting', actor: 'Vakolatli shifokor va konsilium', action: 'Zarur bo‘lsa uzaytirish qarorini, aks holda chiqarish, ko‘chirish yoki vafot sanasi, xulosa va hujjatini kiriting.', result: 'Epizodning muddatlari yoki haqiqiy yakuni yangilanadi.', route: `${root}/inpatient` },
      { title: 'Keyingi mas’ulga topshiring', actor: 'Markaz mutaxassisi va oilaviy shifokor', action: 'Oddiy chiqarish yoki ko‘chirishdan keyin kartada topshirish, qabul qiluvchi shifokor, poliklinika, hujjat va keyingi ko‘rikni yozing.', result: 'Kuzatuvning mas’uli va sanasi alohida tasdiqlanadi.', route: cases },
      { title: 'Oilaviy yordamni alohida davom ettiring va yakunlang', actor: 'Psixolog, ijtimoiy xodim va muvofiqlashtiruvchi', action: 'Vafotdan keyin oilaviy reja va natijalarni muddat ichida yuriting; yakunda ochiq vazifa, tashrif va jihozlarni tekshiring.', result: 'Klinik yakundan mustaqil oilaviy yordam tarixi saqlanadi.', route: cases },
      { title: 'Natijani manba yozuvlari bilan tekshiring', actor: 'Rahbar / monitoring xodimi', action: 'Davriy hisobotda to‘g‘ri davrni tanlang, bola, epizod va tashrif birliklarini ajrating; shubhali satrdan bola kartasiga qayting.', result: 'Hisobot soni bilan amalda bajarilgan xizmatning bog‘lanishi tushunarli bo‘ladi.', route: `${root}/reports` },
    ],
    rules: [
      { tone: 'waiting', condition: 'Manba konsiliumi ijobiy xulosa berdi', action: 'Markaz konsiliumining alohida qarorini kuting; manba xulosasini qabul qarori sifatida ishlatmang.', owner: 'Yo‘llanma beruvchi muassasa va Markaz konsiliumi', basis: 'Yo‘llanma va Markaz qarori modulda alohida yozuvlar.' },
      { tone: 'waiting', condition: 'Qabul tasdiqlangan, faol epizod yo‘q', action: 'O‘rin yoki brigada hamda boshlanish shartlarini tekshirib xizmatni alohida boshlang.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototipda qabul qarori epizodni avtomatik ochmaydi.' },
      { tone: 'waiting', condition: 'PaPaS past yoki yo‘llanma hujjati kam', action: 'Kuzatuv yoki hujjatni to‘ldirishni yuriting; asossiz «rad etildi» holatiga tenglashtirmang.', owner: 'Oilaviy shifokor / qabul xodimi', basis: 'Baholash, hujjat to‘liqligi va qabul qarori turli tekshiruvlar.' },
      { tone: 'waiting', condition: 'Vaqtincha to‘xtatish tanlangan', action: 'Sabab, keyingi muassasa va qayta ko‘rish sanasini yozing; qayta ko‘rishdan keyin yangi qarorni kiriting.', owner: 'Markaz konsiliumi', basis: 'Vaqtincha to‘xtatish yakuniy rad etish emas.' },
      { tone: 'waiting', condition: 'Vazifa yoki tashrif faqat rejalashtirilgan', action: 'Amalda bajarilgach natijasini alohida qayd eting.', owner: 'Yordam ko‘rsatuvchi mutaxassis', basis: 'Reja yozuvi xizmat bajarilganining tasdig‘i emas.' },
      { tone: 'action', condition: 'Klinik epizod chiqarish yoki ko‘chirish bilan yopildi', action: 'Topshirishni alohida kiriting, qabul qiluvchi va keyingi kuzatuv sanasini tekshiring.', owner: 'Markaz va oilaviy shifokor', basis: 'Epizodni yopish topshirish yozuvini yaratmaydi.' },
      { tone: 'action', condition: 'Vafotdan keyin oilaviy yordam ochildi', action: 'Oila uchun vazifa va tashriflarni klinik yordamdan ajratib yuriting, oilaviy yakunni alohida bajaring.', owner: 'Psixolog / ijtimoiy xodim', basis: 'Klinik yakun va oilaviy yakun mustaqil amallar.' },
      { tone: 'waiting', condition: 'Katalogda o‘rin foydalanishga tayyor deb ko‘rsatilgan', action: 'Joylashtirishdan oldin statsionar sahifasida uning bandligini tekshiring.', owner: 'Muvofiqlashtiruvchi', basis: 'Katalog tayyorlikni, statsionar ish oynasi bandlikni ko‘rsatadi.' },
    ],
    faq: [
      { question: 'Bitta ishni qaysi xodim yuritadi?', answer: 'Ishning turli bosqichlarini turli mas’ullar yuritadi. Yagona karta ularning murojaat, klinik xulosa, xizmat va topshirish yozuvlarini birlashtiradi. Keyingi harakatning mas’uli reyestr va karta tavsiyasida ko‘rsatiladi; prototip barcha klinik vakolatlarni alohida xodim akkauntlari bilan tasdiqlamaydi.' },
      { question: 'Nima uchun bolani qabul qilishga ikki marta qaraladi?', answer: 'Manba konsiliumi yo‘llanma va klinik asosni rasmiylashtiradi. Markaz konsiliumi esa Markazga qabul, yordam shakli va tegishli shartlarni mustaqil ko‘rib chiqadi. Shuning uchun hujjatlari va qarorlari alohida saqlanadi.' },
      { question: 'Tasdiqlangan bola nega «Yordam olayotgan bolalar» soniga kirmadi?', answer: 'Tasdiqdan keyin faol statsionar yoki mobil epizod hali ochilmagan bo‘lishi mumkin. Bosh sahifadagi bu ko‘rsatkich faol epizodga tayangan. Bolaning keyingi qadamini va tegishli xizmat oynasini oching.' },
      { question: 'Yordam ko‘rsatilganini nimadan bilamiz?', answer: 'Faol epizod xizmat boshlanganini bildiradi. Qanday yordam bajarilganini individual vazifa natijasi, bajarilgan tashrif yoki boshqa tegishli qayddan tekshiring. Bitta status barcha rejalashtirilgan xizmatlar bajarildi degani emas.' },
      { question: 'Oilaviy maslahatni ikki joyga yozish kerakmi?', answer: 'Yozuv maqsadini ajrating. Kartadagi muloqot qaydi aloqa va keyingi harakatni saqlaydi. Brigada jadvalidagi masofaviy maslahat esa rejalashtirish, boshlash va bajarish bosqichlari bor tashrif yozuvidir. Oddiy muloqot avtomatik hisobot tashrifiga aylanmaydi.' },
      { question: 'Yakunlangan epizoddan keyin bola yana murojaat qilsa nima qilinadi?', answer: 'Mavjud kartani topib, klinik va hujjat shartlariga muvofiq qayta baholash hamda qayta yo‘llanma yo‘lini yuriting. Oldingi epizod va hujjatlar tarixi saqlanadi. Vafotdan keyingi oilaviy yoki yakunlangan ishga yangi klinik xizmat ochish yo‘li sifatida qaramang.' },
      { question: 'Katalogdagi brigada haqiqiy navbatchi brigadami?', answer: 'Yo‘q, katalog prototipdagi demo brigada tarkibi, transport va hududni tushuntiradi. Navbatdagi tashriflar ham shu sessiyadagi jadvaldir; haqiqiy navbatchilik yoki GPS ma’lumotlari ulanmagan.' },
      { question: 'Ishni yakunlash barcha jihozlarni ham qaytaradimi?', answer: 'Yo‘q. Klinik yoki oilaviy yakun xizmat holatiga tegishli. Berilgan jihozlarning faol shartnomasi va qaytarish holatini «Jihoz berish» oynasida alohida tekshirib, qaytarish amalini bajaring.' },
    ],
    checklist: [
      'Bola uchun takror karta yaratilmagan va haqiqiy dastlabki murojaat sanasi saqlangan.',
      'PaPaS va uyda yordam bahosi alohida hujjatlar bilan bog‘langan.',
      'Yo‘llanma beruvchi muassasa xulosasi hamda Markaz qarori alohida ko‘rinadi.',
      'Qabul tasdiqlangandan keyin xizmatni boshlovchi mas’ul, o‘rin yoki brigada belgilangan.',
      'Individual vazifalarda yordam oluvchi, ijrochi, muddat va bajarilgan natija farqlanadi.',
      'Uy tashrifi, masofaviy maslahat va oddiy muloqot qaydi aralashtirilmagan.',
      'Chiqarishdan keyingi topshirish yoki vafotdan keyingi oilaviy reja tekshirilgan.',
      'Klinik yakun, oilaviy yakun va jihoz qaytarish alohida ko‘rib chiqilgan.',
      'Davriy hisobotni o‘qishda sana mezoni va hisob birligi aniqlangan.',
    ],
    fields: [
      { name: 'Bolaning F.I.Sh.', location: 'Yangi bola kartasi / Bola ma’lumotlarini tahrirlash', requirement: 'Majburiy.', meaning: 'Kartada yordam kimga tashkil etilishini ko‘rsatadi; tug‘ilgan sana bilan birga takror ish tekshiruvida ishlatiladi.', example: 'Dilshod Namunaev (sun’iy misol).' },
      { name: 'Poliklinikaga dastlabki murojaat sanasi', location: 'Bola kartasi shakli', requirement: 'Majburiy; kelajakda yoki tug‘ilishdan oldin bo‘lmaydi.', meaning: 'Baholash muddatining boshlang‘ich sanasi; bugun tizimga kiritish sanasidan farq qilishi mumkin.', example: 'Yozma murojaat uch kun oldin berilgan bo‘lsa, shu asl sana.' },
      { name: 'Mas’ul oilaviy shifokor', location: 'Bola kartasi shakli', requirement: 'Majburiy.', meaning: 'Dastlabki ko‘rik va kuzatuv uchun mas’ul shaxsni bildiradi.', example: 'Oilaviy shifokor F.I.Sh. (namuna).' },
      { name: 'Shifokor tasdiqlagan ball', location: 'PaPaS natijasini qayd etish / Uyda yordam ehtiyojini baholash', requirement: 'Majburiy; tanlangan baholash turining tasdiqlangan natijasi.', meaning: 'Ikki mustaqil bahodan qaysi biri qayd etilayotgani shakl sarlavhasi orqali aniqlanadi.', example: 'PaPaS 18 va uy ehtiyoji 23 — ikki alohida yozuv.' },
      { name: 'Tibbiy konsilium xulosasi raqami', location: 'Palliativ yordam uchun yo‘llanma', requirement: 'Manba konsiliumi haqidagi majburiy rekvizit.', meaning: 'Yo‘llanma bergan muassasa xulosasini bildiradi; Markaz qarori raqami bilan almashtirilmaydi.', example: 'DEMO-TK-0042.' },
      { name: 'Konsilium qarori', location: 'Markaz konsiliumi qarori', requirement: 'Qabul qilish, vaqtincha to‘xtatish yoki asosli rad etishdan biri.', meaning: 'Markazning alohida qaror natijasi; qabul tanlanganda ham epizod keyin boshlanadi.', example: 'Vaqtincha to‘xtatish va yo‘naltirish.' },
      { name: 'Qaror asosi', location: 'Markaz konsiliumi qarori', requirement: 'Majburiy.', meaning: 'Tanlangan qarorning vakolatli konsilium bergan izohini saqlaydi.', example: 'Qo‘shimcha yordamdan keyin qayta ko‘rish asosi va hujjatga tayangan izoh.' },
      { name: 'Ko‘rsatiladigan yordam va kutilgan natija', location: 'Individual rejaga vazifa', requirement: 'Majburiy.', meaning: 'Umumiy xizmat nomidan tashqari, bajarilganda nima o‘zgarishi kutilayotganini tushuntiradi.', example: 'Vakilga uy parvarishini tushuntirish va savollariga javob berish.' },
      { name: 'Yordam oluvchi', location: 'Individual rejaga vazifa', requirement: 'Bola yoki oila tanlanadi; oilaviy ishda tegishli cheklovlar ishlaydi.', meaning: 'Vazifa kim uchun ekanini ajratadi.', example: 'Oila — psixologik qo‘llab-quvvatlash.' },
      { name: 'Bajarilgan yordam va natija', location: 'Bajarilgan yordamni qayd etish', requirement: 'Vazifani bajarilgan deb saqlash uchun majburiy.', meaning: 'Reja bajarilishining mazmunli dalili; «bajarildi» degan umumiy belgi bilan cheklanmaydi.', example: 'Vakil bilan uchrashildi, parvarish usuli tushuntirildi, keyingi savollar belgilandi.' },
      { name: 'Qabul qiluvchi oilaviy shifokor', location: 'Oilaviy shifokorga topshirish', requirement: 'Topshirishda majburiy.', meaning: 'Klinik yakundan keyingi kuzatuvni kim qabul qilganini ko‘rsatadi.', example: 'Keyingi kuzatuvni qabul qilgan shifokor F.I.Sh.' },
      { name: 'Keyingi kuzatuv sanasi', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy; topshirishdan oldin bo‘lmaydi.', meaning: 'Keyingi kuzatuv qachon bo‘lishi rejalashtirilganini bildiradi.', example: 'Topshirishdan besh kun keyingi kelishilgan ko‘rik sanasi.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Yo‘llanma saqlandi, ammo Markaz konsiliumida ko‘rinmayapti.', reason: 'Saqlash yo‘llanmani qoralama qiladi; yuborish alohida amal.', solution: '«Baholash va yo‘llanma»da to‘liqlikni tekshirib, «Markaz konsiliumiga yuborish»ni bosing.' },
      { tone: 'waiting', problem: 'Ijobiy manba xulosasi bor, xizmat boshlanmayapti.', reason: 'Markazning alohida qabul qarori yoki boshlash shartlari hali to‘liq emas.', solution: 'So‘nggi Markaz qarorini, so‘ng o‘rin yoki uy bahosi va brigadani tekshiring.' },
      { tone: 'waiting', problem: 'Tasdiqlangan bolaga o‘rin tanlab bo‘lmayapti.', reason: 'O‘rin band yoki foydalanishga tayyor emas bo‘lishi mumkin.', solution: 'Katalogdagi tayyorlikdan tashqari «Statsionar»dagi bandlikni tekshiring; mavjud o‘rinni tanlang.' },
      { tone: 'waiting', problem: 'Mobil xizmatda PaPaS bor, lekin uy bahosi so‘ralmoqda.', reason: 'PaPaS uyda yordam ehtiyoji bahosining o‘rnini bosmaydi.', solution: 'Alohida uy bahosi, hujjati va haftalik tashrif rejasini kiriting.' },
      { tone: 'waiting', problem: 'Klinik xizmat yopildi, topshirilgan shifokor yozuvi yo‘q.', reason: 'Epizodni yopish va oilaviy shifokorga topshirish alohida amallar.', solution: 'Kartadagi «Yordam rejasi → Oilaviy shifokor kuzatuvi»dan topshirishni qayd eting.' },
      { tone: 'rejected', problem: 'Oila ishida yangi klinik baho kiritilmayapti.', reason: 'Vafotdan keyingi oilaviy yordam klinik yordamdan ajratilgan.', solution: 'Oilaviy vazifa, muloqot va tashriflarni yuriting; yangi klinik baho orqali holatni o‘zgartirishga urinmang.' },
      { tone: 'waiting', problem: 'Reja bajarilishi oshmadi, garchi tashrif tugatilgan bo‘lsa ham.', reason: 'Tashrif va individual vazifa mustaqil yozuvlar.', solution: 'Tashrif natijasini tekshiring; ayni reja vazifasi ham amalda bajarilgan bo‘lsa, uning natijasini alohida qayd eting.' },
      { tone: 'action', problem: 'Oldingi oylik hisobotdagi bola bosh sahifa sonida yo‘q.', reason: 'Bosh sahifa joriy faol epizodlarni, davriy hisobot esa tanlangan vaqt oralig‘idagi yordamni hisoblaydi.', solution: 'Bir davr va bir hisob birligini solishtiring; yopilgan tarixiy epizodni kartadan ko‘ring.' },
    ],
    outcomes: [
      'Har bir bola ishi uchun joriy bosqich, keyingi harakat va mas’ul tushunarli bo‘ladi.',
      'Yo‘llanma, ikki konsilium, xizmatni boshlash va bajarish dalillari bir-biridan ajratiladi.',
      'Statsionar, mobil yordam va jihoz ishlari umumiy bola tarixiga bog‘lanadi.',
      'Klinik yakundan keyin topshirish yoki oilaviy yordam e’tibordan chetda qolmaydi.',
      'Hisobot natijasi manba yozuvlari hamda prototip chegaralari bilan birga talqin qilinadi.',
    ],
    relatedTopics: ['intake', 'referral', 'consilium', 'inpatient', 'mobile', 'care-plan', 'equipment', 'follow-up', 'reports', 'demo'],
    flows: [
      {
        id: 'detailed', title: 'Murojaatdan bola va oila yordamining yakunigacha',
        description: 'Asosiy qarorlar, qaytish yo‘llari, xizmatni boshlash va ikki xil yakunni ko‘rsatadigan umumiy jarayon.',
        definition: `flowchart TD
  A["Murojaat yoki ehtiyoj aniqlandi"] --> B{"Bola kartasi mavjudmi?"}
  B -->|Ha| C["Mavjud karta va tarixni ochish"]
  B -->|Yo‘q| D["Bola, vakil, sana va mas’ulni kiritish"]
  C --> E["Shifokor ko‘rigi va PaPaS natijasi"]
  D --> E
  E --> F{"Yo‘llash uchun baho va tibbiy asos bormi?"}
  F -->|Yo‘q| G["Poliklinika kuzatuvi va reja"]
  G -->|Qayta baholash zarur| E
  F -->|Ha| H["Manba muassasa konsiliumi xulosasi"]
  H --> I["Yo‘llanma, ilovalar va tasdiqlarni tayyorlash"]
  I --> J{"Yo‘llanma to‘liqmi?"}
  J -->|Yo‘q| I
  J -->|Ha| K["Markaz konsiliumiga o‘tkazish"]
  K --> L{"Markazning alohida qarori"}
  L -->|Vaqtincha to‘xtatish| M["Boshqa yordam, muassasa va qayta ko‘rish sanasi"]
  M -->|Qayta ko‘rish| K
  L -->|Rad etish| N["Asos va keyingi yordamni qayd etish"]
  N -->|Qayta yollashga asos paydo bo‘lsa| E
  L -->|Qabul| O["Qabul tasdiqlangan, xizmat hali boshlanmagan"]
  O --> P{"Yordam shakli"}
  P -->|Statsionar| Q["Bo‘sh o‘rin, muddat va hamrohni tekshirish"]
  P -->|Mobil| R["Uy bahosi, rozilik va brigadani tekshirish"]
  Q --> S{"Boshlash shartlari tayyormi?"}
  R --> S
  S -->|Yo‘q| O
  S -->|Ha| T["Xizmat epizodini boshlash"]
  T --> U["Individual reja, tashriflar va zarur jihoz"]
  U --> V["Bajarilgan yordam natijalarini qayd etish"]
  V --> W{"Davom ettirish yoki yakun?"}
  W -->|Davom ettirish| X["Zarur qaror va yangilangan reja"]
  X --> U
  W -->|Klinik yakun| Y{"Yakun sababi"}
  Y -->|Chiqarish yoki ko‘chirish| Z["Epizodni yopish va hujjatni saqlash"]
  Z --> AA["Oilaviy shifokorga alohida topshirish"]
  AA --> AB["Keyingi kuzatuv"]
  AB -->|Qayta ehtiyoj| E
  Y -->|Vafot| AC["Klinik yakun va tegishli hujjatlar"]
  AC --> AD["Oilaga alohida reja va yordam natijalari"]
  AD --> AE["Oilaviy yordamni alohida yakunlash"]
  AE --> AF["Ochiq rejalar va jihoz qaytarishni tekshirish"]
  class A,C,D,E,H,I,K,T,U,Z,AA,AC,AD,AE,AF guide_action;
  class O,V guide_success;
  class N guide_rejected;
  class B,F,G,J,L,M,P,Q,R,S,W,X,Y,AB guide_waiting;`,
        walkthrough: [
          'Mavjud kartani ochish va yangi karta yaratish bir xil baholash yo‘liga keladi. Qayta murojaatda tarixni saqlash uchun mavjud kartadan boshlanadi.',
          'Baho va tibbiy asos bo‘lmasa kuzatuv yo‘li qoladi; yangi ehtiyoj yoki mutaxassis qaroridan keyin qayta baholashga qaytiladi. Sxema tashxisni yoki ballni avtomatik belgilamaydi.',
          'Manba konsiliumi xulosasi yo‘llanmaning tarkibiy qismi. Markaz konsiliumi undan keyin alohida qaror beradi. Hujjat kamchiligi qaror natijasi emas, to‘ldirishga qaytish yo‘lidir.',
          'Vaqtincha to‘xtatish qayta ko‘rish nuqtasiga ega; asosli rad etishning sababi va keyingi yordam yoziladi. Qayta yo‘llash zarurati faqat yangi klinik va hujjat asoslari bilan ko‘rib chiqiladi.',
          'Qabul tasdiqidan keyin o‘rin yoki mobil shartlar tayyor bo‘lmaguncha xizmat boshlanmagan hisoblanadi. Epizod boshlangach reja va amalda bajarilgan natijalar alohida yuritiladi.',
          'Chiqarish va ko‘chirish topshirish hamda kuzatuvga olib boradi. Vafot klinik epizodni yopadi, oilaviy yordam esa mustaqil reja va mustaqil yakun bilan davom etadi. Jihoz qaytarish alohida tekshiriladi.',
        ],
      },
      {
        id: 'handoffs', title: 'Mas’uliyat va hujjatning bir bosqichdan boshqasiga o‘tishi',
        description: 'Har bir topshirishda qaysi ma’lumot keyingi xodimga kerakligi va qaysi qayd hali xizmat dalili emasligi.',
        definition: `flowchart TD
  A["Operator: bola va vakil kartasi"] --> B["Oilaviy shifokor: ko‘rik va tasdiqlangan PaPaS"]
  B --> C{"Yo‘llash yoki kuzatuv?"}
  C -->|Kuzatuv| D["Shifokor: reja, muddat va qayta baholash"]
  D --> B
  C -->|Yo‘llash| E["Manba konsiliumi: xulosa va yo‘llanma"]
  E --> F["Qabul xodimi: ilovalar va tasdiqlar tekshiruvi"]
  F --> G{"Ma’lumot yetarlimi?"}
  G -->|Yo‘q| E
  G -->|Ha| H["Markaz konsiliumi: mustaqil qaror"]
  H --> I{"Qabul tasdiqlandimi?"}
  I -->|Yo‘q| J["Qaror asosi, keyingi muassasa yoki muloqot"]
  J -->|Zarur qayta ko‘rish| H
  I -->|Ha| K["Muvofiqlashtiruvchi: o‘rin yoki brigada va boshlash"]
  K --> L["Mutaxassis: yordam rejasi va natija"]
  L --> M["Jihozlar mas’uli: shartnoma va harakat"]
  L --> N["Shifokor: klinik yakun hujjati"]
  N --> O{"Bola kuzatuvimi yoki oilaviy yordammi?"}
  O -->|Bola| P["Qabul qiluvchi shifokor va topshirish hujjati"]
  P --> Q["Keyingi ko‘rik va kuzatuv"]
  O -->|Oila| R["Psixolog va ijtimoiy xodim: alohida reja"]
  R --> S["Mas’ul: oilaviy yakun va ochiq ishlar"]
  Q --> T["Rahbar: manba yozuvlari bilan natijani tekshirish"]
  S --> T
  M --> T
  class A,E,K,L,M,N,P,R,S,T guide_action;
  class B guide_success;
  class C,D,F,G,H,I,J,O,Q guide_waiting;`,
        walkthrough: [
          'Operator va shifokor bir xil ishga turli ma’lumot qo‘shadi: shaxs rekviziti klinik bahoning o‘rnini bosmaydi.',
          'Manba konsiliumidan keyin qabul xodimi to‘liqlikni tekshiradi. Yetishmagan ilova muassasaga qaytadi, Markaz qarori sifatida saqlanmaydi.',
          'Markazning ijobiy qarori muvofiqlashtiruvchiga xizmatni tashkil etish vazifasini beradi. Boshlash va bajarilgan yordamni qayd etish yana ikki alohida mas’uliyatdir.',
          'Jihozlar mas’uli xizmatga parallel ishlaydi. Uning shartnoma va qaytarish yozuvlari klinik xulosa bilan almashtirilmaydi.',
          'Klinik yakundan so‘ng qabul qiluvchi oilaviy shifokor yoki oilaga yordam ko‘rsatuvchi mutaxassis aniq bo‘lishi kerak. Rahbar shu manba yozuvlari orqali natijani tekshiradi.',
        ],
      },
    ],
  },
  reports: {
    prerequisites: [
      'Tekshiriladigan davr va savol aniq: yordam olgan bolalar, yangi epizodlar, bajarilgan tashriflar yoki qaydlar ro‘yxati.',
      'Manba yozuvlari shu ochiq demo sessiyasida mavjud; sahifani yangilash bilan sinov ma’lumotlari tiklanishi inobatga olingan.',
      'Bola kartasi, xizmat epizodi va tashrif turli hisob birliklari ekani tushunilgan.',
      'Oilaga ko‘rsatilgan xizmat bolaning klinik xizmati bilan tenglashtirilmaydi.',
      'CSV lokal fayl ekanligi va hisobot rasmiy tashkilotga yuborilmasligi ma’lum.',
    ],
    sections: [
      { title: 'Davrni tanlash va qamrov', paragraphs: [
        '«Davriy hisobot → Hisobot davri»da «Oylik», «Choraklik» yoki «Yillik» tanlanadi. Oylikda oy, choraklikda yil va chorak, yillikda yil kiritiladi. O‘ng tomondagi boshlanish va yakun sanalari hisobning haqiqiy chegarasini ko‘rsatadi; ikkala chegara kuni ham qamrab olinadi.',
        'Sahifada alohida viloyat filtri yo‘q. «Hududlar bo‘yicha natijalar» barcha to‘rtta viloyatning satrlarini bir xil davrda ko‘rsatadi. Bolalar reyestridagi viloyat tanlovi hisobotning filtri sifatida qo‘llanmaydi.',
        'Ko‘rsatkichlar manbadan qayta hisoblanadi. Hisobotga kirib turganingiz yoki CSV yuklaganingiz biror xizmatni bajarilgan, yo‘llanmani yuborilgan yoki ishni yopilgan qilmaydi.',
      ] },
      { title: 'Yordam olgan bolalar: takrorlanmaydigan ishlar', paragraphs: [
        '«Yordam olgan bolalar» tanlangan davr bilan kamida bir kuni kesishadigan klinik xizmat epizodi bor kartalarni oladi. Avvalgi oyda boshlangan, lekin hisobot oyida ham davom etgan epizoddagi bola shu davrda hisoblanadi. Faol epizod uchun kesishish bugungi sanagacha olinadi.',
        'Bundan tashqari, davr ichida bajarilgan va oluvchisi bola bo‘lgan tashriflari bor kartalar kiritiladi. Bir kartada bir necha epizod va tashrif bo‘lsa ham bu ko‘rsatkichda bir marta sanaladi. Bu shaxs reyestri orqali tasdiqlangan noyob insonlar soni emas, prototipdagi takrorlanmaydigan bola ishlari sonidir.',
        'Faqat oila uchun bajarilgan tashrif bola soniga qo‘shilmaydi. Agar shu kartaning klinik epizodi ham davr bilan kesishgan bo‘lsa, bola klinik epizodi uchun, oila esa o‘ziga bajarilgan xizmat uchun alohida ustunlarda ko‘rinishi mumkin. Bu ikki sonni bitta oluvchilar jami sifatida qo‘shish to‘g‘ri emas.',
      ] },
      { title: 'Boshlangan epizodlar va bajarilgan tashriflar', paragraphs: [
        '«Boshlangan epizodlar» faqat boshlanish sanasi davr ichiga tushgan epizodlarni sanaydi. Shu sabab xizmat olayotgan bola bor, lekin yangi epizod soni nol bo‘lishi mumkin: xizmat oldingi davrda boshlangan. Bir bolaga turli vaqtda bir necha epizod ochilsa epizodlar ko‘payadi, bola soni esa takrorlanmaydi.',
        '«Bajarilgan uyga tashriflar» va «Masofaviy maslahatlar» faqat bajarilgan tashrif yozuvlarini oladi. Asosiy sana — bajarilgan vaqt; eski yozuvda u bo‘lmasa rejalashtirilgan vaqt qo‘llanadi. Rejalashtirilgan, jarayondagi va bekor qilingan tashriflar bu bajarilish sonlariga kirmaydi.',
        'Uyga tashrif va masofaviy maslahat jami bola hamda oilaga xizmatlarni o‘z ichiga oladi. Ular xizmat turi bo‘yicha ajratiladi. «Hududlar bo‘yicha natijalar»dagi «Yordam olgan oilalar» esa davrda bajarilgan oilaviy tashriflar mavjud bo‘lgan bola ishlari sonini takrorlamay sanaydi; bitta oila a’zolarini alohida odamlar sifatida sanamaydi.',
      ] },
      { title: 'Davrdagi qaydlar boshqa sana mezoni bilan tuziladi', paragraphs: [
        '«Davrdagi qaydlar»da yuborilgan yo‘llanma o‘z hujjat sanasi, epizod o‘z boshlanish sanasi, tashrif rejalashtirilgan sana va vaqti, jihoz berish esa berilgan sana bilan tanlanadi. Ro‘yxat eng yangi qayddan boshlab joylashadi. Qaydning hozirgi holati ko‘rsatiladi; bu davr oxiridagi muzlatilgan holat emas.',
        'Masalan, tashrif 31-avgustga rejalashtirilib 1-sentyabrda bajarilgan bo‘lsa, avgust qaydlari va CSVida rejalashtirilgan sana sabab ko‘rinadi. Bajarilgan tashrif ko‘rsatkichi esa sentyabrda oshadi. Avgust ro‘yxatida uning holati hozir «Bajarilgan» bo‘lib turishi mumkin. Bu xato yig‘indi emas, sana mezonlarining farqidir.',
        'Yana bir misol: klinik epizod avgustda boshlanib sentyabrda davom etsa, bola sentyabr oluvchilari soniga kiradi, ammo sentyabrning yangi epizodi yoki epizod boshlanish qaydi sifatida ko‘rinmaydi. Shu sabab yuqoridagi kartochkalar sonini «Davrdagi qaydlar» satrlari bilan tenglashtirmang.',
      ] },
      { title: 'Qaysi manbalar kiradi va qaysilari kirmaydi?', paragraphs: [
        'Yo‘llanmalarda joriy yozuv va tarixdagi yuborilgan nusxalar hisobga olinadi; aynan bir yozuv identifikatori takror bo‘lsa bir marta olinadi. Qoralama yo‘llanma ro‘yxatga kirmaydi. Bir kartada qayta rasmiylashtirilgan alohida yo‘llanmalar mavjud bo‘lsa ular alohida qayd bo‘lishi mumkin.',
        'Epizodlar faol yoki yakunlangan bo‘lishidan qat’i nazar boshlanish sanasi bilan kiradi. Tashriflarning barcha holatlari rejalashtirilgan sana bilan kiradi. Jihozning har bir berish yozuvi berilgan sana bilan kiradi va hozir qaytarilgan bo‘lsa «Qaytarilgan» holatini ko‘rsatadi. Alohida qaytarish sanasi bo‘yicha yana bir qayd yaratilmaydi; qaytarish tafsiloti jihoz oynasidagi tarixdan ko‘riladi.',
        'Individual reja vazifalari, oddiy muloqotlar, PaPaS va uy baholari, konsilium qarorlari, topshirish yozuvlari bu CSVga alohida satr sifatida kirmaydi. Ularni bola kartasidagi tegishli bo‘lim va «Jarayon tarixi»dan tekshiring. Bosh sahifadagi «Individual reja bajarilishi» boshqa hisob: bekor qilingan vazifalarni chiqarib, mavjud vazifalarning bajarilgan ulushini ko‘rsatadi; hisobot davri bilan filtrlab berilmaydi.',
      ] },
      { title: 'CSVni olish va qayta tekshirish', paragraphs: [
        '«CSV yuklash» ayni paytda tanlangan davrning «Davrdagi qaydlar» ro‘yxatini faylga aylantiradi. Ustunlar: «Sana», «Amal», «Raqam», «Bola», «Hudud», «Holat», «Tafsilot». Bu yuqoridagi ko‘rsatkichlar yoki hududlar yig‘indisi fayli emas. Tafsilotda yozuv turiga qarab muassasa, o‘rin, brigada, tashrif maqsadi yoki jihoz va shartnoma ko‘rinadi.',
        'Ro‘yxat bo‘sh bo‘lsa CSV tugmasi faol emas. Fayl yaratilgach odatiy yuklash boshlanadi; boshlanmasa «Tayyor CSV faylni yuklab olish» havolasi ishlaydi. Fayl nomida hisob oralig‘i yoziladi.',
        'Davrni o‘zgartirganingizdan yoki manba yozuvga yangi amal qilganingizdan keyin CSVni qayta yarating. Avval yaratilgan fayl yoki pastdagi havola o‘z-o‘zidan yangi tarkibga aylanmaydi. CSVni ochish, saqlash yoki ko‘rib chiqish tashqi tashkilotga jo‘natishni anglatmaydi.',
      ] },
      { title: 'Raqamlarni boshqaruv savoliga aylantirish', paragraphs: [
        'Bola ko‘p, yangi epizod kam bo‘lsa — oldindan davom etayotgan xizmatlar borligini tekshiring. Rejalashtirilgan tashriflar ko‘p, bajarilganlar kam bo‘lsa — sana hali kelmaganmi, tashrif jarayondami yoki bekor qilinganmi, shuni mobil jadvaldan ko‘ring. Oila soni bilan uy tashrifi soni teng bo‘lmasligi tabiiy: bir oilaga bir necha tashrif yoki masofaviy maslahat bo‘lishi mumkin.',
        'Shubhali qayd satridagi bola nomi kartani ochadi. «Umumiy ma’lumot», «Baholash va yo‘llanma», «Yordam rejasi» va «Jarayon tarixi»ni mos manba bilan solishtiring. Hisobot jadvali ichida xizmat natijasini tahrirlash amali yo‘q; ma’lumot tegishli ish oynasida yaratiladi.',
        'Buyruqdagi davriy hisobot talabi ushbu prototipning barcha formulalari tasdiqlangan rasmiy shakl ekanini bildirmaydi. Xizmat sifati, klinik natija va oilaning qoniqishini faqat satr sonidan chiqarib bo‘lmaydi. Ushbu hisoblash qoidalari amaldagi frontend talqini sifatida ko‘rsatilmoqda.',
      ] },
    ],
    steps: [
      { title: 'Hisobot savolini belgilang', actor: 'Rahbar / monitoring xodimi', action: 'Qaysi davr, qaysi hisob birligi va qaysi holatni tekshirmoqchi ekaningizni aniqlang.', result: 'Bola, epizod, tashrif yoki qaydlar bo‘yicha aniq savol paydo bo‘ladi.', route: `${root}/reports` },
      { title: 'Davriy hisobotni oching', actor: 'Monitoring xodimi', action: 'Yon menyudagi «Hisobotlar → Davriy hisobot»ga o‘ting.', result: 'Davr tanlovi, ko‘rsatkichlar, hududlar va qaydlar bir sahifada ochiladi.', route: `${root}/reports` },
      { title: 'Davr turini tanlang', actor: 'Monitoring xodimi', action: '«Oylik», «Choraklik» yoki «Yillik»ni bosing.', result: 'Tegishli oy yoki yil va chorak maydonlari ko‘rinadi.', route: `${root}/reports` },
      { title: 'Davr qiymatini va chegarani tekshiring', actor: 'Monitoring xodimi', action: 'Oy, yil va kerak bo‘lsa chorakni belgilang; yonidagi boshlanish va yakun sanalarini o‘qing.', result: 'Hisobga qaysi kalendar kunlari kirishi tasdiqlanadi.', route: `${root}/reports` },
      { title: 'Takrorlanmaydigan bola sonini o‘qing', actor: 'Rahbar', action: '«Yordam olgan bolalar»ni davr bilan kesishgan klinik epizodlar va bolaga bajarilgan tashriflar orqali talqin qiling.', result: 'Davom etayotgan xizmatdagi bolalar yangi epizodlardan ajratiladi.', route: `${root}/reports` },
      { title: 'Yangi epizodlarni alohida solishtiring', actor: 'Monitoring xodimi', action: '«Boshlangan epizodlar»ning boshlanish sanasiga qarashini inobatga oling; bitta bola bir necha marta qatnashishi mumkin.', result: 'Bola va epizod sonlari noto‘g‘ri tenglashtirilmaydi.', route: `${root}/reports` },
      { title: 'Bajarilgan xizmat turlarini ajrating', actor: 'Muvofiqlashtiruvchi', action: 'Uyga tashrif va masofaviy maslahat sonlarini o‘qing; reja yoki bekor qilingan tashriflarni bajarilgan natijaga qo‘shmang.', result: 'Bajarilgan xizmat hajmi aniqlanadi.', route: `${root}/reports` },
      { title: 'Oilalarni hudud satrlaridan ko‘ring', actor: 'Rahbar', action: '«Hududlar bo‘yicha natijalar»da «Yordam olgan oilalar»ni alohida o‘qing; tashrif ustunlari bola va oilani qamrab olishini esda tuting.', result: 'Oilaviy va klinik yordam o‘z birliklarida tushuniladi.', route: `${root}/reports` },
      { title: 'Qaydlar sanasi va joriy holatini tekshiring', actor: 'Monitoring xodimi', action: '«Davrdagi qaydlar»da yo‘llanma sanasi, epizod boshlanishi, tashrif rejalashtirilishi yoki jihoz berilgan sanaga e’tibor bering.', result: 'Qaydlar soni va bajarilgan tashrif ko‘rsatkichi o‘rtasidagi farq izohlanadi.', route: `${root}/reports` },
      { title: 'Farqni manba kartada tekshiring', actor: 'Tegishli mas’ul xodim', action: 'Qayd satridagi bola nomini ochib, kerakli hujjat, epizod, reja yoki tarixni ko‘ring; tashrif bo‘lsa mobil jadvalga o‘ting.', result: 'Raqamning manbasi topiladi.', route: cases },
      { title: 'Joriy davr CSVini yarating', actor: 'Monitoring xodimi', action: 'Hisobotga qaytib davrni yana tekshiring va «CSV yuklash»ni bosing. Yuklash boshlanmasa tayyor fayl havolasidan foydalaning.', result: 'Filtrlangan qaydlarning lokal CSV fayli olinadi.', route: `${root}/reports` },
      { title: 'Fayl tarkibi va xulosani tekshiring', actor: 'Rahbar / monitoring xodimi', action: 'Fayl nomidagi davr, satr soni va ustunlarni tekshiring. Manba yoki davr o‘zgarsa yangi CSV yarating, rasmiy jo‘natma sifatida belgilamang.', result: 'Qayta tekshiriladigan demo natija va chegaralari aniq bo‘ladi.', route: `${root}/reports` },
    ],
    rules: [
      { tone: 'action', condition: 'Epizod oldingi davrda boshlanib hisobot davrida davom etgan', action: 'Bolani yordam oluvchilar tarkibida, epizodni esa yangi boshlanganlar tarkibidan tashqarida talqin qiling.', owner: 'Monitoring xodimi', basis: 'Bola uchun davr kesishishi, yangi epizod uchun boshlanish sanasi qo‘llanadi.' },
      { tone: 'action', condition: 'Bir kartada bir necha epizod yoki tashrif bor', action: 'Bola sonini bir marta, epizod va tashriflarni tegishli yozuvlar sonida o‘qing.', owner: 'Monitoring xodimi', basis: 'Hisob birliklari bir-biridan farq qiladi.' },
      { tone: 'action', condition: 'Tashrif rejalashtirilgan oy bilan bajarilgan oy farq qiladi', action: 'CSV va qaydlarni rejalashtirilgan oyda, bajarilgan ko‘rsatkichni bajarilgan oyda tekshiring.', owner: 'Muvofiqlashtiruvchi / monitoring xodimi', basis: 'Amaldagi frontendda qaydlar va bajarilish ko‘rsatkichlari turli sana maydonidan foydalanadi.' },
      { tone: 'action', condition: 'Tashrif oluvchisi oila', action: 'Oilalar sonida alohida hisoblang; uyga tashrif yoki masofaviy maslahat jami ichida ham uning turi bo‘yicha borligini inobatga oling.', owner: 'Monitoring xodimi', basis: 'Oilaviy tashrif klinik bola oluvchilari to‘plamiga qo‘shilmaydi.' },
      { tone: 'action', condition: 'Tashrif bekor qilingan yoki jarayonda', action: 'Uni bajarilgan xizmat soniga qo‘shmang; rejalashtirilgan sanasi mos bo‘lsa qaydlar ro‘yxatida ko‘rish mumkin.', owner: 'Muvofiqlashtiruvchi', basis: 'Bajarilish ko‘rsatkichlari faqat bajarilgan tashriflarni oladi.' },
      { tone: 'action', condition: 'Jihoz boshqa davrda qaytarildi', action: 'Berish yozuvini berilgan davrda, qaytarish tafsilotini jihozlar tarixida tekshiring.', owner: 'Jihozlar mas’uli / monitoring xodimi', basis: 'CSVda qaytarish alohida sana satri sifatida yaratilmaydi.' },
      { tone: 'success', condition: 'Individual yordam vazifasi bajarildi', action: 'Natijani karta rejasi va tarixidan tekshiring; uni avtomatik CSV yoki tashrif satri deb kutmang.', owner: 'Yordam ko‘rsatuvchi mutaxassis', basis: 'Ushbu hisobot satrlari individual vazifalarni qamrab olmaydi.' },
      { tone: 'waiting', condition: 'Davr yoki yozuvlar CSV yaratilgandan keyin o‘zgardi', action: '«CSV yuklash»ni qayta bosing va yangi faylni tekshiring.', owner: 'CSVni oluvchi xodim', basis: 'Yaratilgan CSV o‘sha paytdagi ro‘yxat nusxasi.' },
      { tone: 'action', condition: 'Oldingi davr satrida hozirgi holat ko‘rinmoqda', action: 'Holatni davr oxiridagi tarixiy surat deb talqin qilmang; haqiqiy o‘zgarish vaqtini manba tarixidan aniqlang.', owner: 'Monitoring xodimi', basis: 'Qaydlar jadvali joriy holatni ko‘rsatadi.' },
    ],
    faq: [
      { question: 'Nega yordam olgan bolalar bor, boshlangan epizodlar esa nol?', answer: 'Davrda davom etgan xizmat oldingi oy yoki yilda boshlangan bo‘lishi mumkin. Bola epizodning davr bilan kesishishi orqali hisobga olinadi; «Boshlangan epizodlar» esa faqat boshlanish sanasi davr ichida bo‘lsa oshadi.' },
      { question: 'Nega bajarilgan tashrif soni CSVdagi bajarilgan satrlar soniga teng emas?', answer: 'Ko‘rsatkich bajarilgan sanadan, CSV tashrif rejalashtirilgan sanasidan foydalanadi. Bir tashrif ikki oy chegarasidan o‘tgan bo‘lsa farq paydo bo‘ladi. CSV yana yo‘llanma, epizod va jihoz berish kabi boshqa qaydlarni ham oladi.' },
      { question: 'Bitta bolaning bir necha xizmati hisobotni ko‘paytiradimi?', answer: 'Epizod va tashrif soni ko‘payishi mumkin, lekin «Yordam olgan bolalar»da bir karta bir marta sanaladi. Kartalar shaxs reyestri orqali tashqi tekshirilmagani sabab bu prototipdagi noyob ishlar sonidir.' },
      { question: 'Uyga tashriflar faqat bolaga bajarilgan xizmatmi?', answer: 'Yo‘q. Uyga tashrif jami bola va oilaga bajarilgan uy tashriflarini qamrab oladi. Oilaga tegishli qaydlar ro‘yxatda «Oilaga yordam» bilan ajratiladi, yordam olgan oilalar esa hudud jadvalida alohida sanaladi.' },
      { question: 'Telefon muloqotini yozdim, nega maslahat soni oshmadi?', answer: 'Kartadagi muloqot qaydi tashrif yozuvi emas. Hisobotdagi masofaviy maslahat soni mobil jadvalda masofaviy maslahat sifatida rejalashtirilib, boshlanib, bajarilgan yozuvlardan olinadi.' },
      { question: 'CSVdan hududlar bo‘yicha yakuniy yig‘indini olamanmi?', answer: 'CSV «Davrdagi qaydlar» ro‘yxatini beradi. Hududlar yig‘indisi va yuqori kartochkalar alohida satrlar sifatida eksport qilinmaydi. CSV ustunidagi hudud orqali manba qaydlarni ko‘rish mumkin, ammo ulardan ko‘rsatkichni qayta yig‘ishda har bir birlikning sana qoidasi kerak.' },
      { question: 'O‘tgan oyda berilgan jihoz bugun qaytarilsa qaysi oyda ko‘rinadi?', answer: 'Berish sanasi bo‘yicha o‘tgan oy qaydida ko‘rinadi va joriy holati «Qaytarilgan» bo‘ladi. Bugungi qaytarish uchun alohida CSV satri yaratilmaydi; qaytarish sana va izohini «Jihoz berish» tarixidan tekshiring.' },
      { question: 'Hisobotdan tashkilotga yuborish yoki tasdiqlash mumkinmi?', answer: 'Hozirgi prototip faqat sahifada hisoblash va lokal CSV yuklashni bajaradi. Tashqi tashkilotga yuborish, elektron imzo, rasmiy tasdiqlash yoki jonli integratsiyali eksport mavjud emas.' },
      { question: 'Nega hisobotdan bola kartasiga qaytib kelganda davrni yana tekshirish kerak?', answer: 'Sahifa qayta ochilganda standart davr joriy oy bo‘lishi mumkin. Xulosa chiqarish yoki CSV olishdan oldin «Hisobot davri» va ko‘rinib turgan sana oralig‘ini har safar tekshirish kerak.' },
    ],
    checklist: [
      'Davr turi, qiymati va ekrandagi boshlanish/yakun sanalari to‘g‘ri.',
      'Yordam olgan bola, yangi epizod, uy tashrifi va masofaviy maslahat alohida hisob birligi sifatida o‘qildi.',
      'Oldingi davrdan davom etgan epizodlar bolalar soniga ta’siri tushuntirildi.',
      'Oilalar alohida sanaldi; uy/masofaviy jami oilaviy xizmatni ham qamrab olishi hisobga olindi.',
      'Tashrifning rejalashtirish va bajarilish sanalari o‘rtasidagi farq tekshirildi.',
      'Qaydlar jadvalidagi holat joriy holat ekani inobatga olindi.',
      'Individual vazifalar, muloqotlar va topshirishlar CSVdan tashqarida ekanligi ma’lum.',
      'CSV ayni davr va manba holati uchun qayta yaratildi; fayl nomi va satr soni solishtirildi.',
      'Natija rasmiy yuborilgan hisobot yoki klinik sifatning avtomatik bahosi sifatida taqdim etilmadi.',
    ],
    fields: [
      { name: 'Oylik / Choraklik / Yillik', location: 'Davriy hisobot → Hisobot davri', requirement: 'Davr turlaridan biri tanlanadi.', meaning: 'Oy, uch oy yoki kalendar yil chegaralarini belgilaydi.', example: 'Choraklik tanlanganda yil va chorak kiritiladi.' },
      { name: 'Hisobot oyi', location: 'Oylik davr tanlangandagi oy maydoni', requirement: 'Oylik uchun haqiqiy yil-oy qiymati.', meaning: 'O‘sha oyning birinchi kunidan oxirgi kunigacha hisoblanadi.', example: '2026-yil sentyabr: 01.09–30.09.' },
      { name: 'Hisobot yili', location: 'Choraklik yoki yillik davrdagi son maydoni', requirement: 'Yil kiritiladi; interfeysda 2026–2100 oralig‘i ko‘rsatilgan.', meaning: 'Chorak yoki yilning qaysi kalendar yilga tegishli ekanini aniqlaydi.', example: '2026.' },
      { name: 'Hisobot choragi', location: 'Choraklik davrdagi tanlov', requirement: '1-, 2-, 3- yoki 4-chorak.', meaning: 'Tanlangan yilning tegishli uch oyini qamrab oladi.', example: '3-chorak: iyul, avgust, sentyabr.' },
      { name: 'Yordam olgan bolalar', location: 'Yuqori ko‘rsatkich va hududlar jadvali', requirement: 'Avtomatik, o‘qish uchun.', meaning: 'Davr bilan kesishgan klinik epizod yoki bolaga bajarilgan tashrifga ega takrorlanmaydigan bola ishlari.', example: 'Bir bolada ikki epizod va uch tashrif bo‘lsa, bola soni bir.' },
      { name: 'Boshlangan epizodlar', location: 'Yuqori ko‘rsatkich; jadvalda Yangi epizodlar', requirement: 'Avtomatik, o‘qish uchun.', meaning: 'Boshlanish sanasi tanlangan davrda bo‘lgan klinik xizmat epizodlari.', example: 'Avgustda boshlangan xizmat sentyabrning yangi epizodi emas.' },
      { name: 'Bajarilgan uyga tashriflar', location: 'Yuqori ko‘rsatkich; jadvalda Uyga tashriflar', requirement: 'Faqat bajarilgan uy tashriflari.', meaning: 'Bajarilgan sana bo‘yicha olinadi; bola va oilaga xizmatlarni qamrab oladi.', example: 'Bir oilaga ikki bajarilgan uy tashrifi — ikki tashrif.' },
      { name: 'Masofaviy maslahatlar', location: 'Yuqori ko‘rsatkich va hududlar jadvali', requirement: 'Faqat bajarilgan masofaviy tashrif yozuvlari.', meaning: 'Uyga tashrifdan ajratilgan xizmat turi; oddiy muloqot qaydi avtomatik kirmaydi.', example: 'Mobil jadvalda bajarilgan masofaviy maslahat — bir maslahat.' },
      { name: 'Yordam olgan oilalar', location: 'Hududlar bo‘yicha natijalar', requirement: 'Avtomatik, o‘qish uchun.', meaning: 'Davrda oila uchun bajarilgan tashrifi bor takrorlanmaydigan bola ishlari; oila a’zolari soni emas.', example: 'Bir karta oilasiga uch xizmat — bir oila ishi.' },
      { name: 'Sana', location: 'Davrdagi qaydlar va CSV', requirement: 'Manba yozuvdan olinadi.', meaning: 'Yo‘llanma hujjati, epizod boshlanishi, tashrif rejasi yoki jihoz berilgan sanasi.', example: 'Tashrifda rejalashtirilgan sana; bajarilgan sana bilan farq qilishi mumkin.' },
      { name: 'Amal / raqam', location: 'Davrdagi qaydlar; CSVda Amal va Raqam alohida ustunlar', requirement: 'Avtomatik.', meaning: 'Yozuv turini va undagi raqamni ajratadi; barcha raqamlar noyob epizod yoki tashrif raqami emas.', example: 'Yo‘llanmada hujjat raqami; epizod va tashrifda bola karta raqami; jihozda inventar raqami.' },
      { name: 'Bola / oila ishi', location: 'Davrdagi qaydlar', requirement: 'O‘qish va kartani ochish uchun.', meaning: 'Qayd bog‘langan ish; bola nomini bosish manba kartani ochadi.', example: 'Oilaviy tashrif ham tegishli bola ishi orqali ochiladi.' },
      { name: 'Holat', location: 'Davrdagi qaydlar va CSV', requirement: 'Manbaning joriy holati.', meaning: 'Davr oxiridagi tarixiy holat emas; keyinchalik bajarilgan yoki qaytarilgan yozuv yangilangan holatda ko‘rinadi.', example: 'Avgust berish qaydi hozir Qaytarilgan bo‘lishi mumkin.' },
      { name: 'Tafsilot', location: 'CSV ustuni', requirement: 'Manbadan olinadigan izoh.', meaning: 'Yozuvga qarab muassasa, o‘rin, brigada va maqsad yoki jihoz va shartnoma.', example: '1-mobil brigada · uy parvarishi bo‘yicha maslahat.' },
      { name: 'CSV yuklash', location: 'Hisobot davri sarlavhasi yonidagi tugma', requirement: 'Kamida bitta davr qaydi bo‘lishi kerak.', meaning: 'Joriy qaydlar nusxasini faylga yaratadi; qayta yaratmaguncha oldingi fayl yangilanmaydi.', example: 'palliativ-hisobot-2026-09-01-2026-09-30.csv.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Tanlangan davrda qayd yo‘q.', reason: 'Yozuvlarning tegishli sanalari boshqa davrda yoki faqat bu hisobotga kirmaydigan vazifalar yaratilgan.', solution: 'Oy/chorak/yilni tekshiring; tarixiy xizmatlar uchun kengroq davrni tanlang. Vazifalarni bola kartasidan ko‘ring.' },
      { tone: 'waiting', problem: 'Bolalar soni CSVdagi bola nomlari soniga teng emas.', reason: 'CSV hodisalar ro‘yxati; bolalar ko‘rsatkichi esa epizod kesishishi va bajarilgan klinik tashriflardan tuziladi.', solution: 'CSV satrlarini shunchaki sanamang. Bir kartaning epizod muddatlari va tashrif oluvchisini tekshiring.' },
      { tone: 'waiting', problem: 'Hisobot oyida yordam ko‘rsatilgan, epizod satri topilmadi.', reason: 'Epizod oldingi oyda boshlangan.', solution: 'Kartadagi epizod boshlanish/yakunini ko‘ring; bolaning qamrovini yordam oluvchilar sonidan tekshiring.' },
      { tone: 'waiting', problem: 'Bajarilgan tashrif boshqa oyning qaydlarida turibdi.', reason: 'Qaydlar rejalashtirilgan sana, ko‘rsatkichlar esa bajarilgan sana bilan olinadi.', solution: 'Mobil jadval va karta tarixidan ikki sanani solishtiring; noto‘g‘ri dublikat yaratmang.' },
      { tone: 'action', problem: 'Oila tashrifi bolalar sonini oshirmadi.', reason: 'Oilaviy tashrif bolaning klinik oluvchilar to‘plamiga qo‘shilmaydi.', solution: '«Yordam olgan oilalar» va xizmat turi ustunlarini tekshiring.' },
      { tone: 'action', problem: 'Jihoz qaytarilgan oyning CSVida qaytarish yo‘q.', reason: 'Hisobot jihoz berishni berish sanasi bo‘yicha chiqaradi; qaytarish uchun alohida satr yo‘q.', solution: '«Jihoz berish»dagi berish/qaytarish tarixini oching; berish sanasidagi hisobot holati yangilanganini ko‘ring.' },
      { tone: 'waiting', problem: 'CSV tugmasi bosilmaydi.', reason: 'Tanlangan davrda eksport qilinadigan qaydlar yo‘q.', solution: 'Davrni manba sanalariga moslang. Faqat individual vazifa bor bo‘lsa uni kartada tekshiring.' },
      { tone: 'waiting', problem: 'CSV tugmasidan keyin yuklash ko‘rinmadi.', reason: 'Brauzerning avtomatik yuklash xatti-harakati sabab bo‘lishi mumkin; fayl tayyorlangan bo‘lsa havola ko‘rinadi.', solution: '«Tayyor CSV faylni yuklab olish» havolasini bosing va brauzer yuklashlarini tekshiring.' },
      { tone: 'waiting', problem: 'Davrni o‘zgartirdim, yuklangan fayl eski bo‘lib qoldi.', reason: 'Oldingi CSV nusxasi saqlangan; tayyor havola ham o‘sha nusxaga tegishli.', solution: 'Yangi davrni tekshirib «CSV yuklash»ni yana bosing, fayl nomidagi sanalarni solishtiring.' },
      { tone: 'waiting', problem: 'Bosh sahifadagi reja foizi davriy hisobot bilan teng emas.', reason: 'Reja foizi vazifalar bo‘yicha umumiy joriy hisob; davriy hisobot esa epizod va tashriflar bo‘yicha boshqa hisob.', solution: 'Reja vazifalarini karta orqali tekshiring. Foizni tashriflar ulushi yoki tanlangan oy natijasi deb talqin qilmang.' },
    ],
    outcomes: [
      'Tanlangan davrning qamrovi va har bir ko‘rsatkich birligi aniq bo‘ladi.',
      'Bola, oila, epizod, uy tashrifi va masofaviy maslahat sonlari to‘g‘ri farqlanadi.',
      'Sana mezoni sabab paydo bo‘lgan farqlar manba yozuv bilan izohlanadi.',
      'Joriy davr qaydlaridan lokal CSV olinadi va uning doirasi ma’lum bo‘ladi.',
      'Hisobot klinik sifat yoki rasmiy jo‘natma sifatida ortiqcha talqin qilinmaydi.',
    ],
    relatedTopics: ['overview', 'mobile', 'inpatient', 'equipment', 'care-plan', 'follow-up', 'demo'],
    flows: [
      {
        id: 'detailed', title: 'Davr tanlashdan manbani tekshirish va CSV olishgacha',
        description: 'Ko‘rsatkichlar va qaydlar ro‘yxatining alohida yo‘llari, bo‘sh davr hamda qayta eksport qilish holatlari.',
        definition: `flowchart TD
  A["Hisobot savolini aniqlash"] --> B["Davriy hisobotni ochish"]
  B --> C{"Davr turi"}
  C -->|Oylik| D["Hisobot oyini tanlash"]
  C -->|Choraklik| E["Yil va chorakni tanlash"]
  C -->|Yillik| F["Hisobot yilini tanlash"]
  D --> G["Boshlanish va yakun sanasini tekshirish"]
  E --> G
  F --> G
  G --> H["Epizodlarning davr bilan kesishishi"]
  G --> I["Davrda boshlangan epizodlar"]
  G --> J["Bajarilgan sana bo‘yicha tashriflar"]
  H --> K["Takrorlanmaydigan bola ishlari"]
  J --> L{"Yordam oluvchi"}
  L -->|Bola| K
  L -->|Oila| M["Takrorlanmaydigan oila ishlari"]
  J --> N["Uy tashrifi va masofaviy maslahatni ajratish"]
  K --> O["Barcha hududlar satrlarini solishtirish"]
  M --> O
  I --> O
  N --> O
  G --> P["Hujjat, boshlash, reja va berish sanasi bo‘yicha qaydlar"]
  P --> Q["Davrdagi qaydlar va joriy holat"]
  O --> R{"Kutilmagan farq bormi?"}
  Q --> R
  R -->|Ha| S["Satr orqali bola kartasini ochish"]
  S --> T["Sana, oluvchi, tur va holatni tekshirish"]
  T --> U["Hisobotga qaytib davrni qayta tekshirish"]
  U --> G
  R -->|Yo‘q yoki farq izohlandi| V{"Davrda qayd bormi?"}
  V -->|Yo‘q| W["CSV faol emas: boshqa davr yoki manbani tekshirish"]
  W --> C
  V -->|Ha| X["CSV yuklash"]
  X --> Y{"Yuklash boshlandimi?"}
  Y -->|Yo‘q| Z["Tayyor CSV havolasidan foydalanish"]
  Y -->|Ha| AA["Fayl davri, satrlari va ustunlarini tekshirish"]
  Z --> AA
  AA --> AB{"Davr yoki manba o‘zgardimi?"}
  AB -->|Ha| X
  AB -->|Yo‘q| AC["Chegaralari ma’lum lokal hisobot nusxasi"]
  class A,B,D,E,F,H,I,J,K,M,N,O,P,Q,S,X,AA guide_action;
  class AC guide_success;
  class C,G,L,R,T,U,V,W,Y,Z,AB guide_waiting;`,
        walkthrough: [
          'Davr turiga qarab faqat kerakli maydonlar ochiladi; ko‘rinib turgan sana oralig‘i barcha hisoblar uchun umumiy chegaradir.',
          'Ko‘rsatkichlar uch manbaga ajraladi: epizodning davr bilan kesishishi, yangi epizod boshlanishi va bajarilgan tashriflar. Bola va oila ishlarini alohida takrorlamay hisoblash kerak.',
          'Qaydlar parallel yo‘l bilan tuziladi: yo‘llanma hujjat sanasi, epizod boshlanishi, tashrif rejasi va jihoz berish sanasi. Shu sabab ko‘rsatkichlar bilan satrlar yig‘indisi teng bo‘lishi shart emas.',
          'Farq aniqlansa satrdagi bola orqali manbaga qaytiladi. Hisobotga qaytganda davrni qayta tekshirish standart oyga qaytish xatosini oldini oladi.',
          'Qayd yo‘q bo‘lsa eksport faol emas. Fayl tayyor bo‘lib yuklash boshlanmasa tayyor havola ishlatiladi. Keyin sana oralig‘i yoki manba o‘zgarsa yangi CSV yaratiladi.',
        ],
      },
      {
        id: 'aggregation', title: 'Bitta yozuv qaysi ko‘rsatkichga kiradi?',
        description: 'Hisob birligi, sana va yordam oluvchi bo‘yicha ajratish; CSV bilan farqning sababi.',
        definition: `flowchart TD
  A["Tanlangan davr va manba yozuvlari"] --> B["Klinik epizod"]
  A --> C["Tashrif yozuvi"]
  A --> D["Yo‘llanma yoki jihoz berish"]
  B --> E{"Epizod davr bilan kesishadimi?"}
  E -->|Ha| F["Bola ishini bir marta qamrash"]
  B --> G{"Boshlanish sanasi davrdami?"}
  G -->|Ha| H["Yangi epizod soni va epizod qaydi"]
  C --> I{"Tashrif bajarilganmi?"}
  I -->|Ha| J{"Bajarilish sanasi davrdami?"}
  J -->|Ha| K{"Bola yoki oila?"}
  K -->|Bola| F
  K -->|Oila| L["Oila ishini bir marta qamrash"]
  J -->|Ha| M{"Uyga tashrif yoki masofaviy?"}
  M -->|Uy| N["Bajarilgan uy tashriflari soni"]
  M -->|Masofaviy| O["Masofaviy maslahatlar soni"]
  C --> P{"Rejalashtirilgan sana davrdami?"}
  P -->|Ha| Q["Tashrif qaydi: har qanday joriy holat"]
  D --> R{"Hujjat yoki berish sanasi davrdami?"}
  R -->|Ha| S["Yuborilgan yo‘llanma yoki jihoz berish qaydi"]
  H --> T["Davrdagi qaydlar va CSV"]
  Q --> T
  S --> T
  F --> U["Hududlar bo‘yicha bolalar"]
  L --> V["Hududlar bo‘yicha oilalar"]
  N --> W["Xizmat turi bo‘yicha jami"]
  O --> W
  class A,B,C,D,F,H,L,Q,S,T,U,V,W guide_action;
  class N,O guide_success;
  class E,G,I,J,K,M,P,R guide_waiting;`,
        walkthrough: [
          'Bir epizod ikki savoldan o‘tadi: davrda davom etganmi va aynan davrda boshlanganmi. Birinchi savol bola qamroviga, ikkinchisi yangi epizod hamda epizod satriga ta’sir qiladi.',
          'Tashrif bajarilgan va bajarilish sanasi davrda bo‘lsa ko‘rsatkichga kiradi. Bola uchun bo‘lsa bola ishlari to‘plamiga, oila uchun bo‘lsa oilalar to‘plamiga qo‘shiladi.',
          'Xizmat turi bo‘yicha uy tashrifi yoki masofaviy maslahat sanaladi; ikkala tur ham bola va oilaga bajarilgan xizmatlarni oladi.',
          'Tashrif qaydi uchun boshqa savol — rejalashtirilgan sanasi davrdami. Shuning uchun hali rejalashtirilgan yoki bekor qilingan yozuv CSVda bo‘lishi, ammo bajarilish sonida bo‘lmasligi mumkin.',
          'Yo‘llanmalardan faqat yuborilganlari, jihozdan esa berish harakatlari kiradi. Individual vazifalar bu hisob yo‘liga kirmaydi; ularning natijasi kartada ko‘riladi. «Ha» tarmog‘i shartga mos yozuvlar kiritilishini anglatadi, mos bo‘lmaganlar o‘sha ko‘rsatkichga qo‘shilmaydi.',
        ],
      },
    ],
  },
  demo: {
    prerequisites: [
      'Maqsad sinov: bolalar, vakillar, hujjatlar va klinik qaydlar sun’iy namuna ekanligi ma’lum.',
      'Ma’lumotlar faqat ochiq ilova xotirasida turishi, sahifani yangilash yoki demoni qayta boshlash o‘zgarishlarni bekor qilishi tushunilgan.',
      'Bitta sinov savoli tanlangan: masalan, hujjat to‘liqligi, tasdiqdan xizmatga o‘tish, tashrif natijasi yoki topshirish.',
      'Bir amalni bajarishdan oldin namunaning boshlang‘ich tavsifi, joriy holati va tekshirish nuqtalari o‘qiladi.',
      'Haqiqiy shaxs yoki klinik sir kiritish kerak emas; tayyor sun’iy qiymatlar bilan to‘ldirish tugmasi mavjud.',
    ],
    sections: [
      { title: 'Demoni qayerdan boshlash kerak?', paragraphs: [
        'Bosh sahifadagi «Demo misollar» havolasi «Bolalar va yo‘llanmalar» sahifasining «Demo ssenariylar» ko‘rinishini ochadi. Shu sahifada «Bolalar reyestri» va «Demo ssenariylar» o‘rtasida almashish mumkin: birinchisi barcha kartalar bilan operatsion ishlashga, ikkinchisi tayyor misolni tushunishga qulay.',
        'Ssenariy kartasida misol raqami, hozirgi holat, mavzu, qisqa izoh va bola ko‘rinadi. «Ko‘rib chiqiladigan amallar»ni ochib tekshirish nuqtalarini o‘qing. Sarlavha yoki bola qatori kartani ochadi. Karta ichidagi «Boshlang‘ich demo vaziyati» tafsilotini ochib misolning dastlabki maqsadini yana ko‘rish mumkin.',
        'Tavsif boshlang‘ich vaziyatni tushuntiradi. Amal bajarilgach hozirgi holat, keyingi qadam va tarix yangilanadi, tavsif esa o‘sha boshlang‘ich misolni eslatib turadi. Demoni tushunishda faqat ssenariy matniga emas, haqiqiy joriy yozuvlarga qarang.',
      ] },
      { title: '22 namuna: aniqlash, yo‘llanma va qarorlar', paragraphs: [
        'Aniqlash va baholashni uch misolda ko‘ring: «Yangi murojaat» — klinik baho hali yo‘q; «PaPaS 14: kuzatuv» — past ball yakuniy rad etish emas; «Baholash jarayoni va kechikish» — ko‘rik boshlangan, tasdiqlangan natija hali yozilmagan. Uch ish kuni prototipda ish haftasi bo‘yicha hisoblanadi.',
        'Hujjatlar yo‘lini «Hujjati yetishmagan yo‘llanma» va «Oldingi sanali yozma yo‘llanma» orqali solishtiring. Birinchida yetishmagan ko‘chirma va tasdiq yuborishni to‘xtatadi; ikkinchida asl murojaat, baho va qog‘oz hujjat sanalari bugungi kiritish sanasidan farqlanadi. Tarixiy sanalarni «bugun»ga ko‘chirish misolning ma’nosini yo‘qotadi.',
        'Qaror farqlarini «Markaz konsiliumi kutilyapti», «Vaqtincha to‘xtatish» va «Yangi qabulda yosh chegarasi» namunalari ko‘rsatadi. Manba xulosasi Markaz qarorini almashtirmaydi; vaqtincha to‘xtatish qayta ko‘rishga olib keladi; yangi qabul yoshi mavjud epizodni davom ettirishdan farqlanadi.',
        'Bu bo‘limdagi guruhlash o‘rganish maqsadi uchun. Ekrandagi ssenariy guruhlari hozirgi ish holatiga qarab tuziladi: yozma yo‘llanma allaqachon yuborilgan bo‘lsa «Konsilium» guruhida ko‘rinishi mumkin. Misolning nomi uning joriy guruhini doim belgilamaydi.',
      ] },
      { title: '22 namuna: xizmatni tashkil etish va statsionar', paragraphs: [
        '«Qabul tasdiqlangan, joylashtirish kutilmoqda» namunasida Markaz qarori bor, epizod yo‘q. Bo‘sh o‘rinni tanlab xizmat boshlashni sinang. «Mobil qabul: uy bahosi kutilmoqda» namunasida tasdiq va rozilik bor, lekin uyda yordam bahosi yetishmaydi. PaPaS bu kamchilikni to‘ldirmaydi.',
        'Statsionarni to‘rt misolda ko‘ring: «14 kunlik statsionar yordam» — boshlang‘ich vaqtinchalik davr; «Konsilium bilan uzaytirish» — alohida qaror bilan uzaytirilgan yordam; «Muddatsiz statsionar yordam» — hujjatli terminal holat va rejalashtirilgan yakunning yo‘qligi; «Statsionarda 18 yoshga to‘lish» — voyaga yetmasdan boshlangan mavjud xizmatning alohida davom ettirilishi.',
        'O‘rin bandligi, hamroh, xizmat sanalari, ochiq va bajarilgan vazifalarni solishtiring. 14/28 kun hisobining kalendar yil, kirish va chiqish kunlariga oid qismi prototip talqinidir. Muddatsiz yordamni avtomatik kalendar yakun yoki yangi qabul uchun kattaroq yosh chegarasi deb talqin qilmang.',
      ] },
      { title: '22 namuna: mobil xizmat, topshirish va oila', paragraphs: [
        'Mobil xizmatning to‘rt holati bor: «Haftasiga ikki uy tashrifi» — PaPaS va uy bahosi farqi, maslahat va jihozlar; «Bir tashrif va jihoz qaytarish» — bir haftalik tashrif rejasi, soz qaytgan va ta’mirga ajratilgan jihoz; «Uch tashrif va faol brigada» — natija kutayotgan boshlangan tashrif; «Qayta baholash va qayta yo‘llanma» — baholar va yo‘llanmalar tarixi hamda konsilium o‘zgartirgan tashrif soni.',
        'Yakun va davomiylikni yana to‘rt misolda ko‘ring: «Chiqarish va shifokorga topshirish»da topshirish allaqachon yozilgan; «Boshqa muassasaga ko‘chirish»da keyingi topshirish ochiq; «Vafotdan keyin oilaga yordam»da klinik epizod yopiq, oilaviy reja faol; «Oilaviy yordam yakunlangan»da bajarilgan vazifalar saqlangan, ochiq rejalar bekor qilingan.',
        'Mobil sahifadagi «Barcha sanalar» yordamida oldingi va keyingi tashriflarni ko‘ring. Boshlangan tashrifni natijasiz bajarilgan deb bo‘lmaydi. Oila ishlari klinik xizmatdan alohida: yangi klinik baho yoki bolaga yangi tashrif orqali oilaviy holatni o‘zgartirish ko‘zda tutilmagan.',
      ] },
      { title: 'Qidiruv, guruh va ro‘yxat sonlari', paragraphs: [
        '«Ssenariy, bola yoki sinov qadami…» maydonida ssenariy nomi, mazmuni, tekshirish qadami, bola, vakil yoki karta ma’lumotlari bo‘yicha qidirish mumkin. Viloyat va holat filtrlari qidiruv bilan birga ishlaydi. Pastdagi guruhlar: «Barchasi», «Aniqlash va baholash», «Yo‘llanma», «Konsilium», «Yordamni tashkil etish», «Xizmat ko‘rsatish», «Kuzatuv va oila».',
        'Bosh sahifa bosqichidan kelgan bo‘lsangiz bosqich filtri, kutilayotgan ishlar ko‘rsatkichidan kelgan bo‘lsangiz «Keyingi harakat kutilmoqda» filtri ham qolishi mumkin. Shu holatda ko‘rinishni «Demo ssenariylar»ga almashtirish qolgan filtrlarni avtomatik olib tashlamaydi.',
        '«Tozalash» qidiruv, viloyat, holat va yuqoridan kelgan bosqich/harakat filtrlarini olib tashlaydi. Faqat ssenariy guruhini o‘zgartirgan bo‘lsangiz «Barchasi»ni tanlang. Natija bo‘sh bo‘lganda «Barcha bosqichlarni ko‘rish» guruhni tiklaydi, qolgan qidiruv yoki viloyat filtrini esa alohida tozalash kerak.',
        'Siz yaratgan yangi karta reyestrda ko‘rinadi, lekin unga tayyor ssenariy tavsifi avtomatik qo‘shilmaydi. Shuning uchun reyestr 23 ta bo‘lib, demo ssenariylar 22 ta qolishi mumkin. Amal bajarilgach misolning joriy guruhi va guruh sonlari o‘zgarishi tabiiy.',
      ] },
      { title: 'Namuna bilan to‘ldirish nimani bajaradi?', paragraphs: [
        'Yangi karta va jarayon shakllaridagi «Namuna bilan to‘ldirish» sun’iy ism, hujjat rekviziti, matn, baho yoki qaror misolini shaklga qo‘yadi. Bu saqlash emas. Shaklni o‘qib, sanalar, yordam shakli, qaror natijasi va tasdiqlarni tekshirgandan so‘ng formaning yakuniy tugmasi bosiladi. Markaz qarorida bu «Qabulni tasdiqlash», «Vaqtincha to‘xtatishni qayd etish» yoki «Rad etishni qayd etish»; boshqa shakllarda «Saqlash» yoki «Yo‘llanmani saqlash» bo‘lishi mumkin. «Bola ma’lumotlarini tahrirlash»da shu yordamchi tugma mavjud emas.',
        'Qo‘lda o‘zgartirgan maydonlar shakldagi namuna bilan to‘ldirishda saqlanadi. Qaror turi yoki yo‘llanma manbasini almashtirgandan so‘ng tugmani yana bosish tegishli yangi namuna matnlarini to‘ldirishi mumkin; avval o‘zingiz yozgan matnni yangi tanlovga moslab tekshiring. Tugma qaror sanasini avtomatik tarixga moslamaydi.',
        'Statsionar, mobil va jihoz amallari oynalaridagi namuna tugmasi bo‘sh matnlarni to‘ldiradi. Sana, bola, brigada, o‘rin, jihoz, ball, tashrif soni va checkbox tanlovlarini o‘zingiz tekshirasiz. Masalan, band brigada yoki kelajakdagi tashrif vaqti namuna matni bilan tuzalmaydi.',
        'Saqlash muvaffaqiyatli bo‘lsa holat, tarix yoki tegishli resurs yangilanadi. Xato bo‘lsa shakldagi sababni o‘qing, mazmunan to‘g‘ri maydonni tuzating va qayta saqlang. Tekshiruvni chetlab o‘tish uchun tarixiy sanani yoki klinik xulosani tasodifiy o‘zgartirmang; boshqa mos tayyor misoldan boshlash mumkin.',
      ] },
      { title: 'Katalog va qo‘llanmadan birga foydalanish', paragraphs: [
        '«Ma’lumotnomalar → Kataloglar»da «Hududlar», «Xizmat turlari», «Ish holatlari», «Brigada va o‘rinlar» tablari bor. Har bir tab ichida nom yoki mazmun bo‘yicha qidiriladi; tab almashtirilganda shu qidiruv tozalanadi. Bu bo‘limda yangi katalog elementi yaratish yoki resursni o‘zgartirish amali yo‘q.',
        'Katalogdagi o‘rin tayyorligi bilan statsionardagi bandlikni solishtiring. Brigada tarkibi va hududi katalogda tushuntiriladi, tashriflar esa «Mobil yordam» jadvalida yuritiladi. «Tashriflar jadvali» va «O‘rinlar bandligi» havolalari shu ish oynalariga olib boradi.',
        'Yon menyudagi «Qo‘llanmalar»dan mavzu, rol va formatni tanlang. Karta yoki ish oynasidagi kitob belgisi «Qo‘llanma» havolasidir. Qo‘llanma qadami yonidagi o‘rganish belgisini qo‘yish xizmatni bajarmaydi: haqiqiy demo amalni tegishli karta yoki xizmat shaklida saqlash kerak.',
      ] },
      { title: 'Demoni tiklash va natijani saqlab qolish chegarasi', paragraphs: [
        'Modul sarlavhasi yonidagi aylana o‘q belgisi «Demoni qayta boshlash» amalidir. Bosilganda barcha tayyor bola, xizmat, tashrif, jihoz va ssenariylar boshlang‘ich holatga qaytadi; yangi yaratilgan sinov kartalar va shu sessiyadagi o‘zgartirishlar yo‘qoladi. Bosh sahifaga o‘tiladi va tiklash xabari ko‘rinadi.',
        'Brauzer sahifasini yangilash ham boshlang‘ich demo to‘plamini yaratadi. Oddiy yon menyu orqali o‘tish ochiq sessiyadagi ishni davom ettiradi. Backend, lokal ma’lumotlar bazasi yoki brauzerda doimiy saqlash yo‘q; boshqa foydalanuvchining nusxasi bilan sinovlar sinxronlashmaydi.',
        'Sinov uchun yangi ochgan karta manzili tiklashdan keyin topilmasligi tabiiy. «Bolalar reyestriga qaytish» orqali tayyor kartani tanlang. Avval yuklangan CSV kompyuteringizdagi alohida nusxa bo‘lib qoladi, lekin u demoni qayta tiklash uchun zaxira yoki import fayli emas.',
        'Namuna sanalari ilova ochilgan vaqtga nisbatan tuziladi. Shuning uchun turli kunlarda bugungi tashriflar va muddatlar o‘zgarishi mumkin; doim bir xil oylik sonni kutmang. Muhim natija — tanlangan qoidaning ishlashi, holat o‘tishi va manba tarixining mos kelishi.',
      ] },
    ],
    steps: [
      { title: 'Bitta o‘rganish maqsadini tanlang', actor: 'Demo foydalanuvchisi', action: 'Masalan, qabul tasdig‘i bilan faol xizmat farqini yoki boshlangan tashrif natijasini sinashni belgilang.', result: 'Bir sinovda nimani tekshirishingiz aniq bo‘ladi.', route: examples },
      { title: 'Demo ssenariylar ko‘rinishini oching', actor: 'Demo foydalanuvchisi', action: 'Bosh sahifadagi «Demo misollar» yoki reyestrdagi «Demo ssenariylar»ni bosing.', result: 'Tayyor misollar kartalari ochiladi.', route: examples },
      { title: 'Qolgan filtrlarni tekshiring', actor: 'Demo foydalanuvchisi', action: 'Qidiruv, viloyat, holat va bosqichni tekshiring; barcha misollar kerak bo‘lsa «Tozalash» va «Barchasi»ni qo‘llang.', result: 'Kerakli misol filtr sabab yashirin qolmaydi.', route: examples },
      { title: 'Maqsadga mos namunani qidiring', actor: 'Demo foydalanuvchisi', action: 'Ssenariy nomi yoki sinov qadami bo‘yicha qidiring, joriy bosqich guruhini tanlang.', result: 'Tekshiriladigan holatdagi misol topiladi.', route: examples },
      { title: 'Tekshirish nuqtalarini o‘qing', actor: 'Demo foydalanuvchisi', action: '«Ko‘rib chiqiladigan amallar»ni oching; misolning boshlang‘ich holati va kutilgan farqni tushuning.', result: 'Amaldan oldingi holatni nimaga solishtirish ma’lum bo‘ladi.', route: examples },
      { title: 'Bola kartasini oching', actor: 'Tegishli rol vazifasini sinovchi', action: 'Ssenariy sarlavhasi yoki bola qatorini bosing. Joriy status, «Boshlang‘ich demo vaziyati» va keyingi qadamni o‘qing.', result: 'Misolning haqiqiy joriy yozuvlari ochiladi.', route: cases },
      { title: 'Mos shakl yoki xizmat oynasiga o‘ting', actor: 'Tegishli rol vazifasini sinovchi', action: '«Davom etish», «Ish oynasiga o‘tish» yoki kerakli karta tabidan tegishli amalni tanlang.', result: 'Aynan shu holatda mavjud amal oynasi ochiladi.', route: cases },
      { title: 'Namunani to‘ldirib qiymatlarni tekshiring', actor: 'Tegishli rol vazifasini sinovchi', action: 'Mavjud bo‘lsa «Namuna bilan to‘ldirish»ni bosing; sana, xizmat, qaror, oluvchi, brigada va tasdiqlarni tekshiring.', result: 'Saqlash uchun ko‘rib chiqilgan sun’iy ma’lumot tayyor bo‘ladi.', route: cases },
      { title: 'Amalni alohida saqlang', actor: 'Tegishli rol vazifasini sinovchi', action: 'Shaklning saqlash tugmasini bosing. Xato chiqsa sababiga mos maydonni tuzatib qayta urinib ko‘ring.', result: 'Muvaffaqiyat xabari yoki aniq tekshiruv sababi olinadi.', route: cases },
      { title: 'O‘zgarishni karta va xizmatda tekshiring', actor: 'Demo foydalanuvchisi', action: 'Joriy status, keyingi qadam, «Jarayon tarixi» va tegishli reja, tashrif yoki resursni solishtiring.', result: 'Tugma bosilishi bilan haqiqiy holat o‘zgarishi farqlanadi.', route: cases },
      { title: 'Katalogdagi tushunchalarni solishtiring', actor: 'Demo foydalanuvchisi', action: '«Kataloglar»dan ish holati, xizmat turi, brigada yoki o‘rin tavsifini ko‘ring; tayyorlik va bandlikni ajrating.', result: 'Jarayon atamalari va foydalanilgan resurs tushunarli bo‘ladi.', route: `${root}/references` },
      { title: 'Hisobotga ta’sirini tekshiring', actor: 'Demo foydalanuvchisi', action: 'Davrni amalga moslang; yangi epizod, bajarilgan tashrif yoki jihoz berishning qaysi hisobga kirishini tekshiring. Individual vazifani kartadan tekshiring.', result: 'Amal va boshqaruv ko‘rsatkichi o‘rtasidagi bog‘lanish tushuniladi.', route: `${root}/reports` },
      { title: 'Boshqa ssenariyni tanlang yoki demoni tiklang', actor: 'Demo foydalanuvchisi', action: 'Sinovni davom ettirish uchun ro‘yxatga qayting. Boshlang‘ich misollar kerak bo‘lsa «Demoni qayta boshlash»ni bosing.', result: 'Joriy holatda davom etiladi yoki barcha sinov o‘zgarishlarisiz boshlang‘ich to‘plam olinadi.', route: examples },
      { title: 'Yangi karta bilan reyestrni sinang', actor: 'Demo foydalanuvchisi', action: '«Yangi bola kartasi» orqali sun’iy karta yarating, reyestrdan toping; tayyor ssenariylar soni avtomatik oshmasligini tekshiring.', result: 'Yangi ish yaratish bilan oldindan yozilgan demo ssenariyning farqi tushuniladi.', route: cases },
    ],
    rules: [
      { tone: 'action', condition: 'Sinov amali bajarilgach ssenariy boshqa guruhga o‘tdi', action: 'Joriy status va keyingi qadamni asos qiling; boshlang‘ich tavsif o‘zgarmasligi tabiiy.', owner: 'Demo foydalanuvchisi', basis: 'Guruhlar joriy ish holati bo‘yicha tuziladi.' },
      { tone: 'waiting', condition: 'Qidiruv, viloyat, holat yoki yuqoridan kelgan bosqich filtri bor', action: 'Kerakli misol ko‘rinmasa filtrlarni tozalang va «Barchasi»ni tanlang.', owner: 'Demo foydalanuvchisi', basis: 'Filtrlar birgalikda qo‘llanadi; ko‘rinishni almashtirish ularni saqlashi mumkin.' },
      { tone: 'waiting', condition: 'Namuna bilan to‘ldirish bosildi', action: 'Qiymatlarni o‘qing va alohida saqlang; to‘ldirishni bajarilgan amal deb qabul qilmang.', owner: 'Demo foydalanuvchisi', basis: 'Namuna tugmasi shakl qiymatlarini tayyorlaydi, ma’lumotni saqlamaydi.' },
      { tone: 'waiting', condition: 'Qaror turi yoki tarixiy sana qo‘lda o‘zgartirildi', action: 'Namuna matni, qo‘shimcha maydon va hujjatlar shu tanlovga mosligini tekshiring.', owner: 'Demo foydalanuvchisi', basis: 'Qo‘lda o‘zgartirilgan qiymatlar saqlanadi; klinik va sanaviy tekshiruvlar ishlashda davom etadi.' },
      { tone: 'action', condition: 'Yangi bola kartasi yaratildi', action: 'Uni «Bolalar reyestri»dan toping; tayyor ssenariy tavsifi qo‘shilishini kutmang.', owner: 'Demo foydalanuvchisi', basis: 'Demo ssenariylar faqat oldindan tavsiflangan 22 namunani ko‘rsatadi.' },
      { tone: 'cancelled', condition: 'Demoni qayta boshlash yoki brauzerni yangilash bajarildi', action: 'Boshlang‘ich misollar tiklanganini tekshiring; oldingi sinov kartasi va o‘zgarishlar saqlangan deb o‘ylamang.', owner: 'Demo foydalanuvchisi', basis: 'Faqat ochiq sahifa xotirasidagi holat, doimiy saqlash yo‘q.' },
      { tone: 'action', condition: 'Katalog tablari ochildi', action: 'Tushuncha va resurslarni o‘qing; xizmatni bajarish uchun tegishli ish sahifasiga o‘ting.', owner: 'Demo foydalanuvchisi', basis: 'Kataloglar o‘qish uchun; resurs bandligi va xizmat amallari boshqa sahifalarda.' },
      { tone: 'action', condition: 'Qo‘llanma qadami o‘rganilgan deb belgilandi', action: 'Amaliy sinov kerak bo‘lsa karta yoki ish oynasida tegishli amalni saqlang.', owner: 'Demo foydalanuvchisi', basis: 'Qo‘llanmadagi belgi klinik yozuvni o‘zgartirmaydi.' },
      { tone: 'waiting', condition: 'Demo boshqa kuni qayta ochildi', action: 'Tashrif, muddat va hisobot davrini yangi joriy sanaga moslab tekshiring.', owner: 'Demo foydalanuvchisi', basis: 'Boshlang‘ich sanalar ilova ochilgan vaqtga nisbatan yaratiladi.' },
    ],
    faq: [
      { question: '22 ta kartaning barchasini boshidan oxirigacha yuritish kerakmi?', answer: 'Shart emas. Har bir namuna muayyan farqni ko‘rsatish uchun jarayonning tayyor nuqtasidan boshlanadi. Avval bitta maqsadga mos misolni tanlang, keyin boshqa bosqichdagi namuna bilan solishtiring. Yangi kartada to‘liq yo‘lni alohida sinash mumkin.' },
      { question: 'Nega misolda «Qabul tasdiqlangan» yozilgan, lekin bola hali xizmat olmayapti?', answer: 'Bu aynan ko‘rsatish uchun yaratilgan farq: Markaz qarori bilan o‘rin yoki brigadani biriktirib epizodni boshlash alohida bosqichlar. «Qabul tasdiqlangan, joylashtirish kutilmoqda» va «Mobil qabul: uy bahosi kutilmoqda» shuni tushuntiradi.' },
      { question: 'Namuna bilan to‘ldirish barcha xatolarni tuzatadimi?', answer: 'Yo‘q. Tugma sun’iy qiymatlar beradi. Band o‘rin, brigada vaqti to‘qnashuvi, noto‘g‘ri tarixiy sana, qarorsiz qabul yoki oilaviy muddat kabi qoidalar baribir tekshiriladi. Sana va tanlovlarni ko‘rib chiqish kerak.' },
      { question: 'Nega tugmani qayta bosganda qo‘lda yozgan matnim almashmadi?', answer: 'Karta shakllari qo‘lda o‘zgartirilgan maydonlarni asraydi; xizmat amallarida namuna faqat bo‘sh matnlarni to‘ldiradi. Tanlovni almashtirgan bo‘lsangiz o‘zingiz yozgan izohni yangi holatga qo‘lda moslang.' },
      { question: 'Amal bajarildi, ssenariy tavsifi nega eski?', answer: 'Tavsif misolning boshlang‘ich maqsadini tushuntiradi. Joriy vaziyatni status, keyingi qadam, xizmatlar va «Jarayon tarixi»dan tekshiring. Boshlang‘ich tavsif bajarilgan amalning yangi tasdig‘i emas.' },
      { question: 'Reyestrda 23 karta, ssenariylarda 22 bo‘lishi xatomi?', answer: 'Yo‘q. Yangi yaratgan kartangiz operatsion reyestrga qo‘shiladi. «Demo ssenariylar» oldindan sarlavha, izoh va tekshirish nuqtalari yozilgan tayyor misollarni ko‘rsatadi.' },
      { question: 'Nega tarixiy mobil tashriflar ko‘rinmayapti?', answer: 'Mobil sahifa tanlangan sana bilan cheklangan bo‘lishi mumkin. «Barcha sanalar»ni yoqing, kerak bo‘lsa brigada va xizmat turi tanlovlarini ham tekshiring. Tayyor misollarda oldingi davr qaydlari ham bor.' },
      { question: 'Demoni tiklash faqat ochiq kartani tiklaydimi?', answer: 'Yo‘q. «Demoni qayta boshlash» butun palliativ demo to‘plamini — bolalar, epizodlar, tashriflar va jihoz holatini — boshlang‘ich holatga qaytaradi va bosh sahifani ochadi. Siz yaratgan yangi karta ham yo‘qoladi.' },
      { question: 'CSVni saqlasam keyin demo holatini qayta yuklay olamanmi?', answer: 'Yo‘q. CSV hisobot qaydlarining o‘qish uchun nusxasi. U barcha karta ma’lumotlarini qamrab olmaydi va ushbu prototipda import yoki zaxiradan tiklash amali mavjud emas.' },
      { question: 'Haqiqiy shaxs ma’lumotini yoki hujjat faylini kiritish kerakmi?', answer: 'Yo‘q. Sun’iy kartalar va namuna rekvizitlari yetarli. Hujjat maydoni haqiqiy fayl yuklash, elektron imzo yoki E-palliative orqali yuborishni bajarmaydi.' },
    ],
    checklist: [
      'Bitta aniq sinov maqsadi va unga mos tayyor namuna tanlandi.',
      'Qidiruv, viloyat, holat va bosqich filtrlari tekshirildi.',
      'Boshlang‘ich izoh bilan haqiqiy joriy status bir-biridan ajratildi.',
      'Namuna bilan to‘ldirishdan keyin sana, qaror, xizmat va tasdiqlar ko‘rib chiqildi.',
      'Shakl alohida saqlandi va muvaffaqiyat yoki xato xabari o‘qildi.',
      'Holat o‘zgarishi karta tarixi va tegishli xizmat yozuvida tekshirildi.',
      'Hisobotga ta’sir tekshirilsa tegishli davr va sana mezoni tanlandi.',
      'Yangi karta reyestrga qo‘shilishi, tayyor ssenariylar soni esa o‘zgarmasligi tushunildi.',
      'Demo tiklanganda sinov o‘zgarishlari yo‘qolishi hisobga olindi.',
    ],
    fields: [
      { name: 'Demo misollar', location: 'Bosh sahifa sarlavhasi yonidagi havola', requirement: 'Navigatsiya, ma’lumot kiritilmaydi.', meaning: 'Tayyor ssenariylar ko‘rinishini ochadi.', example: 'Qabuldan faol xizmatga o‘tishni sinash uchun oching.' },
      { name: 'Bolalar reyestri / Demo ssenariylar', location: 'Bolalar va yo‘llanmalar yuqorisi', requirement: 'Ro‘yxat ko‘rinishidan biri.', meaning: 'Barcha kartalar jadvali yoki oldindan tushuntirilgan demo kartalari.', example: 'Yangi yaratgan kartani Bolalar reyestridan qidiring.' },
      { name: 'Bola, karta yoki demo ssenariy bo‘yicha qidirish', location: 'Reyestr va ssenariylar qidiruv maydoni', requirement: 'Ixtiyoriy.', meaning: 'Ism, karta, ssenariy sarlavhasi, mazmun va tekshirish qadami bo‘yicha izlaydi.', example: '«uzaytirish», «ko‘chirma» yoki bola ismi.' },
      { name: 'Viloyat bo‘yicha filtr', location: 'Reyestr va ssenariylar filtri', requirement: 'Ixtiyoriy; Barcha viloyatlar boshlang‘ich tanlov.', meaning: 'Mavjud qidiruv va holatga qo‘shimcha hudud cheklovi.', example: 'Samarqand tanlanganda boshqa viloyat misollari yashiriladi.' },
      { name: 'Holat bo‘yicha filtr', location: 'Reyestr va ssenariylar filtri', requirement: 'Ixtiyoriy; Barcha holatlar boshlang‘ich tanlov.', meaning: 'Hozirgi ish holati bilan cheklaydi, boshlang‘ich ssenariy nomi bilan emas.', example: 'Qabul tasdiqlangan.' },
      { name: 'Barchasi', location: 'Demo ssenariylar guruhlari', requirement: 'Guruh tanlovi.', meaning: 'Joriy bosqich guruhini olib tashlaydi; yuqoridagi boshqa filtrlarni avtomatik tozalamaydi.', example: 'Yo‘llanma guruhidan barcha mos ssenariylarga qaytish.' },
      { name: 'Ko‘rib chiqiladigan amallar', location: 'Demo ssenariy kartasidagi ochiladigan tafsilot', requirement: 'O‘qish uchun.', meaning: 'Aynan shu namuna orqali tekshiriladigan farqlar va amallar.', example: 'Tasdiq epizodning o‘zi emas; o‘rin alohida ajratiladi.' },
      { name: 'Boshlang‘ich demo vaziyati', location: 'Tayyor namunaning bola kartasi', requirement: 'O‘qish uchun, foydalanuvchi tahrirlamaydi.', meaning: 'Misolning boshlang‘ich maqsadi; keyingi amallardan so‘ng joriy statusni almashtirmaydi.', example: 'Avval qabul kutgan namuna xizmat boshlanganidan keyin ham boshlang‘ich izohni saqlaydi.' },
      { name: 'Namuna bilan to‘ldirish', location: 'Yangi karta va jarayon shakllari; statsionar, mobil, jihoz amallari', requirement: 'Ixtiyoriy; tahrirlash shaklida mavjud emas.', meaning: 'Sun’iy qiymatlarni saqlamasdan shaklga qo‘yadi. Xizmat amallarida faqat bo‘sh matnlar to‘ldiriladi.', example: 'DEMO hujjat raqami va namunaviy qaror matni.' },
      { name: 'Qaror sanasi', location: 'Markaz konsiliumi qarori shakli', requirement: 'Majburiy va ishning sanalar ketma-ketligiga mos.', meaning: 'Qarorning haqiqiy sanasi; namuna bilan to‘ldirish uni avtomatik tuzatmaydi.', example: 'Yo‘llanma sanasidan oldin bo‘lmagan, kelajakda bo‘lmagan sana.' },
      { name: 'Saqlash / Yo‘llanmani saqlash / tanlangan qarorni qayd etish tugmasi', location: 'Karta shaklining pastki qismi', requirement: 'Amalni yakunlash uchun bosiladi; tekshiruvlardan o‘tishi kerak.', meaning: 'Shakldagi ma’lumotni shu demo sessiyasiga qo‘llaydi. Markaz qarorida nomi natijaga mos: Qabulni tasdiqlash, Vaqtincha to‘xtatishni qayd etish yoki Rad etishni qayd etish.', example: 'Namuna to‘ldirilgach tegishli yakuniy tugmani bosing; qaror tanlashning o‘zi saqlamaydi.' },
      { name: 'Jarayon tarixi', location: 'Bola kartasi tabi', requirement: 'O‘qish uchun.', meaning: 'Qaysi amal qachon qayd etilganini solishtirish joyi.', example: 'Konsilium qarori yoki tashrif bajarilishi qaydi.' },
      { name: 'Hududlar / Xizmat turlari / Ish holatlari / Brigada va o‘rinlar', location: 'Ma’lumotnomalar → Kataloglar', requirement: 'To‘rtta o‘qish tabi.', meaning: 'Atama va resursni tushuntiradi; element qo‘shish yoki bandlikni o‘zgartirish amali emas.', example: 'Ish holatlaridan Qabul tasdiqlangan tavsifini o‘qish.' },
      { name: 'Demoni qayta boshlash', location: 'Modul sarlavhasidagi aylana o‘q tugmasi', requirement: 'Ixtiyoriy; butun demo to‘plamiga ta’sir qiladi.', meaning: 'Sinov o‘zgarishlarini olib tashlab, tayyor namunalarni tiklaydi va bosh sahifaga o‘tadi.', example: 'Yangi karta va o‘zgartirilgan xizmatlar dastlabki to‘plamga qaytadi.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Barcha 22 ssenariy ko‘rinmayapti.', reason: 'Qidiruv, viloyat, holat, joriy guruh yoki bosh sahifadan kelgan bosqich/harakat filtri bor.', solution: 'Yuqoridagi «Tozalash»ni bosing va «Barchasi» guruhini tanlang; natija sonini tekshiring.' },
      { tone: 'waiting', problem: 'Yangi kartam ssenariylar orasida yo‘q.', reason: 'Yangi karta tayyor ssenariy tavsifiga ega emas.', solution: '«Bolalar reyestri»ni tanlab ism yoki karta raqami bilan izlang.' },
      { tone: 'waiting', problem: 'Amaldan keyin misol oldingi guruhdan yo‘qoldi.', reason: 'Holati o‘zgargani sabab boshqa biznes bosqichiga o‘tdi.', solution: '«Barchasi»dan qidiring yoki joriy statusga mos guruhni tanlang; karta tarixidan o‘tishni tekshiring.' },
      { tone: 'waiting', problem: 'Namuna to‘ldirildi, lekin karta o‘zgarmadi.', reason: 'To‘ldirish tugmasi saqlamaydi yoki saqlashda xato qolgan.', solution: 'Shakl qiymatlarini ko‘rib yakuniy tugmani bosing: Markaz qarorida tanlovga mos «Qabulni tasdiqlash», «Vaqtincha to‘xtatishni qayd etish» yoki «Rad etishni qayd etish»; boshqa shakllarda tegishli saqlash tugmasi. Xabar va karta tarixini tekshiring.' },
      { tone: 'waiting', problem: 'Namuna bilan to‘ldirish tugmasi yo‘q.', reason: 'Bola ma’lumotlarini tahrirlash shaklida bu tugma ko‘rsatilmaydi; u har bir o‘qish ekranida ham bo‘lmaydi.', solution: 'Tahrirni qo‘lda kiriting yoki yangi karta/jarayon amalining mos shaklini oching.' },
      { tone: 'waiting', problem: 'Tayyor matn bilan ham konsilium qarori saqlanmayapti.', reason: 'Tanlangan sana, yosh, hujjat to‘liqligi, yordam shakli yoki tasdiqlar mos kelmasligi mumkin.', solution: 'Xabardagi sababni o‘qing; qaror sanasi va yordam shaklini birinchi tekshiring. Klinik shartni soxta belgi bilan chetlab o‘tmang, mos tayyor misolni tanlang.' },
      { tone: 'waiting', problem: 'Tashrifni boshlashda boshqa faol tashrif xabari chiqdi.', reason: 'Tanlangan brigadaning jarayondagi boshqa tashrifi bor; demoda bunday holat ataylab mavjud.', solution: '«Uch tashrif va faol brigada»dagi boshlangan tashrif natijasini tegishli tartibda yakunlang yoki boshqa mos brigada/vaqt bilan sinang.' },
      { tone: 'waiting', problem: 'Oilaviy ishda yangi vazifa yoki tashrif bloklandi.', reason: 'Yordam oluvchisi, oilaviy holat yoki uch oylik muddat shartlari mos emas.', solution: 'Faol oilaviy namunani oching, oluvchini Oila qilib va muddat ichida rejalang. Yakunlangan misolni tarixni o‘rganish uchun ishlating.' },
      { tone: 'cancelled', problem: 'Sahifani yangilagach sinov kartasi topilmadi.', reason: 'Yangi karta faqat oldingi ochiq sahifa xotirasida bo‘lgan.', solution: '«Bolalar reyestriga qaytish»dan tayyor misolni oching yoki yangi sun’iy karta yarating.' },
      { tone: 'waiting', problem: 'Katalogda o‘rin tayyor, ammo joylashtirish mumkin emas.', reason: 'Tayyorlik va bandlik boshqa tushunchalar; o‘rin faol epizodga biriktirilgan bo‘lishi mumkin.', solution: '«Statsionar → O‘rinlar bandligi»ni tekshiring va bo‘sh tayyor o‘rinni tanlang.' },
      { tone: 'waiting', problem: 'Qo‘llanmadagi qadamni belgiladim, status o‘zgarmadi.', reason: 'O‘rganish belgisi amaliy xizmat qaydi emas.', solution: 'Qadamdagi havola orqali tegishli ish oynasini oching va demo amalni alohida saqlang.' },
      { tone: 'waiting', problem: 'Boshqa kuni hisobot sonlari yoki muddatlar farq qildi.', reason: 'Demo sanalari ochilish vaqtiga nisbatan qayta tuziladi.', solution: 'Joriy sana va hisobot davrini tekshiring; oldingi qat’iy sonni emas, qoida va holat o‘tishini solishtiring.' },
    ],
    outcomes: [
      'Barcha 22 tayyor namunaning qaysi biznes farqni ko‘rsatishi ma’lum bo‘ladi.',
      'Ssenariy topish, shaklni to‘ldirish, alohida saqlash va natijani tarixdan tekshirish bajariladi.',
      'Boshlang‘ich tavsif bilan joriy status va guruhlar farqi tushuniladi.',
      'Katalog, qo‘llanma, amaliy ish oynasi va hisobotning vazifalari ajratiladi.',
      'Demo tiklanishi va doimiy saqlash yo‘qligi sabab kutilmagan yo‘qotish talqini yuzaga kelmaydi.',
    ],
    relatedTopics: ['overview', 'intake', 'referral', 'consilium', 'inpatient', 'mobile', 'care-plan', 'equipment', 'follow-up', 'reports'],
    flows: [
      {
        id: 'detailed', title: 'Tayyor ssenariyni topish, amal qilish va natijani tekshirish',
        description: 'Qidiruvdan holat o‘zgarishigacha, yangi karta va butun demoni tiklash yo‘llari bilan.',
        definition: `flowchart TD
  A["Sinov maqsadini tanlash"] --> B["Demo misollarni ochish"]
  B --> C{"Qidiruv yoki filtr qolganmi?"}
  C -->|Ha| D["Qidiruv, viloyat, holat va bosqichni tozalash"]
  C -->|Yo‘q| E["Ssenariy guruhi yoki nomini tanlash"]
  D --> E
  E --> F{"Mos misol topildimi?"}
  F -->|Yo‘q| G["Barchasi guruhiga qaytish va qidiruvni qisqartirish"]
  G --> E
  F -->|Ha| H["Izoh va ko‘rib chiqiladigan amallarni o‘qish"]
  H --> I["Bola kartasini ochish"]
  I --> J["Joriy status va boshlang‘ich vaziyatni solishtirish"]
  J --> K["Davom etish yoki ish oynasiga o‘tish"]
  K --> L{"Namuna tugmasi bormi?"}
  L -->|Ha| M["Namuna bilan to‘ldirish"]
  L -->|Yo‘q| N["Maydonlarni qo‘lda to‘ldirish"]
  M --> O["Sana, qaror, xizmat va tanlovlarni tekshirish"]
  N --> O
  O --> P["Amalni alohida saqlash"]
  P --> Q{"Saqlash muvaffaqiyatlimi?"}
  Q -->|Yo‘q| R["Xato sababiga mos maydon yoki shartni tekshirish"]
  R --> O
  Q -->|Ha| S["Status va keyingi qadamni tekshirish"]
  S --> T["Jarayon tarixi va xizmat yozuvini ko‘rish"]
  T --> U["Katalogdagi tushuncha va resursni solishtirish"]
  U --> V["Hisobot davri va tegishli hisobni tekshirish"]
  V --> W{"Keyingi sinov"}
  W -->|Boshqa tayyor misol| E
  W -->|Yangi karta| X["Yangi bola kartasi shakli"]
  X --> Y["Sun’iy ma’lumot bilan alohida saqlash"]
  Y --> Z["Bolalar reyestridan topish"]
  Z --> J
  W -->|Boshlang‘ich holat| AA["Demoni qayta boshlash"]
  AA --> AB["Barcha sinov o‘zgarishlari olib tashlanadi"]
  AB --> AC["Bosh sahifa va 22 tayyor namuna tiklanadi"]
  AC --> B
  class A,B,D,E,H,I,K,M,N,T,U,V,X,Z guide_action;
  class P,Y,AC guide_success;
  class AA,AB guide_cancelled;
  class C,F,G,J,L,O,Q,R,S,W guide_waiting;`,
        walkthrough: [
          'Ssenariy topishdan oldin qolgan filtrlar tekshiriladi. «Barchasi» joriy guruhni, yuqoridagi «Tozalash» esa umumiy filtrlarni tiklaydi.',
          'Boshlang‘ich tavsifni o‘qib, kartadagi haqiqiy statusga qarab mavjud amal tanlanadi. Misol nomi eski bosqichni eslatishi mumkin, joriy status esa bajarilgan amallarni aks ettiradi.',
          'Namuna bilan to‘ldirish va qo‘lda to‘ldirish bir xil tekshirish hamda alohida saqlash bosqichiga keladi. Namuna matni jarayon qoidalarini chetlab o‘tmaydi.',
          'Muvaffaqiyatdan keyin kamida status va tarix, zarur bo‘lsa resurs yoki tashrif tekshiriladi. Katalog va hisobot tushuncha hamda hisobga ta’sirni tekshirishga yordam beradi.',
          'Yangi karta faqat reyestrga qo‘shiladi. Demoni qayta boshlash esa bitta kartani emas, butun sessiyadagi o‘zgarishlarni tiklaydi va tayyor to‘plam bilan bosh sahifaga qaytaradi.',
        ],
      },
      {
        id: 'walkthrough', title: 'Bitta mobil tashrifni amalda yakunlash sinovi',
        description: '«Uch tashrif va faol brigada» namunasida boshlangan xizmat, natija, hisobot va tiklashni tekshirish.',
        definition: `flowchart TD
  A["Demo ssenariylarda Uch tashrif va faol brigada misolini topish"] --> B["Izoh: bir tashrif jarayonda"]
  B --> C["Bola kartasidagi joriy mobil holatni tekshirish"]
  C --> D["Mobil yordamni ochish"]
  D --> E{"Kerakli tashrif ko‘rinyaptimi?"}
  E -->|Yo‘q| F["Barcha sanalar va brigada tanlovini tekshirish"]
  F --> D
  E -->|Ha| G{"Tashrif holati"}
  G -->|Bajarilmoqda| H["Natijani qayd etish amalini ochish"]
  G -->|Rejalashtirilgan| I{"Vaqti kelgan va brigada bo‘shmi?"}
  I -->|Yo‘q| J["Faol tashrifni yoki reja vaqtini tekshirish"]
  J --> D
  I -->|Ha| K["Tashrifni boshlash"]
  K --> H
  H --> L["Namuna yoki o‘z matni bilan natijani yozish"]
  L --> M["Natijani alohida saqlash"]
  M --> N["Tashrif Bajarilgan holatini tekshirish"]
  N --> O["Bola kartasidagi Jarayon tarixi"]
  O --> P["Bajarilgan sana davrida hisobotni tekshirish"]
  P --> Q["Qayd va CSV uchun rejalashtirilgan sanani solishtirish"]
  Q --> R{"Boshlang‘ich namuna yana kerakmi?"}
  R -->|Ha| S["Demoni qayta boshlash"]
  R -->|Yo‘q| T["Joriy sessiyada boshqa sinovni davom ettirish"]
  S --> A
  class A,B,C,D,H,K,L,M,O,P,Q,T guide_action;
  class N guide_success;
  class S guide_cancelled;
  class E,F,G,I,J,R guide_waiting;`,
        walkthrough: [
          'Tayyor misolda jarayondagi tashrif allaqachon bor. Uni yana rejalashtirish shart emas; avval mos bola va tashrifni topib, joriy holatini tekshiring.',
          'Tashrif ko‘rinmasa sana va brigada tanlovlari tekshiriladi. Rejalashtirilgan boshqa tashrifni tanlab qo‘ygan bo‘lsangiz uning vaqti kelishi va brigadaning boshqa faol tashrifi tugashi kerak.',
          'Jarayondagi tashrif natija bilan yakunlanadi. Namuna matni yoki qo‘lda yozilgan natija saqlanmaguncha holat bajarilganga o‘tmaydi.',
          'Tashrif bajarilgach kartadagi tarix va hisobot tekshiriladi. Bajarilgan xizmat ko‘rsatkichi bajarilish davriga, qaydlar hamda CSV esa rejalashtirilgan davrga qaraydi.',
          'Demoni tiklash aynan shu tashrifni ham boshlang‘ich holatga qaytaradi, shu bilan birga boshqa sinov o‘zgarishlarini ham olib tashlaydi. Tiklamasdan davom etsangiz barcha amallar shu ochiq sessiyada qoladi.',
        ],
      },
    ],
  },
}
