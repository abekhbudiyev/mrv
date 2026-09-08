import type { GuideDetail, GuideField } from './guides-types'

const field = (name: string, location: string, requirement: string, meaning: string, example: string): GuideField => ({ name, location, requirement, meaning, example })

export const intakeGuideDetails: Record<string, GuideDetail> = {
  intake: {
    prerequisites: [
      'Bola yoki uning qonuniy vakili murojaati, dastlabki murojaat sanasi va aloqa ma’lumotlari aniqlangan bo‘lsin. Yozma hujjat avval berilgan bo‘lsa, uning asl sanalarini tayyorlang.',
      'Bolalar reyestridan F.I.Sh. va tug‘ilgan sana bo‘yicha mavjud kartani tekshiring. Bitta bolaning qayta baholanishi uchun ikkinchi karta ochilmaydi.',
      'Mas’ul oilaviy shifokor, poliklinika va to‘rtta xizmat hududidan tegishlisi ma’lum bo‘lsin: Samarqand, Jizzax, Qashqadaryo yoki Navoiy.',
      'PaPaS natijasini kiritishdan oldin baholashni o‘tkazgan shifokorning xulosasi, sana, metodika nomi va versiyasi hamda natija hujjati rekviziti bo‘lsin.',
      'Sinov uchun to‘qima shaxs ma’lumotlaridan foydalaning. Namuna bilan to‘ldirish faqat formaga qiymat qo‘yadi; saqlash va keyingi yuborish alohida amallardir.',
    ],
    sections: [
      { title: 'Murojaat, karta va klinik baholash o‘rtasidagi bog‘liqlik', paragraphs: [
        'Bola kartasi murojaatning boshlang‘ich nuqtasidir: unda bola, vakil, hudud, poliklinika, mas’ul shifokor va ehtiyojlar bir joyda saqlanadi. Keyingi PaPaS natijalari, yo‘llanmalar, Markaz qarorlari va xizmatlar shu kartaga bog‘lanadi. Kartani yaratish palliativ yordamga qabul qilish haqidagi qaror hisoblanmaydi.',
        'Nizomning 18-bandida poliklinikada uch ish kuni ichida tibbiy tekshiruv va PaPaS baholashi belgilangan. Baholashni oilaviy shifokor yoki palliativ yordam bo‘yicha o‘qitilgan shifokor o‘tkazadi; zaruratdagi mutaxassis ishtirokini klinik xodim belgilaydi. Prototip natijani qayd etadi, savollar orqali klinik ball hisoblamaydi.',
        'Yangi karta saqlanganda holat Yangi murojaat bo‘ladi. Baholash holatidagi demo karta ham mavjud, biroq joriy formada baholashni boshlash uchun alohida holat o‘zgartiruvchi tugma yo‘q: Baholash va yo‘llanma bo‘limidagi Natija kiritish orqali tayyor natija saqlanadi.',
      ] },
      { title: 'Sanalar qanday o‘qiladi va kiritiladi?', paragraphs: [
        'Poliklinikaga dastlabki murojaat sanasi — oilaning asl murojaat sanasi. Karta tizimda bugun ochilgan bo‘lsa ham, avvalgi yozma murojaat uchun o‘sha tarixiy sanani kiriting. Tizimdagi yozuv yaratilgan vaqt alohida saqlanadi; u klinik baholash sanasi bilan almashtirilmaydi.',
        'Tug‘ilgan sana kelajakda bo‘lishi mumkin emas. Murojaat sanasi tug‘ilgan sanadan oldin yoki bugundan keyin bo‘lmasligi kerak. PaPaS sanasi murojaat sanasidan oldin yoki bugundan keyin bo‘lsa, natija saqlanmaydi. Kecha baholangan bolaga bugun karta ochayotgan bo‘lsangiz, dastlabki murojaat sanasini ham asl hujjatga muvofiq kiriting.',
        'Uch ish kunlik muddat prototipda murojaat sanasiga dushanba–juma kunlarini qo‘shib hisoblanadi. Rasmiy bayram kalendari ulanmagan. Muddat o‘tishi klinik rad etish yoki kartani avtomatik yopish emas; mas’ul shifokor ishni ko‘rib chiqishi uchun nazorat belgisidir.',
      ] },
      { title: 'PaPaS natijasidan keyingi yo‘l', paragraphs: [
        'Nizomning 19-bandiga ko‘ra 14 va undan kam ball poliklinika kuzatuvini davom ettirish yo‘liga olib boradi. Prototipda faol xizmat bo‘lmagan kartaga 15 dan past PaPaS yozilganda Poliklinika kuzatuvi holati qo‘yiladi. Bu uzil-kesil rad etish emas: keyingi ko‘rik va yangi tasdiqlangan natija shu kartada yuritiladi.',
        '15 va undan yuqori ball bilan birga 1-ilovaga muvofiq tibbiy ko‘rsatma bo‘lsa, vakil tanlagan vakolatli muassasaga yo‘naltirish ko‘rib chiqiladi. Faqat ballning o‘zi yo‘llanmani yuborish yoki Markazga qabul uchun yetarli emas. Manba konsiliumi, Z51.5, hujjatlar va keyinchalik alohida Markaz konsiliumi qarori kerak.',
        'Yangi natija avvalgisini o‘chirmaydi. Yuborish tekshiruvida baholash sanasi bo‘yicha eng so‘nggi PaPaS olinadi; bir kunda bir necha natija kiritilgan bo‘lsa, keyin saqlangani olinadi. Faol statsionar yoki mobil xizmat paytida yangi PaPaS natijasi xizmatni avtomatik to‘xtatmaydi.',
        'Uyda yordam ehtiyojini baholash PaPaSdan alohida. PaPaS natijasini Uyda yordam baholashlari paneliga yoki uy ehtiyoji ballini PaPaS paneliga kiritmang. Mobil xizmatdagi tashriflar soni alohida uy ehtiyoji bahosi va konsilium belgilagan rejaga bog‘lanadi.',
      ] },
      { title: 'Karta ma’lumotlarini tuzatish chegaralari', paragraphs: [
        'Karta tepasidagi Tahrirlash orqali demografik ma’lumotlar, aloqa, mas’ul shifokor, tashxis va ko‘rsatmani aniqlashtirish mumkin. Bu amal avvalgi yo‘llanma, xizmat yoki qaror tarixini o‘chirmaydi. Murojaat sanasini saqlangan baholash yoki yo‘llanma sanasidan keyinga surib bo‘lmaydi.',
        'Xizmat tarixi mavjud kartada tug‘ilgan sanani o‘zgartirish prototipda bloklangan. Bunday xatoni hal qilish uchun soxta yosh bilan yangi karta yaratish tavsiya etilmaydi; mas’ul xodim ma’lumot va hujjatni alohida tekshiradi. Yangi kartani ochish paytida 18 yoshga to‘lgan shaxs uchun ro‘yxatdan o‘tkazish bloklanishi — prototipning boshlang‘ich himoyasi. Statsionarda avval qabul qilingan bolaning 18 yoshdan keyingi davom ettirish qarori boshqa jarayondir.',
      ] },
    ],
    steps: [
      { title: 'Mavjud kartani qidiring', actor: 'Murojaatni qayd etuvchi xodim', action: 'Bolalar reyestrini ochib, F.I.Sh., tug‘ilgan sana va vakilni solishtiring. Mos karta topilsa, yangi karta yaratish o‘rniga o‘sha kartaga kiring.', result: 'Murojaat qaysi bola ishida davom ettirilishi aniq.', route: '/apps/palliative-care/cases' },
      { title: 'Yangi murojaat formasini oching', actor: 'Murojaatni qayd etuvchi xodim', action: 'Mos karta bo‘lmasa Yangi bola kartasi tugmasini bosing. Sinovda Namuna bilan to‘ldirishdan foydalanishingiz mumkin; qo‘yilgan qiymatlarni saqlashdan oldin o‘qing.', result: 'Yangi bola kartasi formasi tayyor.' },
      { title: 'Bola va yashash hududini kiriting', actor: 'Murojaatni qayd etuvchi xodim', action: 'Bola haqida guruhida F.I.Sh., tug‘ilgan sana, jins, viloyat, tuman va manzilni kiriting. JShShIR ixtiyoriy; kiritilsa 14 raqam bo‘lsin. Hujjat turini va mavjud rekvizitni moslang.', result: 'Bola identifikatsiyasi va xizmat hududi qayd etilgan.' },
      { title: 'Vakil bilan bog‘lanish ma’lumotini yozing', actor: 'Murojaatni qayd etuvchi xodim', action: 'Qonuniy vakil F.I.Sh., qarindoshligi va aloqa telefonini kiriting. Bola nomi bilan vakil nomini almashtirib yubormaganingizni tekshiring.', result: 'Keyingi muloqot uchun vakil va telefon mavjud.' },
      { title: 'Asl murojaat sanasi va mas’ulni belgilang', actor: 'Oilaviy shifokor yoki qayd etuvchi xodim', action: 'Poliklinikaga dastlabki murojaat sanasi, Mas’ul oilaviy shifokor va Poliklinika maydonlarini to‘ldiring. Avvalgi qog‘oz hujjat uchun bugungi sana o‘rniga asl murojaat sanasini ishlating.', result: 'Uch ish kunlik baholash muddati uchun boshlang‘ich sana va mas’ul ma’lum.' },
      { title: 'Dastlabki ehtiyojni qayd eting', actor: 'Oilaviy shifokor', action: 'Tashxis yoki dastlabki ma’lumotni, simptom va ehtiyojlarni yozing. Tibbiy ko‘rsatma hali aniqlanmagan bo‘lsa Baholashda aniqlanadi tanlovini qoldiring. So‘ralayotgan yordam shakli va ish ustuvorligini murojaat mazmuniga mos tanlang.', result: 'Klinik qaror o‘rnini bosmaydigan boshlang‘ich ma’lumotlar to‘plangan.' },
      { title: 'Kartani saqlang va tekshiring', actor: 'Murojaatni qayd etuvchi xodim', action: 'Saqlashni bosing. Xato bo‘lsa tegishli maydonni tuzating; dublikat xabarida mavjud kartani oching. Umumiy ma’lumot bo‘limida bola, vakil, shifokor va muddatni qayta o‘qing.', result: 'Yangi murojaat kartasi va harakatlar tarixi yaratilgan.' },
      { title: 'Baholashni o‘tkazing', actor: 'Oilaviy shifokor yoki palliativ yordam bo‘yicha o‘qitilgan shifokor', action: 'Buyruqdagi uch ish kunlik muddat doirasida tibbiy tekshiruv va PaPaS baholashini amaldagi metodika bilan o‘tkazing. Zaruratdagi mutaxassislarni shifokor belgilaydi; modul ballni o‘zi hisoblamaydi.', result: 'Kiritishga tayyor, shifokor tasdiqlagan natija va hujjat bor.' },
      { title: 'PaPaS natijasini kiriting', actor: 'Baholovchi shifokor yoki uning natijasini qayd etuvchi xodim', action: 'Kartadagi Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish orqali ball, baholash sanasi, baholovchi, metodika va hujjat rekvizitini yozing. Zarur izohni qo‘shib Saqlashni bosing.', result: 'PaPaS natijasi alohida sana va dalil bilan tarixga qo‘shilgan.' },
      { title: 'Natijaga mos keyingi ishni belgilang', actor: 'Oilaviy shifokor', action: 'PaPaS 15 dan past bo‘lsa poliklinika kuzatuvini davom ettiring. 15 va undan yuqori bo‘lsa 1-ilovadagi ko‘rsatmani klinik tekshiring; tasdiqlangan guruhni Tahrirlash orqali kartaga kiriting.', result: 'Kuzatuv yoki yo‘llanma tayyorlashning asosi aniq; avtomatik qabul bo‘lmagan.' },
      { title: 'Vakolatli muassasa bilan yo‘llanma bosqichiga o‘ting', actor: 'Oilaviy shifokor va qonuniy vakil', action: 'Ball va tibbiy ko‘rsatma mos bo‘lganda vakil tanlagan vakolatli muassasada manba konsiliumi xulosasi rasmiylashtiriladi. Shu kartadagi Yo‘llanma tayyorlash orqali hujjatlarini qayd etishga o‘ting.', result: 'Bola kartasi manba konsiliumi va yo‘llanma jarayoniga tayyor.', route: '/apps/palliative-care/cases' },
      { title: 'Kuzatuv va qayta baholashni shu kartada davom ettiring', actor: 'Oilaviy shifokor', action: 'Past ball, aniqlashtirish yoki navbatdagi ko‘rikda yangi tasdiqlangan PaPaSni shu panelga qo‘shing. Muloqot qaydi va Yordam rejasi orqali keyingi ishni yozing; Jarayon tarixi bo‘limida oldingi amallar saqlanganini ko‘ring.', result: 'Avvalgi natijalar saqlangan holda qayta ko‘rish yo‘li davom etadi.' },
    ],
    rules: [
      { tone: 'action', condition: 'Asl murojaat ilgari bo‘lgan, karta bugun ochilmoqda', action: 'Dastlabki murojaat sanasiga hujjatdagi sanani kiriting; baholashni ham haqiqiy o‘tkazilgan sanada qayd eting.', owner: 'Qayd etuvchi xodim', basis: '18-banddagi muddatni yuritish; prototip sanalar tekshiruvi.' },
      { tone: 'waiting', condition: 'Uch ish kunlik muddat o‘tgan', action: 'Baholashni mas’ul shifokor bilan yakunlash va kechikish mazmunini qayd etishni tashkil qiling. Holat avtomatik rad etilmaydi.', owner: 'Oilaviy shifokor va koordinator', basis: 'Nizom 18-bandi; muddat belgisi prototip vositasi.' },
      { tone: 'waiting', condition: 'F.I.Sh. va tug‘ilgan sana bo‘yicha mos karta mavjud', action: 'Mavjud kartada davom eting. F.I.Sh. yoki tug‘ilgan sanani sun’iy o‘zgartirib ikkinchi karta ochmang.', owner: 'Qayd etuvchi xodim', basis: 'Prototipning dublikatni oldini olish tekshiruvi.' },
      { tone: 'waiting', condition: 'PaPaS 15 yoki yuqori, 1-ilova ko‘rsatmasi hali aniqlanmagan', action: 'Tibbiy ko‘rsatmani shifokor aniqlashtiradi. Yuborish tekshiruvi bajarilishi uchun klinik xulosasiz guruh tanlanmaydi.', owner: 'Oilaviy shifokor', basis: 'Nizom 19-bandi va 1-ilova.' },
      { tone: 'waiting', condition: 'PaPaS yangi natijasi oldingisidan farq qiladi', action: 'Haqiqiy sana va hujjat bilan yangi natija kiriting. Oldingi natijalarni saqlang; eng so‘nggi baholash keyingi tekshiruvlarda ishlatiladi.', owner: 'Baholovchi shifokor', basis: 'Prototip baholash tarixi va eng so‘nggi natija tanlovi.' },
      { tone: 'rejected', condition: 'Bola vafotidan keyin oilaga yordam ochilgan', action: 'Klinik PaPaS qo‘shmang. Oilaviy muloqot va yordam vazifalarini tegishli ishda yuriting.', owner: 'Mas’ul shifokor va oilaviy yordam jamoasi', basis: 'Nizom 38-bandi; prototip klinik va oilaviy ishni ajratadi.' },
    ],
    faq: [
      { question: 'Karta ochish uchun JShShIR shartmi?', answer: 'Joriy prototipda ixtiyoriy. Kiritilgan bo‘lsa aynan 14 raqam bo‘lishi tekshiriladi. Bu davlat reyestri orqali shaxs tasdiqlandi degani emas. Sinovda haqiqiy shaxs ma’lumoti talab qilinmaydi.' },
      { question: '0–100 maydon chegarasi PaPaSning rasmiy shkalasimi?', answer: 'Yo‘q. Bu prototipdagi son kiritish chegarasi. Qo‘llanma klinik savollar, og‘irliklar yoki ball hisoblash formulasini bermaydi; natijani vakolatli shifokor o‘z metodikasi asosida tasdiqlaydi.' },
      { question: 'PaPaS 14 bo‘lsa ishni yopish kerakmi?', answer: 'Yo‘q. Poliklinika kuzatuvi davom etadi. Keyingi tekshiruv va yangi PaPaS natijasi shu kartaga qo‘shiladi; 14 ball uzil-kesil rad etish belgisi emas.' },
      { question: 'Kecha baholangan bolaga bugun karta ochsam bo‘ladimi?', answer: 'Bo‘ladi: dastlabki murojaat sanasi haqiqiy tarixiy sana bo‘lsin. Baholash sanasi shu murojaatdan oldin bo‘lmasligi kerak. Tizimdagi karta yaratilgan vaqt alohida saqlanadi.' },
      { question: 'PaPaSni noto‘g‘ri kiritdim. Oldingi natijani o‘chirsam bo‘ladimi?', answer: 'Joriy interfeys baholashni o‘chirish yoki ustidan yozishni taklif qilmaydi. Tasdiqlangan to‘g‘ri natijani tegishli sana va hujjat bilan qo‘shing, Izohda tuzatish mazmunini ko‘rsating. Eng so‘nggi natija qanday tanlanganini paneldan tekshiring.' },
      { question: 'So‘ralayotgan yordam shakli keyingi qarorni belgilab qo‘yadimi?', answer: 'Yo‘q. Bu murojaatdagi istak yoki dastlabki yo‘nalishdir. Manba konsiliumi klinik marshrutni, Markaz konsiliumi esa qabul qilinadigan xizmat shaklini alohida qayd etadi.' },
      { question: 'Birinchi navbatda tanlovi tibbiy shoshilinchlikni hisoblaydimi?', answer: 'Bu prototipdagi ish ustuvorligi belgisi. U klinik saralash algoritmi, shoshilinch yordam tavsiyasi yoki avtomatik qabul qarori emas.' },
    ],
    checklist: [
      'F.I.Sh. va tug‘ilgan sana mavjud kartalar bilan solishtirilgan; dublikat ochilmagan.',
      'Viloyat, tuman, manzil, vakil, qarindoshlik va telefon bir-biriga mos.',
      'Asl murojaat sanasi, mas’ul shifokor va poliklinika aniq ko‘rsatilgan.',
      'Baholash sanasi murojaatdan oldin ham, kelajakda ham emas.',
      'PaPaSga shifokor tasdiqlagan ball, baholovchi, metodika va hujjat yozilgan.',
      'PaPaS va uy ehtiyoji baholari o‘z paneliga kiritilgan.',
      '15 dan past natija kuzatuv sifatida yuritilgan; qabul rad etildi deb belgilanmagan.',
      '15 va undan yuqori natijada tibbiy ko‘rsatma shifokor tomonidan aniqlashtirilgan.',
      'Yo‘llanmaga o‘tishdan oldin vakolatli muassasa va uning konsiliumi bosqichi tushunarli.',
      'Tahrirdan so‘ng karta va Jarayon tarixi tekshirilgan; asl ma’lumotni yashirish uchun yangi karta ochilmagan.',
    ],
    fields: [
      field('Bolaning F.I.Sh.', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Majburiy.', 'Bolaning to‘liq ismi. Vakilning F.I.Sh. bu yerga yozilmaydi; tug‘ilgan sana bilan birga dublikat tekshiruvida qatnashadi.', 'Saidova Mohinur Anvar qizi (to‘qima namuna).'),
      field('Tug‘ilgan sana', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Majburiy; haqiqiy va kelajakda bo‘lmagan sana.', 'Yosh chegaralarini tekshirish uchun ishlatiladi. Yangi kartada bola hozir 18 yoshga to‘lmagan bo‘lishi kerak.', '15.04.2017 — to‘qima bolaning hujjatdagi sanasi.'),
      field('Jinsi', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Ro‘yxatdan tanlanadi.', 'O‘g‘il bola yoki Qiz bola tanlovi. Formadagi boshlang‘ich qiymatni hujjatga moslang.', 'Qiz bola.'),
      field('JShShIR', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Prototipda ixtiyoriy; kiritilsa 14 ta raqam.', 'Qo‘lda kiritilgan identifikator; davlat bazasi bilan avtomatik tekshirilmaydi.', 'Bo‘sh qoldirilgan — to‘qima ssenariyda haqiqiy JShShIR kerak emas.'),
      field('Shaxsni tasdiqlovchi hujjat', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Ro‘yxatdan tanlanadi.', 'Tug‘ilganlik guvohnomasi yoki Pasport / ID turini belgilaydi.', 'Tug‘ilganlik guvohnomasi.'),
      field('Hujjat seriyasi va raqami', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Joriy formada ixtiyoriy.', 'Shaxs hujjati rekviziti; yuklangan fayl yoki tasdiqlangan elektron hujjat emas.', 'DEMO-GUV-0042.'),
      field('Viloyat', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'To‘rtta hududdan tanlanadi.', 'Samarqand, Jizzax, Qashqadaryo yoki Navoiy. Hudud bolaning karta ma’lumoti sifatida saqlanadi.', 'Jizzax.'),
      field('Tuman / shahar', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Majburiy.', 'Yashash hududini viloyat ichida aniqlashtiradi; hozir matn bilan kiritiladi.', 'Zomin tumani (namuna).'),
      field('Yashash manzili', 'Yangi bola kartasi / Tahrirlash → Bola haqida', 'Majburiy.', 'Bola yashaydigan manzil. Mobil yo‘nalishda keyingi tashrifni tashkil qilish uchun ham o‘qiladi.', 'Namuna MFY, Namunaviy ko‘cha, 12-uy — to‘qima manzil.'),
      field('Qonuniy vakil F.I.Sh.', 'Oila va qonuniy vakil', 'Majburiy.', 'Bola nomidan murojaat qilgan vakil; mobil rozilik keyin qaror formasida alohida qayd etiladi.', 'Saidova Dilnoza Olim qizi (to‘qima namuna).'),
      field('Qarindoshligi', 'Oila va qonuniy vakil', 'Majburiy.', 'Vakilning bolaga munosabati. Ushbu yozuv vakolat hujjatining o‘rnini bosmaydi.', 'Onasi.'),
      field('Aloqa telefoni', 'Oila va qonuniy vakil', 'Majburiy.', 'Vakil bilan bog‘lanish raqami; prototip qo‘ng‘iroq yoki SMS yubormaydi.', '+998 00 000 00 00 — faqat format namunasi.'),
      field('Poliklinikaga dastlabki murojaat sanasi', 'Murojaat va keyingi yordam', 'Majburiy; tug‘ilgan sanadan oldin va kelajakda bo‘lmaydi.', 'Asl murojaat sanasi. Uch ish kunlik baholash muddati shu sanadan yuritiladi; yozma hujjatda tarixiy sana bo‘lishi mumkin.', '01.09.2026 — misol; kartani 03.09.2026 da ochishda ham asl sana saqlanadi.'),
      field('Mas’ul oilaviy shifokor', 'Murojaat va keyingi yordam', 'Majburiy.', 'Murojaat va keyingi kuzatuv uchun mas’ul shifokor. Matn sifatida kiritiladi; real xodimlar katalogiga ulanmagan.', 'Shifokor Sh. Akbarova (namuna).'),
      field('Poliklinika', 'Murojaat va keyingi yordam', 'Majburiy.', 'Murojaat va oilaviy shifokor bilan bog‘liq birlamchi tibbiyot muassasasi.', 'Zomin namunaviy oilaviy poliklinikasi.'),
      field('Asosiy tashxis / dastlabki ma’lumot', 'Murojaat va keyingi yordam', 'Majburiy.', 'Hujjatdagi tashxis yoki dastlabki klinik ma’lumot matni. Yo‘llanmadagi konsilium qo‘ygan Z51.5 kodidan alohida.', 'Hujjatga ko‘ra nevrologik kasallik fonida uzoq muddatli parvarish ehtiyoji — demo yozuv.'),
      field('1-ilovadagi tibbiy ko‘rsatma', 'Murojaat va keyingi yordam', 'Karta ochishda Baholashda aniqlanadi mumkin; yo‘llanmani yuborishda ko‘rsatma qaydi kerak.', 'To‘rtta umumiy klinik guruhdan shifokor xulosasiga mosini tanlash. Bu to‘liq kasalliklar klassifikatori yoki avtomatik tashxis emas.', 'Asab tizimi kasalliklari — shifokorning shartli xulosasi bo‘yicha.'),
      field('Yetakchi simptom va ehtiyojlar', 'Murojaat va keyingi yordam', 'Ixtiyoriy; bir necha qiymat vergul bilan ajratiladi.', 'Bola va oilaning hujjatdagi ehtiyojlarini keyingi reja uchun ko‘rsatadi; davolash tavsiyasi hisoblanmaydi.', 'parvarish ko‘nikmalari, oziqlantirish bo‘yicha yordam, psixologik yordam.'),
      field('So‘ralayotgan yordam shakli', 'Murojaat va keyingi yordam', 'Statsionar — xospis yoki Mobil — uy sharoitida tanlanadi.', 'Murojaatning dastlabki xizmat yo‘nalishi. Manba va Markaz konsiliumi qarorlari keyingi bosqichda alohida yuritiladi.', 'Mobil — uy sharoitida.'),
      field('Ish ustuvorligi', 'Murojaat va keyingi yordam', 'Odatiy yoki Birinchi navbatda tanlanadi.', 'Ishlar ro‘yxati uchun tashkiliy belgi; klinik shoshilinchlikni dastur hisoblamaydi.', 'Odatiy.'),
      field('Murojaat mazmuni', 'Murojaat va keyingi yordam', 'Ixtiyoriy.', 'Murojaat sababi, vakil aytgan ehtiyoj va keyingi aniqlashtirishni qisqa tushuntirish.', 'Ona uy sharoitidagi parvarish bo‘yicha yordam so‘radi; baholash shifokor bilan kelishiladi. Demo.'),
      field('Shifokor tasdiqlagan ball', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Majburiy son; prototip 0–100 oralig‘ini qabul qiladi.', 'Tayyor PaPaS natijasi. Forma ballni hisoblamaydi; 0–100 texnik chegara rasmiy metodika shkalasini tasdiqlamaydi.', '16 ball — shifokor tasdiqlagan to‘qima natija.'),
      field('Baholash sanasi', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Majburiy; murojaatdan oldin va kelajakda bo‘lmaydi.', 'Ko‘rik va baholash o‘tkazilgan haqiqiy sana; natijalarni vaqt bo‘yicha solishtirishda ishlatiladi.', '02.09.2026, agar asl murojaat 01.09.2026 bo‘lsa — namuna.'),
      field('Baholovchi shifokor F.I.Sh.', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Majburiy.', 'Natijani tasdiqlagan oilaviy yoki tegishli tayyorgarlikdan o‘tgan shifokor.', 'Shifokor Sh. Akbarova (namuna).'),
      field('Metodika nomi va versiyasi', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Majburiy.', 'Baholashda ishlatilgan metodikaning hujjatdagi nomi va versiyasi. Qo‘llanma tasdiqlanmagan versiyani klinik standart sifatida taklif qilmaydi.', 'PaPaS — baholash varaqasida ko‘rsatilgan versiya (demo rekvizit).'),
      field('Baholash hujjati rekviziti', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Majburiy.', 'Natijani asoslovchi varaqa yoki hujjat raqami; joriy prototipda fayl yuklanmaydi.', 'DEMO-PAPAS-0042, 02.09.2026.'),
      field('Izoh', 'Baholash va yo‘llanma → PaPaS baholashlari → Natija kiritish', 'Ixtiyoriy.', 'Baholash mazmuni, avvalgi natijaga aniqlik yoki keyingi ko‘rik haqida tushuntirish.', 'Qayta ko‘rik natijasi; avvalgi baholash tarixda saqlandi. Demo.'),
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Shu F.I.Sh. va tug‘ilgan sana bilan ish mavjud. Reyestrdagi kartani oching.', reason: 'Xuddi shu bola nomi va tug‘ilgan sana bilan karta topilgan.', solution: 'Formani bekor qilib mavjud kartani oching. Agar boshqa bola deb hisoblasangiz, manba hujjatlarini solishtiring; tekshiruvni chetlab o‘tish uchun ism yoki sanani o‘zgartirmang.' },
      { tone: 'waiting', problem: 'Bola, vakil, telefon, manzil, shifokor va tashxis maydonlarini to‘ldiring.', reason: 'Majburiy karta maydonlaridan kamida biri bo‘sh yoki faqat bo‘sh joydan iborat.', solution: 'Bola haqida, Oila va qonuniy vakil, Murojaat va keyingi yordam guruhlarini tekshirib, haqiqiy mazmun kiriting va qayta saqlang.' },
      { tone: 'waiting', problem: 'Tug‘ilgan sana haqiqiy va kelajakda bo‘lmasligi kerak.', reason: 'Sana mavjud emas, noto‘g‘ri yoki bugundan keyingi kunga kiritilgan.', solution: 'Hujjatdagi tug‘ilgan sanani sana tanlash maydonida qayta kiriting. Yosh chegarasini chetlab o‘tish uchun boshqa sana qo‘ymang.' },
      { tone: 'waiting', problem: 'Dastlabki murojaat sanasi tug‘ilgan sanadan oldin yoki kelajakda bo‘lmasligi kerak.', reason: 'Murojaat sanasi bolaning hayotiy vaqt ketma-ketligiga mos emas.', solution: 'Murojaat hujjatini tekshiring; tug‘ilgan sanadan boshlab bugungacha bo‘lgan haqiqiy murojaat sanasini kiriting.' },
      { tone: 'waiting', problem: 'JShShIR 14 ta raqamdan iborat bo‘lishi kerak.', reason: 'Kiritilgan ixtiyoriy identifikatorda harf, bo‘sh joy yoki boshqa uzunlik bor.', solution: 'Hujjatdagi qiymatni to‘g‘rilang yoki to‘qima sinovda maydonni bo‘sh qoldiring. Prototip qiymatni real reyestr bilan tekshirmaydi.' },
      { tone: 'rejected', problem: 'Yangi murojaat 18 yoshga to‘lmagan bola uchun ochiladi.', reason: 'Ro‘yxatdan o‘tkazish vaqtidagi yosh 18 yoki yuqori.', solution: 'Yangi bolalar kartasi ochilmaydi. Avvalgi statsionar ish mavjud bo‘lsa o‘sha ishni va davom ettirish qarorini tekshiring; yangi qabul bilan davom ettirishni aralashtirmang.' },
      { tone: 'waiting', problem: '0–100 oralig‘idagi ball va murojaatdan keyingi haqiqiy baholash sanasini kiriting.', reason: 'Ball son emas yoki prototip chegarasidan tashqari; yoxud baholash sanasi murojaatdan oldin yoki kelajakda.', solution: 'Shifokor tasdiqlagan natija va sanani tekshiring. Tarixiy hujjatda avval murojaat bo‘lgan bo‘lsa kartaning asl murojaat sanasini qonuniy ketma-ketlikda aniqlashtiring.' },
      { tone: 'waiting', problem: 'Baholovchi, metodika versiyasi va natija hujjati kerak.', reason: 'PaPaS natijasining muallifi yoki dalil maydonlari to‘liq emas.', solution: 'Baholovchi F.I.Sh., amalda ishlatilgan metodika nomi/versiyasi va hujjat rekvizitini kiriting. Faqat ball bilan saqlashga urinmang.' },
      { tone: 'waiting', problem: 'Murojaat sanasi saqlangan baholash yoki yo‘llanma sanasidan keyin bo‘lishi mumkin emas.', reason: 'Kartani tahrirlashda asl murojaat keyingi klinik hujjatlardan keyinga surilgan.', solution: 'Oldingi baholash va yo‘llanma sanalarini solishtirib asl murojaat sanasini kiriting. Tarixni tuzatish uchun yangi dublikat karta ochmang.' },
      { tone: 'rejected', problem: 'Xizmat tarixi mavjud ishda tug‘ilgan sanani o‘zgartirish alohida tekshiruv talab qiladi; prototipda bloklangan.', reason: 'Kartada xizmat epizodi bor yoki o‘zgartirilgan sana yangi qabul yosh chegarasini buzadi.', solution: 'Saqlanmagan tug‘ilgan sana o‘zgarishini bekor qiling. Hujjatdagi tafovutni mas’ul xodim bilan alohida tekshiring; prototipda bu himoyani aylanib o‘tuvchi amal yo‘q.' },
    ],
    outcomes: [
      'Bola va oila bitta kartada, mas’ul shifokor hamda asl murojaat sanasi bilan qayd etilgan.',
      'PaPaS natijasi, sana, baholovchi, metodika va hujjat alohida yozuv sifatida saqlangan.',
      'Keyingi yo‘l aniq: poliklinika kuzatuvi yoki ko‘rsatma aniqlashtirilgach yo‘llanma tayyorlash.',
      'Karta ochilishi yoki PaPaS balli Markazning qabul qarori sifatida talqin qilinmagan.',
      'Qayta baholash va ma’lumot tuzatish avvalgi tarixni saqlagan holda shu kartada davom etadi.',
    ],
    relatedTopics: ['overview', 'referral', 'consilium', 'mobile', 'care-plan', 'demo'],
    flows: [
      {
        id: 'detailed', title: 'Murojaatdan PaPaS natijasi va keyingi yo‘lgacha', description: 'Karta yaratish, sanalar va dalillarni tekshirish, shifokor baholashi hamda kuzatuv yoki yo‘llanma yo‘liga o‘tish. Rombdagi tekshiruvlar klinik qarorni dasturga topshirmaydi.',
        definition: `flowchart TD
  A["Vakil: poliklinikaga murojaat"] --> B["Xodim: reyestrdan bola kartasini qidirish"]
  B --> C{"Mos karta bormi?"}
  C -->|"Ha"| D["Mavjud kartani ochish"]
  C -->|"Yo‘q"| E["Yangi bola kartasi formasini ochish"]
  E --> F["Bola, tug‘ilgan sana va hujjat rekvizitlari"]
  F --> G["Hudud, manzil, vakil va aloqa"]
  G --> H["Asl murojaat sanasi, shifokor va poliklinika"]
  H --> I["Dastlabki tashxis, ehtiyoj va yordam istagi"]
  I --> J{"Majburiy maydonlar va sanalar to‘g‘rimi?"}
  J -->|"Yo‘q"| K["Xodim: manba hujjat bo‘yicha tuzatish"]
  K --> F
  J -->|"Ha"| L{"Yangi karta ochishda yosh 18 dan kichikmi?"}
  L -->|"Yo‘q"| M["Yangi karta ochilmaydi; avvalgi ishni tekshirish"]
  L -->|"Ha"| N["Saqlash: Yangi murojaat"]
  N --> O["Uch ish kunlik baholash muddatini ko‘rish"]
  D --> O
  O --> P["Shifokor: tekshiruv va PaPaS baholashi"]
  P --> Q["PaPaS panelida Natija kiritish"]
  Q --> R["Ball, sana, baholovchi, metodika va hujjat"]
  R --> S{"Natija va sana kiritish tekshiruvidan o‘tdimi?"}
  S -->|"Yo‘q"| T["Hujjat bilan solishtirib maydonni tuzatish"]
  T --> R
  S -->|"Ha"| U["Natijani tarixga qo‘shish"]
  U --> V{"Faol xizmat epizodi bormi?"}
  V -->|"Ha"| W["Joriy xizmat avtomatik to‘xtamaydi; shifokor ko‘radi"]
  V -->|"Yo‘q"| X{"PaPaS kamida 15 ballmi?"}
  X -->|"Yo‘q"| Y["Poliklinika kuzatuvi va qayta ko‘rik"]
  Y -->|"Yangi tasdiqlangan baholash"| P
  X -->|"Ha"| Z{"Shifokor 1-ilova ko‘rsatmasini tasdiqlaganmi?"}
  Z -->|"Hali yo‘q"| AA["Klinik ma’lumotni aniqlashtirish"]
  AA --> Z
  Z -->|"Ha"| AB["Vakil tanlagan vakolatli muassasa"]
  AB --> AC["Manba konsiliumi va yo‘llanma bosqichi"]
  class A,B,D,E,F,G,H,I,N,P,Q,R,AB,AC guide_action;
  class U guide_success;
  class M guide_rejected;
  class C,J,K,L,O,S,T,V,W,X,Y,Z,AA guide_waiting;`,
        walkthrough: [
          'Mavjud karta topilsa oqim uni ochishga o‘tadi; bola ma’lumotlari qayta yaratilmaydi. Karta bo‘lmasa identifikatsiya, oila, manzil va asl murojaat sanasi yig‘iladi.',
          'Birinchi tekshiruvda bo‘sh maydon va noto‘g‘ri sanalar tuzatish sikliga qaytadi. Yangi karta uchun 18 yosh chegarasi tekshiriladi; bu blok statsionarda davom ettirish qarori bilan almashtirilmaydi.',
          'Saqlangan karta uch ish kunlik baholash nazoratiga o‘tadi. Shifokor baholashni tashqarida tasdiqlaydi, keyin modulga natija va dalillar yoziladi. Prototip ish kunini dushanba–juma bo‘yicha sanaydi.',
          'Natija maydonlari yoki sanasi mos kelmasa forma tuzatilib qayta saqlanadi. Bu texnik tekshiruv klinik ballni qayta hisoblamaydi.',
          'Faol epizod bo‘lsa yangi PaPaS tarixga qo‘shiladi, xizmat avtomatik yopilmaydi. Faol epizod bo‘lmasa 15 dan past natija kuzatuvga, keyingi ko‘rik esa yangi baholash sikliga qaytadi.',
          'Kamida 15 ball klinik ko‘rsatma tekshiruviga olib boradi. Tasdiq bo‘lmaguncha shifokor aniqlashtiradi; tasdiq bo‘lsa vakolatli muassasa va manba konsiliumi bosqichiga o‘tiladi. Markaz qabuli hali tasdiqlanmagan.',
        ],
      },
      {
        id: 'exceptions', title: 'Dublikat, tarixiy sana va qayta baholashda qaytish yo‘llari', description: 'Ko‘p uchraydigan ma’lumot xatolari bilan past PaPaS natijasini ajratadi. Ma’lumotni tuzatish, kuzatuv va klinik qayta ko‘rish bir xil amal emas.',
        definition: `flowchart TD
  A["Karta yoki PaPaSni saqlashga urinish"] --> B{"Dublikat karta xabari bormi?"}
  B -->|"Ha"| C["Formani bekor qilish va mavjud kartani topish"]
  C --> D["Shu bolaning tarixini davom ettirish"]
  B -->|"Yo‘q"| E{"Sana tekshiruvi xatomi?"}
  E -->|"Ha"| F["Tug‘ilgan, asl murojaat va baholash sanalarini solishtirish"]
  F --> G{"Xizmat tarixidagi tug‘ilgan sana o‘zgaryaptimi?"}
  G -->|"Ha"| H["Prototipda blok; mas’ul xodim alohida tekshiradi"]
  G -->|"Yo‘q"| I["Asl hujjatga mos ruxsat etilgan sanani tuzatish"]
  I --> A
  E -->|"Yo‘q"| J{"Baholovchi, metodika va hujjat to‘liqmi?"}
  J -->|"Yo‘q"| K["Shifokordan yetishmagan dalilni olish"]
  K --> A
  J -->|"Ha"| L["Natijani saqlash; avvalgi natijalar qoladi"]
  L --> M{"Faol epizod bormi?"}
  M -->|"Ha"| N["Natijani shifokor ko‘radi; xizmat davom etadi"]
  M -->|"Yo‘q"| O{"PaPaS 15 dan pastmi?"}
  O -->|"Ha"| P["Poliklinika kuzatuvi; yakuniy rad emas"]
  P --> Q["Shifokor qayta baholashni o‘tkazadi"]
  Q --> A
  O -->|"Yo‘q"| R["Ko‘rsatma va yo‘llanma hujjatlarini tekshirish"]
  D --> R
  class A,D,I,R guide_action;
  class L guide_success;
  class H guide_rejected;
  class C guide_cancelled;
  class B,E,F,G,J,K,M,N,O,P,Q guide_waiting;`,
        walkthrough: [
          'Dublikat xabari yangi kartani bekor qilish va mavjud ishni ochish bilan hal qilinadi. Oqim ism yoki tug‘ilgan sanani sun’iy o‘zgartirishni taklif qilmaydi.',
          'Sana xatosida avval uchta manba sana solishtiriladi. Tarixiy qog‘oz hujjatga bugungi murojaat sanasi noto‘g‘ri qo‘yilgan bo‘lsa, ruxsat etilgan tahrir orqali asl sana aniqlashtiriladi va saqlash takrorlanadi.',
          'Xizmat tarixi bor kartadagi tug‘ilgan sana xatosi oddiy forma sikli orqali chetlab o‘tilmaydi. Joriy prototip bunday o‘zgarishni bloklaydi; mas’ul xodim hujjatni alohida tekshiradi.',
          'Baholovchi, metodika yoki hujjat yetishmasa tegishli dalil olinib forma to‘ldiriladi. Natija muvaffaqiyatli saqlanganda oldingi yozuvlar qoladi.',
          'Past ball texnik xato emas. Faol xizmat bo‘lmagan holatda poliklinika kuzatuvi davom etadi; shifokor keyin qayta baholab, yangi natijani shu kartaga qo‘shishi mumkin.',
          'Kamida 15 ball yoki mavjud kartada yo‘llanma ustida davom etish ko‘rsatma va hujjatlar tekshiruviga olib boradi. Bu sxema qabulni avtomatik tasdiqlamaydi.',
        ],
      },
    ],
  },
  referral: {
    prerequisites: [
      'Bola kartasi, vakil, mas’ul shifokor, asl murojaat sanasi va klinik ma’lumotlar mavjud bo‘lsin.',
      'Yo‘llanmani yuborish uchun kartadagi eng so‘nggi PaPaS kamida 15 va 1-ilovaga muvofiq tibbiy ko‘rsatma qaydi kerak. Past ball kuzatuv yo‘lini davom ettiradi.',
      'Vakil tanlagan vakolatli muassasaning tibbiy konsiliumi xulosasi, Z51.5 kodi va klinik marshruti rasmiylashtirilgan bo‘lsin. Xulosani modul o‘zi yaratmaydi.',
      'Kasallik tarixidan ko‘chirma, tekshiruv natijalari, PaPaS hujjati, varaqlar soni va tasdiqlovchi shaxslar rekvizitlarini tayyorlang.',
      'Yozma yo‘llanmada asl raqam/sana va texnik nosozlik sababi, E-palliative namunasi tanlovida tashqi ID bo‘lsin. Prototipda uchala manba ham qo‘lda qayd etiladi.',
      'Kartada faol xizmat epizodi yoki vafotdan keyingi oilaviy yordam bo‘lmasin. Faol xizmat vaqtida joriy yo‘llanmani almashtirish bloklangan.',
    ],
    sections: [
      { title: 'Kimning xulosasi yo‘llanmaga asos bo‘ladi?', paragraphs: [
        'Oilaviy shifokor baholashidan keyin vakil tanlagan vakolatli muassasada tibbiy konsilium hujjatlarni ko‘radi. Nizomning 19–20-bandlaridagi muassasalar: Respublika ixtisoslashtirilgan onkologiya va radiologiya ilmiy-amaliy tibbiyot markazi va filiallari; Bolalar gematologiyasi, onkologiyasi va klinik immunologiyasi markazi; Bolalar milliy tibbiyot markazi; viloyatlar ko‘p tarmoqli bolalar tibbiyot markazlari; davlat oliy tibbiy ta’lim muassasalari klinikalari.',
        'Manba konsiliumi klinik asos bo‘lganda Z51.5 ni qo‘yadi, yordam shakli va marshrutini belgilaydi hamda 2-ilovadagi yo‘llanmani rasmiylashtiradi. Formadagi muassasa va tarkib matn sifatida kiritiladi; joriy prototip tashkilot vakolatini yoki shifokor ishtirokini tashqi reyestr bilan tasdiqlamaydi. Rekvizitlarni manba hujjat bilan xodim solishtiradi.',
        'Markaz konsiliumi bu xulosani qabul qilishga asos bo‘lgan hujjat sifatida ko‘radi, lekin o‘z qarorini alohida qabul qiladi. Yo‘llanma ichidagi Konsilium tarkibi — manba muassasa a’zolari; Markaz qarori formasidagi xuddi shu nomli maydon — Markazning palliativ yordam shifokori, psixolog va ijtimoiy xodimi.',
      ] },
      { title: 'Saqlash va Markazga yuborish — ikki alohida amal', paragraphs: [
        'Yo‘llanmani saqlash formadagi rekvizitlarni qoralama sifatida kartaga qo‘yadi. Shundan keyin Baholash va yo‘llanma bo‘limida Yuborishdan oldingi tekshiruv chiqadi. To‘liqlik tekshiruvi tugamasdan va Markaz konsiliumiga yuborish bosilmasdan karta Markaz ko‘rigiga yuborilgan hisoblanmaydi.',
        'Joriy forma yulduzchali maydonlarni bo‘sh qoldirib saqlashga yo‘l bermaydi. Demo ssenariylardagi to‘liq bo‘lmagan yo‘llanma ilgari yuklangan namuna holatini ko‘rsatadi: uni Yo‘llanmani tahrirlash orqali ochib, yetishmagan maydonlarni to‘ldiring. Forma darajasidagi majburiylikdan tashqari, yuborish paytida PaPaS, ko‘rsatma, manba konsiliumi tasdig‘i, kod va sana ketma-ketligi yana tekshiriladi.',
        'Yuborishdan oldingi tekshiruvdagi har bir muammo hujjatni aniqlashtirish vazifasidir. Masalan, ko‘chirma rekviziti yetishmasligi bolaning klinik qabulini rad etish degani emas. Yetishmagan hujjat qayd etilgach qayta yuboriladi; tizimning xato xabarini chetlab o‘tish uchun tasdiqlanmagan ball yoki kod yozilmaydi.',
      ] },
      { title: 'Manba turi, yozma istisno va hujjat dalillari', paragraphs: [
        'Nizomning 20-bandida E-palliative orqali yo‘llanma berish, 21-bandida texnik nosozlik vaqtida yozma yo‘llanma rasmiylashtirish ko‘rsatilgan. Prototipdagi Prototipda rasmiylashtirish tanlovi oddiy qo‘lda sinov uchun; E-palliative namunasi ham haqiqiy integratsiyaga ulanmagan.',
        'Yozma yo‘llanma tanlanganda Texnik nosozlik sababi paydo bo‘ladi va to‘ldiriladi. Hujjatning asl raqami va berilgan sanasi saqlanadi. Elektron tizim hali ishlab chiqilmaganini haqiqiy texnik nosozlik deb ko‘rsatish kerak emas; yozma istisnoni sinashda namuna ekanini mazmunda belgilang.',
        'Hujjat rekviziti — raqam, sana yoki uni topishga yordam beruvchi matn. Ushbu forma PDF yuklamaydi, hujjat mazmunini o‘qimaydi va elektron imzo qo‘ymaydi. Ko‘chirma va tekshiruv varaqlari soni musbat butun son bo‘lishi kerak. PaPaS rekviziti shu bolaning tegishli baholashiga mosligini xodim tekshiradi.',
      ] },
      { title: 'Qayta yuborishda nimalar saqlanadi?', paragraphs: [
        'Yo‘llanma tahrirlanib saqlanganda oldingi versiya tarixda qoladi, yangi versiya qoralama bo‘ladi. Hatto ilgari yuborilgan yozuv ustida ishlayotgan bo‘lsangiz ham, yangi versiya uchun Markaz konsiliumiga yuborish amalini takrorlash kerak. Avvalgi Markaz qarorlari yangi yo‘llanmani avtomatik tasdiqlamaydi.',
        'Boshqa kartadagi tashqi ID bilan moslik yoki muassasa + yo‘llanma raqami + sana bir xil bo‘lsa saqlash bloklanadi. Bu yordamchi dublikat nazoratidir, to‘liq tashqi reyestr qidiruvi emas. Avvalgi yozma hujjatga elektron nusxa kelganda bola va hujjatni solishtirib mavjud ishda davom eting; yangi bola kartasi ochmang.',
        'Qayta PaPaS baholashi yo‘llanma sanasidan keyin bo‘lsa, eski yo‘llanma bilan yuborish o‘tmaydi. Hujjatlarni yangi baholashga muvofiq manba muassasa bilan qayta rasmiylashtiring. Asl sanani tekshiruvdan o‘tish uchungina sun’iy o‘zgartirish to‘g‘ri yo‘l emas.',
      ] },
    ],
    steps: [
      { title: 'Kerakli bola kartasini oching', actor: 'Yo‘llanmani qayd etuvchi xodim', action: 'Bolalar reyestrida F.I.Sh., tug‘ilgan sana va vakilni solishtirib, Baholash va yo‘llanma bo‘limiga kiring. Faol epizod yoki oilaviy yordam bor-yo‘qligini ko‘ring.', result: 'Yo‘llanma to‘g‘ri va tahrirlash mumkin bo‘lgan ishga bog‘lanadi.', route: '/apps/palliative-care/cases' },
      { title: 'PaPaS va tibbiy ko‘rsatmani tekshiring', actor: 'Oilaviy shifokor va yo‘llanma xodimi', action: 'PaPaS panelidagi eng so‘nggi natija va sanani o‘qing. Kamida 15 ball hamda kartadagi 1-ilova ko‘rsatmasi mavjud bo‘lsin; mos bo‘lmasa shifokor ko‘rib chiqadi.', result: 'Yuborish uchun klinik asos hujjat bilan tekshirilgan.' },
      { title: 'Manba konsiliumi hujjatlarini yig‘ing', actor: 'Vakolatli muassasaning tibbiy konsiliumi', action: 'Muassasa xulosasi, raqam/sana, a’zolar, palliativ yordamga muvofiqlik, Z51.5, yordam shakli va birinchi vazifalar manba hujjat bo‘yicha tayyorlanadi.', result: 'Markaz qaroridan alohida manba konsiliumi asosi bor.' },
      { title: 'Yo‘llanma formasini oching', actor: 'Yo‘llanmani qayd etuvchi xodim', action: 'Yo‘llanma tayyorlash yoki Yo‘llanmani tahrirlashni bosing. Demo ssenariyda namuna qiymatlari yordamida sinashingiz mumkin, lekin ularni hujjat tasdig‘i deb qabul qilmang.', result: 'Palliativ yordam uchun yo‘llanma formasi ochilgan.' },
      { title: 'Asosiy rekvizit va manbani belgilang', actor: 'Yo‘llanmani qayd etuvchi xodim', action: 'Raqam, rasmiylashtirish sanasi, muassasa va manba turini yozing. Yozma yo‘llanmada texnik nosozlik sababini; E-palliative namunasida tashqi IDni kiriting.', result: 'Yo‘llanmaning kelib chiqishi va takrorni solishtirish rekvizitlari mavjud.' },
      { title: 'Manba konsiliumi xulosasini ko‘chiring', actor: 'Manba muassasa xodimi', action: 'Xulosa raqami, sanasi va tarkibini yozing. Ijobiy xulosa mavjud bo‘lgandagina muvofiqlik tasdig‘ini belgilang; hujjatdagi XKT-10 kodi va klinik marshrutni kiriting.', result: 'Konsilium tasdig‘i va marshruti yo‘llanmada aniq.' },
      { title: 'Ehtiyoj va hujjatlar hisobini to‘ldiring', actor: 'Manba muassasa xodimi', action: 'Yo‘naltirish sababi, birinchi vazifalar va zarur jihozlarni yozing. Kasallik tarixidan ko‘chirma, tekshiruv natijalari, PaPaS hujjati va tegishli varaqlar sonini kiriting.', result: 'Klinik mazmun va majburiy ilovalar rekvizitlari to‘liq.' },
      { title: 'Tasdiqlovchi shaxslarni qayd eting', actor: 'Manba muassasa xodimi', action: 'Yo‘naltiruvchi shifokor F.I.Sh., lavozimi, telefoni, bosh shifokor yoki o‘rinbosari va imzolangan xulosa rekvizitini yozing. Bu amalda elektron imzo qo‘yilmaydi.', result: 'Manba hujjatning mas’ullari va tasdig‘i qayd etilgan.' },
      { title: 'Qoralamani saqlang', actor: 'Yo‘llanmani qayd etuvchi xodim', action: 'Yo‘llanmani saqlashni bosing. Forma yoki dublikat xatosi chiqsa tuzating. Saqlangan ma’lumotni kartadagi yo‘llanma panelidan qayta o‘qing.', result: 'Yo‘llanma saqlangan, lekin hali Markaz konsiliumiga yuborilmagan.' },
      { title: 'Yuborishdan oldingi muammolarni hal qiling', actor: 'Yo‘llanma xodimi va tegishli shifokor', action: 'Yuborishdan oldingi tekshiruvdagi bandlarni bittadan ko‘ring. Yetishmagan rekvizitni tahrirlang, klinik tasdiq kerak bo‘lsa vakolatli shifokorga qayting, sanalarni asl hujjat bo‘yicha tekshiring.', result: 'Yo‘llanma ma’lumotlari to‘liq xabari ko‘rinadi; klinik dalillar sun’iy to‘ldirilmagan.' },
      { title: 'Markaz konsiliumiga yuboring', actor: 'Yo‘llanmani qayd etuvchi xodim', action: 'Markaz konsiliumiga yuborishni bosing. Muvaffaqiyat xabari, yuborilgan sana va kartaning Konsiliumda holatini tekshiring.', result: 'Joriy yo‘llanma yuborilgan, Markazning alohida ko‘rigi uchun tayyor.', route: '/apps/palliative-care/consilium' },
      { title: 'Aniqlashtirish kerak bo‘lsa qayta rasmiylashtiring', actor: 'Manba muassasa xodimi va koordinator', action: 'Yangi hujjat yoki baholash talab qilinsa o‘sha kartadagi yo‘llanmani tahrirlab saqlang. Oldingi versiya tarixda qoladi; yangi qoralamani tekshirib qayta yuboring.', result: 'Bir bola ishida avvalgi yo‘llanma va yangi yuborish izchil saqlangan.' },
    ],
    rules: [
      { tone: 'action', condition: 'Muassasa yoki konsilium a’zolari formaga kiritilgan', action: 'Ularning vakolati va xulosaga mosligini manba hujjat orqali tekshiring; matn maydoni tashqi tasdiq hisoblanmaydi.', owner: 'Yo‘llanmani qayd etuvchi xodim', basis: 'Nizom 19–20-bandlari; prototipda tashqi tashkilot/xodim tekshiruvi yo‘q.' },
      { tone: 'waiting', condition: 'Yo‘llanma saqlangan, lekin yuborilgan belgisi yo‘q', action: 'To‘liqlikni tekshirib Markaz konsiliumiga yuborish amalini bajaring.', owner: 'Yo‘llanmani qayd etuvchi xodim', basis: 'Prototipdagi qoralama va yuborilgan bosqichlari.' },
      { tone: 'waiting', condition: 'Kasallik tarixidan ko‘chirma yoki varaqlar soni yo‘q', action: 'Majburiy ilova rekvizitini va musbat butun varaqlar sonini kiriting; hujjat kamchiligini klinik rad etish deb yozmang.', owner: 'Manba muassasa xodimi', basis: 'Nizom 21-bandi va 2-ilova; prototip to‘liqlik tekshiruvi.' },
      { tone: 'waiting', condition: 'PaPaS yoki manba konsiliumi sanasi yo‘llanmadan keyin', action: 'Manba hujjatlarining ketma-ketligini tekshiring va zarur bo‘lsa yo‘llanmani vakolatli muassasada qayta rasmiylashtiring.', owner: 'Manba muassasa va yo‘llanma xodimi', basis: 'Prototip hujjatlar xronologiyasi tekshiruvi.' },
      { tone: 'action', condition: 'Yozma yo‘llanma tanlangan', action: 'Texnik nosozlik sababini va asl rekvizitlarni qayd eting. Oddiy frontend sinovi uchun Prototipda rasmiylashtirish tanlovi ham mavjud.', owner: 'Yo‘llanma xodimi', basis: 'Nizom 21-bandining yozma istisnosi; manba tanlovlari prototip imkoniyati.' },
      { tone: 'waiting', condition: 'Yuborilgan yo‘llanma qayta tahrirlanib saqlangan', action: 'Yangi qoralama uchun barcha tekshiruvlardan o‘tib qayta yuboring. Oldingi qarorni yangi yuborish o‘rnida ishlatmang.', owner: 'Yo‘llanma xodimi va koordinator', basis: 'Prototip versiya tarixi va qaror oldidan yuborilgan yo‘llanma talabi.' },
    ],
    faq: [
      { question: 'Formadagi Z51.5 maydoni tashxis qo‘yadimi?', answer: 'Yo‘q. Bu vakolatli muassasa konsiliumi qo‘ygan kodni hujjatdan qayd etish maydoni. Dastur xabaridan o‘tish uchun klinik xulosasiz kod yozilmaydi.' },
      { question: 'Yo‘llanmani saqlashni bosdim, nega Konsiliumda bo‘lmadi?', answer: 'Saqlash qoralamani yaratadi. Kartadagi Yuborishdan oldingi tekshiruvni yakunlab, Markaz konsiliumiga yuborishni alohida bosish kerak.' },
      { question: 'Hujjatning PDFini qayerga yuklayman?', answer: 'Joriy frontend prototipda fayl yuklash maydoni yo‘q. Hujjat rekviziti va varaqlar soni qayd etiladi; fayl, elektron imzo yoki haqiqiy E-palliative almashinuvi bajarilmaydi.' },
      { question: 'E-palliative namunasi tashqi tizimdan avtomatik oladimi?', answer: 'Yo‘q. Tashqi yo‘llanma IDsi qo‘lda kiritiladi va boshqa kartalardagi mos ID bilan solishtiriladi. Bu real integratsiya yoki tashqi tasdiqlangan hujjat degani emas.' },
      { question: 'Qog‘oz yo‘llanmadan keyin elektron nusxa keldi. Yangi karta kerakmi?', answer: 'Kerak emas. Bola, hujjat raqami, sana va muassasani solishtiring, o‘sha kartada davom eting. Yo‘llanmani yangilab saqlash yangi qoralama qiladi va oldingi versiyani tarixda qoldiradi.' },
      { question: 'To‘liq bo‘lmagan demo yo‘llanmani qanday yakunlayman?', answer: 'Yo‘llanmani tahrirlash orqali oching, yulduzchali maydonlarni to‘ldirib saqlang, so‘ng yuborish tekshiruvidagi qolgan masalalarni hal qiling. Seed namunasi to‘liq bo‘lmagan holatni ko‘rsatadi; joriy forma barcha majburiy maydonlarni bo‘sh qoldirib saqlamaydi.' },
      { question: 'Zarur jihozlar yozilsa jihoz avtomatik ajratiladimi?', answer: 'Yo‘q. Bu yo‘llanmadagi ehtiyoj qaydi. Jihozning mavjudligi, faol mobil xizmat va vakil bilan bepul foydalanish shartnomasi keyin Jihozlar ish jarayonida alohida yuritiladi.' },
      { question: 'Qayta baholash eski yo‘llanmadan keyin bo‘lsa nima qilaman?', answer: 'Yangi baholashni eski hujjat sanasiga moslashtirish uchun o‘zgartirmang. Manba muassasa bilan hujjatlarni yangilang, yangi qoralamani saqlab, tekshiruvdan keyin qayta yuboring.' },
    ],
    checklist: [
      'Yo‘llanma to‘g‘ri bola kartasiga bog‘langan; boshqa bolaning hujjati emas.',
      'Vakolatli muassasa tanlovi va manba konsiliumi hujjati tekshirilgan.',
      'Ijobiy muvofiqlik tasdig‘i hujjat asosida belgilangan, kod Z51.5.',
      'Eng so‘nggi PaPaS kamida 15; tibbiy ko‘rsatma kartada qayd etilgan.',
      'PaPaS va manba konsiliumi sanalari yo‘llanma sanasidan keyin emas.',
      'Ko‘chirma va tekshiruv rekvizitlari, musbat butun varaqlar soni, PaPaS hujjati kiritilgan.',
      'Shifokor, lavozim, telefon, bosh shifokor va imzolangan tasdiq rekviziti to‘liq.',
      'Klinik marshrut, birinchi vazifalar va mobil ehtiyoj bo‘lsa zarur jihozlar yozilgan.',
      'Yozma manbada nosozlik sababi; E-palliative namunasida tashqi ID bor.',
      'Yuborishdan oldingi tekshiruvda muammo qolmagan.',
      'Saqlashdan keyin Markaz konsiliumiga yuborish alohida bajarilgan va natijasi ko‘rilgan.',
      'Qayta rasmiylashtirishda eski tarix saqlangan, yangi qoralama qayta yuborilgan.',
    ],
    fields: [
      field('Yo‘llanma raqami', 'Palliativ yordam uchun yo‘llanma → Yo‘llanma rekvizitlari', 'Majburiy.', 'Manba hujjatning raqami. Muassasa va sana bilan birga dublikat solishtirishda ishlatiladi.', 'DEMO-Y-0042.'),
      field('Rasmiylashtirish sanasi', 'Palliativ yordam uchun yo‘llanma → Yo‘llanma rekvizitlari', 'Majburiy haqiqiy sana; kelajakda bo‘lmaydi.', 'Yo‘llanmaning asl berilgan kuni. Yuborishda eng so‘nggi PaPaS va manba konsiliumi sanasidan oldin bo‘lmasligi tekshiriladi.', '03.09.2026 — PaPaS 02.09.2026, konsilium 03.09.2026 bo‘lgan to‘qima misol.'),
      field('Yo‘llanma manbasi', 'Palliativ yordam uchun yo‘llanma → Yo‘llanma rekvizitlari', 'Uch tanlovdan biri.', 'Prototipda rasmiylashtirish, Yozma yo‘llanma yoki E-palliative namunasi. Tanlov shartli qo‘shimcha maydonlarni ochadi.', 'Yozma yo‘llanma — istisno jarayonini sinash uchun.'),
      field('Vakolatli yo‘llanma beruvchi muassasa', 'Palliativ yordam uchun yo‘llanma → Yo‘llanma rekvizitlari', 'Majburiy.', 'Nizomda nazarda tutilgan manba muassasaning to‘liq nomi. Prototip matnni real katalog orqali tasdiqlamaydi.', 'Jizzax viloyati ko‘p tarmoqli bolalar tibbiyot markazi — demo hujjat.'),
      field('Tashqi yo‘llanma IDsi', 'Yo‘llanma rekvizitlari → E-palliative namunasi tanlanganda', 'Shartli majburiy.', 'Qo‘lda kiritilgan tashqi identifikator; boshqa kartadagi mos ID dublikat sifatida tekshiriladi.', 'DEMO-EP-0042.'),
      field('Texnik nosozlik sababi', 'Yo‘llanma rekvizitlari → Yozma yo‘llanma tanlanganda', 'Shartli majburiy.', 'Nega yozma yo‘llanma rasmiylashtirilganini tushuntiradi. Prototipda integratsiya yo‘qligi haqiqiy nosozlik dalili emas.', 'Demo holat: manba muassasada elektron yo‘llanma yuborish vaqtincha ishlamagan, yozma nusxa berilgan.'),
      field('Tibbiy konsilium xulosasi raqami', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Majburiy.', 'Manba konsiliumi hujjati raqami; Markazning keyingi qaror raqamidan alohida.', 'DEMO-TK-0042.'),
      field('Xulosa sanasi', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Majburiy; yuborishda yo‘llanma sanasidan keyin bo‘lmaydi.', 'Manba konsiliumi xulosa qabul qilgan sana.', '03.09.2026 — to‘qima xulosa.'),
      field('Konsilium tarkibi', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Majburiy.', 'Yo‘llanma bergan muassasaning konsilium a’zolari hujjat bo‘yicha yoziladi. Bu Markaz jamoasi uchun maydon emas.', 'Shifokor M. Karimov, shifokor D. Sobirova (namuna).'),
      field('Konsilium palliativ yordamga muvofiqligini tasdiqlagan', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Yuborish uchun belgilangan bo‘lishi kerak.', 'Manba hujjatda ijobiy klinik xulosa borligini qayd etadi. Dastur tasdiqni mustaqil bermaydi.', 'Belgilangan — faqat shartli ijobiy konsilium hujjati asosida.'),
      field('Konsilium qo‘ygan XKT-10 kodi', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Majburiy; Markazga yuborish mezoni Z51.5.', 'Vakolatli konsilium qo‘ygan kod; kartadagi asosiy tashxis matni va 1-ilova guruhidan alohida.', 'Z51.5 — demo hujjatdagi kod.'),
      field('Klinik marshrut / yordam shakli', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Statsionar yoki mobil shakl tanlanadi.', 'Manba konsiliumi belgilagan xizmat yo‘nalishi. Markaz keyin o‘z qarorida shaklni alohida qayd etadi.', 'Mobil — uy sharoitida.'),
      field('Yo‘naltirish sababi va birinchi navbatdagi vazifalar', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Majburiy.', 'Yo‘llanma nima uchun berilgani, klinik marshrut va dastlabki yordam vazifalarini manba xulosasiga muvofiq tushuntiradi.', 'Uy sharoitidagi parvarishni tashkil etish, oila ehtiyojlarini jamoa bilan ko‘rib chiqish. Demo.'),
      field('Zarur jihozlar', 'Yo‘llanma beruvchi muassasa konsiliumi', 'Ehtiyojga ko‘ra; qiymatlar vergul bilan ajratiladi.', 'Mobil yordamda kerak bo‘ladigan jihozlar ro‘yxati. Bu inventarni band qilmaydi va shartnoma yaratmaydi.', 'funksional karavot, aspirator — faqat demo xulosadagi ehtiyoj.'),
      field('Kasallik tarixidan ko‘chirma rekviziti', 'Hujjatlar hisobi', 'Majburiy.', '21-bandga ko‘ra yo‘llanmaga ilova qilinadigan ko‘chirma raqami/sanasi. Joriy forma faylni emas, rekvizitni saqlaydi.', 'DEMO-KT-0042, 03.09.2026.'),
      field('Ko‘chirma varaqlari soni', 'Hujjatlar hisobi', 'Majburiy; kamida 1, butun son.', 'Kasallik tarixidan ko‘chirma hajmi. Nol, kasr yoki bo‘sh qiymat bilan yuborish o‘tmaydi.', '4.'),
      field('Tekshiruv natijalari rekviziti', 'Hujjatlar hisobi', 'Majburiy.', 'Yo‘llanmaga tegishli tekshiruv natijalarini aniqlaydigan rekvizit.', 'DEMO-TEK-0042, tekshiruvlar jamlanmasi.'),
      field('Tekshiruv varaqlari soni', 'Hujjatlar hisobi', 'Majburiy; kamida 1, butun son.', 'Ilova qilingan tekshiruv natijalari varaqlari soni.', '3.'),
      field('PaPaS natijasi hujjati', 'Hujjatlar hisobi', 'Majburiy.', 'Kartadagi tegishli PaPaS natijasini asoslovchi hujjat; mosligini xodim tekshiradi.', 'DEMO-PAPAS-0042, 02.09.2026.'),
      field('Yo‘naltiruvchi shifokor F.I.Sh.', 'Tasdiqlovchi shaxslar', 'Majburiy.', 'Yo‘llanmani rasmiylashtirgan shifokor nomi; baholovchi shifokor bilan bir xil bo‘lishi shart deb dastur belgilamaydi.', 'Shifokor M. Karimov (namuna).'),
      field('Shifokor lavozimi', 'Tasdiqlovchi shaxslar', 'Majburiy.', 'Yo‘naltiruvchi shifokorning hujjatda ko‘rsatilgan lavozimi.', 'Bo‘lim shifokori — demo.'),
      field('Shifokor telefoni', 'Tasdiqlovchi shaxslar', 'Majburiy.', 'Hujjatni aniqlashtirish uchun yo‘naltiruvchi shifokor aloqa raqami.', '+998 00 000 00 00 — format namunasi.'),
      field('Bosh shifokor / o‘rinbosar F.I.Sh.', 'Tasdiqlovchi shaxslar', 'Majburiy.', 'Yo‘llanmadagi tegishli tasdiqlovchi rahbar nomi.', 'Bosh shifokor o‘rinbosari N. Ismoilova (namuna).'),
      field('Imzolangan xulosa / tasdiq rekviziti', 'Tasdiqlovchi shaxslar', 'Majburiy.', 'Manba hujjatning tasdiq rekviziti. Uni kiritish elektron imzo qo‘yish yoki imzoni tekshirish amali emas.', 'DEMO-TASDIQ-0042, imzolangan manba xulosasi rekviziti.'),
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Yo‘llanma ma’lumotlari kiritilmagan.', reason: 'Kartada saqlangan joriy yo‘llanma yo‘q.', solution: 'Yo‘llanma tayyorlashni ochib hujjatlar rekvizitini to‘ldiring, saqlang va yuborish tekshiruviga qayting.' },
      { tone: 'waiting', problem: 'Yo‘llanma beruvchi vakolatli muassasa konsiliumining ijobiy xulosasi kerak.', reason: 'Muassasa, xulosa raqami/sanasi, tarkib yoki ijobiy muvofiqlik tasdig‘i yetishmaydi.', solution: 'Manba konsiliumi hujjatini tekshiring. Bor rekvizitni to‘ldiring; ijobiy klinik xulosa bo‘lmasa belgi qo‘yib tekshiruvni chetlab o‘tmang.' },
      { tone: 'waiting', problem: 'Yo‘llanmadagi XKT-10 kodi Z51.5 bo‘lishi kerak.', reason: 'Konsilium kodi yuborish mezoniga mos emas.', solution: 'Manba xulosasidagi kodni tekshiring. Yozuv xatosini tuzating yoki masalani vakolatli konsiliumga qaytaring; operator klinik tashxis qo‘ymaydi.' },
      { tone: 'waiting', problem: '1-ilova bo‘yicha klinik ko‘rsatma tasdig‘i kerak.', reason: 'Bola kartasida tibbiy ko‘rsatma bo‘sh qolgan.', solution: 'Shifokor xulosasini oling va kartani Tahrirlash orqali tasdiqlangan ko‘rsatma guruhini kiriting. Faqat formani yuborish uchun taxminiy guruh tanlamang.' },
      { tone: 'waiting', problem: 'PaPaS kamida 15 ball bo‘lishi kerak; past ball poliklinika kuzatuvida qoladi.', reason: 'PaPaS yo‘q yoki sana bo‘yicha eng so‘nggi natija 15 dan past.', solution: 'Natija tarixini ko‘ring. Natija to‘g‘ri bo‘lsa kuzatuvni davom ettiring; yangi baholashni shifokor o‘tkazgandan keyingina yangi hujjatli natija qo‘shiladi.' },
      { tone: 'waiting', problem: 'Kasallik tarixidan ko‘chirma va varaqlar soni majburiy.', reason: 'Ko‘chirma rekviziti bo‘sh yoki varaqlar soni musbat butun son emas.', solution: 'Ko‘chirmani manba muassasadan aniqlashtirib, rekvizit va haqiqiy butun varaqlar sonini kiriting. Hujjat yo‘qligini klinik rad etish sifatida yozmang.' },
      { tone: 'waiting', problem: 'PaPaS va tekshiruv natijalari hujjatlari kerak.', reason: 'PaPaS rekviziti, tekshiruv rekviziti yoki tekshiruv varaqlari soni to‘liq emas.', solution: 'Hujjatlar hisobi guruhidagi uchta tegishli maydonni to‘ldiring va kartadagi PaPaS bilan solishtiring.' },
      { tone: 'waiting', problem: 'Yo‘naltiruvchi shifokor, bosh shifokor va manba tasdiqlari kerak.', reason: 'Tasdiqlovchi shaxslar guruhidagi bir yoki bir nechta majburiy qiymat bo‘sh.', solution: 'Shifokor F.I.Sh., lavozim, telefon, bosh shifokor/o‘rinbosar va imzolangan tasdiq rekvizitini manba hujjatga muvofiq yozing.' },
      { tone: 'waiting', problem: 'Yozma yo‘llanma uchun texnik nosozlik sababi kerak.', reason: 'Yozma yo‘llanma tanlangan, lekin istisno sababi kiritilmagan.', solution: 'Texnik nosozlik sababini yozing. Agar faqat oddiy frontend jarayonini sinayotgan bo‘lsangiz, hujjat manbasini Prototipda rasmiylashtirishga moslang.' },
      { tone: 'waiting', problem: 'Tashqi yo‘llanmaning manba identifikatori kerak.', reason: 'E-palliative namunasi tanlangan va tashqi ID bo‘sh.', solution: 'Namuna hujjatning tashqi ID qiymatini kiriting. Bu maydon avtomatik yuklanmaydi.' },
      { tone: 'waiting', problem: 'PaPaS baholashi yo‘llanma sanasidan keyin bo‘lishi mumkin emas.', reason: 'Sana bo‘yicha eng so‘nggi PaPaS mavjud yo‘llanmadan keyin o‘tkazilgan.', solution: 'Qayta baholashga mos yangilangan yo‘llanmani manba muassasa bilan rasmiylashtiring. Haqiqiy baholash sanasini eski hujjatga moslashtirib o‘zgartirmang.' },
      { tone: 'waiting', problem: 'Manba konsiliumi sanasi yo‘llanma sanasidan keyin bo‘lishi mumkin emas.', reason: 'Yo‘llanma o‘ziga asos bo‘lgan xulosadan oldingi sanada turibdi.', solution: 'Ikki hujjatni solishtirib yozuv xatosini tuzating yoki qayta rasmiylashtirilgan hujjatni kiriting.' },
      { tone: 'waiting', problem: 'Ushbu manba yo‘llanmasi boshqa ishda mavjud.', reason: 'Tashqi ID yoki muassasa, raqam va sana boshqa kartadagi yo‘llanmaga mos kelgan.', solution: 'Avvalgi kartani topib bola va hujjatni solishtiring. Mos ishda davom eting; soxta raqam orqali dublikat nazoratini chetlab o‘tmang.' },
      { tone: 'rejected', problem: 'Faol xizmat yoki oilaga yordam paytida yo‘llanmani almashtirish mumkin emas.', reason: 'Bolaning faol xizmat epizodi yoki vafotdan keyingi oilaviy ishi mavjud.', solution: 'Faol ishni o‘zining xizmat, reja yoki oilaviy yordam bo‘limida davom ettiring. Yangi yo‘llanma yaratish uchun amaldagi xizmat tarixini asossiz yakunlamang.' },
      { tone: 'action', problem: 'Yo‘llanma allaqachon konsiliumga yuborilgan.', reason: 'Joriy versiya ilgari yuborilgan.', solution: 'Yuborilgan belgisini tekshirib Markaz konsiliumi bosqichiga o‘ting. Yangi hujjat kerak bo‘lsagina tahrirlab, yangi qoralama sifatida qayta rasmiylashtiring.' },
    ],
    outcomes: [
      'Manba muassasa konsiliumi, yordam marshruti, majburiy ilovalar va tasdiqlovchi shaxslar 2-ilovaga bog‘liq rekvizitlar bilan qayd etilgan.',
      'Yo‘llanma manbasi aniq; yozma istisno yoki tashqi ID tegishli shart bilan ko‘rsatilgan.',
      'To‘liqlik va xronologiya tekshiruvlari yakunlangan, joriy yo‘llanma Markaz konsiliumiga yuborilgan.',
      'Bola holati Konsiliumda; hali qabul yoki faol xizmat epizodi yaratilmagan.',
      'Qayta yuborish va avvalgi hujjatlar bitta bola ishining tarixida qolgan.',
    ],
    relatedTopics: ['intake', 'consilium', 'inpatient', 'mobile', 'equipment', 'demo'],
    flows: [
      {
        id: 'detailed', title: 'Manba konsiliumidan Markazga yuborilgan yo‘llanmagacha', description: '2-ilova guruhlari, uchta manba varianti, dalillar tekshiruvi va qoralamadan yuborilgan holatga o‘tish ketma-ketligi.',
        definition: `flowchart TD
  A["Xodim: mavjud bola kartasini ochish"] --> B{"Faol xizmat yoki oilaviy ish bormi?"}
  B -->|"Ha"| C["Yo‘llanma almashtirilmaydi; faol ishda davom etish"]
  B -->|"Yo‘q"| D["Eng so‘nggi PaPaS va 1-ilova ko‘rsatmasi"]
  D --> E{"Yuborishning klinik asosi bormi?"}
  E -->|"Yo‘q"| F["Shifokor: kuzatuv yoki klinik aniqlashtirish"]
  F -->|"Yangi asos bo‘lsa"| D
  E -->|"Ha"| G["Vakil tanlagan vakolatli muassasa"]
  G --> H["Manba konsiliumi: xulosa, Z51.5 va marshrut"]
  H --> I["Yo‘llanma tayyorlash yoki tahrirlash"]
  I --> J["Raqam, sana va muassasani kiritish"]
  J --> K{"Yo‘llanma manbasi qaysi?"}
  K -->|"Mahalliy namuna"| L["Prototipda rasmiylashtirish"]
  K -->|"Yozma"| M["Asl rekvizit va texnik nosozlik sababi"]
  K -->|"E-palliative namunasi"| N["Tashqi IDni qo‘lda kiritish"]
  L --> O["Manba konsiliumi raqami, sanasi va tarkibi"]
  M --> O
  N --> O
  O --> P["Muvofiqlik tasdig‘i, Z51.5 va yordam shakli"]
  P --> Q["Yo‘naltirish vazifalari va zarur jihozlar"]
  Q --> R["Ko‘chirma, tekshiruv va PaPaS rekvizitlari"]
  R --> S["Varaqlar soni va tasdiqlovchi shaxslar"]
  S --> T{"Majburiy maydonlar to‘liq va takror yo‘qmi?"}
  T -->|"Yo‘q"| U["Hujjatni aniqlashtirish yoki mavjud ishni ochish"]
  U --> I
  T -->|"Ha"| V["Yo‘llanmani saqlash: qoralama"]
  V --> W["Yuborishdan oldingi tekshiruv"]
  W --> X{"Ball, kod, tasdiqlar va sanalar mosmi?"}
  X -->|"Yo‘q"| Y["Tegishli shifokor yoki manba xodimiga qaytish"]
  Y --> I
  X -->|"Ha"| Z["Markaz konsiliumiga yuborish"]
  Z --> AA["Yuborilgan sana va Konsiliumda holati"]
  AA --> AB["Markazning alohida qarorini kutish"]
  class A,D,G,H,I,J,L,M,N,O,P,Q,R,S,Z guide_action;
  class AA guide_success;
  class C guide_rejected;
  class B,E,F,K,T,U,V,W,X,Y,AB guide_waiting;`,
        walkthrough: [
          'Faol xizmat yoki oilaviy yordamdagi ish yangi yo‘llanma bilan almashtirilmaydi. Qolgan holatlarda eng so‘nggi PaPaS va klinik ko‘rsatma tekshiriladi; klinik asos yo‘q bo‘lsa shifokor kuzatuv yoki aniqlashtirishni belgilaydi.',
          'Klinik asos mavjudligi vakolatli muassasaga o‘tish imkonini beradi. Manba konsiliumi xulosa, Z51.5 va marshrutni belgilaydi; operator bu qarorni modul ichida o‘zi ishlab chiqmaydi.',
          'Manba turi uch yo‘lga ajraladi. Mahalliy namuna oddiy qo‘lda sinov, yozma yo‘l nosozlik sababi va asl rekvizit bilan, E-palliative namunasi tashqi ID bilan davom etadi. Uchala yo‘l shu formadagi konsilium va hujjat maydonlariga qayta birlashadi.',
          'Rekvizitlar, klinik marshrut, hujjatlar hajmi va tasdiqlovchi shaxslar to‘ldirilgach majburiy maydon va takror tekshiruvi o‘tadi. Dublikat topilsa avval mavjud ish aniqlanadi; noto‘g‘ri raqam o‘ylab topilmaydi.',
          'Saqlash qoralama yaratadi. Keyingi tekshiruv eng so‘nggi PaPaS, Z51.5, manba tasdiqlari va sanalarni solishtiradi. Xato yoki dalil yetishmasligi tegishli xodimga qaytish siklini hosil qiladi.',
          'Barcha talablar mos bo‘lgandan keyingina Markaz konsiliumiga yuborish bosiladi. Natija Konsiliumda holati va yuborilgan sanadir; bu hali APPROVED yoki faol xizmat emas.',
        ],
      },
      {
        id: 'exceptions', title: 'Yetishmagan hujjat, yozma nusxa va qayta yuborish', description: 'Texnik kamchilikni klinik rad etishdan ajratib, hujjat to‘ldirish va yangi versiyani yuborish siklini ko‘rsatadi.',
        definition: `flowchart TD
  A["Yo‘llanmani tekshirish yoki yangi nusxa kelishi"] --> B{"Boshqa kartada mos hujjat bormi?"}
  B -->|"Ha"| C["Bola va hujjatni solishtirib mavjud ishda davom etish"]
  B -->|"Yo‘q"| D["Joriy karta yo‘llanmasini ochish"]
  C --> D
  D --> E{"PaPaS yoki klinik tasdiq yetishmayaptimi?"}
  E -->|"Ha"| F["Shifokor yoki manba konsiliumi aniqlashtiradi"]
  F --> G{"Yuborish asosi tasdiqlandimi?"}
  G -->|"Hali yo‘q"| H["Kuzatuv yoki hujjat aniqlashtirishda qolish"]
  H -->|"Yangi hujjat"| F
  G -->|"Ha"| I["Haqiqiy natija va xulosani qayd etish"]
  E -->|"Yo‘q"| J{"Ilova yoki tasdiq rekviziti yetishmayaptimi?"}
  I --> J
  J -->|"Ha"| K["Ko‘chirma, tekshiruv yoki tasdiqni olish"]
  K --> L["Yo‘llanmani tahrirlash"]
  J -->|"Yo‘q"| L
  L --> M{"Yozma yoki tashqi nusxami?"}
  M -->|"Yozma"| N["Asl raqam va sana, nosozlik sababi"]
  M -->|"Tashqi namuna"| O["Tashqi IDni shu ishga qayd etish"]
  M -->|"Mahalliy"| P["Rekvizit va sanalarni tekshirish"]
  N --> P
  O --> P
  P --> Q["Saqlash: eski versiya tarixda, yangi qoralama"]
  Q --> R{"Yuborish tekshiruvi o‘tdimi?"}
  R -->|"Yo‘q"| D
  R -->|"Ha"| S["Qayta yuborish: Markaz konsiliumi"]
  class A,C,D,I,L,N,O,S guide_action;
  class B,E,F,G,H,J,K,M,P,Q,R guide_waiting;`,
        walkthrough: [
          'Elektron yoki yozma yangi nusxa avval bola va hujjat rekvizitlari bilan solishtiriladi. Mos yozuv bo‘lsa shu ish davom etadi; yangi bola kartasi yaratilmaydi.',
          'PaPaS yoki klinik tasdiq yetishmasa hujjatni oddiy operator tasdiqlamaydi. Shifokor yoki manba konsiliumi qayta ko‘radi; asos hali yo‘q bo‘lsa kuzatuv yoki aniqlashtirish davom etadi.',
          'Ko‘chirma, tekshiruv yoki imzolangan tasdiq yetishmasligi hujjatlarni to‘ldirish tarmog‘idir. Bu tarmoq bolani klinik rad etish holatiga o‘tkazmaydi.',
          'Yozma nusxada asl raqam/sana va nosozlik sababi, tashqi namunada ID qayd etiladi. Har ikkisi bir xil karta va hujjatlar tekshiruviga birlashadi.',
          'Tahrirni saqlash oldingi versiyani tarixga olib, yangi qoralama yaratadi. Tekshiruvdan o‘tmasa joriy kartaga qaytiladi; o‘tsa qayta yuborish bilan Markazning yangi ko‘rigi boshlanadi.',
        ],
      },
    ],
  },
  consilium: {
    prerequisites: [
      'Bola kartasidagi joriy yo‘llanma Markaz konsiliumiga yuborilgan bo‘lsin. Faqat saqlangan qoralama bo‘yicha qaror yozilmaydi.',
      'Manba muassasa konsiliumi xulosasi, Z51.5, eng so‘nggi PaPaS, tibbiy ko‘rsatma va majburiy ilovalar ko‘rib chiqishga tayyor bo‘lsin.',
      'Markazning multidissiplinar konsiliumi tarkibi — palliativ yordam shifokori, psixolog va ijtimoiy xodim — hamda uning raqamlangan va sanalangan xulosasi bo‘lsin.',
      'Qabul qilish bo‘yicha qarorda yordam xavfsizligi va tibbiy transportirovka imkoniyatini konsilium baholagan bo‘lsin. Mobil shaklda vakil yoki yaqin qarindosh roziligi ham qayd etiladi.',
      'Vaqtincha to‘xtatish holatida sabab, keyingi tibbiyot muassasasi va qayta ko‘rish sanasi oldindan aniqlangan bo‘lsin.',
      'Qabul tasdiqlangandan keyin xizmatni boshlash alohida ish ekanini hisobga oling: statsionar uchun bo‘sh tayyor o‘rin, mobil uchun uy ehtiyoji bahosi va brigada kerak bo‘ladi.',
    ],
    sections: [
      { title: 'Ikki konsiliumning vakolati bir-birini almashtirmaydi', paragraphs: [
        'Yo‘llanma beruvchi muassasa konsiliumi Z51.5, klinik marshrut va yo‘llanmani rasmiylashtiradi. Markaz konsiliumi esa taqdim etilgan hujjatlar va Markazdagi yordam imkonini alohida ko‘rib chiqadi. Shu sababli Markaz qarori formasida yangi raqam, sana, tarkib, qaror asosi va yordam shakli kiritiladi.',
        'Nizomning 22-bandiga ko‘ra Markaz konsiliumi palliativ yordam shifokori, psixolog va ijtimoiy xodimdan iborat. Joriy formada tarkib matn bilan yoziladi; xodimlarning real qatnashuvi yoki elektron imzosi avtomatik tasdiqlanmaydi. Qaydni konsilium hujjati bilan solishtirish mas’ul xodim vazifasidir.',
        'Karta holati Konsiliumda, Vaqtincha to‘xtatilgan, Qabul rad etilgan yoki Qabul tasdiqlangan bo‘lib, joriy yo‘llanma yuborilgan bo‘lsa Markaz qarorini kiritish mumkin. Har yangi qaror tarixga qo‘shiladi. Oldingi qaror qabuldan keyingi yangi xulosaning o‘rnini bosmaydi.',
      ] },
      { title: 'Qabul qilish va xizmatni amalda boshlash', paragraphs: [
        'Nizomning 23-bandida manba muassasa tomonidan qo‘yilgan Z51.5 va yo‘llanma, kamida 15 PaPaS balli, Markazda xavfsiz yordam va tibbiy transportirovka imkoniyati birgalikda ko‘riladi. Joriy prototip Qabul qilishni saqlaganda yo‘llanma to‘liqligini yana tekshiradi; xavfsizlik kataklarini esa konsilium tasdig‘i asosidagina xodim belgilaydi.',
        'Qaror sanasi yo‘llanma sanasidan oldin yoki kelajakda bo‘lishi mumkin emas. Yangi qabul qarori sanasida 18 yoshga to‘lgan shaxsni qabul qilish bloklanadi. Keyin xizmatni boshlash sanasida ham yangi qabul yoshi tekshiriladi: 18 yoshga to‘lmasdan olingan qarorning o‘zi keyin cheksiz muddat qabul huquqi bermaydi.',
        'Qabul tasdiqlangan holati hali o‘rinni band qilmaydi, mobil tashrif yaratmaydi va xizmat ko‘rsatilganini anglatmaydi. Koordinator keyingi bosqichda qarordagi shaklga mos xizmatni ochadi: Statsionar bo‘limida o‘rin va muddat bilan, Mobil yordamda alohida uy bahosi, brigada va boshlash sanasi bilan.',
        'Statsionarda avval qabul qilingan bola 18 yoshga to‘lsa, 39-bandga ko‘ra konsilium belgilagan muddat davomida, eng ko‘pi bilan 21 yosh chegarasigacha yordamni davom ettirish alohida ko‘riladi. Bu istisno yangi 18–21 yoshli shaxsni qabul qilish emas. Vaqtinchalik yotishning 14/28 kunlik hisob talqini va terminal davomiylik tafsilotlari Statsionar qo‘llanmasida alohida berilgan.',
      ] },
      { title: 'O‘rin yo‘qligi va mobil shaklga yo‘naltirish', paragraphs: [
        'Nizomning 23-bandida tegishli mezonlar bajarilib, o‘rin bo‘lmaganda yoki yo‘llanmada mobil shakl ko‘rsatilganda vakil yoxud yaqin qarindosh roziligi bilan mobil yordam ko‘rsatilishi mumkinligi nazarda tutilgan. O‘rin yo‘q degan ma’lumot avtomatik klinik rad etish yoki avtomatik mobil qabul yaratmaydi.',
        'Konsilium mobil shaklni tanlasa qarorda Yordam shakli maydonini Mobil — uy sharoitida qilib, rozilik katagini va rozilik bergan shaxs, qarindoshlik, sanani to‘ldiring. Prototip mobil qabulda ham yordam xavfsizligi va transportirovka tasdiqlarini tekshiradi. Bu kataklar tibbiy baholashni hisoblamaydi, tayyor inson qarorini qayd etadi.',
        'Qaror mobil xizmatga mos bo‘lsa ham uy ehtiyoji bahosi yo‘q kartada xizmatni boshlash bloklanadi. Koordinator tegishli baholash natijasi va tashrif rejasini qayd etgach brigadani tanlab xizmatni ochadi. Rozilik maydoni esa elektron imzo yoki telefon orqali avtomatik tasdiqlash emas.',
      ] },
      { title: 'Vaqtincha to‘xtatish, asosli rad va 24-banddagi noaniqlik', paragraphs: [
        '24-banddagi boshqa tibbiy yordamga ehtiyoj holatlari Markaz yordamiga qabulni vaqtincha to‘xtatish, tegishli muassasaga yo‘naltirish va keyin qayta ko‘rish bilan yuritiladi. Prototipda Vaqtincha to‘xtatish va yo‘naltirish tanlanganda Qaror asosi, Keyingi davolash / kuzatuv muassasasi hamda Qayta ko‘rish sanasi kiritiladi. Vaqtincha to‘xtatilgan ish yakuniy rad hisoblanmaydi.',
        '24(a) matnida holat tavsifi bilan keltirilgan klinik holatlar o‘rtasida talqin talab qiladigan noaniqlik bor. Modul ushbu banddan avtomatik klinik saralash yoki kasalliklar tasnifini tuzmaydi. Masalani Markaz konsiliumi klinik hujjatlar va tegishli uslubiy aniqlashtirish bilan ko‘radi; forma xodimga o‘zi klinik mezon o‘ylab topishni taklif qilmaydi.',
        'Asosli rad etish alohida hujjatlangan inson qaroridir. Qaror asosiga nima sabab bo‘lganini yozing; keyingi kuzatuv muassasasi va sanasini tegishli bo‘lsa ko‘rsating. Yuborilmagan qoralama yoki yetishmagan ilova haqidagi texnik xabarni bu qaror bilan almashtirmang.',
        'Vaqtincha to‘xtatilgan yoki rad etilgan, lekin joriy yo‘llanmasi yuborilgan kartaga yangi Markaz qarori kiritish mumkin. Agar hujjatlar yangilanishi zarur bo‘lsa avval yo‘llanma tahrirlanadi, saqlanadi va qayta yuboriladi. Qayta ko‘rish sanasi yetib kelishi o‘zi avtomatik qabul yoki xizmat ochmaydi.',
      ] },
    ],
    steps: [
      { title: 'Konsilium navbatidagi ishni oching', actor: 'Markaz koordinatori', action: 'Konsilium sahifasidan tegishli kartani oching. Bola, vakil, holat va joriy yo‘llanma yuborilgan belgisini tekshiring.', result: 'Ko‘riladigan ish va yuborilgan hujjat aniq.', route: '/apps/palliative-care/consilium' },
      { title: 'Manba va Markaz bosqichlarini ajrating', actor: 'Markaz konsiliumi', action: 'Manba konsiliumi xulosasi raqami, tarkibi, Z51.5 va klinik marshrutini o‘qing. Markaz qarori uchun alohida xulosa tayyorlang; manba raqamini Markaz qarori o‘rnida qo‘ymang.', result: 'Ikki konsiliumning qaror va mas’uliyati ajratilgan.' },
      { title: 'Barcha kirish dalillarini ko‘rib chiqing', actor: 'Markaz konsiliumi', action: 'Eng so‘nggi PaPaS, 1-ilova ko‘rsatmasi, kasallik tarixidan ko‘chirma, tekshiruvlar va manba tasdiqlarini ko‘ring. Yetishmagan yoki yangilanishi kerak bo‘lgan hujjatni manba bilan aniqlashtiring.', result: 'Qaror uchun hujjatlar yetarliligi baholangan.' },
      { title: 'Yosh, xavfsizlik va yordam imkonini baholang', actor: 'Markaz konsiliumi', action: 'Yangi qabul yoshini qaror sanasida tekshiring. Markaz sharoitida yordam xavfsizligi, tibbiy transportirovka va boshqa muassasa yordami zaruratini shifokorlar ko‘rib chiqadi. 24(a) avtomatik talqin qilinmaydi.', result: 'Klinik baho konsilium tomonidan shakllantirilgan.' },
      { title: 'Qaror formasini oching', actor: 'Konsilium qarorini qayd etuvchi xodim', action: 'Kartadagi Baholash va yo‘llanma bo‘limida Markaz qarorini kiritish tugmasini bosing. Markaz konsiliumi qarori formasidagi tushuntirishni o‘qing.', result: 'Manba xulosasidan alohida qaror formasi ochilgan.' },
      { title: 'Qaror va xizmat shaklini tanlang', actor: 'Markaz konsiliumi va qayd etuvchi xodim', action: 'Hujjatga muvofiq Qabul qilish, Vaqtincha to‘xtatish va yo‘naltirish yoki Asosli rad etish kartasini tanlang. Ular mos ravishda yashil, amber va qizil rang bilan ajratilgan; qarorni matnli nomi bo‘yicha tekshiring. Yordam shaklini ham konsilium xulosasiga mos belgilang.', result: 'Natijaga tegishli shartli maydonlar ko‘rinadi.' },
      { title: 'Markaz qarori rekvizitlarini kiriting', actor: 'Konsilium qarorini qayd etuvchi xodim', action: 'Qaror raqami, sanasi, Markaz konsiliumi tarkibi va Qaror asosini to‘ldiring. Sana yo‘llanmadan oldin yoki kelajakda bo‘lmasin; asos bajarilgan klinik ko‘rik mazmunini ifodalasin.', result: 'Qarorning kim, qachon va nima asosda qabul qilingani aniq.' },
      { title: 'Qabul qilish shartlarini qayd eting', actor: 'Markaz konsiliumi', action: 'Qabul qilish tanlanganda faqat hujjatdagi tasdiq bo‘lsa xavfsiz yordam va transportirovka kataklarini belgilang. Mobil shaklda vakil/yaqin qarindosh roziligini ham belgilang va shaxs, qarindoshlik, sanani yozing.', result: 'Qabul uchun zarur inson tasdiqlari va mobil rozilik qayd etilgan.' },
      { title: 'To‘xtatish yoki rad etish yo‘lini aniqlashtiring', actor: 'Markaz konsiliumi', action: 'Vaqtincha to‘xtatishda boshqa muassasa va qaror sanasidan oldin bo‘lmagan qayta ko‘rish sanasini kiriting. Rad etishda aniq asos yozing, mavjud bo‘lsa keyingi kuzatuv muassasasi va sanasini qo‘shing.', result: 'Klinik qabul bo‘lmasa ham keyingi ish yo‘li tushunarli.' },
      { title: 'Qarorni qayd eting va holatni tekshiring', actor: 'Konsilium qarorini qayd etuvchi xodim', action: 'Tanlangan natijaga mos Qabulni tasdiqlash, Vaqtincha to‘xtatishni qayd etish yoki Rad etishni qayd etish tugmasini bosing. Xato bo‘lsa hujjat yoki tegishli maydonni tekshiring; tayyor inson xulosasisiz xavfsizlik belgisini qo‘ymang. Kartadagi yangi holat va Jarayon tarixini ko‘ring.', result: 'Qabul tasdiqlangan, Vaqtincha to‘xtatilgan yoki Qabul rad etilgan holati va tarixiy qaror mavjud.' },
      { title: 'Statsionar qarorda joylashtirishni tashkil qiling', actor: 'Markaz koordinatori', action: 'Statsionar shakl tasdiqlangan bo‘lsa Statsionar sahifasida tayyor bo‘sh o‘rin, qabul turi, sana va muddatni tegishli qaror asosida belgilang. O‘rin yo‘q bo‘lsa keyingi yo‘lni konsilium bilan kelishing.', result: 'Statsionar epizod alohida ochishga tayyor; qabul qarori o‘rinni o‘z-o‘zidan band qilmagan.', route: '/apps/palliative-care/inpatient' },
      { title: 'Mobil qarorda uy bahosi va brigadani tayyorlang', actor: 'Markaz koordinatori va mobil jamoa', action: 'Mobil shakl tasdiqlangan bo‘lsa alohida uy ehtiyoji bahosi, haftalik tashrif rejasi va brigadani belgilang. Mobil yordam sahifasida qarordagi shaklga mos epizodni boshlang; keyingi tashriflar alohida rejalashtiriladi.', result: 'Mobil xizmatni boshlashning amaliy shartlari bajarilgan; qaror tashrifni o‘z-o‘zidan yaratmagan.', route: '/apps/palliative-care/mobile' },
      { title: 'Qayta ko‘rishni yakunlang', actor: 'Markaz konsiliumi va koordinator', action: 'Vaqtincha to‘xtashdan keyin tashqi davolash natijalarini ko‘ring. Hujjat yangilansa yo‘llanmani qayta yuboring; aks holda yuborilgan joriy yo‘llanma bo‘yicha yangi Markaz qarorini qayd eting.', result: 'Avvalgi qaror saqlanib, qayta ko‘rish natijasi alohida qayd etilgan.', route: '/apps/palliative-care/consilium' },
    ],
    rules: [
      { tone: 'waiting', condition: 'Joriy yo‘llanma qoralama yoki yuborilmagan', action: 'Avval yo‘llanmani to‘ldirib Markaz konsiliumiga yuboring. Qaror kiritish bosqichini chetlab ochmang.', owner: 'Koordinator va yo‘llanma xodimi', basis: 'Prototip qaror oldidan yuborilgan yo‘llanma tekshiruvi.' },
      { tone: 'waiting', condition: 'Manba konsiliumi ijobiy xulosa bergan', action: 'Markaz konsiliumi o‘z tarkibi, raqami, sanasi va asosi bilan alohida qaror qabul qiladi.', owner: 'Markaz konsiliumi', basis: 'Nizom 20 va 22–23-bandlari.' },
      { tone: 'waiting', condition: 'Qabul qilish tanlangan va xavfsizlik tasdiqlari yo‘q', action: 'Qarorni klinik konsiliumga qaytaring. Prototipdagi kataklar hujjatdagi tayyor tasdiqni aks ettiradi.', owner: 'Markaz konsiliumi', basis: 'Nizom 23-bandi; prototip qabul tekshiruvi.' },
      { tone: 'waiting', condition: 'O‘rin yo‘q yoki mobil yordam taklif qilinmoqda', action: 'Mobil yo‘lni konsilium alohida ko‘rib chiqadi; mos qaror va vakil/yaqin qarindosh roziligini qayd eting. O‘rin yo‘qligi o‘zi klinik rad emas.', owner: 'Markaz konsiliumi va koordinator', basis: 'Nizom 23-bandining mobil yordam sharti.' },
      { tone: 'rejected', condition: 'Qaror sanasida yangi qabul qilinuvchi 18 yoshga to‘lgan', action: 'Yangi qabul tasdiqlanmaydi. Avvalgi statsionar davom ettirish holatini faqat mavjud epizodda alohida ko‘ring.', owner: 'Markaz konsiliumi', basis: 'Nizom 23 va 39-bandlari.' },
      { tone: 'waiting', condition: '24-band bo‘yicha boshqa tibbiy yordamga ehtiyoj bor', action: 'Inson xulosasiga ko‘ra vaqtincha to‘xtatish, tegishli muassasa va qayta ko‘rish sanasini qayd eting; buni yakuniy rad bilan aralashtirmang.', owner: 'Markaz konsiliumi', basis: 'Nizom 24-bandi.' },
      { tone: 'waiting', condition: '24(a) klinik ifodasini bir ma’noda talqin qilib bo‘lmayapti', action: 'Klinik konsilium va tegishli uslubiy aniqlashtirish orqali ko‘ring. Modul avtomatik tashxis yoki to‘xtatish mezoni bermaydi.', owner: 'Markaz konsiliumi', basis: 'Buyruq matnidagi aniqlashtirish talab qiladigan qism; avtomatlashtirilmagan.' },
      { tone: 'waiting', condition: 'Qayta ko‘rish sanasi yetib kelgan', action: 'Hujjatlarni qayta ko‘rib yangi qarorni qayd eting. Sana o‘zi qabulni yoki xizmat boshlanishini tasdiqlamaydi.', owner: 'Koordinator va Markaz konsiliumi', basis: '24-banddagi qayta ko‘rish jarayoni; prototip qo‘lda qaror yuritadi.' },
      { tone: 'waiting', condition: 'Qabul tasdiqlangan, lekin faol epizod yo‘q', action: 'Qarordagi xizmatga mos keyingi bosqichni yakunlang. Statsionar o‘rin yoki mobil baholash/brigada alohida tanlanadi.', owner: 'Markaz koordinatori', basis: 'Prototip qabul qarori va xizmat epizodini ajratadi.' },
    ],
    faq: [
      { question: 'Manba konsiliumi qarorini Markaz qarori sifatida ishlatsam bo‘ladimi?', answer: 'Bo‘lmaydi. Manba xulosasi yo‘llanma va Z51.5 ga asos bo‘ladi; Markaz konsiliumi o‘z ko‘rigi natijasini alohida raqam, sana, tarkib va asos bilan qayd etadi.' },
      { question: 'Qabul tasdiqlangan bo‘lsa bola Statsionarda yoki Mobil yordamda bo‘ladimi?', answer: 'Hali yo‘q. Tasdiqlashdan keyin tegishli xizmat sahifasida epizod alohida boshlanadi. Statsionar uchun tayyor bo‘sh o‘rin, mobil uchun alohida uy bahosi va brigada kabi shartlar tekshiriladi.' },
      { question: 'O‘rin bo‘lmasa darhol rad etishim kerakmi?', answer: 'O‘rin yetishmasligi klinik rad etish bilan teng emas. Konsilium mezon va rozilik bo‘yicha mobil yo‘lni ko‘rib chiqishi mumkin; qaror operator yoki dastur tomonidan avtomatik o‘zgartirilmaydi.' },
      { question: 'Vaqtincha to‘xtatilgan ishni qanday qayta ochaman?', answer: 'Joriy yo‘llanma yuborilgan bo‘lsa Markaz qarorini kiritish orqali qayta ko‘rish natijasini qo‘shing. Hujjat yangilanishi kerak bo‘lsa avval yo‘llanmani tahrirlab saqlang va qayta yuboring. Oldingi qaror tarixda qoladi.' },
      { question: '24(a) bo‘yicha tizim qaysi tashxisni to‘xtatadi?', answer: 'Joriy prototip bu noaniq bandga avtomatik tashxislar ro‘yxati yoki hisoblash qoidasini qo‘llamaydi. Klinika va uslubiy talqinni vakolatli konsilium aniqlashtiradi, tizim uning asosli xulosasini qayd etadi.' },
      { question: '18 yoshga to‘lgan bolaning davom ettirilishi shu formada rasmiylashtiriladimi?', answer: 'Yangi qabul qarori formasi bilan emas. Avvaldan faol statsionar epizod bo‘lsa davom ettirish konsilium qarori Statsionar bo‘limidagi muddat jarayonida yuritiladi; eng yuqori 21 yosh chegarasi yangi qabul yoshini oshirmaydi.' },
      { question: 'Mobil rozilik katagini belgilashning o‘zi yetarlimi?', answer: 'Yetarli emas. Rozilik bergan shaxs, qarindoshligi va sanasi maydonini ham to‘ldiring. Qayd real elektron imzo yoki avtomatik identifikatsiya hisoblanmaydi.' },
      { question: 'Yo‘llanma kamchiligi sababli Asosli rad etish yozamanmi?', answer: 'Yetishmagan rekvizit haqidagi texnik xabarni klinik rad bilan almashtirmang. Yo‘llanmani to‘ldirish yoki hujjatni aniqlashtirish kerak. Asosli rad etish konsiliumning hujjatlangan alohida qarori bo‘ladi.' },
      { question: 'Qabulni tasdiqlagandan so‘ng xizmat shaklini shunchaki almashtirsa bo‘ladimi?', answer: 'Xizmatni boshlash qarordagi shaklga mos bo‘lishi kerak. Faol xizmat hali ochilmagan bo‘lsa konsiliumning yangi asosli qarorini tegishli shakl bilan qayd etish mumkin. Xodim klinik qarorsiz xizmat turini almashtirmaydi.' },
    ],
    checklist: [
      'Joriy yo‘llanma yuborilgan va ko‘rilayotgan bolaniki ekanligi tekshirilgan.',
      'Manba konsiliumi va Markaz konsiliumi rekvizitlari alohida yuritilgan.',
      'Markaz tarkibida palliativ yordam shifokori, psixolog va ijtimoiy xodim qayd etilgan.',
      'Qaror raqami, hujjatga mos sana va aniq asos kiritilgan.',
      'Qabul qilishda eng so‘nggi PaPaS, Z51.5, ko‘rsatma va hujjatlar qayta tekshirilgan.',
      'Yangi qabul yoshi qaror sanasida mos; davom ettirish istisnosi bilan aralashtirilmagan.',
      'Yordam xavfsizligi va transportirovka tasdiqlari konsilium hujjatiga asoslangan.',
      'Mobil qarorda rozilik, shaxs, qarindoshlik va sana yozilgan.',
      'Vaqtincha to‘xtatishda sabab, keyingi muassasa va qayta ko‘rish sanasi bor.',
      '24(a) uchun avtomatik yoki taxminiy klinik mezon qo‘llanmagan.',
      'Saqlangandan so‘ng holat va Jarayon tarixidagi qaror ko‘rilgan.',
      'Qabul qaroridan keyingi o‘rin yoki mobil baholash/brigada ishi koordinatorga aniq.',
    ],
    fields: [
      field('Konsilium qarori', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Hujjatga mos uch natijadan biri tanlanadi.', 'Qabul qilish, Vaqtincha to‘xtatish va yo‘naltirish yoki Asosli rad etish. Tanlov qo‘shimcha maydonlarni o‘zgartiradi.', 'Vaqtincha to‘xtatish va yo‘naltirish — qayta ko‘rish ssenariysi.'),
      field('Yordam shakli', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Statsionar — xospis yoki Mobil — uy sharoitida tanlanadi.', 'Markaz belgilagan xizmat shakli. Keyingi faol epizod aynan qarordagi shaklga mos bo‘lishi kerak.', 'Mobil — uy sharoitida.'),
      field('Qaror raqami', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Majburiy.', 'Markaz qarorining alohida raqami; manba konsiliumi hujjatidan farqlanadi.', 'DEMO-MK-0042.'),
      field('Qaror sanasi', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Majburiy; yo‘llanma sanasidan oldin va kelajakda bo‘lmaydi.', 'Konsilium qaror qabul qilgan kun. Yangi qabulning 18 yosh chegarasi shu sanada tekshiriladi.', '04.09.2026 — yo‘llanma 03.09.2026 bo‘lgan to‘qima misol.'),
      field('Konsilium tarkibi', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Majburiy.', 'Markazning palliativ yordam shifokori, psixolog va ijtimoiy xodimi. Manba muassasa tarkibi bu yerga avtomatik ko‘chirilmaydi.', 'Palliativ yordam shifokori K. Sobirov, psixolog N. Hamidova, ijtimoiy xodim F. Saidova (namuna).'),
      field('Qaror asosi', 'Baholash va yo‘llanma → Markaz qarorini kiritish → Markaz konsiliumi qarori', 'Har uch natijada majburiy.', 'Ko‘rib chiqilgan hujjatlar, tanlangan natija va keyingi harakatning konsilium belgilagan sababi. 24(a) noaniqligi avtomatik tashxis bilan to‘ldirilmaydi.', 'Demo: boshqa muassasadagi davolashdan keyin yangilangan hujjatlar bilan qabulni qayta ko‘rish belgilandi.'),
      field('Konsilium Markaz sharoitida yordam xavfsizligini tasdiqlagan', 'Qabul qilish tanlanganda', 'Qabulni saqlash uchun belgilangan bo‘lishi kerak.', 'Konsiliumning klinik xavfsizlik haqidagi tayyor tasdig‘i. Operator tibbiy baholashni mustaqil amalga oshirmaydi.', 'Belgilangan — shartli Markaz konsiliumi xulosasi bo‘yicha.'),
      field('Konsilium tibbiy transportirovka imkonini tasdiqlagan', 'Qabul qilish tanlanganda', 'Qabulni saqlash uchun belgilangan bo‘lishi kerak.', 'Tibbiy transportirovka imkoniyati konsilium tomonidan ko‘rilganini qayd etadi; avtomobil bron qilinmaydi.', 'Belgilangan — demo hujjatda tasdiqlangan.'),
      field('Mobil yordamga vakil / yaqin qarindosh roziligi qayd etilgan', 'Qabul qilish tanlanganda', 'Mobil shaklda majburiy tasdiq; statsionar qarorda mobil rozilik sharti qo‘llanmaydi.', 'Mobil yordamga bildirilgan rozilik qaydi. Elektron imzo yoki vakil identifikatsiyasi avtomatik bajarilmaydi.', 'Belgilangan — demo vakilning mobil yordamga roziligi.'),
      field('Rozilik bergan shaxs, qarindoshligi va rozilik sanasi', 'Qabul qilish tanlanganda', 'Mobil shaklda bo‘sh bo‘lmaydi; statsionarda ixtiyoriy.', 'Rozilikni kim va qachon berganini bitta matn maydonida ochib beradi. Joriy prototip matnni alohida imzo xizmatida tekshirmaydi.', 'Saidova Dilnoza Olim qizi, onasi, 04.09.2026 — demo rozilik.'),
      field('Keyingi davolash / kuzatuv muassasasi', 'Vaqtincha to‘xtatish yoki Asosli rad etish tanlanganda', 'Vaqtincha to‘xtatishda majburiy; rad etishda tegishli bo‘lsa kiritiladi.', 'Keyingi tibbiy yordam yoki kuzatuv uchun yo‘naltiriladigan muassasa. Saqlash tashqi muassasaga avtomatik xabar yubormaydi.', 'Viloyat bolalar tibbiyot markazi, tegishli bo‘lim — namuna.'),
      field('Qayta ko‘rish sanasi', 'Vaqtincha to‘xtatish yoki Asosli rad etish tanlanganda', 'Vaqtincha to‘xtatishda majburiy va qaror sanasidan oldin bo‘lmaydi; rad etishda ixtiyoriy.', 'Qayta ko‘rish rejalashtirilgan kun. Shu sana yetishi avtomatik qabul qarori yaratmaydi.', '07.09.2026 — qaror 04.09.2026 bo‘lgan to‘qima misol.'),
      field('Qabulni tasdiqlash / Vaqtincha to‘xtatishni qayd etish / Rad etishni qayd etish', 'Markaz konsiliumi qarori → formaning pastki qismi', 'Tanlangan qarorga mos yakuniy tugma; barcha tegishli maydonlar tekshiriladi.', 'Tugma nomi va rangi tanlangan natijani bildiradi. Faqat shu amal qarorni tarixga yozadi; radio kartani tanlashning o‘zi yetarli emas.', 'Qabul qilish tanlanganda yashil Qabulni tasdiqlash tugmasi.'),
    ],
    troubleshooting: [
      { tone: 'waiting', problem: 'Avval to‘liq yo‘llanmani Markaz konsiliumiga yuboring.', reason: 'Joriy yo‘llanma yuborilmagan yoki karta qaror kiritish mumkin bo‘lgan holatda emas.', solution: 'Baholash va yo‘llanma bo‘limida joriy versiyani tekshiring. Tahrirdan keyin qoralama bo‘lib qolgan bo‘lsa tekshiruvni yakunlab qayta yuboring.' },
      { tone: 'waiting', problem: 'Konsilium raqami, tarkibi, asos va yo‘llanmadan keyingi haqiqiy qaror sanasi kerak.', reason: 'Majburiy qaror rekviziti bo‘sh yoki sana yo‘llanmadan oldin/kelajakda.', solution: 'Markaz hujjatidagi raqam, tarkib, asos va qaror sanasini kiriting. Manba konsiliumi sanasi bilan adashtirmang.' },
      { tone: 'waiting', problem: 'Vaqtincha to‘xtatishda boshqa tibbiyot muassasasi va qayta ko‘rish sanasi kerak.', reason: 'PAUSE natijasida keyingi muassasa yo‘q, sana haqiqiy emas yoki qarordan oldin.', solution: 'Konsilium belgilagan keyingi muassasa va qarordan oldin bo‘lmagan qayta ko‘rish sanasini to‘ldiring. Majburiy maydondan qochish uchun rad etishga almashtirmang.' },
      { tone: 'rejected', problem: '18 yoshga to‘lgan shaxs yangi qabul qilinmaydi.', reason: 'Qabul qilish qarori sanasida bola 18 yoki yuqori yoshda.', solution: 'Yangi qabul tasdiqlanmaydi. Hujjatdagi yoshni tekshiring; avvaldan statsionarda bo‘lgan ish mavjud bo‘lsa davom ettirishni faqat o‘sha faol epizodning tegishli jarayonida ko‘ring.' },
      { tone: 'waiting', problem: 'Xavfsiz yordam va transportirovka imkoniyatini konsilium tasdiqlashi kerak.', reason: 'Qabul qilishda yordam xavfsizligi yoki tibbiy transportirovka katagi tasdiqlanmagan.', solution: 'Markaz konsiliumi hujjatini tekshiring. Tasdiq mavjud bo‘lsa tegishli katakni belgilang; klinik qaror hali yo‘q bo‘lsa konsiliumga qayting.' },
      { tone: 'waiting', problem: 'Mobil yordam uchun vakil/yaqin qarindosh roziligi va F.I.Sh. kerak.', reason: 'Mobil qabulda rozilik katagi belgilanmagan yoki rozilik bergan shaxs maydoni bo‘sh.', solution: 'Rozilikni tegishli vakil/yaqin qarindosh bilan qayd eting, katakni belgilang va shaxs, qarindoshlik hamda sanani yozing.' },
      { tone: 'waiting', problem: 'Qabul qilishni saqlashda yo‘llanma yoki PaPaS xabarlari qaytdi.', reason: 'Qabul paytida hujjatlar qayta tekshiriladi; yangi baholash yoki tahrirdan keyin mezonlar mos kelmay qolgan bo‘lishi mumkin.', solution: 'Xabardagi aniq yo‘llanma bandini tekshiring. Yangilangan klinik hujjat kerak bo‘lsa manba bilan rasmiylashtirib, yo‘llanmani qayta yuboring va keyin Markaz qaroriga qayting.' },
      { tone: 'waiting', problem: 'Qabul tasdiqlangan, ammo xizmat boshlanmagan.', reason: 'Qaror va xizmat epizodi ikki alohida bosqich; o‘rin, uy bahosi yoki brigada hali belgilanmagan bo‘lishi mumkin.', solution: 'Qarordagi shaklga qarab Statsionar yoki Mobil yordam sahifasiga o‘ting. Tegishli xizmat shartlarini yakunlab epizodni boshlang; tasdiqni bajarilgan xizmat sifatida hisobotga kiritmang.' },
      { tone: 'waiting', problem: 'Xizmat shakli Markaz konsiliumi qaroriga mos bo‘lishi kerak.', reason: 'Xizmat boshlashda tanlangan shakl eng so‘nggi qabul qaroridan farq qiladi.', solution: 'Qarordagi shaklni tekshiring. Marshrut o‘zgargan bo‘lsa konsiliumning yangi hujjatli qarorini qayd eting; faqat forma tanlovini o‘zgartirish bilan qarorni almashtirmang.' },
      { tone: 'waiting', problem: 'Markaz qarorini kiritish tugmasi ko‘rinmayapti.', reason: 'Tugma yuborilgan joriy yo‘llanma va tegishli karta holatlarida ko‘rsatiladi; yangi qoralama, faol xizmat yoki oilaviy yordamda bu bosqich ochilmaydi.', solution: 'Karta holati va yo‘llanmaning yuborilgan belgisini tekshiring. Qoralama bo‘lsa yuborish jarayonini tugating; faol xizmat bo‘lsa o‘sha xizmatning operatsion amallarini ishlating.' },
    ],
    outcomes: [
      'Markazning manba konsiliumidan mustaqil qarori raqam, sana, tarkib va asos bilan tarixga qo‘shilgan.',
      'Qaror natijasi uch yo‘ldan biri: qabul tasdiqlangan, vaqtincha to‘xtatilgan yoki asosli rad etilgan.',
      'Mobil qabulda rozilik va shaxs rekvizitlari, vaqtincha to‘xtatishda keyingi muassasa va qayta ko‘rish sanasi mavjud.',
      '24(a) va boshqa klinik masalalar avtomatik mezon bilan hal qilinmagan; qaror inson xulosasiga asoslangan.',
      'Tasdiqlangan ishning keyingi bosqichi — alohida statsionar yoki mobil epizod — koordinatorga aniq.',
      'Qayta ko‘rish natijasi avvalgi qaror va hujjatlar tarixini saqlagan holda qayd etiladi.',
    ],
    relatedTopics: ['intake', 'referral', 'inpatient', 'mobile', 'care-plan', 'follow-up'],
    flows: [
      {
        id: 'detailed', title: 'Markaz konsiliumi: uch qaror va xizmatga o‘tish', description: 'Mustaqil Markaz ko‘rigi, hujjatlar va inson tasdiqlari, vaqtincha to‘xtatish, asosli rad, qabul va keyingi operatsion tayyorgarlik.',
        definition: `flowchart TD
  A["Koordinator: konsiliumdagi kartani ochish"] --> B{"Joriy yo‘llanma yuborilganmi?"}
  B -->|"Yo‘q"| C["Yo‘llanmani to‘ldirib qayta yuborish"]
  C --> B
  B -->|"Ha"| D["Markaz: manba xulosasi va hujjatlarni ko‘rish"]
  D --> E["Z51.5, PaPaS, 1-ilova va yoshni tekshirish"]
  E --> F["Konsilium: xavfsizlik va yordam imkonini baholash"]
  F --> G{"24-band bo‘yicha boshqa yordam zarurmi?"}
  G -->|"Inson xulosasiga ko‘ra ha"| H["Vaqtincha to‘xtatish va yo‘naltirish"]
  H --> I["Sabab, keyingi muassasa va qayta ko‘rish sanasi"]
  G -->|"Yo‘q yoki boshqa natija"| J{"Konsilium qanday xulosa berdi?"}
  J -->|"Asosli rad"| K["Rad sababi va mavjud kuzatuv yo‘lini yozish"]
  J -->|"Qabul qilish"| L["Qarordagi xizmat shaklini tanlash"]
  L --> M["Xavfsiz yordam va transportirovka tasdiqlari"]
  M --> N{"Mobil shakl tanlandimi?"}
  N -->|"Ha"| O["Vakil yoki yaqin qarindosh roziligi"]
  O --> P["Rozilik bergan shaxs, qarindoshlik va sana"]
  N -->|"Yo‘q"| Q["Markaz qarori raqami, sanasi, tarkibi va asosi"]
  P --> Q
  I --> Q
  K --> Q
  Q --> R{"Qaror rekvizitlari va natija shartlari mosmi?"}
  R -->|"Yo‘q"| S["Hujjatni aniqlashtirish; tasdiqni o‘ylab topmaslik"]
  S --> D
  R -->|"Ha"| T["Tanlangan qarorni qayd etish: tarixga qo‘shiladi"]
  T --> U{"Saqlangan qaror natijasi?"}
  U -->|"Vaqtincha to‘xtatish"| V["Vaqtincha to‘xtatilgan: tashqi yordam va qayta ko‘rish"]
  U -->|"Rad"| W["Qabul rad etilgan: asos va kuzatuv qaydi"]
  U -->|"Qabul"| X["Qabul tasdiqlangan: xizmat hali boshlanmagan"]
  X --> Y{"Qarordagi xizmat shakli?"}
  Y -->|"Statsionar"| Z["Koordinator: bo‘sh tayyor o‘rin va muddat"]
  Y -->|"Mobil"| AA["Uy ehtiyoji bahosi, tashrif rejasi va brigada"]
  Z --> AB["Shartlar bajarilgach xizmatni alohida boshlash"]
  AA --> AB
  V -->|"Yangi hujjatlar bilan"| D
  class A,L,M,O,P,Q,T,Z,AA,AB guide_action;
  class X guide_success;
  class K,W guide_rejected;
  class B,C,D,E,F,G,H,I,J,N,R,S,U,V,Y guide_waiting;`,
        walkthrough: [
          'Konsilium ishining kirish sharti — yuborilgan joriy yo‘llanma. Qoralama bo‘lsa avval to‘ldirish/yuborish sikli bajariladi; Markaz qarori bilan bu bosqich chetlab o‘tilmaydi.',
          'Markaz manba xulosasi, PaPaS, ko‘rsatma va yoshni o‘qiydi, yordam xavfsizligini inson ishtirokida baholaydi. 24-band bo‘yicha boshqa yordam zarurligi ham inson xulosasidir; sxema 24(a) uchun avtomatik klinik klassifikator bermaydi.',
          'Vaqtincha to‘xtatish tarmog‘ida sabab, keyingi muassasa va qayta ko‘rish sanasi tayyorlanadi. Asosli rad tarmog‘ida radning hujjatli sababi va mavjud kuzatuv yo‘li yoziladi.',
          'Qabul tarmog‘ida xizmat shakli va xavfsizlik tasdiqlari belgilanadi. Mobil tanlanganda rozilik bergan shaxs, qarindoshlik va sanaga olib boruvchi qo‘shimcha tarmoqdan o‘tiladi.',
          'Har uch natija Markaz qarori rekvizitlariga birlashadi. Tekshiruv o‘tmasa xulosa yoki hujjat aniqlashtiriladi; tasdiqlar taxmin bilan qo‘yilmaydi. Qabulni saqlashda yangi qabul yoshi va yo‘llanma mezonlari ham tekshiriladi.',
          'Tanlangan natijaga mos Qabulni tasdiqlash, Vaqtincha to‘xtatishni qayd etish yoki Rad etishni qayd etish tugmasi uchta alohida holatdan birini qayd etadi. Vaqtincha to‘xtatilgan yo‘l keyin yangi hujjatlar bilan Markaz ko‘rigiga qaytishi mumkin; sana kelgani o‘zi yangi qaror yaratmaydi.',
          'Qabul tasdiqlangan holat statsionar o‘rin/muddat yoki mobil uy bahosi/reja/brigada tayyorlashga o‘tadi. Faqat keyingi alohida amal faol epizodni boshlaydi.',
        ],
      },
      {
        id: 'exceptions', title: 'O‘rin kutish, yosh chegarasi va vaqtincha to‘xtashdan qayta ko‘rish', description: 'Qabulga to‘sqinlik qiladigan turli holatlarni bir xil radga aylantirmasdan ko‘rsatadi. Har bir o‘zgarish hujjatli konsilium qarori yoki tegishli xizmat bosqichida davom etadi.',
        definition: `flowchart TD
  A["Markaz ko‘rigida yoki qabuldan oldin masala chiqdi"] --> B{"Yangi qabul yoshi 18 yoki yuqorimi?"}
  B -->|"Ha"| C{"Avvaldan faol statsionar epizod bormi?"}
  C -->|"Yo‘q"| D["Yangi qabul tasdiqlanmaydi; hujjatli asos"]
  C -->|"Ha"| E["Statsionardagi alohida davom ettirish qarori"]
  E --> F["Konsilium muddati va 21 yosh chegarasi"]
  B -->|"Yo‘q"| G{"24-band bo‘yicha tashqi yordam kerakmi?"}
  G -->|"Konsilium ha dedi"| H["PAUSE: sabab, muassasa va qayta ko‘rish sanasi"]
  H --> I["Tashqi davolash va yangilangan hujjatlar"]
  I --> J{"Yo‘llanma yangilanishi kerakmi?"}
  J -->|"Ha"| K["Tahrirlash, saqlash va qayta yuborish"]
  J -->|"Yo‘q"| L["Yuborilgan joriy hujjatlar bilan qayta ko‘rish"]
  K --> L
  L --> M["Markaz: yangi alohida qaror; oldingi tarix qoladi"]
  G -->|"Yo‘q"| N{"Statsionar o‘rin mavjudmi?"}
  N -->|"Ha"| O["Qarordagi shakl bo‘yicha qabulni tashkil qilish"]
  N -->|"Yo‘q"| P["Konsilium: mobil yo‘lni ko‘rib chiqish"]
  P --> Q{"Mos qaror va vakil roziligi bormi?"}
  Q -->|"Yo‘q"| R["Koordinator: keyingi ishni kelishish; avtomatik rad yo‘q"]
  R -->|"Yangi imkoniyat yoki rozilik"| P
  Q -->|"Ha"| S["Mobil qarorni qayd etish"]
  S --> T["Alohida uy bahosi va brigada bilan xizmatga tayyorlash"]
  M -->|"Qabul tasdiqlansa"| O
  M -->|"Yana vaqtincha to‘xtatilsa"| H
  M -->|"Asosli rad bo‘lsa"| D
  class A,K,L,O,T guide_action;
  class S guide_success;
  class D guide_rejected;
  class B,C,E,F,G,H,I,J,M,N,P,Q,R guide_waiting;`,
        walkthrough: [
          'Yosh masalasida yangi qabul va avvaldan faol statsionar epizod birinchi navbatda ajratiladi. Avvalgi epizod yo‘q bo‘lsa 18 yoshdan keyin yangi qabul tasdiqlanmaydi; mavjud statsionarda esa alohida davom ettirish qarori va 21 yosh chegarasi ko‘riladi.',
          '24-band bo‘yicha boshqa tibbiy yordamga ehtiyojni konsilium belgilasa PAUSE tarmog‘i ochiladi. 24(a) noaniqligi bu sxemada ham avtomatik mezon emas; hujjatli inson xulosasi talab qilinadi.',
          'Tashqi yordamdan so‘ng hujjatlar ko‘riladi. Yo‘llanma yangilansa tahrirlash → saqlash → qayta yuborish sikli bajariladi. Yangilash kerak bo‘lmasa yuborilgan joriy hujjatlar bo‘yicha yangi Markaz qarori yoziladi. Yangi qaror qabulni tashkil qilish, yana vaqtincha to‘xtatish yoki asosli radga olib borishi mumkin; har birida oldingi tarix saqlanadi.',
          'O‘rin mavjud bo‘lsa qabulni qarordagi shaklga muvofiq tashkil qilishga o‘tiladi. O‘rin yo‘qligi avtomatik rad bo‘lmaydi; konsilium mobil yo‘l imkonini ko‘radi.',
          'Mobil yo‘l uchun mos klinik qaror va vakil yoki yaqin qarindosh roziligi kerak. Ular yo‘q bo‘lsa koordinator keyingi ishni kelishadi; imkoniyat yoki rozilik yangilanganda ko‘rib chiqish takrorlanadi.',
          'Mobil qaror qayd etilishi hali uy tashrifi boshlanishi emas. Alohida uy ehtiyoji bahosi, tashrif rejasi va brigada tayyorlanib, xizmat keyingi sahifada boshlanadi.',
        ],
      },
    ],
  },
}
