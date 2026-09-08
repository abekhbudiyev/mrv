import type { GuideDetail } from './guides-types'

const base = '/apps/palliative-care'

export const careGuideDetails: Record<string, GuideDetail> = {
  inpatient: {
    prerequisites: [
      'Bola kartasida Markaz konsiliumining eng so‘nggi qarori qabulni tasdiqlagan va yordam shaklini Statsionar deb belgilagan bo‘lishi kerak.',
      'Bolaning holati Qabul tasdiqlangan; boshqa faol xizmat epizodi yoki vafotdan keyingi oilaviy yordam mavjud bo‘lmasligi kerak.',
      'Qabul sanasida bola 18 yoshga to‘lmagan bo‘lishi; sana konsilium qaroridan oldin va kelajakda bo‘lmasligi kerak.',
      'Muvofiqlashtiruvchi bo‘sh va foydalanishga tayyor o‘rinni, konsilium qarori rekvizitini hamda joylashtirish asosini tayyorlaydi.',
      'Vaqtinchalik qabul uchun oldingi statsionar epizodlar, kalendar yilidagi kunlar va rejalashtirilgan yakun ko‘rib chiqiladi.',
      'Muddatsiz shaklni tanlashga tibbiy xulosa asos bo‘ladi. Bu tanlov vaqtinchalik yordam limitini chetlab o‘tish vositasi emas.',
    ],
    sections: [
      { title: 'Qaror, o‘rin va epizod o‘rtasidagi bog‘lanish', paragraphs: [
        'Konsilium qabulni tasdiqlashi hali bola o‘ringa joylashtirilganini anglatmaydi. Statsionar sahifasidagi Joylashtirish amali aniq bola, boshlanish sanasi va o‘rinni bitta faol epizodga biriktiradi. Saqlangandan keyin bola Statsionarda holatiga o‘tadi va o‘rin band ko‘rinadi.',
        'Statsionar o‘rinlar kartalari o‘rin fondini, Faol joylashtirishlar esa amaldagi epizodlarni ko‘rsatadi. Bola ismini ochib oldingi epizodlar va yangi qaror asosini solishtirish mumkin. Bir bolaning bir nechta tarixiy epizodi bo‘lishi mumkin, lekin parallel faol epizod ochilmaydi.',
      ] },
      { title: 'Sanalarni rejalashtirish va limitni tushunish', paragraphs: [
        'Prototip vaqtinchalik yordamning boshlang‘ich rejasini kalendar yilidagi jami 14 kun bilan, konsilium asosida uzaytirilgan rejani jami 28 kun bilan tekshiradi. Qabul va yakun sanalari hisobga kiradi; yil almashsa, har yil alohida tekshiriladi. Bu hisoblash usuli mahsulotdagi ochiq prototip talqini bo‘lib, yakuniy hisob metodikasi sifatida taqdim etilmaydi.',
        'Masalan, shartli yil ichida avval 5 kun xizmat olingan bo‘lsa, yangi boshlang‘ich reja yana 14 kun emas, qolgan 9 kun doirasida tekshiriladi. 1-sentabrdan 14-sentabrgacha 14 kun hisoblanadi. Uzaytirish mavjud epizodga yangi konsilium qarorini qo‘shadi; eski qabul tarixini o‘chirmaydi.',
      ] },
      { title: 'Yakunlashdan keyin mas’ulning ishlari', paragraphs: [
        'Yakunlash xizmat epizodini yopadi, o‘rinni bo‘shatadi va shu ishning ochiq tashriflarini bekor qiladi. Chiqarish yoki boshqa muassasaga o‘tkazishda bola Keyingi kuzatuv holatiga o‘tadi. Qabul qiluvchi shifokor va kuzatuv rejasi bola kartasida alohida qayd etiladi.',
        'Vafot holatida klinik epizod yopiladi va oilaga uch kalendar oygacha yordam davri ochiladi. Jihozlar avtomatik qaytarilmaydi, reja vazifalari avtomatik bajarilgan bo‘lmaydi. Mas’ul xodim Jihozlar va Yordam rejasi bo‘limlaridagi ochiq yozuvlarni alohida tekshiradi.',
      ] },
    ],
    steps: [
      { title: 'Qabul uchun ishni tekshirish', actor: 'Muvofiqlashtiruvchi', action: 'Bola kartasida eng so‘nggi Markaz qarori, yordam shakli, bola yoshi va Qabul tasdiqlangan holatini tekshiring.', result: 'Statsionarga joylashtirishga asos bo‘ladigan ish aniqlanadi.', route: `${base}/cases` },
      { title: 'O‘rin va oldingi kunlarni ko‘rish', actor: 'Bosh hamshira / muvofiqlashtiruvchi', action: 'Statsionar o‘rinlar va bolaning oldingi epizodlarini ko‘ring. Bo‘sh, foydalanishga tayyor o‘rin hamda vaqtinchalik yordamning yillik kunlarini solishtiring.', result: 'Joylashtirish resursi va rejalashtirish cheklovlari ma’lum bo‘ladi.', route: `${base}/inpatient` },
      { title: 'Joylashtirish formasini ochish', actor: 'Muvofiqlashtiruvchi', action: 'Joylashtirish tugmasini bosing. Bola va Boshlanish sanasi maydonlarini tekshiring; sana qarordan oldin yoki kelajakda bo‘lmasin.', result: 'Yangi epizodning kimga va qachondan tegishli ekani belgilanadi.' },
      { title: 'Joylashtirish shaklini belgilash', actor: 'Konsilium qarorini qayd etuvchi xodim', action: 'Joylashtirish turi maydonida qarorga muvofiq Vaqtinchalik yoki Muddatsiz — klinik xulosa bilan variantini tanlang. Bo‘sh o‘rinni belgilang; vaqtinchalik turda Rejalashtirilgan yakunni kiriting.', result: 'O‘rin va tegishli muddat tekshiruvlari uchun ma’lumot tayyor bo‘ladi.' },
      { title: 'Qaror asosini qayd etish', actor: 'Muvofiqlashtiruvchi', action: 'Konsilium qarori raqami va Qaror asosi / klinik xulosa maydonlarini to‘ldiring. Zarur bo‘lsa, Hamroh (ixtiyoriy) maydoniga vakilni yozing. Namuna bilan to‘ldirish faqat shartli matn tayyorlaydi.', result: 'Joylashtirishning hujjatli asosi ko‘rinadi; hali xizmat boshlanmagan bo‘ladi.' },
      { title: 'Qabulni saqlash', actor: 'Muvofiqlashtiruvchi', action: 'Saqlashni bosing. Xato ko‘rinsa, aynan ko‘rsatilgan sana, o‘rin, qaror yoki limitni tuzating va yana saqlang.', result: 'Faol epizod ochiladi, holat Statsionarda bo‘ladi, o‘rin band hisoblanadi.' },
      { title: 'Individual yordamni yuritish', actor: 'Yordam ko‘rsatuvchi mutaxassislar', action: 'Bola kartasidagi Yordam rejasi orqali vazifa, mas’ul va muddatlarni kiriting; xizmat amalda bajarilgach, natijasini alohida qayd eting.', result: 'Joylashtirish yozuvi bilan birga ko‘rsatiladigan yordam mazmuni ham yuritiladi.', route: `${base}/cases` },
      { title: 'Uzaytirish ehtiyojini ko‘rib chiqish', actor: 'Markaz konsiliumi', action: 'Davom ettirish zarurati bo‘lsa, amaldagi reja, oldingi kunlar va yosh chegaralarini ko‘rib, qaror sanasi, raqami va asosini belgilang.', result: 'Muddatni o‘zgartirishga inson tomonidan qabul qilingan qaror tayyorlanadi.' },
      { title: 'Uzaytirishni rasmiylashtirish', actor: 'Muvofiqlashtiruvchi', action: 'Faol joylashtirishda Muddatni uzaytirishni oching. Yangi yakun sanasi, Konsilium sanasi, qaror raqami va Uzaytirish asosini kiriting. 18 yoshdan keyingi davom uchun tegishli konsilium tasdig‘ini belgilang.', result: 'Tekshiruvdan keyin yangi muddat va qaror uzaytirish tarixiga qo‘shiladi.', route: `${base}/inpatient` },
      { title: 'Epizodni yakunlashni tayyorlash', actor: 'Davolovchi mutaxassis va muvofiqlashtiruvchi', action: 'Yakunlashni oching. Yakun sanasi, Yakunlash sababi, hujjat va Yakuniy xulosa va keyingi harakatni kiriting. Vafot sababiga e’tiroz qayd etilsa, Patologoanatomiya bo‘limiga yo‘llash qaydini ham to‘ldiring.', result: 'Chiqarish, o‘tkazish yoki vafotning alohida asosi saqlashga tayyor bo‘ladi.' },
      { title: 'Yakunlash va yangi holatni tekshirish', actor: 'Muvofiqlashtiruvchi', action: 'Epizodni yakunlashni bosing. Bo‘shagan o‘rin, yopilgan epizod va bolaning Keyingi kuzatuv yoki Oilaga yordam holatini tekshiring.', result: 'Faol statsionar xizmat yakunlanadi; keyingi jarayon alohida ochiladi.' },
      { title: 'Topshirish va resurslarni nazorat qilish', actor: 'Oilaviy shifokor, muvofiqlashtiruvchi va jihozlar mas’uli', action: 'Chiqarilganda bola kartasida Topshirishni qayd etish orqali kuzatuvni yozing. Vafotda oilaviy reja oching. Agar oldingi jihoz berish yozuvi mavjud bo‘lsa, amaldagi qaytarishni Jihozlarda alohida qayd eting.', result: 'Klinik epizod, keyingi yordam va resurs qaytarish holatlari bir-biridan aniq ajraladi.' },
    ],
    rules: [
      { tone: 'waiting', condition: 'Konsilium qarori mavjud, lekin eng so‘nggi qaror boshqa xizmat shakliga tegishli.', action: 'Joylashtirish formasida xizmat shaklini o‘zboshimchalik bilan almashtirmang; Markaz konsiliumi qarorini tekshiring.', owner: 'Markaz konsiliumi va muvofiqlashtiruvchi', basis: 'Prototipda xizmat shakli eng so‘nggi tasdiqlangan qarorga mos bo‘lishi shart.' },
      { tone: 'waiting', condition: 'Tanlangan o‘rin boshqa faol epizodga biriktirilgan yoki foydalanishga tayyor emas.', action: 'Boshqa bo‘sh o‘rinni tanlang; haqiqiy yakunlash bo‘lmasdan avvalgi bolani chiqarilgan deb qayd etmang.', owner: 'Bosh hamshira', basis: 'Prototipning bir o‘rin — bir faol epizod tekshiruvi.' },
      { tone: 'waiting', condition: 'Boshlang‘ich vaqtinchalik reja 18 yoshga to‘lish sanasini qamraydi.', action: 'Yangi qabul rejasini 18 yoshdan oldingi doirada kiriting; davom ettirishni alohida konsilium qarori bilan yuriting.', owner: 'Markaz konsiliumi', basis: 'Nizomdagi yangi qabul va davom ettirish farqi; prototipning sana tekshiruvi.' },
      { tone: 'waiting', condition: 'Uzaytirish sanasi avvalgi rejalashtirilgan yakundan keyin emas.', action: 'Haqiqiy uzaytirish uchun keyingi sanani kiriting. Bu forma eski yozuvni tahrirlash yoki muddatni qisqartirish amali emas.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototip uzaytirishni alohida tarixiy qaror sifatida qo‘shadi.' },
      { tone: 'rejected', condition: 'Yangi yakun sanasi 21 yoshga to‘lish kuniga yetadi yoki undan o‘tadi.', action: 'Davom ettirishni bu sana bilan saqlamang; yosh chegarasigacha bo‘lgan xizmat va keyingi kuzatuvni mas’ullar bilan ko‘rib chiqing.', owner: 'Markaz konsiliumi', basis: 'Prototip 21 yoshga to‘lgan sanadagi davomni bloklaydi.' },
      { tone: 'cancelled', condition: 'Klinik epizod yakunlanmoqda va ochiq tashriflar bor.', action: 'Yakunlashdan keyin ularning Bekor qilingan holatini tekshiring; ularni bajarilgan xizmat sifatida hisoblamang.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototipning yakunlash bilan bog‘liq tashriflarni bekor qilish amali.' },
      { tone: 'action', condition: 'Jihoz avval berilgan, lekin epizod yakunlangan.', action: 'Jihoz amalda qaytgandan keyingina Qaytarib olishni bajaring.', owner: 'Jihozlar uchun mas’ul', basis: 'Nizomdagi jihoz hisobi; prototip xizmat yakuni bilan qaytarishni ajratadi.' },
    ],
    faq: [
      { question: 'Qabul tasdiqlangan bola nega hali o‘rin band qilmagan?', answer: 'Konsilium tasdig‘i va amaldagi joylashtirish alohida bosqich. Joylashtirish formasini to‘ldirib Saqlash bajarilgandan keyin o‘rin faol epizodga biriktiriladi.' },
      { question: 'Hamroh maydoni rozilik hujjatini almashtiradimi?', answer: 'Yo‘q. U kim hamroh ekanini ko‘rsatadigan ixtiyoriy qayd. Konsilium qarori, qonuniy vakil ma’lumotlari va tegishli roziliklar alohida mazmunga ega.' },
      { question: 'Yangi yil kirsa oldingi epizod yo‘qoladimi?', answer: 'Yo‘q. Epizod tarixi saqlanadi. Kunlar har kalendar yilga tegishli sanalar bo‘yicha ajratib tekshiriladi; yil almashishi xizmatni avtomatik yopmaydi.' },
      { question: 'Noto‘g‘ri kiritilgan uzaytirishni shu formada tahrirlash mumkinmi?', answer: 'Hozirgi prototipda uzaytirish tarixini tahrirlash amali yo‘q. Saqlashdan oldin sanalarni tekshiring. Demo xatosini tushuntirish uchun Muloqot qaydi yozish mumkin; sahifani yangilash esa butun demo sessiyasini boshlang‘ich namunaga qaytaradi.' },
      { question: 'Boshqa muassasaga o‘tkazish bilan kuzatuvga chiqarish bir xilmi?', answer: 'Ikkalasi faol epizodni yopib Keyingi kuzatuv holatiga olib o‘tadi, lekin yakunlash sababi va hujjati tarixda alohida saqlanadi. Qabul qiluvchi va keyingi harakatni xulosada aniq yozing.' },
      { question: 'Yakunlash tugmasi bosilganda hali bajarilmagan reja vazifalari bajarilgan bo‘ladimi?', answer: 'Yo‘q. Epizod yopilishi vazifa natijasi emas. Ochiq vazifalarni Yordam rejasida tekshiring; vafotdan keyin bola uchun klinik vazifani bajarilgan deb belgilash bloklanadi.' },
    ],
    checklist: [
      'Eng so‘nggi Markaz qarori statsionar qabulni tasdiqlagan.', 'Boshlanish sanasi qarordan oldin va bugundan keyin emas; bola qabulda 18 yoshga to‘lmagan.',
      'Tanlangan o‘rin bo‘sh va foydalanishga tayyor.', 'Joylashtirish turi klinik qarorga mos; vaqtinchalik reja oldingi kunlarni hisobga olgan.',
      'Qaror raqami va klinik asos mazmunli yozilgan.', 'Uzaytirishda alohida qaror sanasi, raqami, asos va yosh bo‘yicha tasdiq tekshirilgan.',
      'Yakunlash sababi va hujjat to‘g‘ri tanlangan; vafotga e’tiroz bo‘lsa yo‘naltirish qaydi bor.', 'Yopilgan epizod va bo‘shagan o‘rin ekranda tekshirilgan.',
      'Keyingi shifokor kuzatuvi yoki oilaviy yordam rejasi yuritilgan.', 'Jihoz va ochiq vazifalar avtomatik yakunlangan deb qabul qilinmagan.',
    ],
    fields: [
      { name: 'Bola', location: 'Statsionar → Joylashtirish', requirement: 'Majburiy; qabul tasdiqlangan statsionar ishlar ichidan.', meaning: 'Yangi epizod ochiladigan bola kartasi.', example: 'Sardor K. (namuna) — qabul tasdiqlangan.' },
      { name: 'Boshlanish sanasi', location: 'Statsionarga joylashtirish', requirement: 'Majburiy; qaror sanasidan oldin emas, bugundan keyin emas; qabul yoshi 18 dan kichik.', meaning: 'Amaldagi joylashtirish boshlangan sana; yillik kunlar shu kundan boshlanadi.', example: '2026-09-01 — faqat qaror va joriy demo sanasiga mos bo‘lsa.' },
      { name: 'Joylashtirish turi', location: 'Statsionarga joylashtirish', requirement: 'Qarorga muvofiq variant tanlanadi.', meaning: 'Vaqtinchalik muddatli reja yoki klinik xulosa bilan muddatsiz yordam.', example: 'Vaqtinchalik.' },
      { name: 'Bo‘sh o‘rin', location: 'Statsionarga joylashtirish', requirement: 'Majburiy; band yoki tayyor bo‘lmagan o‘rin qabul qilinmaydi.', meaning: 'Bola biriktiriladigan aniq xona va o‘rin.', example: 'Ro‘yxatdagi bo‘sh xona va o‘rin (namuna).' },
      { name: 'Rejalashtirilgan yakun', location: 'Statsionarga joylashtirish → Vaqtinchalik', requirement: 'Vaqtinchalik turda majburiy; boshlanishdan oldin emas, boshlang‘ich yillik 14 kun va yosh tekshiruvidan o‘tadi.', meaning: 'Birinchi rejaning yakun sanasi; bu avtomatik chiqarish buyrug‘i emas.', example: '2026-09-14 — 1-sentabr qabul, shu yili oldingi kunlar bo‘lmasa.' },
      { name: 'Konsilium qarori raqami', location: 'Statsionarga joylashtirish', requirement: 'Majburiy.', meaning: 'Qabulga asos bo‘lgan qaror rekviziti; haqiqiy hujjat fayli bu maydonga yuklanmaydi.', example: 'DEMO-MK-045 / 01.09.2026.' },
      { name: 'Qaror asosi / klinik xulosa', location: 'Statsionarga joylashtirish', requirement: 'Majburiy; klinik qarorni xodim qayd etadi.', meaning: 'Nima sababdan aynan shu xizmat va joylashtirish turi belgilanganini izohlaydi.', example: 'Konsilium vaqtinchalik statsionar yordam va oila bilan parvarish rejasini tasdiqlagan (namuna).' },
      { name: 'Hamroh (ixtiyoriy)', location: 'Statsionarga joylashtirish', requirement: 'Ixtiyoriy.', meaning: 'Hamrohning F.I.Sh. va qarindoshligi; alohida rozilik yoki imzo o‘rnini bosmaydi.', example: 'M. Karimova, onasi (namuna).' },
      { name: 'Yangi yakun sanasi', location: 'Faol joylashtirish → Muddatni uzaytirish', requirement: 'Majburiy; avvalgi yakundan keyin, qaror sanasidan oldin emas; tegishli 28 kun va yosh tekshiruvlari bor.', meaning: 'Konsilium belgilagan yangi reja chegarasi.', example: '2026-09-25 — vaqtinchalik jami 25 kunlik reja (namuna).' },
      { name: 'Konsilium sanasi', location: 'Yordam muddatini uzaytirish', requirement: 'Majburiy; epizod boshlanishidan oldin va bugundan keyin emas.', meaning: 'Davom ettirish qarori qabul qilingan sana.', example: '2026-09-10 — demo joriy sanasi bunga imkon bersa.' },
      { name: 'Konsilium qarori raqami; Uzaytirish asosi', location: 'Yordam muddatini uzaytirish', requirement: 'Ikkalasi majburiy.', meaning: 'Mavjud epizodni nega va qaysi qaror bilan davom ettirish belgilanganini tarixga qo‘shadi.', example: 'DEMO-UZ-014; individual reja davomiyligi konsiliumda qayta ko‘rib chiqildi (namuna).' },
      { name: 'Xizmat davomida 18 yoshga to‘lgan bola uchun konsilium belgilagan davom ettirish', location: 'Yordam muddatini uzaytirish → belgilash katagi', requirement: 'Yangi yakun sanasida yosh 18 yoki katta bo‘lsa, alohida konsilium tasdig‘i kerak.', meaning: 'Mavjud epizodning yoshdan keyingi davomi; yangi katta yoshli qabulni ochmaydi.', example: 'Faqat tegishli konsilium qarori mavjud namuna holatida belgilanadi.' },
      { name: 'Yakun sanasi', location: 'Faol joylashtirish → Yakunlash', requirement: 'Majburiy; qabuldan oldin va bugundan keyin emas.', meaning: 'Klinik epizod amalda yakunlangan sana.', example: '2026-09-08 — epizod shu sanada yakunlangan shartli holat.' },
      { name: 'Yakunlash sababi', location: 'Xizmat epizodini yakunlash', requirement: 'Uch variantdan biri tanlanadi.', meaning: 'Oilaviy shifokor kuzatuviga chiqarish, boshqa muassasaga o‘tkazish yoki vafot; keyingi holatni belgilaydi.', example: 'Oilaviy shifokor kuzatuviga chiqarish.' },
      { name: 'Chiqarish yoki o‘tkazish hujjati', location: 'Xizmat epizodini yakunlash → chiqarish / o‘tkazish', requirement: 'Majburiy.', meaning: 'Yakunlash hujjatining raqami va sanasi.', example: 'DEMO-EPI-007 / 08.09.2026.' },
      { name: 'O‘lim epikrizi raqami / hujjat', location: 'Xizmat epizodini yakunlash → Vafot holati', requirement: 'Vafot tanlanganda majburiy.', meaning: 'Klinik epizod yakunini asoslovchi o‘lim epikrizi rekviziti.', example: 'DEMO-VAFOT-EPI-008 / 08.09.2026.' },
      { name: 'Yakuniy xulosa va keyingi harakat', location: 'Xizmat epizodini yakunlash', requirement: 'Majburiy.', meaning: 'Epizod natijasi, topshirish yoki oilaviy yordam bo‘yicha keyingi qadam.', example: 'Epizod yakunlandi; oilaviy shifokorga kuzatuv rejasi topshiriladi (namuna).' },
      { name: 'Qonuniy vakil o‘lim sababiga e’tiroz bildirgan', location: 'Xizmat epizodini yakunlash → Vafot holati', requirement: 'Faqat e’tiroz haqiqatan qayd etilgan holatda xodim belgilaydi.', meaning: 'Patologoanatomiya bo‘limiga yo‘llash qaydi zarurligini ochadi.', example: 'Shartli e’tirozli ssenariyda qo‘lda belgilanadi.' },
      { name: 'Patologoanatomiya bo‘limiga yo‘llash qaydi', location: 'Vafot holati → e’tiroz belgilanganda', requirement: 'E’tiroz bo‘lsa majburiy.', meaning: 'Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining Patologoanatomiya va murdalarni saqlash bo‘limiga yo‘naltirish qaydi.', example: 'DEMO-PAT-008; bo‘limga yo‘llash rekviziti va mas’ul qaydi (namuna).' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Joylashtirish tugmasi faol emas yoki bola tanlovda yo‘q.', reason: 'Statsionar qabul tasdiqlanmagan, boshqa faol epizod bor yoki bo‘sh o‘rin qolmagan bo‘lishi mumkin.', solution: 'Bola kartasidagi joriy holat va eng so‘nggi qarorni, Statsionar o‘rinlar ro‘yxatini tekshiring. Tegishli qaror yoki haqiqiy bo‘sh o‘rin bo‘lmaguncha joylashtirishni saqlamang.' },
      { tone: 'waiting', problem: 'Tanlangan o‘rin band yoki foydalanishga tayyor emas.', reason: 'O‘rin boshqa faol epizodga biriktirilgan yoki foydalanish belgisi o‘chiq.', solution: 'Bo‘sh o‘rin ro‘yxatidan boshqa tayyor o‘rinni tanlang. Bandlikni soxta chiqarish orqali o‘zgartirmang.' },
      { tone: 'waiting', problem: 'Yillik 14 kunlik boshlang‘ich limitdan oshadi.', reason: 'Yangi vaqtinchalik reja va shu yilgi oldingi epizod kunlari boshlang‘ich chegaradan oshgan.', solution: 'Bola tarixini va ikkala sana ham hisoblanishini tekshiring. Asosli yangi qabulni qolgan boshlang‘ich davr ichida rejalang; qo‘shimcha davom faqat konsiliumning alohida uzaytirish qarori bilan yuritiladi.' },
      { tone: 'waiting', problem: 'Uzaytirish sanalari yoki qarori qabul qilinmadi.', reason: 'Qaror asosi bo‘sh, sana kelajakda, epizoddan oldin yoki yangi yakun avvalgi yakundan keyin emas.', solution: 'Yangi yakun sanasi, Konsilium sanasi, raqam va asosni tekshiring. Bu oynada oldingi muddatni qisqartirish/tahrirlash amali mavjud emas.' },
      { tone: 'waiting', problem: '18 yoshdan keyingi davom ettirish bloklandi.', reason: 'Alohida konsilium tasdig‘i belgilanmagan yoki yangi qabulga davom ettirish qoidasi qo‘llanmoqda.', solution: 'Yangi qabul bilan mavjud epizod uzaytirilishini ajrating. Faqat tegishli davom ettirish qarori mavjud bo‘lsa belgilash katagini tasdiqlang; 21 yoshga yetadigan sanani kiritmang.' },
      { tone: 'waiting', problem: '28 kunlik vaqtinchalik yotish tekshiruvi uzaytirishni to‘xtatdi.', reason: 'Prototipda joriy kalendar yili bo‘yicha oldingi vaqtinchalik epizodlar va yangi reja yig‘indisi tekshiriladi.', solution: 'Tarix va reja sanalarini qayta ko‘ring. Muddatsiz tur yoki yangi bola kartasini limitdan o‘tish uchun ishlatmang; konsilium keyingi yordam yo‘lini ko‘rib chiqadi.' },
      { tone: 'waiting', problem: 'Vafot holatini saqlashda patologiya qaydi talab qilindi.', reason: 'Qonuniy vakil e’tirozi belgilangan, yo‘naltirish qaydi esa bo‘sh.', solution: 'Tegishli bo‘limga yo‘llash rekviziti va qaydini kiriting; e’tiroz belgisini faqat xato belgilangan bo‘lsa tuzating.' },
      { tone: 'action', problem: 'Yakunlashdan keyin jihoz hali Foydalanishda turibdi.', reason: 'Klinik epizod yopilishi jihozning amalda qaytganini bildirmaydi.', solution: 'Jihoz qaytganda Jihozlar → Qaytarib olish orqali holat va qabul qilish qaydini yozing; texnik tekshiruv kerak bo‘lsa tegishli katakni belgilang.' },
    ],
    outcomes: [
      'Qaror, bola va o‘ringa bog‘langan faol yoki yakunlangan statsionar epizod ko‘rinadi.', 'Vaqtinchalik reja va uzaytirishlar sanasi, raqami hamda asosi tarixda ajraladi.',
      'O‘rin bandligi faol epizodga mos; chiqarilganda o‘rin bo‘shaydi.', 'Chiqarish/o‘tkazishdan keyingi kuzatuv yoki vafotdan keyingi oilaviy yordam alohida yuritiladi.', 'Yakunlangan epizod va bekor qilingan tashriflar bajarilgan yordam bilan aralashtirilmaydi.',
    ],
    relatedTopics: ['consilium', 'care-plan', 'follow-up', 'equipment', 'reports'],
    flows: [
      {
        id: 'inpatient-full', title: 'Statsionar qabuldan keyingi yordamgacha', description: 'Konsilium qarori, o‘rin va sanalar tekshiruvidan faol epizod, uzaytirish hamda chiqarish yoki oilaviy yordamgacha bo‘lgan ish oqimi.',
        definition: `flowchart TD
 A["Muvofiqlashtiruvchi bola kartasini ochadi"] --> B["Eng so‘nggi Markaz qarori va holat"]
 B --> C{"Statsionar qabul tasdiqlanganmi?"}
 C -->|"Yo‘q"| D["Konsilium bosqichini aniqlashtirish"]
 D --> B
 C -->|"Ha"| E{"Faol epizod yoki oilaviy yordam bormi?"}
 E -->|"Bor"| F["Yangi epizod ochilmaydi"]
 E -->|"Yo‘q"| G["Joylashtirish: bola va boshlanish sanasi"]
 G --> H{"Sana va 18 yoshgacha qabul mosmi?"}
 H -->|"Yo‘q"| I["Sana yoki qabul asosini qayta ko‘rish"]
 I --> G
 H -->|"Ha"| J["Bo‘sh va tayyor o‘rinni tanlash"]
 J --> K{"O‘rin hali bo‘shmi?"}
 K -->|"Yo‘q"| J
 K -->|"Ha"| L{"Konsilium belgilagan turi"}
 L -->|"Vaqtinchalik"| M["Yakun sanasi va avvalgi yillik kunlar"]
 M --> N{"Boshlang‘ich 14 kun va yosh tekshiruvi mosmi?"}
 N -->|"Yo‘q"| M
 N -->|"Ha"| O["Qaror raqami va klinik asos"]
 L -->|"Muddatsiz"| O
 O --> P["Saqlash: faol epizod va band o‘rin"]
 P --> Q["Mutaxassislar individual yordamni yuritadi"]
 Q --> R{"Keyingi harakat"}
 R -->|"Davom ettirish"| S["Konsilium uzaytirish qarorini beradi"]
 S --> T["Muddatni uzaytirish: sana va asos"]
 T --> U{"Sanalar, 28 kun va yosh talablari mosmi?"}
 U -->|"Yo‘q"| S
 U -->|"Ha"| V["Yangi muddat va qaror tarixga qo‘shiladi"]
 V --> Q
 R -->|"Yakunlash"| W["Yakun sanasi, sabab, hujjat va xulosa"]
 W --> X{"Vafot va vakil e’tirozi bormi?"}
 X -->|"Ha"| Y["Patologoanatomiya yo‘llash qaydi"]
 Y --> Z["Epizodni yakunlash"]
 X -->|"Yo‘q"| Z
 Z --> AA["O‘rin bo‘shaydi; ochiq tashriflar bekor"]
 AA --> AB{"Yakunlash sababi vafotmi?"}
 AB -->|"Yo‘q"| AC["Keyingi kuzatuv va shifokorga topshirish"]
 AB -->|"Ha"| AD["Klinik epizoddan alohida oilaga yordam"]
 AC --> AE["Ochiq jihoz va vazifalarni alohida tekshirish"]
 AD --> AE
  class A,G,J,O,Q,W,Y,Z,AC,AD,AE guide_action;
  class P,V guide_success;
  class F guide_rejected;
  class AA guide_cancelled;
  class B,C,D,E,H,I,K,L,M,N,R,S,T,U,X,AB guide_waiting;`,
        walkthrough: [
          'Birinchi tarmoq eng so‘nggi qaror va holatni tekshiradi. Qabul hali tasdiqlanmagan bo‘lsa, joylashtirish o‘rniga Konsilium bosqichiga qaytiladi.',
          'Faol epizod yoki oilaviy yordam mavjudligi yangi klinik epizod ochilishini to‘xtatadi; bu tarmoq boshqa o‘rin tanlash bilan yechilmaydi.',
          'Sana/yosh tekshiruvi qabulning huquqiy va vaqt chegarasini, o‘rin tekshiruvi esa resurs bandligini aniqlaydi. Band o‘rin tanlansa o‘rin tanlashga qaytiladi.',
          'Vaqtinchalik tarmoq rejalashtirilgan yakun va oldingi kunlarni tekshiradi. Muddatsiz tarmoq uchun klinik asos qayd etiladi; u 14/28 kun tekshiruvini chetlash uchun tanlanmaydi.',
          'Saqlashdan keyingina Statsionarda holati va band o‘rin paydo bo‘ladi. Individual reja xizmat davomida alohida to‘ldiriladi.',
          'Davom ettirish aylanasida konsilium yangi qaror beradi. Tekshiruv rad etsa qaror/sana rejasi qayta ko‘riladi; muvaffaqiyatli uzaytirish yordam ko‘rsatish bosqichiga qaytadi. 28 kun faqat vaqtinchalik turga tegishli.',
          'Yakunlash tarmog‘ida hujjat va xulosa majburiy. Faqat vafot hamda vakil e’tirozi birga bo‘lsa patologiya yo‘llash qaydi talab etiladi.',
          'Epizod yopilgach o‘rin bo‘shaydi va ochiq tashriflar bekor qilinadi. Chiqarish/o‘tkazish kuzatuvga, vafot esa alohida oilaviy yordamga yo‘naltiradi.',
          'Ikkala yakun yo‘li ham jihoz va vazifalarni alohida ko‘rib chiqish bilan tugaydi: ular avtomatik qaytarilgan yoki bajarilgan hisoblanmaydi.',
        ],
      },
      {
        id: 'inpatient-extension-review', title: 'Uzaytirish xatosini sababiga ko‘ra bartaraf etish', description: 'Faol epizod, qaror sanasi, 18/21 yosh va vaqtinchalik 28 kun tekshiruvlari bo‘yicha qayta ko‘rib chiqish yo‘li.',
        definition: `flowchart TD
 A["Muddatni uzaytirish so‘rovi"] --> B{"Faol statsionar epizod bormi?"}
 B -->|"Yo‘q"| C["Bola kartasida joriy xizmatni tekshirish"]
 B -->|"Ha"| D["Yangi sana, konsilium sanasi, raqam va asos"]
 D --> E{"Qaror ma’lumoti va sanalar to‘liqmi?"}
 E -->|"Yo‘q"| F["Bo‘sh maydon yoki noto‘g‘ri sanani tuzatish"]
 F --> D
 E -->|"Ha"| G{"Yangi sana avvalgi yakundan keyinmi?"}
 G -->|"Yo‘q"| H["Haqiqiy uzaytirish rejasini aniqlashtirish"]
 H --> D
 G -->|"Ha"| I{"Yangi sanada 21 yoshga to‘ladimi?"}
 I -->|"Ha"| J["Bu sanagacha davom ettirish bloklanadi"]
 J --> K["Konsilium keyingi yordam yo‘lini ko‘radi"]
 I -->|"Yo‘q"| L{"Yangi sanada yosh kamida 18 mi?"}
 L -->|"Ha"| M{"Alohida davom ettirish tasdig‘i bormi?"}
 M -->|"Yo‘q"| K
 K --> D
 M -->|"Ha"| N{"Vaqtinchalik yordammi?"}
 L -->|"Yo‘q"| N
 N -->|"Ha"| O{"Kalendar yildagi jami 28 kundan oshadimi?"}
 O -->|"Ha"| P["Oldingi epizodlar va sanalarni qayta hisoblash"]
 P --> K
 O -->|"Yo‘q"| Q["Saqlash"]
 N -->|"Muddatsiz"| Q
 Q --> R["Uzaytirish tarixi va yangi muddat"]
 R --> S["Faol yordam davom etadi"]
  class A,D,Q,S guide_action;
  class R guide_success;
  class J guide_rejected;
  class B,C,E,F,G,H,I,K,L,M,N,O,P guide_waiting;`,
        walkthrough: [
          'Faol statsionar epizod bo‘lmasa bu forma yangi qabul yaratmaydi; avval joriy xizmat holati aniqlanadi.',
          'Bo‘sh raqam/asos, kelajakdagi konsilium sanasi yoki epizoddan oldingi qaror sanasi ma’lumot kiritish bosqichiga qaytaradi.',
          'Yangi yakun avvalgi yakundan keyin bo‘lishi kerak. Teng yoki oldingi sana uzaytirish sifatida qabul qilinmaydi; eski yozuvni tahrirlash imkoniyati deb tushunilmaydi.',
          '21 yoshga to‘lish sanasini qamrab olgan reja bloklanadi. Bu tarmoqda tasdiq katagini belgilash cheklovni olib tashlamaydi.',
          '18 yoshdan 21 yoshgacha bo‘lgan davom uchun alohida konsilium tasdig‘i tekshiriladi. Tasdiq yo‘q bo‘lsa xodim klinik qaror o‘rniga belgi qo‘ymaydi.',
          '28 kun tarmog‘i faqat vaqtinchalik epizodga tegishli; oldingi yillik kunlar bilan yangi reja tekshiriladi. Muddatsiz klinik yordam bu vaqtinchalik hisob tarmog‘idan o‘tmaydi.',
          'Hisob xatosi aniqlansa sanalar tuzatiladi; rejaning o‘zi chegaradan oshsa konsilium keyingi yordamni ko‘rib chiqadi. Yangi karta yoki boshqa tur bilan limit aylanib o‘tilmaydi.',
          'Barcha talablar bajarilgach Saqlash yangi tarix yozuvini yaratadi va mavjud epizod davom etadi; alohida yangi epizod ochilmaydi.',
        ],
      },
    ],
  },
  mobile: {
    prerequisites: [
      'Eng so‘nggi Markaz konsiliumi qarori Mobil yordamni tasdiqlagan, vakil yoki yaqin qarindosh roziligi va rozilik bergan shaxs qayd etilgan bo‘lishi kerak.',
      'Mobil epizod boshlanishidan oldin PaPaSdan alohida uyda yordam ehtiyoji bahosi, uning metodikasi, shifokori, hujjati va haftalik tashrif soni mavjud bo‘ladi.',
      'Boshlang‘ich xizmat sanasi qarordan oldin va kelajakda emas; yangi qabulda bola 18 yoshga to‘lmagan bo‘lishi kerak.',
      'Mobil brigada ro‘yxatdan tanlanadi. Aniq tashrifga o‘tishdan oldin individual yordam rejasi, manzil, vakil va tashrif maqsadi ko‘rib chiqiladi.',
      'Tashrif faqat faol mobil epizodga yoki faol oilaviy yordam davriga bog‘lanadi. Oilaviy yordamda sana uch kalendar oylik davr ichida bo‘ladi.',
      'Prototip brigada va bolaning jadval to‘qnashuvini tekshiradi; haqiqiy telefon aloqasi, marshrut hisoblash, GPS yoki avtomatik eslatmalar ulanmagan.',
    ],
    sections: [
      { title: 'Baholash natijasidan amaliy jadvalgacha', paragraphs: [
        'PaPaS bola palliativ yordamga ehtiyojini dastlabki jarayonda qayd etadi. Uyda yordam ehtiyoji esa boshqa baholash yozuvi: uning natijasi uyga tashrif chastotasini rejalashtirish uchun ishlatiladi. Bir bahodagi raqam ikkinchisiga avtomatik ko‘chirilmaydi; har birida shifokor, metodika va hujjat ko‘rsatiladi.',
        'Uy ehtiyoji 15–20 ball bo‘lsa haftasiga 1, 21–24 ball bo‘lsa 2, 25 va undan yuqori bo‘lsa 3 uyga tashrif tavsiyasi ko‘rinadi. Alohida asos bilan boshqa 1–7 son tanlanishi mumkin. 15 dan past bahoga tayyor me’yor belgilanmagan: sonni kiritishda konsilium asosini ham yozish kerak. 1–7 son chegarasi va 0–100 ball oralig‘i prototip maydon tekshiruvlari bo‘lib, yangi tibbiy me’yor emas.',
      ] },
      { title: 'Chastota, brigada va tashrif uch xil yozuv', paragraphs: [
        'Haftalik sonni saqlash aniq sanalarda tashrif yaratmaydi. Mobil yordamni boshlash xizmat epizodini va brigada biriktirishini yaratadi. Tashrif rejalashtirish esa har bir uchrashuvning sanasi, boshlanish vaqti, davomiyligi, brigadasi, xizmat turi va maqsadini alohida saqlaydi.',
        'Bir brigada yoki bitta bola uchun vaqt oralig‘i ustma-ust kelsa yangi tashrif saqlanmaydi. Masalan, 10:00–11:00 band bo‘lsa 10:30–11:30 qabul qilinmaydi; 11:00 dan boshlanadigan tashrif avvalgi oralig‘iga tegmaydi. Bajarilgan eski tashrif ham o‘z tarixiy vaqtini band qiladi; bekor qilingan tashrif to‘qnashuv hisobiga kirmaydi.',
      ] },
      { title: 'Rejadan natijagacha bo‘lgan holatlar', paragraphs: [
        'Rejalashtirilgan tashrifda Boshlash amali mavjud. Vaqti kelmagan bo‘lsa yoki shu brigadaning boshqa tashrifi Bajarilmoqda holatida qolgan bo‘lsa boshlash bloklanadi. Boshlangandan so‘ng Natijani qayd etish orqali ko‘rsatilgan yordam va natija yoziladi; shundan keyin tashrif Bajarilgan bo‘ladi.',
        'Uyga tashrif va Masofaviy maslahat alohida xizmat turlari. Masofaviy maslahat uyga tashrif sifatida hisoblanmaydi. Muloqot qaydidagi masofaviy maslahat ham jadvaldagi tashrifdan boshqa yozuv. Epizod yoki oilaviy yordam yopilganda ochiq tashriflar bekor qilinadi va sababi tarixda ko‘rinadi.',
      ] },
    ],
    steps: [
      { title: 'Mobil qabul qarorini tekshirish', actor: 'Muvofiqlashtiruvchi', action: 'Bola kartasida Qabul tasdiqlangan holati, eng so‘nggi Markaz qaroridagi Mobil yordam shakli va vakil roziligini tekshiring.', result: 'Mobil xizmatni boshlash uchun qaror va rozilik asosi aniqlanadi.', route: `${base}/cases` },
      { title: 'Uy ehtiyoji bahosini ochish', actor: 'Baholagan mutaxassis', action: 'Mobil yordamda Ehtiyoj bahosi yoki bola qatoridagi Baholash orqali Uyda yordam ehtiyojini baholash oynasini oching. PaPaS natijasini uy ehtiyoji deb qabul qilmang.', result: 'Alohida uy ehtiyoji yozuvi tayyorlanadi.', route: `${base}/mobile` },
      { title: 'Baholash dalillarini kiritish', actor: 'Baholagan mutaxassis', action: 'Bola, Uyda yordam ehtiyoji, ball, Baholash sanasi, Baholagan mutaxassis, Metodika / versiyasi va Baholash hujjatini to‘ldiring.', result: 'Ball kim tomonidan, qachon va qaysi hujjat asosida berilgani ko‘rinadi.' },
      { title: 'Haftalik son va istisno asosini belgilash', actor: 'Markaz konsiliumi / mas’ul mutaxassis', action: 'Ko‘rsatilgan tavsiyani tekshirib Haftalik uyga tashriflar sonini kiriting. Tavsiyadan farq qilsa yoki ball 15 dan past bo‘lsa O‘zgartirish asosi — konsilium raqami, sanasi va sababini yozing; Saqlashni bosing.', result: 'Chastota va inson tomonidan belgilangan istisno sababi baholash tarixiga qo‘shiladi.' },
      { title: 'Mobil epizodni boshlash', actor: 'Muvofiqlashtiruvchi', action: 'Qabul tasdiqlangan bolaning Mobil yordamni boshlash oynasida Boshlanish sanasi, Mobil brigada, Konsilium qarori raqami va Qaror asosi / klinik xulosani tekshirib Saqlashni bosing.', result: 'Bola Mobil yordamda holatiga o‘tadi; faol epizod yaratiladi.' },
      { title: 'Tashrif maqsadini yordam rejasiga bog‘lash', actor: 'Brigada va muvofiqlashtiruvchi', action: 'Bola kartasidagi yordam vazifalari, vakil va manzilni ko‘rib, tashrifning aniq maqsadini kelishib oling. Oilaviy yordamda maqsad oila ehtiyojiga tegishli bo‘lsin.', result: 'Tashrif mazmuni va yordam oluvchi aniq bo‘ladi.', route: `${base}/cases` },
      { title: 'Aniq vaqt oralig‘ini rejalashtirish', actor: 'Muvofiqlashtiruvchi', action: 'Tashrif rejalashtirishni bosing. Bola / oila, Sana va vaqt, Davomiylik, daqiqa, Brigada, Xizmat turi va Tashrif maqsadini kiriting.', result: 'Tekshirish uchun to‘liq tashrif rejasi tayyorlanadi.', route: `${base}/mobile` },
      { title: 'Jadval tekshiruvini yakunlash', actor: 'Muvofiqlashtiruvchi', action: 'Saqlashni bosing. Vaqt to‘qnashsa boshqa vaqtni yoki tegishli boshqa brigadani tanlang; bola bandligi ham tekshirilishini hisobga oling.', result: 'Mos yozuv Rejalashtirilgan holatida jadvalga qo‘shiladi.' },
      { title: 'Jadvaldagi tashrifni topish', actor: 'Brigada xodimi', action: 'Tashriflar jadvalidagi sana, davr, brigada va holat filtrlarini tekshiring. Kerak bo‘lsa Barcha sanalar bilan kelajakdagi yoki tarixiy yozuvni toping.', result: 'Kerakli bola/oila, maqsad va rejalashtirilgan vaqt tasdiqlanadi.' },
      { title: 'Tashrifni amalda boshlash', actor: 'Brigada xodimi', action: 'Vaqti kelgan rejalashtirilgan tashrifda Boshlashni bosing. Shu brigadaning boshqa ochiq tashrifi bo‘lsa avval uning haqiqiy natijasini qayd eting.', result: 'Tashrif Bajarilmoqda holatiga o‘tadi va haqiqiy boshlash vaqti yoziladi.' },
      { title: 'Ko‘rsatilgan yordamni yakunlash', actor: 'Xizmat ko‘rsatgan mutaxassis', action: 'Natijani qayd etishni oching. Ko‘rsatilgan yordam va natija maydonida bajarilgan ish, kuzatuv va keyingi qadamni yozib Saqlashni bosing.', result: 'Tashrif Bajarilgan bo‘ladi; natija va yakunlash vaqti saqlanadi.' },
      { title: 'Davomiy reja va tarixni tekshirish', actor: 'Muvofiqlashtiruvchi va mutaxassis', action: 'Bajarilgan, ochiq va bekor qilingan tashriflarni ko‘rib chiqing. Ehtiyoj o‘zgarsa yangi uy bahosini va keyingi tashriflarni kiriting; reja vazifasining natijasini zarur bo‘lsa alohida qayd eting.', result: 'Chastota, real tashriflar va individual reja bir-biriga mos ravishda nazorat qilinadi.' },
      { title: 'Xizmat yakunini rasmiylashtirish', actor: 'Mas’ul mutaxassis va muvofiqlashtiruvchi', action: 'Mobil yordamdagi bola qatoridan Yakunlashni ochib sana, sabab, hujjat va xulosani kiriting. Keyingi kuzatuv yoki oilaviy yordamga o‘tgach bekor qilingan ochiq tashriflar va qolgan jihozlarni tekshiring.', result: 'Mobil klinik epizod yopiladi va keyingi jarayon alohida yuritiladi.' },
    ],
    rules: [
      { tone: 'waiting', condition: 'Mobil qarorda rozilik yoki rozilik bergan shaxs qaydi yo‘q.', action: 'Vakil/yaqin qarindoshning tegishli roziligini konsilium bosqichida qayd eting; brigada tayinlash bu kamchilikni bartaraf etmaydi.', owner: 'Markaz konsiliumi', basis: 'Nizomning mobil yordam roziligi talabi va prototip qabul tekshiruvi.' },
      { tone: 'waiting', condition: 'Uy ehtiyoji bahosi bor, ammo haftalik son aniqlanmagan.', action: 'Alohida uy bahosi formasida chastotani, zarur bo‘lsa konsilium asosini kiriting.', owner: 'Mas’ul mutaxassis', basis: 'Mobil xizmatdan oldin uy ehtiyoji va tashrif rejasi bo‘lishi tekshiriladi.' },
      { tone: 'waiting', condition: 'Uy bahosidagi tavsiyadan farqli son tanlangan.', action: 'Konsilium raqami, sanasi va sababini yozing; klinik qarorni tizimga topshirmang.', owner: 'Markaz konsiliumi', basis: 'Tashrif me’yori va prototipdagi asosli inson qarori qaydi.' },
      { tone: 'waiting', condition: 'Bir vaqt oralig‘ida brigada yoki bola band.', action: 'Yangi yozuv uchun bo‘sh vaqt yoki mos brigadani tanlang. Boshqa brigada tanlash bolaning band vaqtini bekor qilmaydi.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototipning brigada yoki bola bo‘yicha ustma-ust vaqt tekshiruvi.' },
      { tone: 'action', condition: 'Tashrif oilaviy yordam uchun rejalashtirilmoqda.', action: 'Faol oilaviy davr va uning oxirgi sanasini tekshiring; maqsadni oila uchun yozing.', owner: 'Muvofiqlashtiruvchi va psixolog / ijtimoiy xodim', basis: 'Nizomdagi uch oygacha oilaviy yordam; prototipda uch kalendar oy.' },
      { tone: 'waiting', condition: 'Tashrif rejalashtirilgan vaqti hali kelmagan.', action: 'Boshlashni vaqti kelganda bajaring; reja mavjudligini amalda xizmat boshlandi deb talqin qilmang.', owner: 'Brigada xodimi', basis: 'Prototipning haqiqiy boshlash vaqti tekshiruvi.' },
      { tone: 'waiting', condition: 'Boshqa tashrif shu brigadada Bajarilmoqda holatida qolgan.', action: 'O‘sha tashrifning haqiqiy holatini aniqlab, ko‘rsatilgan yordamni natijasi bilan yakunlang; asossiz bajarildi deb yozmang.', owner: 'Brigada xodimi', basis: 'Bir brigadaning parallel boshlangan tashriflarini cheklash.' },
      { tone: 'cancelled', condition: 'Epizod yoki oilaviy yordam yakunlangan.', action: 'Bekor qilingan tashriflarni bajarilgan ko‘rsatkichga qo‘shmang; qayta klinik xizmat uchun yangi tegishli jarayon kerak.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototip ochiq tashriflarni yakunlash sababiga bog‘lab bekor qiladi.' },
    ],
    faq: [
      { question: 'Bir xil ball chiqsa ham PaPaS va uy ehtiyojini ikkalasini kiritish kerakmi?', answer: 'Mobil xizmat uchun alohida uy ehtiyoji qaydi kerak. Ball teng bo‘lishi metodika va maqsad tengligini anglatmaydi; baholovchi, sana va hujjat alohida saqlanadi.' },
      { question: 'Uy bahosi yangilansa oldingi tashriflar o‘zgaradimi?', answer: 'Yo‘q. Eng so‘nggi baho kelgusi rejalashtirish uchun ko‘rinadi; avvalgi baholar va aniq tashrif yozuvlari tarixda qoladi. Yangi tashriflarni alohida rejalashtirasiz.' },
      { question: 'Tashrifni yakka tartibda ko‘chirish yoki bekor qilish tugmasi bormi?', answer: 'Hozirgi prototipda saqlangan tashrifni tahrirlash, ko‘chirish yoki alohida bekor qilish amali yo‘q. Saqlashdan oldin vaqtni tekshiring. Epizod yoki oilaviy yordam haqiqatan yakunlanganda ochiq tashriflar avtomatik bekor qilinadi.' },
      { question: 'Masofaviy maslahat tugagach haftalik uyga tashrif soni bajarilgan bo‘ladimi?', answer: 'Yo‘q. Xizmat turi alohida saqlanadi va masofaviy maslahat uyga tashrif o‘rniga hisoblanmaydi. Jadval va hisobotdagi turini tekshiring.' },
      { question: 'Tashrif natijasi yozilganda reja vazifasi ham tugaydimi?', answer: 'Yo‘q. Tashrif va individual reja vazifasi alohida yozuvlar. Tegishli vazifa bo‘yicha Bajarilganini qayd etish orqali uning natijasini ham yozing.' },
      { question: 'Jadvalda tashrif yo‘qolgandek ko‘rinsa nima qilaman?', answer: 'Avval Tashrif davrini Barcha sanalar qilib, brigada va holat filtrlarini kengaytiring. Tanlangan sanadan tashqaridagi yoki bekor qilingan yozuvlar filtr sababli yashiringan bo‘lishi mumkin.' },
    ],
    checklist: [
      'Mobil qabul qarori va vakil/yaqin qarindosh roziligi qayd etilgan.', 'Uy ehtiyoji bahosi PaPaSdan alohida, hujjati va metodikasi ko‘rsatilgan.',
      'Haftalik son tavsiyaga mos yoki konsilium asosli istisno yozilgan.', 'Mobil epizod boshlanish sanasi va brigadasi to‘g‘ri.',
      'Tashrifga to‘g‘ri bola yoki oila tanlangan; oilaviy davr chegarasi tekshirilgan.', 'Sana, vaqt, davomiylik, brigada va xizmat turi tekshirilgan.',
      'Brigada hamda bolaning boshqa tashriflari bilan vaqt to‘qnashmagan.', 'Tashrif faqat vaqti kelganda Boshlash orqali boshlangan.',
      'Natijada bajarilgan ish va keyingi harakat mazmunli yozilgan.', 'Uyga tashrif, masofaviy maslahat, muloqot va reja vazifasi natijalari alohida yuritilgan.',
    ],
    fields: [
      { name: 'Bola', location: 'Mobil yordam → Ehtiyoj bahosi', requirement: 'Majburiy; baholanayotgan ish tanlanadi.', meaning: 'Uy ehtiyoji bahosi tegishli bo‘lgan bola; bu maydon oilaviy qayg‘udan keyingi yordam uchun klinik baho yaratmaydi.', example: 'Javohir F. (namuna).' },
      { name: 'Uyda yordam ehtiyoji, ball', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Majburiy; prototipda 0–100 son oralig‘i.', meaning: 'Mutaxassis bergan tayyor uy ehtiyoji natijasi; tizim tibbiy savollar asosida ball hisoblamaydi.', example: '23 — shartli uy ehtiyoji natijasi, PaPaSdan ko‘chirilmagan.' },
      { name: 'Baholash sanasi', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Majburiy; murojaatdan oldin va kelajakda emas.', meaning: 'Uy ehtiyoji baholangan sana; yangi sana qaysi natija eng so‘nggi ekanini belgilaydi.', example: '2026-09-07 — murojaat va bugungi demo sanasiga mos bo‘lsa.' },
      { name: 'Baholagan mutaxassis', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Majburiy.', meaning: 'Ballni tasdiqlagan mutaxassis F.I.Sh. va lavozimi.', example: 'D. Rahimova, shifokor (namuna).' },
      { name: 'Metodika / versiyasi', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Majburiy.', meaning: 'Baholash usulining nomi va versiyasi; qo‘llanmada tasdiqlanmagan yangi metodika belgilanmaydi.', example: 'Uy ehtiyoji — o‘quv namunasidagi tayyor baho; metodika tasdiqlanmagan.' },
      { name: 'Baholash hujjati', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Majburiy.', meaning: 'Baholashni asoslaydigan hujjat rekviziti; fayl yuklash emas.', example: 'DEMO-HOME-006 / 07.09.2026.' },
      { name: 'Haftalik uyga tashriflar soni', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Bu oynada majburiy; butun son 1–7.', meaning: 'Uyga tashrif rejalashtirish chastotasi; aniq sanalardagi tashriflarni avtomatik yaratmaydi.', example: '2 — 23 ball uchun ko‘rsatilgan haftalik tavsiya.' },
      { name: 'O‘zgartirish asosi — konsilium raqami, sanasi va sababi', location: 'Uy bahosi → tavsiyadan farqli haftalik son', requirement: 'Son tavsiyadan farq qilsa yoki 15 dan past ball uchun son belgilansa majburiy.', meaning: 'Inson tomonidan qabul qilingan istisno qarorining sababi va rekviziti.', example: 'DEMO-MK-061 / 07.09.2026; oila ehtiyoji ko‘rib chiqilib haftalik reja alohida belgilandi (namuna).' },
      { name: 'Izoh (ixtiyoriy)', location: 'Uyda yordam ehtiyojini baholash', requirement: 'Ixtiyoriy.', meaning: 'Natijani tushuntiruvchi qo‘shimcha kontekst; asos talab qilinadigan maydonni almashtirmaydi.', example: 'Vakilga kelgusi uchrashuvlar rejasi tushuntirildi (namuna).' },
      { name: 'Shifokor tasdiqlagan ball; Baholovchi shifokor F.I.Sh.; Metodika nomi va versiyasi; Baholash hujjati rekviziti', location: 'Bola kartasi → uy ehtiyoji bahosi formasi', requirement: 'Kartadagi muqobil baholash oynasida majburiy.', meaning: 'Mobil yordam sahifasidagi ball, mutaxassis, metodika va hujjat maydonlarining kartadagi nomlari; bir xil HOME turidagi tarixga yoziladi.', example: '23; D. Rahimova (namuna); o‘quv metodika qaydi; DEMO-HOME-006.' },
      { name: 'Konsilium belgilagan haftalik uy tashrifi; Me’yordan o‘zgartirish uchun konsilium asosi', location: 'Bola kartasi → uy ehtiyoji bahosi formasi', requirement: 'Haftalik son kartadagi oynada ixtiyoriy; bo‘sh bo‘lsa mavjud tavsiya olinadi. Farqli son uchun asos kerak.', meaning: 'Kartadagi muqobil chastota va istisno qaydi; 15 dan past ball uchun mobil xizmatga kerakli son va asos alohida belgilanadi.', example: '2; tavsiyaga mos bo‘lsa alohida istisno asosi talab qilinmaydi.' },
      { name: 'Bola; Boshlanish sanasi', location: 'Mobil yordamni boshlash', requirement: 'Majburiy; qabul tasdiqlangan ish, qarordan oldin va kelajakda bo‘lmagan sana.', meaning: 'Faol mobil epizodning kimga va qachondan ochilishini belgilaydi.', example: 'Javohir F. (namuna); 2026-09-08.' },
      { name: 'Mobil brigada', location: 'Mobil yordamni boshlash', requirement: 'Majburiy; mavjud ro‘yxatdan.', meaning: 'Klinik mobil epizod uchun boshlang‘ich brigada biriktirishi.', example: 'Ro‘yxatdagi 1-mobil brigada (namuna).' },
      { name: 'Konsilium qarori raqami; Qaror asosi / klinik xulosa', location: 'Mobil yordamni boshlash', requirement: 'Ikkalasi majburiy.', meaning: 'Mobil epizodning qaror va klinik asos rekvizitlari; rozilik eng so‘nggi konsilium yozuvida tekshiriladi.', example: 'DEMO-MK-006; mobil yordam va oila bilan reja tasdiqlangan (namuna).' },
      { name: 'Mobil yordamga vakil / yaqin qarindosh roziligi qayd etilgan; Rozilik bergan shaxs, qarindoshligi va rozilik sanasi', location: 'Bola kartasi → Markaz konsiliumi qarori → Mobil yordam', requirement: 'Mobil qabul tasdig‘i uchun rozilik belgisi va shaxs qaydi kerak.', meaning: 'Xizmatga rozilikning inson tomonidan tasdiqlangan qaydi; elektron imzo yoki hujjat almashinuvi ulanmagan.', example: 'Z. Rahimova, onasi, 07.09.2026 (namuna); katakni xodim qo‘lda tasdiqlaydi.' },
      { name: 'Bola / oila', location: 'Mobil yordam → Tashrif rejalashtirish', requirement: 'Majburiy; faol mobil yoki faol oilaviy yordam yozuvi.', meaning: 'Tashrif yordam oluvchisini belgilaydi; oilaviy yordamda yozuv Oila sifatida yaratiladi.', example: 'Temur H. (namuna) · oilaga yordam.' },
      { name: 'Sana va vaqt', location: 'Tashrifni rejalashtirish', requirement: 'Majburiy; xizmat boshlanishidan oldin emas; oilada davr chegarasidan o‘tmaydi.', meaning: 'Rejalashtirilgan boshlanish; brigada va bola bandligi shu vaqtdan tekshiriladi.', example: '2026-09-09 11:00 — tanlangan ish davriga mos shartli vaqt.' },
      { name: 'Davomiylik, daqiqa', location: 'Tashrifni rejalashtirish', requirement: 'Majburiy; 15–480, oynada 15 daqiqalik qadam.', meaning: 'Vaqt to‘qnashuvini tekshirish uchun rejalashtirilgan oraliq; bu klinik xizmat normasi emas.', example: '60.' },
      { name: 'Brigada', location: 'Tashrifni rejalashtirish', requirement: 'Majburiy; ro‘yxatdan.', meaning: 'Aynan shu tashrifni bajaruvchi brigada; uning boshqa tashrif vaqtlari tekshiriladi.', example: 'Ro‘yxatdagi 2-mobil brigada (namuna).' },
      { name: 'Xizmat turi', location: 'Tashrifni rejalashtirish', requirement: 'Uyga tashrif yoki Masofaviy maslahat tanlanadi.', meaning: 'Hisobotda xizmatlarni to‘g‘ri ajratadi.', example: 'Uyga tashrif.' },
      { name: 'Tashrif maqsadi', location: 'Tashrifni rejalashtirish', requirement: 'Majburiy.', meaning: 'Tashrifda qaysi ehtiyoj yoki individual reja vazifasi ko‘rib chiqiladi.', example: 'Oila bilan parvarish rejasi bajarilishini muhokama qilish (namuna).' },
      { name: 'Ko‘rsatilgan yordam va natija', location: 'Bajarilmoqda → Natijani qayd etish', requirement: 'Majburiy; avval Boshlash bajarilgan bo‘lishi kerak.', meaning: 'Amalda bajarilgan ishlar va kelishilgan keyingi qadam.', example: 'Vakilga parvarish bo‘yicha tushuntirish berildi; keyingi savollar reja vazifasiga qayd etildi (namuna).' },
      { name: 'Tashrif sanasi; Tashrif davri; Brigada; holat filtri', location: 'Mobil yordam → Tashriflar jadvali', requirement: 'Ko‘rish filtrlari; ma’lumotni o‘zgartirmaydi.', meaning: 'Tanlangan sana yoki barcha sanalar, brigada va tashrif holati bo‘yicha yozuvlarni topish.', example: 'Barcha sanalar; barcha brigadalar; Bekor qilingan.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Mobil xizmat oldidan uy ehtiyoji bahosi va tashrif rejasi so‘ralmoqda.', reason: 'Alohida HOME yozuvi yo‘q yoki unda tavsiya/haftalik son belgilanmagan. PaPaS bu talabni qoplamaydi.', solution: 'Ehtiyoj bahosini ochib alohida natija, hujjat va haftalik sonni saqlang. Past ball yoki farqli son uchun konsilium asosini kiriting, keyin mobil qabulni takrorlang.' },
      { tone: 'waiting', problem: 'Chastota o‘zgartirish asosi talab qilinmoqda.', reason: 'Haftalik son ball uchun ko‘rsatilgan tavsiyadan farq qiladi yoki bu ball uchun tayyor tavsiya yo‘q.', solution: 'Tegishli konsilium raqami, sanasi va sababini yozing yoki xato sonni to‘g‘ri tavsiyaga tuzating. Namuna matni real qaror o‘rnini bosmaydi.' },
      { tone: 'waiting', problem: 'Tashrifni saqlashda brigada yoki bolaning vaqti band.', reason: 'Yangi interval shu brigada yoki shu bolaning bekor qilinmagan tashrifi bilan ustma-ust tushgan.', solution: 'Barcha sanalar va brigada filtrlaridan tegishli vaqtni ko‘ring; yangi tashrifda bo‘sh vaqtni belgilang. Faqat brigadani almashtirish bolaning band vaqtini hal qilmaydi.' },
      { tone: 'waiting', problem: 'Kelajakdagi tashrifni hozir boshlash mumkin emas.', reason: 'Rejalashtirilgan sana-vaqt hali kelmagan.', solution: 'Tashrif vaqti kelganda Boshlashni bosing. Demo tekshiruvi uchun vaqti kelgan tayyor rejalashtirilgan tashrifdan foydalaning.' },
      { tone: 'waiting', problem: 'Brigadaning boshqa tashrifi hali yakunlanmagan.', reason: 'Shu brigadada Bajarilmoqda holatidagi boshqa yozuv bor.', solution: 'Jadvalda shu brigada va Bajarilmoqda filtrini tanlang. Haqiqatan tugagan tashrif natijasini yozing; davom etayotgan xizmatni faqat blokni ochish uchun yakunlamang.' },
      { tone: 'waiting', problem: 'Avval tashrifni boshlang xabari yoki natija tugmasi yo‘q.', reason: 'Tashrif hali rejalashtirilgan, allaqachon bajarilgan yoki bekor qilingan.', solution: 'Holatni tekshiring. Rejalashtirilgan tashrif vaqti kelganda Boshlashdan o‘ting; bajarilgan/bekor qilingan yozuvga ikkinchi natija kiritilmaydi.' },
      { tone: 'waiting', problem: 'Oilaviy tashrif muddati qabul qilinmadi yoki boshlash bloklandi.', reason: 'Reja uch kalendar oylik chegaradan o‘tgan yoki oilaviy yordamni hozir boshlash uchun davr tugagan.', solution: 'Bola kartasidagi oilaviy davr boshlanishi va oxirgi sanasini tekshiring. Yangi tashrifni ruxsat etilgan davrga moslang; davr tugagan bo‘lsa mas’ul yakunlashni ko‘rib chiqadi.' },
      { tone: 'waiting', problem: 'Saqlangan tashrif ko‘rinmayapti.', reason: 'Jadvalning sana, brigada yoki holat filtri yozuvni yashirmoqda.', solution: 'Tashrif davrini Barcha sanalar qiling, brigada va holat tanlovlarini kengaytiring. Bola kartasidagi Jarayon tarixidan rejalashtirish qaydini ham tekshiring.' },
    ],
    outcomes: [
      'PaPaSdan alohida uy ehtiyoji natijasi, metodika va haftalik reja saqlanadi.', 'Rozilik va konsilium qaroriga bog‘langan faol mobil epizod ochiladi.',
      'Har tashrifning aniq vaqt oralig‘i, brigadasi, yordam oluvchisi va turi ko‘rinadi.', 'Rejalashtirilgan, bajarilayotgan, bajarilgan va bekor qilingan xizmatlar ajraladi.',
      'Tashrif natijasi, shifokor qaydi va individual vazifa natijasi alohida dalil sifatida yuritiladi.',
    ],
    relatedTopics: ['consilium', 'care-plan', 'equipment', 'follow-up', 'reports'],
    flows: [
      {
        id: 'mobile-full', title: 'Uy bahosidan bajarilgan tashrifgacha', description: 'Rozilik, alohida uy bahosi, asosli chastota, faol mobil epizod, jadval va natija ketma-ketligi.',
        definition: `flowchart TD
 A["Muvofiqlashtiruvchi Markaz qarorini tekshiradi"] --> B{"Mobil qabul va vakil roziligi bormi?"}
 B -->|"Yo‘q"| C["Konsiliumda qaror va rozilikni aniqlashtirish"]
 C --> A
 B -->|"Ha"| D["Mutaxassis alohida uy ehtiyoji bahosini ochadi"]
 D --> E["Ball, sana, shifokor, metodika va hujjat"]
 E --> F{"Ball uchun haftalik tavsiya bormi?"}
 F -->|"15 va yuqori"| G["15–20: 1; 21–24: 2; 25 va yuqori: 3"]
 F -->|"15 dan past"| H["Konsilium haftalik son va asosni belgilaydi"]
 G --> I{"Tanlangan son tavsiyaga mosmi?"}
 I -->|"Yo‘q"| H
 I -->|"Ha"| J["Uy bahosi va haftalik sonni saqlash"]
 H --> J
 J --> K["Mobil yordamni boshlash formasini ochish"]
 K --> L["Boshlanish sanasi, brigada va qaror asosi"]
 L --> M{"Qabul holati, yosh va sana mosmi?"}
 M -->|"Yo‘q"| N["Xabar bo‘yicha qabul ma’lumotini tekshirish"]
 N --> L
 M -->|"Ha"| O["Faol mobil epizod: Mobil yordamda"]
 O --> P["Individual rejadan tashrif maqsadini aniqlash"]
 P --> Q["Bola, vaqt, davomiylik, brigada va xizmat turi"]
 Q --> R{"Davr va vaqt bandligi mosmi?"}
 R -->|"Yo‘q"| S["Yangi yozuv vaqtini yoki brigadasini tuzatish"]
 S --> Q
 R -->|"Ha"| T["Saqlash: Rejalashtirilgan tashrif"]
 T --> U{"Vaqti kelgan va brigada bo‘shmi?"}
 U -->|"Yo‘q"| V["Vaqtni kutish yoki oldingi natijani tekshirish"]
 V --> U
 U -->|"Ha"| W["Boshlash: Bajarilmoqda"]
 W --> X["Mutaxassis xizmatni ko‘rsatadi"]
 X --> Y["Natijani qayd etish"]
 Y --> Z{"Natija matni kiritilganmi?"}
 Z -->|"Yo‘q"| Y
 Z -->|"Ha"| AA["Saqlash: Bajarilgan tashrif"]
 AA --> AB["Uyga tashrif va masofaviy maslahat alohida hisob"]
 AB --> AC{"Keyingi yordam kerakmi?"}
 AC -->|"Yangi tashrif"| P
 AC -->|"Bahoni yangilash"| D
 AC -->|"Epizodni yakunlash"| AD["Hujjatli yakun va keyingi kuzatuv"]
  class D,E,G,K,L,P,Q,T,W,X,Y,AB,AD guide_action;
  class J,O,AA guide_success;
  class A,B,C,F,H,I,M,N,R,S,U,V,Z,AC guide_waiting;`,
        walkthrough: [
          'Mobil qabul qarori bilan rozilik birinchi tekshiriladi. Ulardan biri yetishmasa jarayon brigada tanlashga emas, konsilium yozuvini aniqlashtirishga qaytadi.',
          'Uy bahosi alohida ochiladi: bu PaPaS nusxasi emas. Ballga qo‘shimcha sana, mutaxassis, metodika va hujjat kiritiladi.',
          'Tavsiya mavjud bo‘lsa son unga solishtiriladi; farqli son hamda 15 dan past natija konsiliumning alohida son va asos tarmog‘iga boradi.',
          'Bahoni saqlash aniq tashrif yaratmaydi. Keyingi tugunlarda mobil epizodning sana, brigada, yosh va qaror asoslari tekshiriladi.',
          'Faol epizoddan keyin har bir tashrif alohida vaqt va maqsad bilan rejalashtiriladi. Band vaqt bo‘lsa yangi yozuvdagi vaqt yoki brigada qayta tanlanadi.',
          'Rejalashtirilgan holatdan Boshlashga o‘tishdan oldin vaqt kelgani va brigadaning boshqa boshlangan tashrifi yo‘qligi tekshiriladi. Bu yerda xizmat bajarildi deb taxmin qilinmaydi.',
          'Boshlangan tashrif natijasiz yakunlanmaydi: bo‘sh matn natija formasiga qaytaradi. Saqlangandan so‘ng haqiqiy Bajarilgan holati paydo bo‘ladi.',
          'Hisoblash tuguni uyga tashrif va masofaviy maslahatni ajratadi; biri boshqasining bajarilgan me’yorini to‘ldirmaydi.',
          'Oxirgi uch tarmoq keyingi tashrifga, ehtiyoj qayta bahosiga yoki hujjatli epizod yakuniga olib boradi. Qayta baholash eski tashriflarni o‘zgartirmaydi.',
        ],
      },
      {
        id: 'mobile-schedule-rework', title: 'Jadval va boshlash xatolarini tekshirish', description: 'Bola/oila davri, vaqt to‘qnashuvi, kelajakdagi tashrif va brigadaning ochiq ishi bo‘yicha amaliy qayta ishlash.',
        definition: `flowchart TD
 A["Tashrifni rejalashtirish"] --> B{"Faol mobil yoki oilaviy yordam bormi?"}
 B -->|"Yo‘q"| C["Bola kartasida xizmat holatini ko‘rish"]
 B -->|"Ha"| D["Sana, vaqt, 15–480 daqiqa va maqsad"]
 D --> E{"Xizmat davriga mosmi?"}
 E -->|"Yo‘q"| F["Boshlanish va oilaviy oxirgi sanani tekshirish"]
 F --> D
 E -->|"Ha"| G{"Brigada yoki bola vaqti bandmi?"}
 G -->|"Ha"| H["Jadvalni barcha sanalar bilan ko‘rish"]
 H --> I["Yangi tashrifga bo‘sh vaqt tanlash"]
 I --> D
 G -->|"Yo‘q"| J["Saqlash: Rejalashtirilgan"]
 J --> K["Boshlash bosiladi"]
 K --> L{"Faol yordam hali davom etyaptimi?"}
 L -->|"Yo‘q"| M["Yakun va bekor qilish sababini ko‘rish"]
 L -->|"Ha"| N{"Oilaviy muddat tugaganmi?"}
 N -->|"Ha"| O["Mas’ul oilaviy yordam yakunini ko‘radi"]
 N -->|"Yo‘q"| P{"Tashrif vaqti kelganmi?"}
 P -->|"Yo‘q"| Q["Rejalashtirilgan vaqtni kutish"]
 Q --> K
 P -->|"Ha"| R{"Shu brigadada boshqa boshlangan tashrif bormi?"}
 R -->|"Ha"| S["O‘sha tashrifning haqiqiy natijasini aniqlash"]
 S --> K
 R -->|"Yo‘q"| T["Bajarilmoqda"]
 T --> U["Xizmat va natija qaydi"]
 U --> V["Bajarilgan"]
  class A,C,D,K,O,T,U guide_action;
  class V guide_success;
  class M guide_cancelled;
  class B,E,F,G,H,I,J,L,N,P,Q,R,S guide_waiting;`,
        walkthrough: [
          'Faol xizmat bo‘lmagan tarmoqda yangi jadval yozuvi yaratib muammoni aylanib o‘tib bo‘lmaydi; bola kartasidagi tegishli qabul yoki oilaviy davr tekshiriladi.',
          'Davr xatosi xizmat boshlanishidan oldingi tashrifni yoki oilaga uch kalendar oydan keyingi rejani anglatishi mumkin. Sana o‘sha ishning haqiqiy davriga moslashtiriladi.',
          'Bandlikda faqat brigada emas, bola ham tekshiriladi. Barcha sanalar orqali ustma-ust oraliq topilib, yangi yozuvning vaqti tuzatiladi; eski tashrifni ko‘chirish tugmasi mavjud deb taxmin qilinmaydi.',
          'Saqlash tekshiruvi bilan Boshlash tekshiruvi alohida: reja saqlangandan keyin xizmat yopilgan yoki oilaviy muddat tugagan bo‘lishi mumkin.',
          'Xizmat yopilgan tarmoqda bekor qilish sababi ko‘riladi. Oilaviy davr tugagan tarmoqda mas’ul yakunlashni ko‘radi; yangi klinik epizodga avtomatik o‘tish yo‘q.',
          'Kelajakdagi tashrif rejalashtirilgan holatda qoladi; vaqt kelgach Boshlash qayta bajariladi.',
          'Brigadaning boshqa boshlangan tashrifi bo‘lsa uning haqiqiy holati aniqlanadi. Faqat amalda tugagan xizmat natija bilan yakunlanadi; shundan keyin yangi Boshlash qayta sinab ko‘riladi.',
          'Yakuniy yo‘l Boshlash → xizmat → natija → Bajarilgan ketma-ketligidir. Reja yoki bo‘sh natija matni bajarilgan tashrif o‘rnini bosmaydi.',
        ],
      },
    ],
  },
  'care-plan': {
    prerequisites: [
      'Bolalar va yo‘llanmalar ro‘yxatidan kerakli bola/oila kartasi ochilgan; ism, vakil va joriy holat tekshirilgan bo‘lishi kerak.',
      'Vazifa mazmuni tegishli mutaxassisning individual yordam rejasidan olinadi; tizim tashxisga qarab xizmat yoki dori buyurmaydi.',
      'Har vazifa uchun kutilgan natija, xizmat yo‘nalishi, yordam oluvchi, mas’ul va bajarish muddati tayyorlanadi.',
      'Vafotdan keyingi davrda yordam oluvchi Oila bo‘ladi; oilaviy yordam faol va vazifa muddati uch kalendar oylik davr ichida bo‘lishi kerak.',
      'Bajarilganini qayd etish uchun amalda bajarilgan xizmat natijasi mavjud bo‘ladi; faqat rejalashtirilgan vazifa yoki tashrif bunga yetarli emas.',
      'Muloqot qaydida tur, xodim va mazmun yoziladi. Bu modul haqiqiy qo‘ng‘iroq, xabar yuborish yoki shikoyat bo‘yicha tashqi topshiriqni amalga oshirmaydi.',
    ],
    sections: [
      { title: 'Yordam rejasi vazifaning mas’ulini va natijasini birlashtiradi', paragraphs: [
        'Bola kartasidagi Yordam rejasi tibbiy yordam, parvarish, psixologik yordam, ijtimoiy xizmat va oilani o‘qitish/qo‘llab-quvvatlash vazifalarini bir joyda ko‘rsatadi. Har vazifa erkin matn bilan kiritiladi; xizmat yo‘nalishi uning qaysi turga mansubligini, yordam oluvchi esa Bola yoki Oila ekanini ajratadi.',
        'Vazifa nomini faqat Maslahat kabi umumiy so‘z bilan cheklamasdan, bajariladigan ish va kutilgan natijani yozing. Masalan, Oila bilan parvarish rejasidagi savollarni ko‘rib chiqish va keyingi qadamni kelishish (namuna). Bu matn shifokorning klinik qarorini yoki dori buyurish hujjatini almashtirmaydi.',
      ] },
      { title: 'Bajarilgan xizmat va aloqa qaydi turli dalillardir', paragraphs: [
        'Vazifa saqlanganda Rejalashtirilgan bo‘ladi. Bajarilganini qayd etish amali natija matni bilan xizmatni Bajarilgan holatiga o‘tkazadi va vaqtini saqlaydi. Tashrif tugashi vazifani o‘z-o‘zidan bajarmaydi; vazifani tugatish ham mobil tashrifni yakunlamaydi.',
        'Muloqot qaydi ish bo‘yicha qo‘ng‘iroq, masofaviy maslahat, oddiy qayd yoki shikoyat mazmunini saqlaydi. Muloqot matnida keyingi harakatni yozish mumkin, lekin u avtomatik vazifa yaratmaydi. Zarur vazifa Vazifa qo‘shish orqali alohida kiritiladi.',
      ] },
      { title: 'Oila davri va bajarilish ko‘rsatkichini o‘qish', paragraphs: [
        'Vafot qaydidan keyin bolaning klinik vazifasini bajarilgan deb belgilash bloklanadi. Oilaga yordam uchun yangi vazifa Oila nishoni bilan, faol davrning oxirgi sanasidan kechiktirmay kiritiladi. Uch kalendar oylik davr tugagach yangi oilaviy vazifa qo‘shish va uni hozir bajarilgan deb belgilash cheklanadi.',
        'Bajarilish ulushi bajarilgan vazifalar sonini rejalashtirilgan va bajarilgan vazifalar yig‘indisiga nisbatan ko‘rsatadi. Bekor qilingan vazifalar ulush maxrajiga kirmaydi va tarixdan o‘chmaydi. Oilaga yordamni yakunlash ochiq oilaviy vazifalarni bekor qiladi; bu ularni bajarilgan xizmatga aylantirmaydi.',
      ] },
    ],
    steps: [
      { title: 'Kerakli kartani ochish', actor: 'Yordam ko‘rsatuvchi mutaxassis', action: 'Bolalar va yo‘llanmalar ro‘yxatidan bolani ochib joriy holat, faol epizod yoki oilaviy davrni tekshiring.', result: 'Xizmat to‘g‘ri bola yoki oilaga bog‘lanadi.', route: `${base}/cases` },
      { title: 'Mavjud reja va muloqotlarni o‘qish', actor: 'Mutaxassis / muvofiqlashtiruvchi', action: 'Yordam rejasi oynasida ochiq, bajarilgan va bekor qilingan vazifalar hamda so‘nggi aloqa qaydlarini ko‘ring.', result: 'Takroriy yoki mazmuni aniqlanmagan vazifa qo‘shish ehtiyoji kamayadi.' },
      { title: 'Yangi vazifani tayyorlash', actor: 'Tegishli mutaxassis', action: 'Vazifa qo‘shishni bosing. Ko‘rsatiladigan yordam va kutilgan natijani aniq yozing.', result: 'Vazifa qanday ishni va qanday natijani nazarda tutishi ko‘rinadi.' },
      { title: 'Yo‘nalish va yordam oluvchini tanlash', actor: 'Tegishli mutaxassis', action: 'Xizmat yo‘nalishi va Yordam oluvchini belgilang. Oilaga yordam davrida Oila tanlanadi; klinik xizmatni vafotdan keyingi oilaviy xizmat bilan aralashtirmang.', result: 'Vazifa turi va Bola/Oila tegishliligi ajraladi.' },
      { title: 'Mas’ul va muddatni belgilash', actor: 'Muvofiqlashtiruvchi', action: 'Mas’ul mutaxassis va Bajarish muddatini kiriting. Oilaviy vazifada muddat faol oilaviy davr ichida ekanini tekshiring.', result: 'Vazifani kim va qachongacha bajarishi ma’lum bo‘ladi.' },
      { title: 'Vazifani saqlash', actor: 'Mutaxassis', action: 'Saqlashni bosing; xato bo‘lsa yetishmagan matn, mas’ul, sana yoki yordam oluvchini tuzating.', result: 'Vazifa Rejalashtirilgan holatida ro‘yxatga qo‘shiladi.' },
      { title: 'Xizmatni amalda bajarish', actor: 'Belgilangan mas’ul', action: 'Rejada qayd etilgan yordamni ko‘rsating. Mobil tashrif talab qilinsa uni Mobil yordam sahifasida alohida rejalashtirib yuriting.', result: 'Natija qaydiga asos bo‘ladigan amaliy xizmat mavjud bo‘ladi.', route: `${base}/mobile` },
      { title: 'Vazifa natijasini kiritish', actor: 'Xizmat ko‘rsatgan mas’ul', action: 'Tegishli vazifadagi Bajarilganini qayd etishni bosing; Bajarilgan yordam va natija maydonini to‘ldirib Saqlashni bosing.', result: 'Vazifa Bajarilgan holatiga o‘tadi; natija va bajarish vaqti ko‘rinadi.' },
      { title: 'Muloqotni alohida qayd etish', actor: 'Muloqot qilgan xodim', action: 'Muloqot qaydini ochib Muloqot turi, Qayd etgan xodim va Muloqot mazmuni va keyingi harakatni kiriting.', result: 'Aloqa yoki murojaat alohida tarixiy yozuv sifatida saqlanadi.' },
      { title: 'Muloqotdan kelib chiqqan ishni rejalash', actor: 'Muvofiqlashtiruvchi / tegishli mutaxassis', action: 'Muloqot natijasida yordam vazifasi kerak bo‘lsa Vazifa qo‘shish orqali uni mas’ul va muddat bilan alohida kiriting. Telefon qaydi o‘zi vazifa yaratmaydi.', result: 'Keyingi harakat faqat erkin matnda qolib ketmay, reja yozuviga ega bo‘ladi.' },
      { title: 'Natijalar va istisnolarni ko‘rib chiqish', actor: 'Muvofiqlashtiruvchi', action: 'Bajarilish ulushi, ochiq vazifalar va bekor qilish sabablarini solishtiring. Oilaviy davr tugaganda yangi xizmatni belgilash o‘rniga mas’ul bilan yakunlashni ko‘rib chiqing.', result: 'Ko‘rsatkich haqiqiy bajarilgan yordamni aks ettiradi; tarixiy bekor qilishlar saqlanadi.' },
    ],
    rules: [
      { tone: 'waiting', condition: 'Vazifada yordam mazmuni, mas’ul yoki haqiqiy sana yetishmaydi.', action: 'Uchala ma’lumotni kiriting; vazifa mazmunida kutilgan natijani ham aniqlang.', owner: 'Rejani tuzuvchi mutaxassis', basis: 'Prototipning vazifa, mas’ul va muddat bo‘yicha majburiy maydonlari.' },
      { tone: 'action', condition: 'Vafotdan keyingi oilaviy yordam davri ochilgan.', action: 'Yangi vazifani Oila uchun yarating; oldingi bola klinik vazifalarini bajarildi deb yopmang.', owner: 'Psixolog / ijtimoiy xodim / muvofiqlashtiruvchi', basis: 'Klinik epizod va oilaviy yordamni ajratish; prototip himoyasi.' },
      { tone: 'waiting', condition: 'Oilaviy yordamning uch kalendar oylik davri tugagan.', action: 'Yangi oilaviy vazifa yoki hozir bajarildi qaydini kiritmang; mas’ul yakunlashni ko‘rib chiqadi.', owner: 'Oilaviy yordam uchun mas’ul', basis: 'Nizomdagi uch oygacha davrning prototip sana tekshiruvi.' },
      { tone: 'action', condition: 'Vazifa allaqachon bajarilgan yoki bekor qilingan.', action: 'Yangi bajarish qaydi qo‘shmang; uning saqlangan natijasi yoki bekor qilish sababini o‘qing.', owner: 'Mutaxassis', basis: 'Faqat Rejalashtirilgan vazifa bajarilgan holatiga o‘tkaziladi.' },
      { tone: 'waiting', condition: 'Aloqa qaydida keyingi xizmat va’da qilingan.', action: 'Zarur bo‘lsa individual vazifa yoki tashrifni alohida yarating; aloqa matnini avtomatik topshiriq deb hisoblamang.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototipda muloqot, vazifa va tashrif alohida yozuvlar.' },
      { tone: 'waiting', condition: 'Shikoyat / murojaat turi tanlangan.', action: 'Mazmun, mas’ul va keyingi harakatni aniq yozing; tizimda belgilanmagan muddat yoki avtomatik tashqi yuborish bor deb ko‘rsatmang.', owner: 'Qayd etgan xodim', basis: 'Prototip doirasi; yangi shikoyat muddati o‘ylab topilmaydi.' },
      { tone: 'action', condition: 'Maxsus dori yoki klinik buyurish hujjati kerak.', action: 'Ularni vakolatli mutaxassis belgilangan rasmiy tartibda yuritadi; oddiy vazifa yoki muloqot matni shu hujjat o‘rnini bosmaydi.', owner: 'Tegishli tibbiy mutaxassis', basis: 'Nizomning maxsus hisob va tibbiy hujjatlar bo‘yicha talablaridan ajratish.' },
    ],
    faq: [
      { question: 'Vazifani tahrirlash, o‘chirish yoki muddatini o‘zgartirish mumkinmi?', answer: 'Hozirgi prototipda bunday amallar yo‘q. Saqlashdan oldin tekshiring. Aniqlashtirishni Muloqot qaydida yozib, zarur yangi vazifani alohida kirita olasiz; eski yozuv tarixda qoladi.' },
      { question: 'Shikoyat qaydi mas’ulga avtomatik xabar yuboradimi?', answer: 'Yo‘q. Muloqot turi, xodim va matn saqlanadi. Tashqi xabar yuborish, topshiriq integratsiyasi va xizmat muddati hisoblagichi ulanmagan.' },
      { question: 'Mas’ul maydonida ism yozish tizimdagi rol huquqini o‘zgartiradimi?', answer: 'Yo‘q. Bu prototipda vazifa uchun mas’ulni ko‘rsatadigan matn maydoni. Xodim hisobiga avtomatik topshiriq, bildirishnoma yoki kirish huquqi berilmaydi.' },
      { question: 'Bajarilmagan oilaviy vazifa yakunlashda o‘chadimi?', answer: 'Yo‘q. Oilaga yordamni yakunlash ochiq oilaviy vazifani Bekor qilingan holatiga o‘tkazib sababini saqlaydi. Bajarilgan natijalar va bekor qilingan yozuvlar tarixda qoladi.' },
      { question: 'Bajarilish foizi nega bekor qilingandan so‘ng o‘zgardi?', answer: 'Ko‘rsatkichning maxraji faqat rejalashtirilgan va bajarilgan vazifalardan iborat. Bekor qilingan yozuvlar maxrajdan chiqariladi, ammo bajarilganlar sonini oshirmaydi.' },
    ],
    checklist: [
      'Bola/oila kartasi va joriy xizmat holati to‘g‘ri tanlangan.', 'Yangi vazifa mavjud reja bilan solishtirilgan; xizmat va kutilgan natija aniq.',
      'Xizmat yo‘nalishi, yordam oluvchi, mas’ul va muddat belgilangan.', 'Oilaviy vazifa faol uch kalendar oylik davrga mos.',
      'Bajarilgan qaydi haqiqiy xizmat natijasiga asoslangan.', 'Natijada bajarilgan ish va keyingi qadam ko‘rinadi.',
      'Muloqot turi, xodim va mazmun saqlangan; zarur keyingi vazifa alohida yaratilgan.', 'Bekor qilingan vazifalar bajarilgan xizmat sifatida hisoblanmagan.',
      'Klinik hujjatlar va maxsus dori hisoblari oddiy matn qaydi bilan almashtirilmagan.',
    ],
    fields: [
      { name: 'Ko‘rsatiladigan yordam va kutilgan natija', location: 'Bola kartasi → Yordam rejasi → Vazifa qo‘shish', requirement: 'Majburiy.', meaning: 'Aniq bajariladigan ish va undan kutilgan natija.', example: 'Oila bilan parvarish rejasidagi savollarni ko‘rib chiqish va keyingi qadamni kelishish (namuna).' },
      { name: 'Xizmat yo‘nalishi', location: 'Individual rejaga vazifa', requirement: 'Ro‘yxatdagi yo‘nalishlardan biri tanlanadi.', meaning: 'Tibbiy yordam, Parvarish, Psixologik yordam, Ijtimoiy xizmat yoki Oilani o‘qitish / qo‘llab-quvvatlash.', example: 'Oilani o‘qitish / qo‘llab-quvvatlash.' },
      { name: 'Yordam oluvchi', location: 'Individual rejaga vazifa', requirement: 'Bola yoki Oila; vafotdan keyingi davrda Oila bo‘lishi kerak.', meaning: 'Vazifa klinik bolaga yoki oilaga yo‘naltirilganini ajratadi.', example: 'Oila — faol oilaviy yordam namunasi.' },
      { name: 'Mas’ul mutaxassis', location: 'Individual rejaga vazifa', requirement: 'Majburiy.', meaning: 'Vazifa uchun javobgar mutaxassisning F.I.Sh. yoki aniq mas’ul qaydi.', example: 'N. Ismoilova, psixolog (namuna).' },
      { name: 'Bajarish muddati', location: 'Individual rejaga vazifa', requirement: 'Majburiy haqiqiy sana; oilaviy vazifada faol davr oxiridan kech emas.', meaning: 'Vazifaning rejalashtirilgan bajarish sanasi; tizim bu sana kelganda uni bajarildi qilmaydi.', example: '2026-09-12 — oilaviy davrga mos shartli sana.' },
      { name: 'Bajarilgan yordam va natija', location: 'Yordam rejasi → Bajarilganini qayd etish', requirement: 'Majburiy; faqat rejalashtirilgan vazifada.', meaning: 'Amalda bajarilgan yordam, kuzatilgan natija va zarur keyingi qadam.', example: 'Oila savollari muhokama qilindi; kelgusi suhbat uchun ikki masala qayd etildi (namuna).' },
      { name: 'Muloqot turi', location: 'Yordam rejasi → Muloqot qaydi', requirement: 'To‘rt turdan biri tanlanadi.', meaning: 'Ishonch telefoniga qo‘ng‘iroq, Masofaviy maslahat, Ish bo‘yicha qayd yoki Shikoyat / murojaat.', example: 'Ishonch telefoniga qo‘ng‘iroq — o‘quv qaydi.' },
      { name: 'Qayd etgan xodim', location: 'Muloqot yoki murojaatni qayd etish', requirement: 'Majburiy.', meaning: 'Muloqotni qayd qilgan shaxs; vazifa mas’ulidan farq qilishi mumkin.', example: 'B. Hamidova, navbatchi hamshira (namuna).' },
      { name: 'Muloqot mazmuni va keyingi harakat', location: 'Muloqot yoki murojaatni qayd etish', requirement: 'Majburiy.', meaning: 'Kim nima masalada murojaat qilgani, qanday ma’lumot berilgani va keyingi kelishilgan qadam.', example: 'Vakil tashrif vaqtini aniqlashtirdi; reja bo‘yicha ma’lumot tushuntirildi (namuna).' },
      { name: 'Namuna bilan to‘ldirish', location: 'Vazifa, natija va muloqot dialoglari', requirement: 'Ixtiyoriy yordamchi tugma; Saqlash o‘rnini bosmaydi.', meaning: 'Bo‘sh matnlarga shartli misol qo‘yadi; saqlashdan oldin foydalanuvchi tekshiradi.', example: 'Namuna matnini qo‘ying, mas’ul va muddatni tekshiring, keyin Saqlashni bosing.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Vazifa, mas’ul va haqiqiy muddatni kiriting xabari chiqdi.', reason: 'Majburiy matn bo‘sh yoki sana haqiqiy emas.', solution: 'Ko‘rsatiladigan yordam va kutilgan natija, Mas’ul mutaxassis va Bajarish muddatini to‘ldiring; qayta Saqlashni bosing.' },
      { tone: 'waiting', problem: 'Oilaviy vazifani saqlashda faol muddat talabi chiqdi.', reason: 'Yordam oluvchi Bola tanlangan, oilaviy davr yopilgan yoki muddat davr oxiridan kech.', solution: 'Bola kartasidagi oilaviy holat va oxirgi sanani tekshiring. Faol davrda Oila va mos sanani tanlang; davr tugagan bo‘lsa yakunlashni ko‘rib chiqing.' },
      { tone: 'rejected', problem: 'Vafotdan keyin bola uchun klinik xizmat bajarildi deb belgilanmaydi.', reason: 'Vazifa Bola uchun, ishda esa vafotdan keyingi oilaviy yordam ochilgan.', solution: 'Oldingi klinik vazifa tarixini saqlang. Oilaga tegishli yangi ishni alohida Oila vazifasi qilib kiriting; klinik vazifaga soxta natija yozmang.' },
      { tone: 'waiting', problem: 'Bajarilganini qayd etish tugmasi yo‘q.', reason: 'Vazifa allaqachon bajarilgan/bekor qilingan, karta yopilgan yoki klinik vazifani bajarish oilaviy holatda cheklangan.', solution: 'Vazifa holati va karta holatini ko‘ring. Mavjud natija yoki bekor qilish sababini o‘qing; ayni yozuvni qayta bajarish amali yo‘q.' },
      { tone: 'waiting', problem: 'Xizmat natijasini yozing xabari chiqdi.', reason: 'Bajarilgan yordam va natija maydoni bo‘sh.', solution: 'Amalda bajarilgan ish va natijani yozing. Faqat Bajarildi degan noaniq matn o‘rniga ko‘rsatilgan yordamni mazmunli ifodalang.' },
      { tone: 'waiting', problem: 'Muloqot qaydi saqlanmadi.', reason: 'Muloqot mazmuni yoki qayd etgan xodim kiritilmagan.', solution: 'Qayd etgan xodim va Muloqot mazmuni va keyingi harakatni to‘ldiring; to‘g‘ri muloqot turini tekshiring.' },
      { tone: 'action', problem: 'Muloqot yozdim, lekin yangi vazifa/jadval tashrifi paydo bo‘lmadi.', reason: 'Aloqa qaydi avtomatik xizmat yoki tashrif yaratmaydi.', solution: 'Vazifa qo‘shish yoki Mobil yordam → Tashrif rejalashtirish orqali kerakli yozuvni alohida kiriting.' },
    ],
    outcomes: [
      'Har vazifa yordam turi, Bola/Oila, mas’ul va muddat bilan bog‘langan.', 'Rejalashtirilgan va amalda bajarilgan yordam natijalari ajralgan.',
      'Muloqot va shikoyat qaydlari muallif hamda keyingi harakat bilan ko‘rinadi.', 'Oilaviy yordamning ochiq, bajarilgan va bekor qilingan vazifalari tarixda saqlanadi.',
      'Bajarilish ko‘rsatkichi bekor qilingan yozuvlarni xizmat natijasiga qo‘shmaydi.',
    ],
    relatedTopics: ['inpatient', 'mobile', 'follow-up', 'reports'],
    flows: [
      {
        id: 'care-plan-full', title: 'Individual vazifa, xizmat natijasi va muloqot', description: 'Bola/oila holatidan rejalashtirilgan yordam, bajarish qaydi va muloqotdan kelib chiqadigan yangi ishgacha.',
        definition: `flowchart TD
 A["Mutaxassis bola kartasini ochadi"] --> B["Yordam rejasi va mavjud tarixni ko‘radi"]
 B --> C{"Karta yakunlanganmi?"}
 C -->|"Ha"| D["Tarix va saqlangan natijalarni o‘qish"]
 C -->|"Yo‘q"| E["Vazifa qo‘shish"]
 E --> F["Yordam mazmuni va kutilgan natija"]
 F --> G["Xizmat yo‘nalishi va yordam oluvchi"]
 G --> K["Mas’ul mutaxassis va bajarish muddati"]
 K --> H{"Oilaviy yordam davrimi?"}
 H -->|"Ha"| I{"Oila tanlangan va muddat faol davrdami?"}
 I -->|"Yo‘q"| J["Yordam oluvchi va oilaviy sanani tekshirish"]
 J --> G
 I -->|"Ha"| L{"Majburiy maydonlar to‘liqmi?"}
 H -->|"Yo‘q"| L
 L -->|"Yo‘q"| F
 L -->|"Ha"| M["Saqlash: Rejalashtirilgan vazifa"]
 M --> N["Mas’ul xizmatni amalda ko‘rsatadi"]
 N --> O{"Mobil uchrashuv ham kerakmi?"}
 O -->|"Ha"| P["Tashrifni alohida rejalash va yuritish"]
 P --> Q["Bajarilganini qayd etish"]
 O -->|"Yo‘q"| Q
 Q --> R{"Vazifa va yordam holati bajarishga mosmi?"}
 R -->|"Yo‘q"| S["Vafot, muddat yoki yopilgan vazifani tekshirish"]
 R -->|"Ha"| T["Bajarilgan yordam va natija"]
 T --> U{"Natija matni bormi?"}
 U -->|"Yo‘q"| T
 U -->|"Ha"| V["Saqlash: Bajarilgan vazifa"]
 V --> W["Bajarilish ko‘rsatkichi va tarix"]
 C -->|"Yo‘q, muloqotni qayd etish"| X["Muloqot qaydi: tur, xodim va mazmun"]
 X --> Y["Muloqotni saqlash"]
 Y --> Z{"Yangi xizmat vazifasi kerakmi?"}
 Z -->|"Ha"| E
 Z -->|"Yo‘q"| W
  class A,B,D,E,F,G,K,N,O,P,Q,T,W,X,Y guide_action;
  class V guide_success;
  class C,H,I,J,L,M,R,S,U,Z guide_waiting;`,
        walkthrough: [
          'Karta yakunlangan bo‘lsa asosiy yo‘l tarixni o‘qish bilan tugaydi. Yangi reja uchun ochiq bola/oila holati kerak.',
          'Vazifa mazmuni va kutilgan natija avval yoziladi, keyin yo‘nalish va yordam oluvchi tanlanadi. Oilaviy davr tarmog‘ida Oila hamda ruxsat etilgan muddat tekshiriladi.',
          'Bo‘sh mas’ul, noto‘g‘ri sana yoki yordam matni vazifani saqlashga o‘tkazmaydi; tegishli kiritish tuguniga qaytiladi.',
          'Saqlash Rejalashtirilgan holatini yaratadi. Xizmat amalda ko‘rsatilishi bundan keyingi inson ishi hisoblanadi.',
          'Mobil uchrashuv talab qilinsa tashrif alohida yuritiladi. Bu tarmoqdan keyin ham vazifaning o‘z natijasi alohida qayd etiladi.',
          'Bajarishga moslik tekshiruvi allaqachon yopilgan vazifa, vafotdan keyingi klinik ish yoki tugagan oilaviy muddatni aniqlaydi; bunday holatda soxta natija bilan davom etilmaydi.',
          'Natija matni bo‘sh bo‘lsa natija maydoniga qaytiladi. Matn saqlangandan keyin vazifa Bajarilgan bo‘lib ko‘rsatkichga kiradi.',
          'Muloqot yo‘li vazifadan mustaqil. Tur, xodim va mazmun saqlanadi; yangi xizmat kerak bo‘lsa foydalanuvchi Vazifa qo‘shishga qaytadi, avtomatik yaratish yo‘q.',
        ],
      },
      {
        id: 'care-plan-family-exceptions', title: 'Oilaviy davrdagi vazifa va bajarish istisnolari', description: 'Yordam oluvchi, uch kalendar oy, oldingi klinik vazifa va oilaviy yakunlash oqibatlarini ajratish.',
        definition: `flowchart TD
 A["Oilaviy yordam kartasida reja amali"] --> B{"Oilaviy yordam faolmi?"}
 B -->|"Yo‘q"| C["Yakunlangan tarixni o‘qish"]
 B -->|"Ha"| D{"Bugun oxirgi sanadan keyinmi?"}
 D -->|"Ha"| E["Yangi vazifa va hozirgi bajarish bloklanadi"]
 E --> F["Mas’ul yakunlashni ko‘rib chiqadi"]
 D -->|"Yo‘q"| G{"Yangi vazifami yoki bajarishmi?"}
 G -->|"Yangi vazifa"| H{"Oila tanlanganmi?"}
 H -->|"Yo‘q"| I["Yordam oluvchini Oila qilish"]
 I --> H
 H -->|"Ha"| J{"Vazifa sanasi oilaviy davr ichidami?"}
 J -->|"Yo‘q"| K["Reja muddatini tekshirish"]
 K --> J
 J -->|"Ha"| L["Mas’ul va mazmun bilan vazifani saqlash"]
 G -->|"Bajarish"| M{"Vazifa Bola uchunmi?"}
 M -->|"Ha"| N["Vafotdan keyin klinik vazifa bajarilmaydi"]
 M -->|"Yo‘q"| O{"Vazifa hali rejalashtirilganmi?"}
 O -->|"Yo‘q"| C
 O -->|"Ha"| P["Haqiqiy natijani yozib saqlash"]
 F --> Q["Yakunlashni tasdiqlash"]
 Q --> R["Ochiq oilaviy vazifalar bekor qilinadi"]
 R --> S["Natija va bekor qilish tarixi saqlanadi"]
 P --> S
 L --> S
 N --> S
  class A,C,I,Q,S guide_action;
  class P guide_success;
  class E,N guide_rejected;
  class R guide_cancelled;
  class B,D,F,G,H,J,K,L,M,O guide_waiting;`,
        walkthrough: [
          'Oilaviy yordam allaqachon yopilgan bo‘lsa yozuvlar o‘qiladi; qayta xizmat qo‘shish amali yo‘q.',
          'Bugun uch kalendar oylik oxirgi sanadan o‘tgan bo‘lsa yangi vazifa va hozir bajarilgan natija qaydi bloklanadi. Mas’ul oilaviy yordamni yakunlash masalasini ko‘rib chiqadi.',
          'Yangi vazifa tarmog‘i yordam oluvchini tekshiradi: Bola tanlangan bo‘lsa uni oilaga tegishli xizmat mazmuni bilan Oila qilib aniqlashtirish kerak.',
          'Vazifa sanasi oilaviy davrdan tashqarida bo‘lsa reja sanasi qayta ko‘riladi. Faqat mos muddat, mas’ul va mazmun bilan saqlash mumkin.',
          'Bajarish tarmog‘ida oldingi Bola vazifasi alohida to‘xtatiladi; vafotdan keyin klinik xizmat bajarildi deb yozilmaydi.',
          'Oila vazifasi ham allaqachon bajarilgan yoki bekor qilingan bo‘lsa qayta natija olmaydi. Faqat rejalashtirilgan vazifa haqiqiy natija bilan tugatiladi.',
          'Mas’ul yakunlashni tasdiqlasa ochiq oilaviy vazifalar bekor qilinadi. Bu tarmoq vazifa bajarilganini emas, xizmat davri yakunini bildiradi.',
          'Oxirgi tarix tuguni barcha yo‘llardagi natijalar va bekor qilish sabablarini saqlaydi; bekor qilingan yozuvlar bajarilish maxrajidan chiqariladi.',
        ],
      },
    ],
  },
  equipment: {
    prerequisites: [
      'Jihozlar sahifasida kerakli inventar birligi mavjud; nomi, inventar raqami, joriy holati va foydalanish tarixi ko‘rib chiqilgan bo‘lishi kerak.',
      'Uyda bepul foydalanishga oluvchi bola faol Mobil yordamda bo‘ladi. Faqat qabul tasdig‘i, statsionar epizod yoki oilaga yordam davri yetarli emas.',
      'Jihoz Mavjud holatida va qaytarilmagan avvalgi berish yozuvisiz bo‘lishi kerak; bir birlik ikki oilaga bir paytda berilmaydi.',
      'Vakil bilan bepul foydalanish shartnomasi rekviziti tayyorlanadi. Prototip matn rekvizitini saqlaydi; elektron shartnoma yoki imzo yaratmaydi.',
      'Qaytarishda jihoz amalda qabul qilingan, butligi/ishlash holati va qabul qilish qaydi ma’lum bo‘ladi.',
      'Texnik tekshiruv yoki ta’mir zarur bo‘lsa qaytarish formasidagi katak xodim tomonidan belgilanadi. Texnik xizmatdan foydalanishga qaytarish amali bu prototipda yo‘q.',
    ],
    sections: [
      { title: 'Inventar birligi bilan bolaning xizmatini ajratish', paragraphs: [
        'Jihoz kartasi aniq inventar birligini ifodalaydi. Berish yozuvi esa shu jihoz qaysi bola va shartnomaga biriktirilganini ko‘rsatadi. Bir xil nomli bir nechta jihoz bo‘lishi mumkin; amalda nom bilan birga inventar raqamini tekshirish kerak.',
        'Foydalanishga berish faqat faol mobil epizoddagi bola uchun ochiladi. Statsionar xizmatdagi bola yoki vafotdan keyingi oila bu uyda foydalanish tanloviga kirmaydi. Mobil qabul qarori bor, lekin epizod boshlanmagan bo‘lsa avval Mobil yordamni boshlash jarayoni bajariladi.',
      ] },
      { title: 'Berish, amaldagi qaytarish va texnik holat', paragraphs: [
        'Saqlangan berish jihozni Foydalanishda holatiga o‘tkazadi va bola, shartnoma hamda vaqtni tarixga qo‘shadi. Xizmat tugashi, kuzatuvga o‘tish yoki vafot qaydi jihozni avtomatik Mavjud qilmaydi. Qaytarib olish faqat amaldagi qabul qilingandan keyin alohida bajariladi.',
        'Qaytarish natijasida ochiq berish yozuvi yopiladi, holat va qaytarish vaqti saqlanadi. Texnik tekshiruv yoki ta’mir kerak katagi belgilanmasa jihoz Mavjud bo‘ladi; belgilansa Texnik xizmatda bo‘ladi va qayta berilmaydi. Qaytarish matni jihoz kartasidagi joriy holat tavsifini ham yangilaydi.',
      ] },
      { title: 'Tarixning amaliy foydasi va prototip chegarasi', paragraphs: [
        'Berish va qaytarish tarixi faol hamda yakunlangan berishlarni birga ko‘rsatadi. Bola kartasi xizmat holati o‘zgargan bo‘lsa ham shartnoma, berish sanasi va qaytarish natijasi ko‘rinadi. Qaytarish amali bola klinik xizmati yopilgan bo‘lsa ham ishlaydi: resursning amaldagi qaytishi alohida hodisa.',
        'Bu ekran inventar hisobining namunasidir. Yangi jihoz yaratish, inventar raqamini tahrirlash, ta’mirni yakunlash, to‘lov, jarima yoki avtomatik qaytarish muddati amallari kiritilmagan. Texnik xizmatdagi birlik o‘rniga mavjud boshqa birlikni tekshirish mumkin; uni matn bilan mavjudga aylantirish yo‘li yo‘q.',
      ] },
    ],
    steps: [
      { title: 'Jihoz va tarixini topish', actor: 'Jihozlar uchun mas’ul', action: 'Jihozlar sahifasida kerakli jihoz nomi va inventar raqamini tekshiring; joriy holat hamda Berish va qaytarish tarixini ko‘ring.', result: 'To‘g‘ri inventar birligi va oldingi foydalanish yozuvlari aniqlanadi.', route: `${base}/equipment` },
      { title: 'Bolaning xizmat holatini tekshirish', actor: 'Muvofiqlashtiruvchi / jihozlar mas’uli', action: 'Qabul qiluvchi bola faol Mobil yordamda ekanini va qonuniy vakilini bola kartasida tekshiring.', result: 'Uyda bepul foydalanish uchun mos oluvchi aniqlanadi.', route: `${base}/cases` },
      { title: 'Mavjud birlikni tanlash', actor: 'Jihozlar uchun mas’ul', action: 'Mavjud holatidagi jihozda Foydalanishga berishni bosing. Kartadagi jihoz, inventar raqami va holat tavsifini yana solishtiring.', result: 'Tanlangan birlikning berish formasi ochiladi.', route: `${base}/equipment` },
      { title: 'Vakil va shartnomani qayd etish', actor: 'Jihozlar uchun mas’ul', action: 'Bola / qonuniy vakil tanlovidan ishni belgilang. Bepul foydalanish shartnomasi maydoniga raqam va imzolangan sana rekvizitini kiriting.', result: 'Jihozni kimga va qaysi hujjat asosida berish aniq bo‘ladi.' },
      { title: 'Berishni saqlash', actor: 'Jihozlar uchun mas’ul', action: 'Saqlashni bosing. Xato bo‘lsa bola xizmat holati, jihoz bandligi va shartnoma maydonini tekshiring.', result: 'Jihoz Foydalanishda bo‘ladi; yangi ochiq berish yozuvi yaratiladi.' },
      { title: 'Foydalanishdagi biriktirishni tekshirish', actor: 'Muvofiqlashtiruvchi', action: 'Jihoz kartasida bola, shartnoma va berilgan vaqtni ko‘ring. Xizmat epizodi tugaganda ham amalda qaytarilmagan birlik shu holatda qolishini hisobga oling.', result: 'Klinik xizmat holati bilan inventar qaytarilishi aralashtirilmaydi.' },
      { title: 'Jihozni amalda qabul qilish', actor: 'Jihozlar uchun mas’ul', action: 'Jihoz qaytganda uning inventar raqami, butligi va ishlash holatini tekshiring; qabul qilish dalolatnomasi yoki qayd rekvizitini tayyorlang.', result: 'Qaytarish yozuviga asos bo‘ladigan amaldagi qabul ma’lumoti mavjud bo‘ladi.' },
      { title: 'Qaytarish natijasini yozish', actor: 'Jihozlar uchun mas’ul', action: 'Qaytarib olishni ochib Qaytarilgandagi holat va qabul qilish qaydini to‘ldiring. Texnik tekshiruv yoki ta’mir kerak bo‘lsa tegishli katakni qo‘lda belgilang.', result: 'Qaytarilgandan keyingi foydalanishga tayyorlik aniq qayd etiladi.' },
      { title: 'Qaytarishni saqlash', actor: 'Jihozlar uchun mas’ul', action: 'Saqlashni bosing. Jihoz Mavjud yoki Texnik xizmatda holatiga o‘tganini tekshiring.', result: 'Ochiq berish yozuviga qaytarish vaqti va holat qo‘shiladi.' },
      { title: 'Tarix va keyingi resursni ko‘rish', actor: 'Jihozlar uchun mas’ul / muvofiqlashtiruvchi', action: 'Berish va qaytarish tarixida oldingi oluvchi, shartnoma va qaytarish natijasini tekshiring. Texnik xizmatdagi birlik qayta berilmaydi; zarur bo‘lsa mavjud boshqa birlik tanlanadi.', result: 'Resursning keyingi harakati saqlangan texnik holatga mos bo‘ladi.' },
    ],
    rules: [
      { tone: 'waiting', condition: 'Bola mobil yordamga qabul qilingan, ammo epizod hali boshlanmagan.', action: 'Mobil yordam sahifasida xizmatni boshlashni yakunlang; shundan keyin oluvchi tanlovini tekshiring.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototip jihoz berishda faol mobil epizodni tekshiradi.' },
      { tone: 'rejected', condition: 'Oluvchi statsionar xizmatda, keyingi kuzatuvda yoki oilaga yordamda.', action: 'Bu uyda bepul foydalanishga berish formasida yangi ajratma yaratmang.', owner: 'Jihozlar uchun mas’ul', basis: 'Nizomdagi uyda foydalanish jarayonining prototip doirasi — faol mobil yordam.' },
      { tone: 'waiting', condition: 'Jihoz Foydalanishda yoki qaytarilmagan berish yozuvi bor.', action: 'Shu birlikni ikkinchi bolaga bermang. Boshqa Mavjud birlikni tanlang yoki haqiqiy qaytarishdan keyin qayta tekshiring.', owner: 'Jihozlar uchun mas’ul', basis: 'Bir inventar birligi uchun bitta ochiq berish tekshiruvi.' },
      { tone: 'waiting', condition: 'Bepul foydalanish shartnomasi maydoni bo‘sh.', action: 'Tegishli shartnoma rekvizitini kiriting; bola yoki vakil ismining o‘zi yetarli emas.', owner: 'Jihozlar uchun mas’ul', basis: 'Bepul foydalanishning hujjatli asosi va majburiy prototip maydoni.' },
      { tone: 'action', condition: 'Bola epizodi yakunlangan, jihoz esa amalda qaytmagan.', action: 'Foydalanishda yozuvini saqlang; haqiqiy qabul qilinganda Qaytarib olishni bajaring.', owner: 'Jihozlar uchun mas’ul', basis: 'Xizmat epizodi va jihoz ajratmasi alohida yuritiladi.' },
      { tone: 'waiting', condition: 'Qaytarilgan jihoz tekshiruv yoki ta’mir talab qiladi.', action: 'Qaytarish katagini belgilang; birlik Texnik xizmatda bo‘ladi va yangi ajratmaga berilmaydi.', owner: 'Jihozlar uchun mas’ul', basis: 'Prototipdagi texnik holatni ajratish amali.' },
      { tone: 'waiting', condition: 'Jihoz Texnik xizmatda turibdi.', action: 'Boshqa mavjud birlikni ko‘rib chiqing. Bu prototipda ta’mirni yakunlash va mavjudga qaytarish tugmasi yo‘q.', owner: 'Jihozlar uchun mas’ul', basis: 'Joriy interfeys imkoniyati; mavjud bo‘lmagan texnik jarayon yaratilmaydi.' },
    ],
    faq: [
      { question: 'Jihoz bir oiladan qaytgach boshqa bolaga berilishi mumkinmi?', answer: 'Qaytarish saqlanib jihoz Mavjud holatiga o‘tsa, faol mobil yordamdagi boshqa bolaga yangi shartnoma qaydi bilan berish mumkin. Oldingi berish tarixi saqlanadi.' },
      { question: 'Bola kartasi yakunlangan bo‘lsa jihozni qanday qaytaraman?', answer: 'Jihozlar sahifasidagi ochiq berishdan Qaytarib olishni bajarasiz. Qaytarish jihoz ajratmasiga tegishli va bolaning klinik epizodi yopilganligi bunga to‘sqinlik qilmaydi.' },
      { question: 'Texnik xizmatda holatini qanday Mavjudga o‘zgartiraman?', answer: 'Hozirgi prototipda ta’mirni yakunlash amali yo‘q. Ushbu birlik qayta berilmaydi; mavjud boshqa birlik orqali jarayonni namoyish etish mumkin.' },
      { question: 'Qaytarish uchun sana kiritiladimi?', answer: 'Qaytarish formasida alohida sana maydoni yo‘q. Saqlash amali joriy vaqtni qaytarilgan vaqt sifatida yozadi; hujjat rekviziti va holat matnda qayd etiladi.' },
      { question: 'Shartnoma maydoniga fayl yoki elektron imzo yuklanadimi?', answer: 'Yo‘q. Bu matn rekviziti maydoni. Prototip tashqi hujjat aylanishi, fayl yuklash yoki elektron imzo xizmatiga ulanmagan.' },
      { question: 'Namuna bilan to‘ldirish texnik nosozlikni o‘zi belgilaydimi?', answer: 'Yo‘q. Yordamchi matn tayyorlaydi; texnik tekshiruv yoki ta’mir kerak katagini foydalanuvchi amaldagi holatga qarab qo‘lda belgilaydi.' },
    ],
    checklist: [
      'Jihoz nomi bilan birga inventar raqami tekshirilgan.', 'Jihoz Mavjud; qaytarilmagan boshqa ajratma yo‘q.',
      'Oluvchi bola faol mobil epizodda va to‘g‘ri vakilga ega.', 'Bepul foydalanish shartnomasi rekviziti kiritilgan.',
      'Berishdan keyin bola, shartnoma va Foydalanishda holati tekshirilgan.', 'Qaytarish faqat jihoz amalda qabul qilingach qayd etilgan.',
      'Butlik, ishlash holati va qabul qilish hujjati yozilgan.', 'Tekshiruv/ta’mir zarurati bo‘lsa tegishli katak belgilangan.',
      'Yakuniy Mavjud yoki Texnik xizmatda holati va tarix tekshirilgan.',
    ],
    fields: [
      { name: 'Jihoz nomi; inventar raqami; holat tavsifi', location: 'Jihozlar → jihoz kartasi va berish/qaytarish oynasi', requirement: 'O‘qish uchun; bu oynalarda tahrirlanmaydi.', meaning: 'Aynan qaysi birlik bilan ishlayotganingizni va so‘nggi texnik holatini ko‘rsatadi.', example: 'Namuna jihoz birligi; DEMO-INV-001; butligi tekshirilgan (namuna).' },
      { name: 'Bola / qonuniy vakil', location: 'Jihozlar → Foydalanishga berish', requirement: 'Majburiy; faol mobil epizoddagi bola tanlanadi.', meaning: 'Ajratmaning bola kartasi va vakilga tegishliligini belgilaydi.', example: 'Javohir F. (namuna) · uning qonuniy vakili.' },
      { name: 'Bepul foydalanish shartnomasi', location: 'Jihozni foydalanishga berish', requirement: 'Majburiy.', meaning: 'Bepul foydalanish shartnomasining raqami va imzolangan sana rekviziti; fayl yoki imzo emas.', example: 'DEMO-SH-006 / 08.09.2026.' },
      { name: 'Qaytarilgandagi holat va qabul qilish qaydi', location: 'Jihozlar → Qaytarib olish', requirement: 'Majburiy.', meaning: 'Butlik, ishlash holati va qabul qilish dalolatnomasi; qaytarish tarixiga va joriy holat tavsifiga yoziladi.', example: 'Jihoz but, ish holati tekshirildi; DEMO-QAY-006 bilan qabul qilindi (namuna).' },
      { name: 'Texnik tekshiruv yoki ta’mir kerak — jihoz qayta foydalanishga berilmaydi', location: 'Jihozni qaytarib olish → belgilash katagi', requirement: 'Zaruratga qarab xodim belgilaydi.', meaning: 'Belgilansa Texnik xizmatda, belgilanmasa Mavjud holati qo‘yiladi.', example: 'Texnik holat tekshiruvi kerak bo‘lgan shartli qaytarishda qo‘lda belgilanadi.' },
      { name: 'Berish va qaytarish tarixi', location: 'Jihozlar → tarix jadvali', requirement: 'Ko‘rish uchun; alohida saqlash talab qilinmaydi.', meaning: 'Jihoz, bola, shartnoma, berilgan/qaytarilgan vaqt va qaytarish natijasini ko‘rsatadi.', example: 'DEMO-SH-006 — foydalanishda yoki qaytarish qaydi mavjud.' },
      { name: 'Foydalanishga berish; Qaytarib olish', location: 'Jihozlar → birlik amallari', requirement: 'Jihoz holatiga qarab mavjud amal.', meaning: 'Mavjud birlikda berish, ochiq ajratmali Foydalanishda birlikda qaytarish oynasini ochadi.', example: 'Foydalanishda birlikda Qaytarib olishni tanlash.' },
      { name: 'Namuna bilan to‘ldirish; Saqlash', location: 'Berish va qaytarish dialoglari', requirement: 'Namuna yordamchisi ixtiyoriy; o‘zgarishni qo‘llash uchun Saqlash kerak.', meaning: 'Yordamchi bo‘sh matnlarni to‘ldiradi; foydalanuvchi oluvchi va texnik holatni tekshiradi.', example: 'Shartli rekvizitni tekshirib Saqlash; texnik katakni alohida qo‘lda tanlash.' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Oluvchi bola tanlovda yo‘q.', reason: 'Faol mobil epizod yo‘q yoki ish oilaviy yordamga o‘tgan.', solution: 'Bola kartasidagi joriy holatni tekshiring. Tegishli qabul tasdig‘i bo‘lsa Mobil yordamni boshlashni bajaring; statsionar yoki oilaviy ishni mos bo‘lmasa tanlamang.' },
      { tone: 'waiting', problem: 'Jihoz mavjud emas yoki boshqa bolaga berilgan.', reason: 'Birlik Mavjud emas yoki hali qaytarilmagan ajratma bor.', solution: 'Jihoz holati va tarixni tekshiring; boshqa mavjud birlikni tanlang. Shu jihoz haqiqatan qaytgandan keyin qaytarish qaydini saqlab qayta berish mumkin.' },
      { tone: 'waiting', problem: 'Bepul foydalanish shartnomasi raqami talab qilinmoqda.', reason: 'Shartnoma maydoni bo‘sh.', solution: 'Bepul foydalanish shartnomasi rekvizitini kiriting. Demo uchun Namuna bilan to‘ldirish yordamchisidan foydalanib matnni tekshiring.' },
      { tone: 'action', problem: 'Faol jihoz berish qaydi topilmadi.', reason: 'Jihoz allaqachon qaytarilgan yoki bu birlikda ochiq ajratma yo‘q.', solution: 'Berish va qaytarish tarixidan kerakli inventar birligini aniqlang. Qaytarilgan ajratmani ikkinchi marta qaytarmang.' },
      { tone: 'waiting', problem: 'Qaytarishdagi holat va dalolatnoma qaydi talab qilindi.', reason: 'Qaytarish matni bo‘sh.', solution: 'Qaytarilgandagi holat va qabul qilish qaydiga butlik, ishlash holati va hujjat rekvizitini yozib saqlang.' },
      { tone: 'waiting', problem: 'Qaytarilgan jihozda Foydalanishga berish tugmasi yo‘q.', reason: 'Qaytarishda texnik tekshiruv/ta’mir belgilanib, birlik Texnik xizmatda bo‘lgan.', solution: 'Joriy holat va qaytarish sababini o‘qing. Prototipda ta’mirni yakunlash yo‘q; mavjud boshqa birlikni ko‘rib chiqing.' },
      { tone: 'action', problem: 'Klinik xizmat yopildi, lekin jihoz Foydalanishda qolgan.', reason: 'Epizod yakuni amaldagi qaytarishni avtomatik qayd etmaydi.', solution: 'Jihoz amalda qaytganida Qaytarib olishni bajaring. Bola kartasi yopilgan bo‘lsa ham bu amal jihozning ochiq ajratmasida mavjud.' },
    ],
    outcomes: [
      'Har inventar birligining mavjudligi va kimga berilgani ko‘rinadi.', 'Bepul foydalanish shartnomasi bola hamda aniq jihoz bilan bog‘langan.',
      'Bir birlikning parallel ikki oilaga berilishi bloklanadi.', 'Amaldagi qaytarish, texnik holat va vaqt ajratma tarixiga yoziladi.',
      'Texnik xizmatdagi jihoz qayta foydalanishga berilmaydi; oldingi foydalanish tarixi saqlanadi.',
    ],
    relatedTopics: ['mobile', 'care-plan', 'follow-up', 'reports'],
    flows: [
      {
        id: 'equipment-full', title: 'Jihozni berish, qaytarish va texnik holat', description: 'Faol mobil oluvchi va shartnomadan amaldagi qaytarishgacha; mavjud hamda texnik xizmatdagi birliklarning keyingi farqi.',
        definition: `flowchart TD
 A["Jihozlar mas’uli inventar ro‘yxatini ochadi"] --> B["Jihoz nomi, raqami va tarixini tekshirish"]
 B --> C{"Mavjud va ochiq ajratmasizmi?"}
 C -->|"Yo‘q"| D["Boshqa mavjud birlikni ko‘rish"]
 D --> B
 C -->|"Ha"| E["Foydalanishga berish"]
 E --> F["Bola va qonuniy vakilni tanlash"]
 F --> G{"Faol mobil epizod bormi?"}
 G -->|"Yo‘q"| H["Mobil qabul va xizmat holatini aniqlashtirish"]
 H --> F
 G -->|"Ha"| I["Bepul foydalanish shartnomasi rekviziti"]
 I --> J{"Shartnoma matni to‘ldirilganmi?"}
 J -->|"Yo‘q"| I
 J -->|"Ha"| K["Saqlash: jihoz Foydalanishda"]
 K --> L["Bola, shartnoma va berish vaqti tarixda"]
 L --> M{"Jihoz amalda qaytdimi?"}
 M -->|"Yo‘q"| N["Ochiq ajratma saqlanadi"]
 N --> O["Xizmat yopilishi qaytarish hisoblanmaydi"]
 O --> M
 M -->|"Ha"| P["Mas’ul butlik va ishlash holatini tekshiradi"]
 P --> Q["Qaytarib olish"]
 Q --> R["Qaytarish holati va qabul qilish qaydi"]
 R --> S{"Texnik tekshiruv yoki ta’mir kerakmi?"}
 S -->|"Ha"| T["Texnik tekshiruv katagini belgilash"]
 S -->|"Yo‘q"| U["Katak belgilanmaydi"]
 T --> V["Saqlash: ajratma qaytarish bilan yopiladi"]
 U --> V
 V --> W{"Texnik katak belgilanganmi?"}
 W -->|"Ha"| X["Texnik xizmatda: qayta berilmaydi"]
 W -->|"Yo‘q"| Y["Mavjud: keyingi ajratma mumkin"]
 X --> Z["Berish va qaytarish tarixi saqlanadi"]
 Y --> Z
 Y --> B
  class A,B,E,F,I,L,N,O,P,Q,R,U,Z guide_action;
  class K,V,Y guide_success;
  class C,D,G,H,J,M,S,T,W,X guide_waiting;`,
        walkthrough: [
          'Inventar birligining nomi va raqami tekshiriladi. Mavjud bo‘lmagan yoki ochiq ajratmali birlikda yangi berish ochilmaydi; boshqa birlik tanlash aylanasiga qaytiladi.',
          'Oluvchi tarmog‘ida faol mobil epizod talab qilinadi. Faqat qabul tasdig‘i yoki statsionar xizmat bu tekshiruvni qoplamaydi.',
          'Shartnoma rekviziti bo‘sh bo‘lsa berish saqlanmaydi; matn to‘ldirilgach jihoz Foydalanishda bo‘ladi va vaqt bilan yangi ajratma ochiladi.',
          'Amalda qaytdimi tarmog‘i xizmat yakunidan mustaqil. Bola kuzatuvga yoki oilaviy yordamga o‘tgan bo‘lsa ham qaytmagan jihoz ochiq ajratmada qoladi.',
          'Qaytarish yo‘lida xodim butlik va ishlash holatini tekshiradi, so‘ng holat hamda qabul qilish hujjatini yozadi.',
          'Texnik zarurat bor tarmog‘ida katak qo‘lda belgilanadi. Yordamchi namuna tugmasi bu qarorni xodim o‘rniga qilmaydi.',
          'Qaytarish saqlanganda ajratma yopiladi. Katak belgilangan bo‘lsa Texnik xizmatda, aks holda Mavjud holati qo‘yiladi.',
          'Faqat Mavjud yo‘li keyingi berishga qaytadi. Texnik xizmatdagi birlik tarixda ko‘rinadi, ammo prototipda ta’mirdan chiqarish amali mavjud emas.',
        ],
      },
      {
        id: 'equipment-return-exceptions', title: 'Yakunlangan ish va texnik jihoz istisnolari', description: 'Klinik xizmat yopilganidan keyin ochiq ajratmani qaytarish, qayta berish to‘sig‘i va texnik xizmat holatini tushunish.',
        definition: `flowchart TD
 A["Jihoz bo‘yicha amal ishlamadi"] --> B{"Yangi berishmi yoki qaytarishmi?"}
 B -->|"Yangi berish"| C{"Birlik Foydalanishdami?"}
 C -->|"Ha"| D["Ochiq ajratma va amaldagi oluvchini tekshirish"]
 D --> E["Boshqa Mavjud birlikni tanlash"]
 C -->|"Yo‘q"| F{"Texnik xizmatdami?"}
 F -->|"Ha"| G["Ta’mirni yakunlash amali prototipda yo‘q"]
 G --> E
 F -->|"Yo‘q"| H["Faol mobil oluvchi va shartnomani tekshirish"]
 H --> I["Mos ma’lumot bilan berishni saqlash"]
 B -->|"Qaytarish"| J{"Ochiq berish yozuvi bormi?"}
 J -->|"Yo‘q"| K["Tarixdan to‘g‘ri inventar birligini topish"]
 K --> J
 J -->|"Ha"| L{"Jihoz amalda qabul qilinganmi?"}
 L -->|"Yo‘q"| M["Xizmat yopilgan bo‘lsa ham ajratma ochiq qoladi"]
 L -->|"Ha"| N["Karta yopilgan bo‘lsa ham Qaytarib olish"]
 N --> O["Holat va qabul qaydini yozish"]
 O --> P{"Tekshiruv yoki ta’mir kerakmi?"}
 P -->|"Ha"| Q["Katak bilan saqlash: Texnik xizmatda"]
 P -->|"Yo‘q"| R["Kataksiz saqlash: Mavjud"]
 Q --> S["Qaytarish natijasi tarixda"]
 R --> S
  class A,D,N,O,S guide_action;
  class I,R guide_success;
  class B,C,E,F,G,H,J,K,L,M,P,Q guide_waiting;`,
        walkthrough: [
          'Avval amal turi ajratiladi: yangi berish talablari bilan qaytarish talablari bir xil emas.',
          'Yangi berishda Foydalanishda birlik tanlansa ochiq ajratma tekshiriladi; u haqiqiy qaytarilmaguncha boshqa Mavjud birlik tanlanadi.',
          'Texnik xizmatda tarmog‘i foydalanuvchini mavjud bo‘lmagan ta’mirni yakunlash tugmasini izlashga yubormaydi. Namoyish uchun boshqa mavjud birlikdan foydalaniladi.',
          'Mavjud birlikda muammo bo‘lsa faol mobil oluvchi va shartnoma rekviziti ko‘riladi; bu ikkisi mos bo‘lgach berish qayta saqlanadi.',
          'Qaytarish tarmog‘ida ochiq ajratma topilmasa inventar raqami va tarix tekshiriladi. Qaytgan yozuv ikkinchi marta qaytarilmaydi.',
          'Jihoz amalda qabul qilinmagan bo‘lsa klinik xizmatning yopilganligi qaytarish asosi bo‘lmaydi; ajratma ochiq qoladi.',
          'Amalda qaytgan birlik bola kartasi yopilgan bo‘lsa ham Jihozlar orqali qaytariladi. Holat va qabul qilish matni majburiy.',
          'Texnik ehtiyojga qarab yakuniy holat ajraladi; ikkala yo‘lda ham oldingi bola, shartnoma va qaytarish natijasi tarixda saqlanadi.',
        ],
      },
    ],
  },
  'follow-up': {
    prerequisites: [
      'Klinik xizmatni yakunlash uchun bola faol Statsionar yoki Mobil yordam epizodiga ega bo‘lishi kerak.',
      'Mas’ul mutaxassis yakunlash sababini, amaldagi sanani, tegishli hujjat va keyingi yordam xulosasini tayyorlaydi.',
      'Oilaviy shifokorga topshirish xizmat epizodi yopilib bola Keyingi kuzatuv holatiga o‘tgandan so‘ng qayd etiladi.',
      'Vafot holatida o‘lim epikrizi rekviziti tayyorlanadi. Vakil o‘lim sababiga e’tiroz bildirgan bo‘lsa tegishli patologiya bo‘limiga yo‘llash qaydi ham kerak.',
      'Oilaga keyingi yordam klinik epizoddan ajratiladi: oila uchun psixologik/ijtimoiy reja, mas’ullar va uch kalendar oylik davr ko‘rib chiqiladi.',
      'Yakunlashdan oldin va keyin ochiq tashrif, reja vazifasi va jihozlar tekshiriladi; har yozuv o‘zining haqiqiy natijasiga ko‘ra yuritiladi.',
    ],
    sections: [
      { title: 'Yakunlash sababi keyingi jarayonni belgilaydi', paragraphs: [
        'Statsionar yoki Mobil yordamdagi Yakunlash amali faol klinik epizodga tegishli. Oilaviy shifokor kuzatuviga chiqarish va Boshqa muassasaga o‘tkazish variantlari Keyingi kuzatuv holatini beradi; tanlangan sabab, hujjat va xulosa epizod tarixida alohida saqlanadi.',
        'Vafot holati klinik epizodni yopib Oilaga yordam holatini ochadi. Bu bola xizmatini davom ettirish emas, oilaga yordamning alohida davridir. O‘lim sababini tizim aniqlamaydi; mutaxassis hujjatli natijani va zarur yo‘naltirishni qayd etadi.',
      ] },
      { title: 'Shifokorga topshirish yozuvining vazifasi', paragraphs: [
        'Keyingi kuzatuv holatidagi bola kartasida Yordam rejasi → Oilaviy shifokor kuzatuvi → Topshirishni qayd etish ochiladi. Qabul qiluvchi shifokor, poliklinika, topshirish sanasi, keyingi kuzatuv sanasi, hujjat va reja yoziladi. Bu qayd epizod yakunidan alohida, yordam uzluksizligini ko‘rsatadigan yozuvdir.',
        'Topshirish qaydini saqlash karta holatini Yakunlangan qilmaydi: bola Keyingi kuzatuvda qoladi. Keyinchalik qayta ehtiyoj bo‘lsa o‘sha kartada yo‘llanma qayta tayyorlanishi mumkin; eski epizodlar va oldingi yo‘llanma tarixi qoladi. Yangi xizmat yana tegishli konsilium qarori, yangi qabul yoshi va oldingi kunlar tekshiruvidan o‘tadi.',
      ] },
      { title: 'Uch kalendar oylik oilaviy davr qanday yuritiladi', paragraphs: [
        'Prototip oilaviy davrni vafot sanasiga uch kalendar oy qo‘shib belgilaydi. Bu 90 kun degani emas. Masalan, shartli 31-yanvar boshlanishiga mos uch oylik oxirgi sana 30-aprel bo‘ladi, chunki aprel oyida 31-kun yo‘q. Kartadagi boshlanish va oxirgi sanalar ish uchun asosiy ko‘rinadigan chegaradir.',
        'Davr ichida Oila uchun vazifalar va tashriflar rejalashtiriladi; muddat tugagach yangi oilaviy vazifa, uni hozir bajarilgan deb belgilash va yangi tashrifni boshlash cheklanadi. Sana kelishi kartani avtomatik yopmaydi: Oilaga yordamni yakunlash amali mas’ul tomonidan tasdiqlanadi.',
      ] },
      { title: 'Yakunlashdan so‘ng nima avtomatik o‘zgaradi', paragraphs: [
        'Klinik epizod yopilganda faol o‘rin bo‘shaydi, ishning rejalashtirilgan yoki bajarilayotgan tashriflari bekor qilinadi. Jihoz qaytarilishi va vazifa bajarilishi bundan avtomatik kelib chiqmaydi. Vafotdan keyin eski Bola vazifasini bajarilgan deb belgilash mumkin emas; oila ehtiyoji uchun Oila vazifasi yaratiladi.',
        'Oilaga yordamni yakunlash tasdiqlanganda ochiq oilaviy vazifalar va tashriflar bekor qilinadi; bajarilgan xizmatlar hamda bekor qilish sabablari tarixda qoladi. Karta Yakunlangan bo‘ladi. Jihozlar esa hali qaytmagan bo‘lsa Jihozlar orqali amaldagi qaytarilishiga ko‘ra alohida yopiladi.',
      ] },
    ],
    steps: [
      { title: 'Faol epizod va keyingi ehtiyojni ko‘rish', actor: 'Davolovchi mutaxassis / muvofiqlashtiruvchi', action: 'Bola kartasida faol xizmat, individual reja, ochiq tashriflar va jihozlarni ko‘ring; yakunlashning hujjatli sababini aniqlang.', result: 'Klinik yakun bilan keyingi yordamning vazifalari ajraladi.', route: `${base}/cases` },
      { title: 'Xizmatni yakunlash oynasini ochish', actor: 'Muvofiqlashtiruvchi', action: 'Statsionar yoki Mobil yordamdagi tegishli faol bola qatoridan Yakunlashni bosing.', result: 'Aynan shu faol klinik epizodning yakunlash formasi ochiladi.' },
      { title: 'Yakun sanasi va sababini belgilash', actor: 'Mas’ul mutaxassis', action: 'Yakun sanasini qabuldan oldin bo‘lmagan va kelajakda bo‘lmagan sana sifatida kiriting. Yakunlash sababini chiqarish, o‘tkazish yoki vafot holatidan tanlang.', result: 'Yakun voqeasi va unga mos keyingi holat aniqlanadi.' },
      { title: 'Hujjat va xulosani to‘ldirish', actor: 'Mas’ul mutaxassis', action: 'Chiqarish yoki o‘tkazish hujjati yoxud O‘lim epikrizi raqami / hujjat maydonini to‘ldiring. Yakuniy xulosa va keyingi harakatni mazmunli yozing.', result: 'Epizod yakuni hujjat va davomiy yordam xulosasi bilan asoslanadi.' },
      { title: 'Vafotga e’tiroz bo‘lsa yo‘naltirishni yozish', actor: 'Mas’ul tibbiy xodim', action: 'Vafot sababiga vakil e’tirozi mavjud bo‘lsa tegishli katakni belgilang va Patologoanatomiya bo‘limiga yo‘llash qaydini kiriting.', result: 'E’tirozli holatning tegishli bo‘limga yo‘naltirish dalili alohida saqlanadi.' },
      { title: 'Klinik epizodni yakunlash', actor: 'Muvofiqlashtiruvchi', action: 'Epizodni yakunlashni bosing; yopilgan epizod, bo‘shagan o‘rin va ochiq tashriflar bekor qilinganini tekshiring.', result: 'Chiqarish/o‘tkazishda Keyingi kuzatuv, vafotda Oilaga yordam holati paydo bo‘ladi.' },
      { title: 'Chiqarilgandan keyingi topshirishni ochish', actor: 'Oilaviy shifokor / muvofiqlashtiruvchi', action: 'Keyingi kuzatuv holatidagi bola kartasining Yordam rejasi oynasida Oilaviy shifokor kuzatuvi → Topshirishni qayd etishni bosing.', result: 'Klinik epizoddan keyingi qabul qiluvchi va reja uchun alohida yozuv ochiladi.', route: `${base}/cases` },
      { title: 'Qabul qiluvchi va kuzatuv sanalarini kiritish', actor: 'Oilaviy shifokor / muvofiqlashtiruvchi', action: 'Qabul qiluvchi oilaviy shifokor, Poliklinika, Topshirish sanasi, Keyingi kuzatuv sanasi, Topshirish hujjati rekviziti va Kuzatuv rejasini to‘ldirib Saqlashni bosing.', result: 'Topshirish qaydi tarixga qo‘shiladi; bola Keyingi kuzatuvda qoladi.' },
      { title: 'Vafotdan keyingi oilaviy davrni ko‘rish', actor: 'Psixolog / ijtimoiy xodim / muvofiqlashtiruvchi', action: 'Oilaga yordam holatida kartadagi boshlanish va oxirgi sanani tekshiring. Oldingi klinik vazifalar bilan oilaviy yordamni ajrating.', result: 'Oilaga xizmat ko‘rsatishning uch kalendar oylik chegarasi aniq bo‘ladi.' },
      { title: 'Oila rejasini va uchrashuvlarni yuritish', actor: 'Psixolog / ijtimoiy xodim', action: 'Yordam rejasida Oila uchun vazifa, mas’ul va muddatni kiriting. Uchrashuv kerak bo‘lsa Mobil yordam → Tashrif rejalashtirish orqali oilaviy tashrifni alohida yarating.', result: 'Oila yordami bola klinik xizmatidan ajratilgan yozuvlarda rejalashtiriladi.', route: `${base}/mobile` },
      { title: 'Oila xizmatining natijasini saqlash', actor: 'Xizmat ko‘rsatgan mutaxassis', action: 'Vazifada Bajarilganini qayd etish, boshlangan tashrifda Natijani qayd etish orqali haqiqiy natijani yozing. Aloqalarni Muloqot qaydida yuriting.', result: 'Ko‘rsatilgan oilaviy yordam va aloqa mazmuni saqlanadi.' },
      { title: 'Oilaviy yordam yakunini ko‘rib chiqish', actor: 'Oilaviy yordam uchun mas’ul', action: 'Ochiq oilaviy vazifalar, tashriflar, natijalar va davr chegarasini ko‘ring. Yakunlashga qaror qilinganda Oilaga yordamni yakunlashni oching.', result: 'Bekor qilinadigan ochiq ishlar va saqlanadigan natijalar yakunlashdan oldin ko‘rinadi.' },
      { title: 'Oilaviy yordamni tasdiq bilan yopish', actor: 'Oilaviy yordam uchun mas’ul', action: 'Tasdiqlash oynasidagi oqibatni o‘qib Yakunlashni tasdiqlashni bosing. Fikr o‘zgarsa Bekor qilish orqali oynani yoping.', result: 'Ochiq oilaviy vazifa va tashriflar bekor bo‘ladi, oilaviy davr va karta Yakunlangan holatiga o‘tadi.' },
      { title: 'Resurslar va tarixni yakuniy tekshirish', actor: 'Muvofiqlashtiruvchi / jihozlar uchun mas’ul', action: 'Yordam rejasi va Jarayon tarixida epizod, topshirish yoki oilaviy natijalarni tekshiring. Qaytgan jihoz bo‘lsa Jihozlar → Qaytarib olishni alohida bajaring.', result: 'Xizmat yakuni, oilaviy davr va inventarning amaldagi holati o‘zaro aniq yuritiladi.', route: `${base}/equipment` },
    ],
    rules: [
      { tone: 'waiting', condition: 'Topshirishni qayd etish faol klinik epizod vaqtida bajarilmoqda.', action: 'Avval hujjatli klinik yakunni qayd eting; topshirish Keyingi kuzatuv holatida yuritiladi.', owner: 'Muvofiqlashtiruvchi', basis: 'Prototipda epizod yakuni va keyingi shifokorga topshirish ketma-ketligi.' },
      { tone: 'waiting', condition: 'Topshirish sanasi epizod yakunidan oldin yoki kelajakda.', action: 'Haqiqiy topshirish sanasini kiriting; keyingi kuzatuv sanasi undan oldin bo‘lmasin.', owner: 'Oilaviy shifokor / muvofiqlashtiruvchi', basis: 'Prototipning topshirish sanalarini izchil tekshirishi.' },
      { tone: 'action', condition: 'Vafot va qonuniy vakil e’tirozi birga qayd etilgan.', action: 'Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining Patologoanatomiya va murdalarni saqlash bo‘limiga yo‘llash qaydini yozing.', owner: 'Mas’ul tibbiy xodim', basis: 'Buyruqdagi e’tirozli vafot holatini yo‘naltirish tartibi; prototip majburiy qaydi.' },
      { tone: 'action', condition: 'Vafot sanasi saqlangan.', action: 'Bola klinik xizmatini alohida yopilgan deb, oilaga yordamni alohida faol davr deb yuriting; oldingi klinik vazifalarni bajarildi qilmang.', owner: 'Muvofiqlashtiruvchi va mutaxassislar', basis: 'Klinik epizod bilan oilaviy yordamni ajratish.' },
      { tone: 'waiting', condition: 'Oilaviy vazifa yoki tashrif davr oxiridan keyinga belgilanmoqda.', action: 'Kartadagi uch kalendar oylik chegarani tekshirib reja sanasini moslang. 90 kunlik oddiy qo‘shishdan foydalanmang.', owner: 'Oilaviy yordam uchun mas’ul', basis: 'Nizomdagi uch oygacha davr; prototipning kalendar oy hisoblash usuli.' },
      { tone: 'waiting', condition: 'Oilaviy davr oxirgi sanasi o‘tgan, karta hali ochiq.', action: 'Mas’ul yakunlashni ko‘rib chiqadi. Sana o‘tishi avtomatik yakunlash yoki yangi yordam davri yaratmaydi.', owner: 'Oilaviy yordam uchun mas’ul', basis: 'Prototip avtomatik klinik qaror chiqarmaydi; yakun alohida tasdiqlanadi.' },
      { tone: 'cancelled', condition: 'Oilaga yordamni yakunlash tasdiqlanmoqda.', action: 'Ochiq oilaviy vazifa va tashriflar bekor bo‘lishini tekshiring; bajarilgan tarix saqlanadi.', owner: 'Oilaviy yordam uchun mas’ul', basis: 'Prototipning ochiq oilaviy ishlarni bekor qilish va kartani yopish amali.' },
      { tone: 'waiting', condition: 'Keyingi kuzatuvdan so‘ng qayta palliativ xizmat ehtiyoji bor.', action: 'Mavjud kartada yangi yo‘llanma va tegishli konsilium bosqichlarini yuriting; oldingi epizodlarni o‘chirmang.', owner: 'Oilaviy shifokor va yo‘llanma beruvchi muassasa', basis: 'Takroriy murojaatni tarix bilan saqlash; yangi qabul yoshi va statsionar kunlari qayta tekshiriladi.' },
      { tone: 'action', condition: 'Xizmat yoki oilaviy davr yopilganda jihoz qaytmagan.', action: 'Jihoz ajratmasini ochiq qoldiring; amalda qaytganda alohida qaytarish yozuvini saqlang.', owner: 'Jihozlar uchun mas’ul', basis: 'Resurs hisobi xizmat holatidan alohida yuritiladi.' },
    ],
    faq: [
      { question: 'Topshirish qaydi saqlangach bola kartasi nega Keyingi kuzatuvda qoldi?', answer: 'Bu kutilgan holat. Topshirish yozuvi qabul qiluvchi shifokor va reja tarixini qo‘shadi, kartani avtomatik Yakunlangan qilmaydi.' },
      { question: 'Oilaga yordamni yakunlashni 90 kundan keyin bajarish kerakmi?', answer: 'Davr kartada uch kalendar oy bilan ko‘rsatiladi, 90 kun bilan emas. Yakunlash mas’ulning alohida amali; tizim sanada avtomatik yopmaydi. Faol davr ichidagi xizmatlar va haqiqiy yakun holati ko‘rib chiqiladi.' },
      { question: 'Vafot qaydi saqlanganda oldingi barcha vazifalar bekor bo‘ladimi?', answer: 'Klinik epizod yakuni ochiq tashriflarni bekor qiladi, barcha vazifalarni emas. Eski Bola vazifalari tarixda qolishi mumkin, lekin vafotdan keyin ularni bajarilgan deb belgilash bloklanadi. Oilaviy yakun esa ochiq Oila vazifalarini bekor qiladi.' },
      { question: 'Oilaviy yordam tugagach karta ichida yangi xizmat yozish mumkinmi?', answer: 'Yakunlangan karta xizmat qo‘shish uchun yopiq bo‘ladi; mavjud tarix o‘qiladi. Jihozning amaldagi qaytarilishi Jihozlar sahifasidagi ochiq ajratmadan alohida qayd etilishi mumkin.' },
      { question: 'Boshqa muassasaga o‘tkazishda topshirish ma’lumotini qayerga yozaman?', answer: 'Yakunlashda Boshqa muassasaga o‘tkazish sababini tanlab hujjat va xulosada tegishli ma’lumotni yozing. Keyingi oilaviy shifokor kuzatuvi bo‘lsa kartadagi alohida Topshirishni qayd etish orqali shifokor va poliklinika qayd etiladi.' },
      { question: 'Oilaviy tashrif bola uchun uyga tashrif soniga kiradimi?', answer: 'Tashrif yordam oluvchisi Oila deb saqlanadi. U yangi klinik epizod yoki bolaning PaPaS/uy ehtiyoji bahosi hisoblanmaydi; hisobotda xizmat turi va yordam oluvchini birga tekshiring.' },
      { question: 'Yakunlash oynasini yopib yuborsam holat o‘zgaradimi?', answer: 'Yo‘q. Klinik yakunda Epizodni yakunlash, oilaviy yakunda Yakunlashni tasdiqlash bajarilgandan keyin o‘zgarish saqlanadi. Bekor qilish dialogni saqlamasdan yopadi.' },
    ],
    checklist: [
      'Faol klinik epizod va yakunlashning haqiqiy sababi tekshirilgan.', 'Yakun sanasi qabuldan oldin va kelajakda emas.',
      'Tegishli epikriz/topshirish hujjati va yakuniy xulosa kiritilgan.', 'Vafotga e’tiroz bo‘lsa kerakli bo‘limga yo‘llash qaydi saqlangan.',
      'Chiqarish/o‘tkazishda qabul qiluvchi shifokor, poliklinika va keyingi kuzatuv rejasi yozilgan.', 'Vafotda oilaviy davr boshlanishi va uch kalendar oylik oxirgi sana tekshirilgan.',
      'Oilaviy vazifa va tashriflar Oila uchun, tegishli davr ichida rejalashtirilgan.', 'Klinik vazifa bajarilishi oilaviy xizmat bilan aralashtirilmagan.',
      'Oilaviy yakunda ochiq ishlar bekor bo‘lishi va natijalar tarixda qolishi tekshirilgan.', 'Jihozning amaldagi qaytarilishi alohida qayd etilgan yoki ochiq ajratma sifatida saqlangan.',
      'Keyingi kuzatuv va Yakunlangan holatlari bir xil deb talqin qilinmagan.',
    ],
    fields: [
      { name: 'Yakun sanasi', location: 'Statsionar / Mobil yordam → Yakunlash', requirement: 'Majburiy; epizod boshlanishidan oldin va kelajakda emas.', meaning: 'Klinik epizodning haqiqiy yakun sanasi; vafotda oilaviy davr shu sanadan hisoblanadi.', example: '2026-09-08 — epizod sanalariga mos shartli yakun.' },
      { name: 'Yakunlash sababi', location: 'Xizmat epizodini yakunlash', requirement: 'Uch variantdan biri.', meaning: 'Chiqarish/o‘tkazish Keyingi kuzatuvga, Vafot holati Oilaga yordamga olib o‘tadi.', example: 'Oilaviy shifokor kuzatuviga chiqarish.' },
      { name: 'Chiqarish yoki o‘tkazish hujjati', location: 'Xizmat epizodini yakunlash → chiqarish yoki o‘tkazish', requirement: 'Majburiy.', meaning: 'Yakun hujjati raqami va sanasi; haqiqiy fayl yuklanmaydi.', example: 'DEMO-EPI-019 / 08.09.2026.' },
      { name: 'O‘lim epikrizi raqami / hujjat', location: 'Xizmat epizodini yakunlash → Vafot holati', requirement: 'Vafot holatida majburiy.', meaning: 'Klinik epizodning vafot sababli yakunini hujjatlashtiruvchi rekvizit.', example: 'DEMO-VAFOT-EPI-020 / 08.09.2026.' },
      { name: 'Yakuniy xulosa va keyingi harakat', location: 'Xizmat epizodini yakunlash', requirement: 'Majburiy.', meaning: 'Ko‘rsatilgan xizmat yakuni va keyingi shifokor/oila yordami bo‘yicha aniq qadam.', example: 'Klinik epizod yakunlandi; oilaga alohida psixologik yordam rejasi tuziladi (namuna).' },
      { name: 'Qonuniy vakil o‘lim sababiga e’tiroz bildirgan', location: 'Vafot holati → belgilash katagi', requirement: 'E’tiroz mavjud bo‘lsa xodim belgilaydi.', meaning: 'Patologoanatomiya yo‘llash qaydi talabini ochadi; tizim sababni mustaqil baholamaydi.', example: 'E’tirozli shartli vaziyatda qo‘lda tasdiqlanadi.' },
      { name: 'Patologoanatomiya bo‘limiga yo‘llash qaydi', location: 'Vafot holati → e’tiroz mavjud', requirement: 'E’tiroz belgilanganda majburiy.', meaning: 'Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining tegishli bo‘limiga yo‘naltirish rekviziti va qaydi.', example: 'DEMO-PAT-020; yo‘llash sanasi va mas’ul qaydi (namuna).' },
      { name: 'Qabul qiluvchi oilaviy shifokor', location: 'Bola kartasi → Yordam rejasi → Topshirishni qayd etish', requirement: 'Majburiy; karta Keyingi kuzatuvda bo‘ladi.', meaning: 'Kuzatuvni qabul qilgan aniq shifokor.', example: 'D. Sobirova, oilaviy shifokor (namuna).' },
      { name: 'Poliklinika', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy.', meaning: 'Keyingi kuzatuvni yurituvchi qabul qiluvchi tashkilot.', example: 'Namuna oilaviy poliklinika.' },
      { name: 'Topshirish sanasi', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy; epizod yakunidan oldin va bugundan keyin emas.', meaning: 'Hujjat/ma’lumot amalda topshirilgan sana.', example: '2026-09-08 — shu kuni yakunlangan epizod namunasi.' },
      { name: 'Keyingi kuzatuv sanasi', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy haqiqiy sana; topshirish sanasidan oldin emas.', meaning: 'Keyingi ko‘rik yoki kuzatuvning rejalashtirilgan sanasi.', example: '2026-09-15 — shifokor belgilagan shartli sana.' },
      { name: 'Topshirish hujjati rekviziti', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy.', meaning: 'Kuzatuvni topshirish hujjati raqami/sanasi; klinik yakun hujjatidan alohida qayd.', example: 'DEMO-TOP-019 / 08.09.2026.' },
      { name: 'Kuzatuv rejasi', location: 'Oilaviy shifokorga topshirish', requirement: 'Majburiy.', meaning: 'Qabul qiluvchi shifokor bilan kelishilgan kuzatuv va keyingi harakatlar.', example: 'Rejadagi ko‘rikda oila ehtiyojlari qayta ko‘riladi; zarur keyingi yordam shifokor tomonidan belgilanadi (namuna).' },
      { name: 'Yordam oluvchi; Bajarish muddati', location: 'Oilaga yordam kartasi → Yordam rejasi → Vazifa qo‘shish', requirement: 'Oila va faol oilaviy davrdan kech bo‘lmagan sana.', meaning: 'Klinik Bola vazifasi bilan oila xizmatini ajratadi.', example: 'Oila; 2026-09-15 — kartadagi davrga mos bo‘lsa.' },
      { name: 'Bola / oila; Sana va vaqt; Tashrif maqsadi', location: 'Mobil yordam → Tashrif rejalashtirish → oilaviy yordam', requirement: 'Faol oila, davr ichidagi vaqt va aniq maqsad; brigada/davomiylik ham kiritiladi.', meaning: 'Oila uchun alohida uy uchrashuvi yoki masofaviy maslahat rejasini yaratadi.', example: 'Temur H. (namuna) · oilaga yordam; 2026-09-15 11:00; oila bilan qo‘llab-quvvatlash suhbati.' },
      { name: 'Oilaga yordamni yakunlash; Yakunlashni tasdiqlash', location: 'Oilaga yordam kartasi → yakunlash oynasi', requirement: 'Faol oilaviy yordamda xodimning aniq tasdig‘i kerak.', meaning: 'Ochiq oilaviy vazifa/tashriflarni bekor qilib davrni va kartani yopadi; natijalarni o‘chirmaydi.', example: 'Ochiq ishlarni ko‘rib chiqib Yakunlashni tasdiqlash; aks holda Bekor qilish.' },
      { name: 'Qaytarilgandagi holat va qabul qilish qaydi', location: 'Jihozlar → Qaytarib olish', requirement: 'Amalda qaytgan jihoz uchun majburiy; bola kartasi yopilgan bo‘lsa ham.', meaning: 'Xizmat yakunidan alohida inventar qaytarilishini qayd etadi.', example: 'DEMO-QAY-020 bilan qabul qilindi; holati tekshirildi (namuna).' },
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Faol xizmat epizodi topilmadi.', reason: 'Epizod allaqachon yopilgan yoki xizmat hali boshlanmagan.', solution: 'Bola kartasida joriy holat va epizodlar tarixini tekshiring. Yopilgan xizmatni qayta yakunlash o‘rniga keyingi kuzatuv/oilaviy yordam yozuvlarini yuriting.' },
      { tone: 'waiting', problem: 'Yakunlash sanasi, xulosa yoki hujjat qabul qilinmadi.', reason: 'Sana qabuldan oldin/kelajakda yoki majburiy hujjat/xulosa bo‘sh.', solution: 'Yakun sanasi, tegishli hujjat rekviziti va Yakuniy xulosa va keyingi harakatni tekshirib qayta saqlang.' },
      { tone: 'waiting', problem: 'Vafot sababiga e’tirozda patologiya qaydi so‘ralmoqda.', reason: 'E’tiroz katagi belgilangan, lekin yo‘naltirish ma’lumoti kiritilmagan.', solution: 'Tegishli bo‘limga yo‘llash hujjati va qaydini kiriting. E’tiroz katagini faqat haqiqiy holatni tuzatish uchun o‘zgartiring.' },
      { tone: 'waiting', problem: 'Topshirishni qayd etish tugmasi yo‘q.', reason: 'Bola Keyingi kuzatuv holatida emas yoki klinik epizod faol.', solution: 'Xizmat yakuni va holatni tekshiring. Chiqarish/o‘tkazishdan keyingi Yordam rejasi → Oilaviy shifokor kuzatuvi bo‘limidan foydalaning; oilaviy yordamga bu klinik topshirish amali qo‘llanmaydi.' },
      { tone: 'waiting', problem: 'Topshirish sanalari yoki qabul qiluvchi ma’lumotlari so‘ralmoqda.', reason: 'Shifokor, poliklinika, hujjat, reja yoki izchil sanalar yetishmaydi.', solution: 'Barcha olti maydonni to‘ldiring. Topshirish epizod yakunidan oldin va kelajakda emas; keyingi kuzatuv esa topshirishdan oldin bo‘lmasin.' },
      { tone: 'waiting', problem: 'Oilaviy vazifa yoki tashrif muddati bloklandi.', reason: 'Tanlangan sana uch kalendar oylik chegaradan tashqarida yoki xizmatni hozir bajarish/boshlash uchun davr o‘tgan.', solution: 'Kartadagi oilaviy davr sanalarini ko‘ring. Ruxsat etilgan davrdagi reja ma’lumotini tuzating; davr o‘tgan bo‘lsa mas’ul yakunlashni ko‘rib chiqadi.' },
      { tone: 'rejected', problem: 'Vafotdan keyin eski bola vazifasi bajarildi bo‘lmayapti.', reason: 'Klinik Bola vazifasi oilaviy yordam bilan aralashtirilmoqda.', solution: 'Oldingi klinik yozuvni tarixda qoldiring. Oila uchun amaldagi yordamni Oila nishonli yangi vazifa va tegishli natija bilan yuriting.' },
      { tone: 'waiting', problem: 'Oilaviy davr sanasi tugadi, lekin karta o‘zi yopilmadi.', reason: 'Yakunlash avtomatik emas; mas’ulning alohida tasdig‘i kerak.', solution: 'Ochiq oilaviy vazifa va tashriflarni ko‘rib, Oilaga yordamni yakunlash → Yakunlashni tasdiqlashni bajaring.' },
      { tone: 'cancelled', problem: 'Oilaviy yakundan keyin ayrim vazifalar Bekor qilingan bo‘ldi.', reason: 'Yakunlash paytida ular hali bajarilmagan oilaviy vazifalar edi.', solution: 'Bekor qilish sababini va oldin bajarilgan natijalarni tarixdan ko‘ring; bekor qilingan yozuvni bajarilgan xizmatga qo‘shmang.' },
      { tone: 'action', problem: 'Karta yopilgan, jihoz esa qaytarilmagan bo‘lib turibdi.', reason: 'Klinik/oilaviy yakun jihoz qabulini avtomatik bajarmaydi.', solution: 'Jihoz amalda qaytganida Jihozlar → Qaytarib olish orqali qabul holati va zarur texnik tekshiruvni qayd eting.' },
    ],
    outcomes: [
      'Klinik epizod sana, sabab, hujjat va xulosa bilan yopilgan.', 'Chiqarish/o‘tkazishdan keyin shifokor, poliklinika va keyingi kuzatuv rejasi ko‘rinadi.',
      'Vafotdan keyingi oilaviy yordam klinik xizmatdan alohida uch kalendar oylik davrda yuritiladi.', 'Vafotga e’tiroz bo‘lsa tegishli bo‘limga yo‘naltirish qaydi mavjud.',
      'Oilaviy yakun inson tasdig‘i bilan bajarilgan; ochiq ishlarning bekor qilish tarixi saqlangan.', 'Jihozlar xizmat holatiga emas, amaldagi qaytarilishiga qarab alohida yuritilgan.',
    ],
    relatedTopics: ['inpatient', 'mobile', 'care-plan', 'equipment', 'referral'],
    flows: [
      {
        id: 'follow-up-full', title: 'Klinik yakundan kuzatuv yoki oilaviy yordamgacha', description: 'Chiqarish, o‘tkazish va vafotning alohida yo‘llari; topshirish, oilaviy reja va tasdiqlangan yakun.',
        definition: `flowchart TD
 A["Mas’ul faol klinik epizodni ko‘radi"] --> B["Yakunlash formasini ochish"]
 B --> C["Yakun sanasi va sababini tanlash"]
 C --> D["Hujjat rekviziti va yakuniy xulosa"]
 D --> E{"Sana va majburiy ma’lumotlar mosmi?"}
 E -->|"Yo‘q"| F["Sana, hujjat yoki xulosani tuzatish"]
 F --> C
 E -->|"Ha"| G{"Vafot va vakil e’tirozi bormi?"}
 G -->|"Ha"| H["Patologoanatomiya bo‘limiga yo‘llash qaydi"]
 H --> I["Epizodni yakunlash"]
 G -->|"Yo‘q"| I
 I --> J["Epizod yopiladi; o‘rin bo‘shaydi; ochiq tashriflar bekor"]
 J --> K{"Yakunlash sababi vafotmi?"}
 K -->|"Yo‘q"| L["Bola Keyingi kuzatuvda"]
 L --> M["Topshirishni qayd etish"]
 M --> N["Shifokor, poliklinika, hujjat va kuzatuv rejasi"]
 N --> O{"Topshirish va keyingi kuzatuv sanalari mosmi?"}
 O -->|"Yo‘q"| N
 O -->|"Ha"| P["Topshirish saqlanadi; Keyingi kuzatuv davom etadi"]
 P --> Q{"Qayta xizmat ehtiyoji bormi?"}
 Q -->|"Ha"| R["Shu kartada yangi yo‘llanma va konsilium"]
 Q -->|"Yo‘q"| S["Kuzatuv yozuvlarini yuritish"]
 K -->|"Ha"| T["Klinik epizoddan alohida Oilaga yordam"]
 T --> U["Boshlanish va uch kalendar oylik oxirgi sana"]
 U --> V["Oila uchun vazifa, mas’ul va muddat"]
 V --> W["Zarur oilaviy tashrif va muloqotlarni rejalash"]
 W --> X["Amaldagi yordam va alohida natija qaydlari"]
 X --> Y{"Yordamni davom ettirish yoki yakunlash?"}
 Y -->|"Faol davrda davom"| V
 Y -->|"Yakunlashni ko‘rish"| Z["Ochiq oila vazifalari va tashriflarini tekshirish"]
 Z --> AA["Oilaga yordamni yakunlash"]
 AA --> AB{"Yakunlash tasdiqlandimi?"}
 AB -->|"Bekor qilish"| X
 AB -->|"Tasdiqlash"| AC["Ochiq oilaviy ishlar bekor; karta Yakunlangan"]
 AC --> AD["Natija va bekor qilish tarixi saqlanadi"]
 S --> AE["Jihozni amaldagi qaytishiga ko‘ra alohida yopish"]
 R --> AE
 AD --> AE
  class A,B,C,D,H,I,L,M,N,R,S,T,U,V,W,X,AA,AD,AE guide_action;
  class P guide_success;
  class J,AC guide_cancelled;
  class E,F,G,K,O,Q,Y,Z,AB guide_waiting;`,
        walkthrough: [
          'Yakunlash faol klinik epizoddan boshlanadi. Sana, sabab, hujjat va xulosa to‘liq bo‘lmasa kiritish bosqichiga qaytiladi.',
          'Vafot va vakil e’tirozi birga bo‘lgan tarmoqda tegishli patologiya bo‘limiga yo‘llash qaydi olinadi. Boshqa holatlarda bu qo‘shimcha maydon talab qilinmaydi.',
          'Epizodni yakunlash o‘rinni bo‘shatadi va ochiq tashriflarni bekor qiladi; keyingi tarmoq tanlangan yakunlash sababiga bog‘liq.',
          'Chiqarish yoki o‘tkazish Keyingi kuzatuvga olib boradi. Shifokorga topshirish alohida yoziladi; sanalar mos bo‘lmasa topshirish formasiga qaytiladi.',
          'Topshirish saqlanganda karta ochiq Keyingi kuzatuvda qoladi. Qayta xizmat ehtiyoji bo‘lsa ayni kartada yangi yo‘llanma/konsilium yuritiladi; eski tarix va yangi qabul tekshiruvlari saqlanadi.',
          'Vafot tarmog‘i bolaning klinik xizmatini davom ettirmaydi: uch kalendar oylik alohida Oila rejasini ochadi.',
          'Oila vazifasi, tashrif va muloqot alohida yozuvlar; natijalar ham har birida alohida qayd etiladi. Davom etish aylanasiga faqat faol davrga mos ishlar qaytadi.',
          'Yakunlashni ko‘rish tarmog‘ida ochiq ishlar tekshiriladi. Tasdiq oynasidagi Bekor qilish hech narsani yopmaydi, amaldagi reja ko‘rinishiga qaytaradi.',
          'Yakunlash tasdiqlansa ochiq oilaviy vazifa va tashriflar bekor qilinadi; karta yopiladi va bajarilgan/bekor qilingan tarix saqlanadi.',
          'Oxirgi jihoz tuguni barcha yo‘llardan mustaqil amaldagi qaytarishni eslatadi: epizod, kuzatuv yoki oilaviy yakun inventarni avtomatik qaytarmaydi.',
        ],
      },
      {
        id: 'follow-up-boundaries', title: 'Topshirish va oilaviy davr chegaralarini tekshirish', description: 'Faol klinik epizod, keyingi kuzatuv, vafotdan keyingi yordam va muddat tugashida to‘g‘ri amalni tanlash.',
        definition: `flowchart TD
 A["Keyingi yordam amali bajarilmayapti"] --> B["Bola kartasidagi joriy holatni ko‘rish"]
 B --> C{"Faol klinik epizod bormi?"}
 C -->|"Ha"| D["Avval hujjatli Yakunlash jarayoni"]
 C -->|"Yo‘q"| E{"Keyingi kuzatuv holatimi?"}
 E -->|"Ha"| F["Topshirishni qayd etish"]
 F --> G{"Shifokor, poliklinika, hujjat va reja to‘liqmi?"}
 G -->|"Yo‘q"| H["Qabul qiluvchi va reja ma’lumotlarini to‘ldirish"]
 H --> F
 G -->|"Ha"| I{"Topshirish va kuzatuv sanalari izchilmi?"}
 I -->|"Yo‘q"| J["Epizod yakuni, bugun va keyingi ko‘rikni solishtirish"]
 J --> F
 I -->|"Ha"| K["Topshirish saqlanadi; karta kuzatuvda qoladi"]
 E -->|"Yo‘q"| L{"Faol oilaviy yordam bormi?"}
 L -->|"Yo‘q"| M["Yakunlangan yoki boshqa bosqich tarixini o‘qish"]
 L -->|"Ha"| N{"Uch kalendar oylik muddat o‘tganmi?"}
 N -->|"Yo‘q"| O["Oila vazifasi va davr ichidagi tashriflar"]
 O --> P["Bola klinik vazifasini bajarildi qilmaslik"]
 N -->|"Ha"| Q["Yangi vazifa va tashrifni boshlash bloklanadi"]
 Q --> R["Mas’ul ochiq oilaviy ishlarni ko‘radi"]
 R --> S["Oilaga yordamni yakunlashni tasdiqlash"]
 S --> T["Ochiq oilaviy ishlar bekor qilinadi"]
 T --> U["Yakunlangan karta va saqlangan tarix"]
 U --> V["Qaytgan jihoz bo‘lsa Jihozlarda alohida qayd"]
 K --> V
  class A,B,D,F,M,O,P,S,U,V guide_action;
  class K guide_success;
  class Q guide_rejected;
  class T guide_cancelled;
  class C,E,G,H,I,J,L,N,R guide_waiting;`,
        walkthrough: [
          'Muammo qaysi forma ochilganidan emas, kartaning joriy holatidan tekshiriladi. Faol klinik epizod bor bo‘lsa keyingi shifokorga topshirish hali boshlanmaydi.',
          'Keyingi kuzatuv yo‘lida qabul qiluvchi shifokor, poliklinika, hujjat va reja tekshiriladi; bo‘sh ma’lumot bo‘lsa topshirish formasiga qaytiladi.',
          'Sana tarmog‘ida topshirish epizod yakunidan oldin va kelajakda emasligi, keyingi kuzatuv undan oldin emasligi tekshiriladi. Mos bo‘lgach karta kuzatuvda qolgan holda yozuv saqlanadi.',
          'Keyingi kuzatuv bo‘lmasa faol oilaviy yordam mavjudligi tekshiriladi. Yopilgan yoki boshqa bosqichdagi kartada tegishli tarix ko‘riladi; noto‘g‘ri amal majburan ochilmaydi.',
          'Oilaviy davr hali davom etsa Oila vazifasi va ruxsat etilgan sanalardagi tashriflar yuritiladi. Eski klinik Bola vazifalari bajarildi deb belgilanmaydi.',
          'Muddat tugagan tarmoqda yangi oilaviy vazifa va yangi tashrifni boshlash bloklanadi; oilaviy vazifani hozir bajarilgan deb qayd etish ham cheklanadi. Karta o‘zi avtomatik yopilmaydi.',
          'Mas’ul ochiq ishlarni ko‘rib yakunlashni tasdiqlasa, tugallanmagan oilaviy vazifa/tashriflar bekor qilinadi. Bekor qilish bajarilgan natijaga aylantirilmaydi.',
          'Topshirishdan keyin ham, karta yopilgandan keyin ham jihozning amaldagi qaytarilishi alohida qayd etiladi. Ochiq jihoz ajratmasi xizmat holatidan mustaqil ko‘rinadi.',
        ],
      },
    ],
  },
}
