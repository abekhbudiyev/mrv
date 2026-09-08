# 316-son buyruq asosida «Bolalar palliativ yordami va xospis» modulini qo‘shish rejasi

Tayyorlangan sana: 2026-yil 8-sentabr.

Asos: Ijtimoiy himoya milliy agentligi direktorining 2026-yil 31-iyuldagi 316-son buyrug‘i, «Bolalar uchun xospis markazi to‘g‘risidagi vaqtinchalik nizomni tasdiqlash haqida».

Manba fayli: [316-son buyruq 31.07.2026.pdf](../public/guides/316-son-buyruq-31-07-2026.pdf). PDFning barcha 13 sahifasi vizual o‘rganildi: buyruq, 7 bob va 46 banddan iborat nizom, ikkita ilova hamda kelishish sahifasi. Quyida «PDF beti» fayldagi tartib raqamini anglatadi; nizomning bosma bet raqami bundan farq qiladi.

**Asosiy taklif:** mavjud NASP tizimiga bola va uning oilasi bo‘yicha yagona ish yuritadigan modul qo‘shish. Unda aniqlash, baholash, yo‘llanma, ikki bosqichdagi konsilium, statsionar yoki mobil yordam, jihozlar, chiqarish va keyingi kuzatuv o‘zaro bog‘lanadi.

Hujjatdagi topshiriqlar bu rejada tashkilotlar va xodimlarning xizmat jarayoniga qo‘yilgan talablar sifatida tahlil qilindi. Ushbu ish natijasi — ishlab chiqish rejasi; dastur kodi o‘zgartirilmadi.

## 1. Modulning chegarasi va mavjud tizimga munosabati

### 1.1. Uch turdagi talab

- **Buyruq talabi:** nizomda bevosita ko‘rsatilgan jarayon, ishtirokchi, mezon yoki muddat. Har bir muhim talabga band va PDF beti berildi.
- **Loyihaviy yechim:** shu talabni tizimda bajarish usuli — ekran, status, ma’lumot modeli, API oilasi yoki nazorat mexanizmi. Bular buyruqdagi tayyor texnik spetsifikatsiya emas.
- **Aniqlashtiriladigan masala:** hujjatda yo‘q yoki bir xil talqin qilib bo‘lmaydigan qoida. Bunday qoidani taxmin bilan avtomatik qarorga aylantirish mumkin emas.

### 1.2. Hudud va amal qilish davri

Buyruq imzolangan kundan kuchga kiradi. Nizom 2027-yil 31-dekabrgacha amal qiladi. Aniqlash va mobil yordam Samarqand, Jizzax, Qashqadaryo va Navoiy viloyatlarida yashash va turgan joyi bo‘yicha ro‘yxatdan o‘tgan bolalarni qamrab oladi. Markaz manzili: 100140, Samarqand viloyati, Samarqand tumani, Amir Temur ko‘chasi, 27-uy. Manba: buyruq 3-bandi; nizom 2, 7, 17, 26-bandlari, PDF 1–4 va 7-betlar.

**Loyihaviy yechim:** hududlar, markaz, xizmat shakllari, mezonlar va amal qilish davri versiyalanadigan ma’lumotnomada saqlanadi. Nizom muddati tugashi tarixiy ma’lumotni o‘chirmaydi yoki faol xizmatni avtomatik yopmaydi; keyingi huquqiy asosni kiritish va o‘tish tartibi alohida belgilanadi.

### 1.3. Checkout tekshiruvi

Tekshirilgan loyiha: `/Users/aswillback/Documents/Projects/nasp` (`/Users/aswillback/Documents/nasp` shu joyga olib boradi). Unda Vue 3, TypeScript, Vue Router, Pinia va Vite ishlatilgan.

| Qism | Hozir tasdiqlangan holat | Rejaga ta’siri |
|---|---|---|
| Umumiy qobiq, menyu, modul kartalari, sahifa marshrutlari | Frontendda mavjud | Yangi modul shu mexanizmga ulanadi |
| API qatlami | `src/core/services/api/client.ts` dagi `request()` hali «API service layer is not implemented yet.» xatosini chiqaradi | Backend va integratsiya alohida ish hajmi hisoblanadi |
| Umumiy fuqarolar, arizalar, hujjatlar va hisobotlar sahifalari | Placeholder ko‘rinishida | Ularni tayyor ishlaydigan servis deb rejalashtirmaslik kerak |
| PTPK va erta aralashuvdagi case/reja interfeyslari | Demo yoki lokal saqlashga asoslangan namunalar bor | UI tajribasidan foydalanish mumkin; ma’lumot va klinik qoidalar avtomatik ko‘chirilmaydi |
| Backend, real shaxs/tashkilot servislarining kontrakti | Ushbu checkoutda tasdiqlanmadi | Ish boshlanishida real NASP servislarining inventarizatsiyasi kerak |

Haqiqiy ishlab turgan NASP backendida shaxs, tashkilot, xodim, hujjat, murojaat yoki xabarnoma servisi mavjud bo‘lsa, yangi modul ulardan foydalanadi. Faqat yetishmaydigan imkoniyatlar qo‘shiladi. Mazkur reja alohida yangi axborot tizimini yaratishni nazarda tutmaydi.

## 2. Asosiy xizmat jarayoni

### 2.1. Aniqlash va dastlabki baholash

1. Qonuniy vakil oilaviy yoki markaziy tuman/shahar ko‘p tarmoqli poliklinikasiga murojaat qiladi. Bola, vakil, hudud va mas’ul oilaviy shifokor qayd etiladi. **17-band, PDF 4.**
2. Poliklinika uch ish kuni ichida tibbiy tekshiruv va PaPaS baholashini o‘tkazadi. Baholovchi — oilaviy shifokor yoki palliativ yordam bo‘yicha o‘qitilgan shifokor; zaruratda tor soha mutaxassislari jalb qilinadi. **18-band, PDF 4.**
3. Birinchi ilovadagi tibbiy ko‘rsatmalardan biri va PaPaS natijasi 15 yoki undan yuqori bo‘lsa, qonuniy vakil tanlagan vakolatli tibbiyot muassasasiga yo‘naltiriladi. 14 yoki undan past bo‘lsa, poliklinikada tibbiy kuzatuv va kasallik bo‘yicha davolash davom etadi. **19-band, PDF 4–5.**

**Tizim yechimi:** murojaat va baholash sanalari, mas’ul shifokor, ball va dalil hujjatlari, uch ish kunlik muddat, vakilning muassasa tanlovi. Past ball holati «xizmatdan uzil-kesil rad etildi» deb yopilmaydi; poliklinika kuzatuvi natijasi saqlanadi. Ball 15 yoki yuqori bo‘lib, ilovadagi ko‘rsatma tasdiqlanmasa, avtomatik yo‘llanma berilmaydi; shifokor ko‘rib chiqadigan holat sifatida ajratiladi.

### 2.2. Yo‘llanma beruvchi tibbiy konsilium

Vakolatli muassasalar: Respublika ixtisoslashtirilgan onkologiya va radiologiya ilmiy-amaliy tibbiyot markazi va filiallari; Bolalar gematologiyasi, onkologiyasi va klinik immunologiyasi markazi; Bolalar milliy tibbiyot markazi; viloyatlar ko‘p tarmoqli bolalar tibbiyot markazlari; davlat oliy tibbiy ta’lim muassasalari klinikalari. **19-band, PDF 4–5.**

Tanlangan muassasaning tibbiy konsiliumi tibbiy hujjatlarni ko‘radi, asos bo‘lganda XKT-10 bo‘yicha Z51.5 tashxisini qo‘yadi, klinik marshrutni belgilaydi va «E-palliative» orqali 2-ilova shaklida yo‘llanma beradi. Tekshiruv va PaPaS natijalari birga taqdim etiladi. **20-band, PDF 5.**

Yo‘llanmada mobil yoki statsionar shakl, mobil xizmatda zarur jihozlar ko‘rsatiladi. Kasallik tarixidan ko‘chirma majburiy. Texnik nosozlikda tegishli tibbiyot muassasasi yozma yo‘llanma rasmiylashtirishi mumkin. **21-band, PDF 5.**

**Tizim yechimi:** tashqi yo‘llanmani qabul qilish, shaklning to‘liqligini tekshirish, tibbiy hujjatlarni bog‘lash, yozma yo‘llanmani manbasi va nosozlik sababi bilan ro‘yxatdan o‘tkazish. Qog‘oz yo‘llanma raqami va berilgan sanasi saqlanadi; keyinchalik elektron nusxa kelganda yangi ish ochilmaydi, dublikatlar solishtiriladi. Tibbiy konsiliumning qarori tizim tomonidan yaratilmaydi.

### 2.3. Markaz konsiliumi va qabul

Markazning multidissiplinar konsiliumi palliativ yordam shifokori, psixolog va ijtimoiy xodimdan tuziladi. Bu yo‘llanma bergan muassasadagi konsiliumdan alohida qaror bosqichidir. **22-band, PDF 5.**

Qabulda birgalikda tekshiriladigan shartlar: vakolatli muassasa tomonidan qo‘yilgan Z51.5 tashxisi va yo‘llanma; PaPaS kamida 15 ball; Markazda xavfsiz yordam ko‘rsatish va tibbiy transportirovka imkoniyati. Yakuniy qarorni konsilium qabul qiladi. **23-band, PDF 5–6.**

| Holat | Nizomdagi yo‘nalish | Tizimda saqlanadigan natija |
|---|---|---|
| Qabul mezonlari bajarilgan | Konsilium qabul to‘g‘risida qaror qiladi | Qaror, asos, xizmat shakli, boshlanish va rejalashtirilgan muddat |
| Z51.5/yo‘llanma yoki ball mezoni bajarilmagan | Markazga qabul rad etiladi | Alohida asosli qaror; mavjud davolash/kuzatuv yo‘nalishi saqlanadi |
| Yangi qabulda shaxs 18 yoshga to‘lgan | Markazga qabul rad etiladi | Yosh qaysi sanaga hisoblangani va qaror asosi |
| 23-bandning «a» va «b» mezonlari bajarilgan, o‘rin yo‘q yoki yo‘llanmada mobil shakl belgilangan | Vakil yoki boshqa yaqin qarindosh roziligi bilan mobil yordamga yo‘naltirilishi mumkin | Rozilik bergan shaxs, qarindoshlik, sana va konsilium marshruti; avtomatik yo‘naltirish bo‘lmaydi |
| 24-band bo‘yicha boshqa tibbiy yordam zarur | Qabul vaqtincha to‘xtatiladi, tegishli muassasaga yo‘naltiriladi; holat bartaraf etilgach qayta ko‘riladi | «Vaqtincha to‘xtatilgan» natijasi, tashqi yo‘nalish va qayta ko‘rish; yakuniy rad etishdan farqlanadi |

**Muhim ochiq masala:** 24-band «a» kichik bandida intensiv terapiya talab etmaydigan, barqaror va o‘tkir og‘irlashuv belgisi bo‘lmagan holat yozilgan, keyingi ro‘yxatda esa o‘tkir nafas buzilishi, gemodinamik beqarorlik va faol qon ketishi sanalgan. Ushbu ichki nomuvofiqlik vakolatli klinik/uslubiy mas’ul tomonidan aniqlashtirilishi kerak. Tasdiqlanmaguncha bu kichik band asosida avtomatik qabul yoki rad etish qoidasi yozilmaydi. **PDF 6.**

24-bandning boshqa kichik bandlari invaziv sun’iy o‘pka ventilyatsiyasi, hayotiy muhim funksiyalarni ekstrakorporal qo‘llab-quvvatlash yoki boshqa yuqori texnologiyali intensiv terapiyaga ehtiyojni; yuqumli kasalliklar statsionarida davolanishni talab qiluvchi faol infeksiyani; boshqa tibbiy yordamga muhtojlikni qamrab oladi. Bu holatlar shifokor xulosasi bilan alohida sabab sifatida qayd etiladi; tashqi davolashdan keyin Markaz konsiliumi qayta ko‘radi.

### 2.4. Statsionar yordam

- Vaqtinchalik joylashtirish bir kalendar yil davomida ko‘pi bilan 14 kungacha. Konsilium qarori bilan uzaytirish mumkin; umumiy qolish muddati 28 kundan oshmasligi ko‘rsatilgan. **25-band, PDF 6–7.**
- Hayotining oxirgi olti oyini yashayotgani kutilayotgan holatda muddatsiz qabul nazarda tutilgan. Bu klinik xulosa asosida alohida joylashtirish turi bo‘ladi; tizim olti oylik avtomatik chiqarish sanasini qo‘ymaydi. **25-band.**
- Statsionar yordam vaqtida 18 yoshga to‘lgan bolaga konsilium belgilagan muddatgacha, eng ko‘pi bilan 21 yoshgacha yordam davom ettiriladi. Bu yangi qabul yoshini 21 ga oshirmaydi. **23 va 39-bandlar, PDF 6, 8–9.**

**Tizim yechimi:** o‘rinlar va haqiqiy bandlik; qabul/chiqish sanalari; bola bo‘yicha yil ichidagi jami yotish kunlari; vaqtinchalik, uzaytirilgan va muddatsiz epizodlar; uzaytirish qarori; hamrohlar va ularning bo‘lish davri; xizmat va parvarish qaydlari.

14 kunlik yillik hisob hamda 28 kunlik umumiy limit saqlanadi. 28 kunning aynan yillik jami yoki alohida uzaytirilgan joylashtirishga qo‘llanishi, kirish/chiqish kunini sanash va yil almashish qoidasi ishchi tartibda aniqlashtiriladi. Tasdiqlangan qoidagacha yangi epizod yaratib limitni chetlab o‘tishga yo‘l berilmaydi; xizmat avtomatik uzilmaydi, konsilium ko‘rigiga chiqariladi.

### 2.5. Mobil yordam

Mobil brigada tarkibi: palliativ yordam shifokori, psixolog, ijtimoiy xodim va hamshira. Ikki maxsus jihozlangan avtomobil ajratiladi; qo‘shimcha brigadalar tegishli kelishuv bilan tashkil etilishi mumkin. Xizmat uyda va masofadan maslahat shaklida ko‘rsatiladi. **26–28-bandlar, PDF 7.**

Brigada bola va oilani kompleks baholaydi, individual yordam rejasini tuzadi, og‘riq va simptomlarni kuzatadi, parvarish bo‘yicha maslahat beradi, psixologik va ijtimoiy yordamni tashkil qiladi, uyda reabilitatsiya va zarur texnik jihozlar bilan ta’minlash choralarini ko‘radi. **29-band.**

| Uyda yordamga muhtojlik bahosi | Haftalik uyga tashriflar |
|---|---:|
| 15–20 ball | 1 marta |
| 21–24 ball | 2 marta |
| 25 va undan yuqori ball | 3 marta |

Baholash JSST uslubiyoti asosida o‘tkaziladi. Konsilium sog‘liq holatiga qarab tashriflar sonini o‘zgartirishi mumkin. **30–31-bandlar, PDF 7.**

**Tizim yechimi:** tasdiqlangan baholash natijasidan haftalik tashrif rejasini taklif qilish; konsilium o‘zgartirishining sababi va tarixini saqlash; brigada, avtomobil va vaqtni taqsimlash; tashrif natijasi; masofaviy maslahatni alohida qayd etish. Telefon maslahati o‘z-o‘zidan uyga tashrif o‘rnini bosgan deb hisoblanmaydi.

Bosh hamshira avtomobil yoki xodim telefonidagi GPS orqali tashrif vaqti, yo‘nalishlar va brigada ishini real vaqtda muvofiqlashtiradi. Shu sababli to‘liq joriy etish tarkibiga dispetcher xaritasi, chaqiruv taqsimoti va real GPS integratsiyasi kiradi. Qurilma aloqa holati va oxirgi signal vaqti ko‘rinadi; GPS yo‘qligi avtomatik ravishda «xizmat bo‘lmagan» deb talqin qilinmaydi. Qurilma/provayder, fon rejimida ishlash va uzilgan aloqadan qayta sinxronlash texnik pilotda tekshiriladi. **32-band, PDF 8.**

### 2.6. Jihoz, chiqarish va keyingi yordam

- Zarur jihoz Markaz bilan qonuniy vakil o‘rtasidagi shartnoma asosida tekin foydalanishga beriladi. **36-band, PDF 8.** Tizimda ehtiyoj, jihoz birligi, shartnoma va berish qaydi bog‘lanadi. Inventar/seriya raqami, holat, qaytarish va ta’mir tarixi — hisobni tashkil etish uchun loyihaviy qo‘shimcha; ularning aniq shakli va muddati buyruqda berilmagan.
- Statsionardan chiqish yoki mobil yordam tugagach bola oilaviy shifokor nazoratiga o‘tadi; shifokor brigada bilan kuzatuv va zarur qayta yo‘llashni ta’minlaydi. **34-band, PDF 8.** Topshirish, qabul qilgan shifokor va kuzatuv natijasi qayd etiladi; qayta murojaat oldingi ish bilan bog‘lanadi.
- Markazdagi vafot holatida o‘lim epikrizi rasmiylashtiriladi va chiqarish amalga oshiriladi. Vakil o‘lim sababiga e’tiroz bildirsa, Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining Patologoanatomiya va murdalarni saqlash bo‘limiga yo‘naltirish qayd etiladi. **40-band, PDF 9.**
- Mobil yordam bolaga hayotining so‘nggi kunlarigacha, uning vafotidan keyin esa oilaga, jumladan psixologik qo‘llab-quvvatlash uch oygacha davom etadi. Bola bo‘yicha klinik epizod yopilishi oilaning yordam rejasini avtomatik yopmaydi. **33-band, PDF 8.**

## 3. Foydalanuvchilar va asosiy ekranlar

### 3.1. Rollar

| Rol | Asosiy ish |
|---|---|
| Poliklinika / oilaviy shifokor | Murojaat, dastlabki tekshiruv, PaPaS natijasi, kuzatuv va qayta yo‘naltirish |
| Yo‘llanma beruvchi muassasa konsiliumi, shifokori, bosh shifokori/o‘rinbosari | Klinik xulosa, yo‘llanma va undagi tasdiqlar |
| Markaz registratori yoki mas’ul qabul xodimi | Kelgan yo‘llanma va hujjatlar to‘liqligi, yozma yo‘llanma qaydi; bu operatsion rol loyihaviy taklif |
| Markaz konsiliumi | Qabul, vaqtincha to‘xtatish, rad etish, shaklni belgilash, uzaytirish va tashrif sonini o‘zgartirish |
| Mobil brigada a’zolari | Individual reja, uyga tashrif, maslahat va o‘z yo‘nalishi bo‘yicha xizmat natijalari |
| Bosh hamshira | Brigada/avtomobil taqsimoti, chaqiruvlar, jadval va GPS monitoring |
| Jihozlar uchun mas’ul xodim | Jihoz hisobi, shartnoma, berish va qaytarish; ichki rol nomi aniqlashtiriladi |
| Bosh shifokor va bo‘lim boshlig‘i | Faoliyat, istisnolar va davriy hisobotlar |
| Agentlik va Ijtimoiy inspeksiya | Vakolat doirasidagi monitoring va nazorat |

Qonuniy vakilning alohida shaxsiy kabineti buyruqda talab qilinmagan. Dastlab uning murojaati, tanlovi, roziligi va imzolanadigan hujjatlari xodim yoki mavjud tashqi kanal orqali qayd etiladi. Tashqi tibbiyot xodimlari aynan NASPga kirishi yoki ma’lumot E-palliative orqali kelishi integratsiya chegarasiga bog‘liq.

### 3.2. Yetti asosiy bo‘lim

| Bo‘lim | Tarkib |
|---|---|
| 1. Bosh sahifa | Kutilayotgan ishlar, uch ish kunlik muddat, konsilium ko‘rigi, band o‘rinlar, bugungi tashriflar, bajarilmagan reja |
| 2. Bolalar va yo‘llanmalar | Umumiy reyestr; bola/oila kartasi; murojaat; baholash; elektron va yozma yo‘llanma; hujjatlar; tarix |
| 3. Konsilium | Kelgan ishlar; mezonlar; ikki turdagi xulosalar; qabul, vaqtincha to‘xtatish, rad etish va uzaytirish |
| 4. Statsionar | O‘rinlar, joylashtirish, yotish kunlari, hamrohlar, individual parvarish va chiqarish |
| 5. Mobil yordam | Individual reja, brigada va transport, haftalik jadval, bosh hamshira xaritasi, chaqiruv/tashrif/maslahat |
| 6. Jihozlar | Ehtiyojlar, mavjud birliklar, shartnomalar, berilgan va qaytarilgan jihozlar |
| 7. Hisobotlar | Oylik, choraklik, yillik natijalar; muddatlar, hududlar, xizmat shakllari va resurslar |

Qonuniy vakil, baholashlar, klinik ma’lumotlar, individual reja, oilaga keyingi yordam, shikoyatlar va hujjatlar bola kartasining ichki varaqlarida ochiladi. Ma’lumotnomalar va rol sozlamalari umumiy ma’muriy sozlamalarga ulanadi.

## 4. Ma’lumotlar va integratsiya modeli

### 4.1. Umumiy obyektlar

Har bir viloyat, tashxis guruhi yoki xizmat shakli uchun alohida jadval va API ochilmaydi. Shaxs, tashkilot, hudud, xodim va fayl ma’lumotlari mavjud umumiy servisga identifikator orqali bog‘lanadi; referens qiymatlar `id` va `code` bilan yuritiladi.

| Obyekt | Vazifasi |
|---|---|
| Bola/oila ishi — `case` | Bola, qonuniy vakil, hudud, mas’ul tashkilot; bir nechta murojaat va xizmat epizodining umumiy tarixi |
| Murojaat va yo‘llanma — `referral` | Manba, raqam/sana, yuboruvchi/qabul qiluvchi, xizmat shakli, klinik asos, ilovalar va tasdiqlar |
| Baholash — `assessment` | Baholash turi, metodika versiyasi, sana, baholovchi, javoblar mavjud bo‘lsa ular, jami ball va asl hujjat |
| Konsilium qarori — `decision` | Yo‘llanma beruvchi yoki Markaz konsiliumi turi, tarkib, xulosa, sana/raqam, asos va muddat |
| Xizmat epizodi — `service_episode` | Statsionar yoki mobil yordamning boshlanishi, yakuni, mas’ullari, tegishli qaror va haqiqiy natija |
| Individual reja va bajarilish — `care_plan`, `service_event` | Bola/oila ehtiyoji, xizmat turi, ijrochi, rejalashtirilgan muddat, tashrif/maslahat va natija |
| Resurs va ajratish — `resource`, `allocation` | O‘rin, brigada, avtomobil yoki jihoz; bir resursning bir vaqtda ikki marta ajratilishini oldini olish |
| Hujjat va kelishuv — umumiy document xizmati bilan aloqa | Yo‘llanma, xulosa, rozilik, shartnoma, ko‘chirma, epikriz va boshqa hujjatlar |
| Kuzatuv / oilaga yordam | Oilaviy shifokorga topshirish, qayta yo‘naltirish, vafotdan keyingi oilaviy reja va yakun |

**Ikki baholash ajratiladi:** qabul oldi PaPaS bahosi va 30–31-bandlardagi uyda yordamga muhtojlik bahosi. Ularning aynan bir xil usul ekanligi ushbu PDF bilan tasdiqlanmagan. Tasdiqlangan metodika olinmaguncha savollar yoki ball hisoblash formulasi taxmin qilinmaydi; shifokor tasdiqlagan natija, sana va hujjat qayd etiladi.

**Statuslar — loyihaviy taklif:** yo‘llanmada qoralama, yuborilgan, qabul qilingan, aniqlashtirish kutilmoqda; qarorda qabul, vaqtincha to‘xtatish, asosli rad etish; epizodda rejalashtirilgan, faol, tugagan. Oilaga yordamning holati alohida saqlanadi. Bitta «yopildi» statusi barcha jarayonni yashirmaydi. Texnik hujjat kamchiligi klinik rad etish sifatida yozilmaydi.

### 4.2. 2-ilova bo‘yicha yo‘llanmaning to‘liq maydonlari

| Blok | Maydonlar |
|---|---|
| Rekvizitlar | Yo‘llanma beruvchi tibbiyot muassasasi; yo‘llanma raqami; rasmiylashtirish sanasi |
| Bola | F.I.Sh.; tug‘ilgan sana; jins; JShShIR; tug‘ilganlik guvohnomasi yoki pasport/ID; seriya/raqam; yashash manzili |
| Qonuniy vakil | F.I.Sh.; qarindoshligi; telefon |
| Klinik ma’lumot | Asosiy tashxis va XKT-10 kodi; asoratlar va hamroh kasalliklar; PaPaS balli va baholangan sana |
| Konsilium | Xulosa raqami va sanasi; palliativ yordamga muvofiqligi — ha/yo‘q |
| Simptom/ehtiyojlar | Og‘riq; hansirash; tirishish; yutish/oziqlanish muammosi; ko‘ngil aynishi/qusish; psixologik/ijtimoiy yordam; boshqa |
| Marshrut | Mobil yoki statsionar shakl; yo‘naltirilayotgan xizmat/muassasa; sabab va birinchi navbatdagi vazifalar |
| Mobil xizmat jihozlari | Kislorod konsentratori; aspirator; nebulayzer; pulsoksimetr; funksional karavot; antidekubit matras; nogironlik aravachasi; oziqlantirish/infuzion pompa; boshqa |
| Ilovalar | Kasallik tarixidan ko‘chirma va varaqlar soni — majburiy; tekshiruv natijalari va varaqlar soni; 20-band bo‘yicha PaPaS natijasi ham biriktiriladi |
| Tasdiqlash | Yo‘naltiruvchi shifokor F.I.Sh., lavozimi, telefoni, imzosi va sana; bosh shifokor/o‘rinbosar F.I.Sh. va imzosi; muhr o‘rni |

Elektron hujjat mazmuni shu shaklni to‘liq qoplaydi. Imzo texnologiyasi, elektron raqamlash va tasdiqlash ketma-ketligi E-palliative egasi bilan aniqlashtiriladi. Ikki checkbox mavjudligi bir vaqtda ikki xizmat shakli tanlanishini avtomatik anglatmaydi; xizmatlar o‘rtasida o‘tish alohida tarix bilan yuritiladi.

### 4.3. 1-ilova ma’lumotnomasi

To‘rt guruh va yettita asosiy band mavjud:

1. Asab tizimining og‘ir, surunkali, progressiyalanuvchi yoki qaytmas shikastlanish bilan kechuvchi kasalliklari.
2. Progressiyalanuvchi og‘ir irsiy va orttirilgan nerv-mushak kasalliklari.
3. Hayotni cheklovchi yoki uning davomiyligini qisqartiruvchi og‘ir genetik, irsiy, metabolik va orfan kasalliklar.
4. Onkologik/onkogematologik guruh ichidagi to‘rt band: palliativ ko‘rsatmasi bor barcha lokalizatsiyadagi yomon sifatli o‘smalar; davolash prognozi manfiy qaytalanuvchi o‘smalar; palliativ ko‘rsatmasi bor miyelodisplastik/miyeloproliferativ kasalliklar; boshqa davolab bo‘lmaydigan onkologik/onkogematologik kasalliklar.

Ma’lumotnomaga ilovadagi barcha quyi kasallik nomlari va ularning «og‘ir», «progressiyalanuvchi», «palliativ ko‘rsatmasi mavjud» shartlari saqlangan holda kiritiladi. Ilovada tayyor XKT-10 kodlar xaritasi berilmagan. Kodlarga moslashtirish klinik mas’ul tasdig‘idan o‘tadi; tashxis guruhini tanlashning o‘zi avtomatik qabulga asos bo‘lmaydi. **PDF 10–11.**

### 4.4. Integratsiyalar

| Integratsiya | Rejalashtiriladigan ish | Tayyorlik holati |
|---|---|---|
| E-palliative | 2-ilovadagi yo‘llanma va fayllarni olish; tashqi ID bo‘yicha takrorlarni aniqlash; qabul natijasini qaytarish imkonini kelishish | Nizom yo‘llanma berishni belgilaydi; API, egasi va qaytariladigan statuslar kontrakti taqdim etilmagan |
| Shaxs, vakillik, manzil | JShShIR bo‘yicha mavjud ma’lumotni olish va vakilga bog‘lash; qo‘lda tasdiqlash yo‘li | Real NASP servislarida tekshiriladi |
| Tashkilot, xodim va hudud | Vakolatli muassasalar, konsilium/brigada a’zolari va xizmat hududlari | Real katalog va kirish mexanizmi tekshiriladi |
| Fayl/hujjat va imzo | Ilovalarni saqlash, yo‘llanma va xulosani tasdiqlash, hujjat versiyalari | Mavjud servisdan foydalanish yoki yetishmagan qismini qo‘shish |
| GPS | Avtomobil yoki xizmat telefoni signalini olish, dispetcher xaritasi va tashrif vaqtini bog‘lash | Qurilma/provayder tanlovi va texnik pilot kerak |
| Murojaatlar va xabarnomalar | Shikoyatni bola ishiga bog‘lash; topshiriq va muddat xabarlari | Bor bo‘lsa umumiy servislarga ulash |
| Tibbiy, dorixona, ombor va xo‘jalik hisobi | Klinik qayd, maxsus dori jurnali, jihoz, ovqatlanish va moliyaviy hujjatlarga havola/almashinuv | Alohida inventarizatsiya; ushbu checkout ularning mavjudligini isbotlamaydi |

APIlar umumiy `cases`, `referrals`, `assessments`, `decisions`, `service-episodes`, `care-plans`, `visits`, `resources` va `reports` oilalari orqali loyihalanadi. Yakuniy endpoint va maydon kontrakti keyingi texnik topshiriqda belgilanadi.

## 5. Qo‘shimcha vazifalar qanday qoplanadi

Quyidagi talablar asosiy qabul jarayonidan tashqarida, ammo to‘liq faoliyat rejasida saqlanadi. Ular uchun mavjud tizimga ulanish yoki mas’ul operatsion jarayon ko‘rsatilishi kerak.

| Talab | Qoplash rejasi |
|---|---|
| Og‘riqni boshqarish, maxsus ovqatlanish, parvarish, oila a’zolarini o‘qitish, ijtimoiy/psixologik xizmat — 8–9, 29-bandlar | Individual rejada xizmat turlari va ijro qaydlari; klinik tayinlov vakolatli tibbiyot xodimida |
| Tunu-kun ishonch telefoni — 9-band | Chaqiruvni ro‘yxatga olish, mas’ulga biriktirish va bola ishiga bog‘lash; aloqa liniyasi va navbatchilik — tashkiliy ta’minot, telefoniya integratsiyasi keyingi bosqichda |
| Dori ta’minoti, retsept, saqlash/berish/hisobdan chiqarishning maxsus jurnallari va dalolatnomalari — 11–13-bandlar | Mavjud tasdiqlangan dorixona/tibbiy hisobga ulash yoki zarur jurnal/hujjat hisobini alohida kelishish. Oddiy «xizmat ko‘rsatildi» qaydi maxsus hisob o‘rnini bosmaydi; elektron yozuvning rasmiy jurnal o‘rnini bosishi vakolatli tartibga bog‘liq |
| SSV klinik protokollari va nazorati — 14-band | Qo‘llanilgan protokol nomi/versiyasi va tibbiy hujjatga havola; tizim protokol yoki davolashni o‘zi tuzmaydi |
| Xodimlarni o‘qitish, stajirovka, psixologik yordam — 9, 15-bandlar | Mavjud xodimlar/o‘qitish hisobiga bog‘lash; zarur bo‘lsa o‘qish tadbiri va tasdiqlovchi hujjat reyestri |
| Qo‘shimcha to‘garak/kurs, volontyor/NNT/diniy tashkilot vakillari xizmatlari — 16-band | Ruxsat etilgan hamkor/tadbir, shartnoma va ishtirokni xizmat rejasiga bog‘lash; barchasini majburiy xizmatga aylantirmaslik |
| Xonalar xavfsizligi va sanitariya — 35-band | Ishga tushirishga tayyorlik bo‘yicha tashkiliy nazorat; alohida yangi inspeksiya moduli shart emas |
| Moliyalashtirish manbalari — 36-band | Budjet, Ijtimoiy himoya davlat jamg‘armasi, Davlat tibbiy sug‘urtasi jamg‘armasi, homiylik va boshqa ruxsat etilgan manbalar; moliyaviy hisobga bog‘lash |
| Bepul ovqatlanish — 37-band | Statsionar bola/vakil/oila a’zolarining haqiqiy bo‘lish davriga asoslangan ro‘yxat; xodimlar uchun ish vaqtida bir mahal ovqat hisobi alohida |
| Tasdiqlangan shtatlar va rahbariyat — 10, 38-bandlar | Mavjud tashkilot/xodim katalogi; lavozim va tayinlash hujjati; buyruqda berilmagan shtat sonini taxmin qilmaslik |
| Ichki tartib va shikoyatlar — 44–45-bandlar | Ichki tartib hujjatining versiyasi; mavjud murojaatlar tizimiga bog‘lash, ko‘rib chiqish tarixi. Shikoyat muddati ushbu buyruqdan chiqarilmaydi |

Sug‘urta tomonidan moliyalashtirish tartibi alohida belgilanadi. Ushbu buyruqda tarif, to‘lov formulasi, avtomatik kompensatsiya yoki billing algoritmi yo‘q; ular hozirgi modulga taxmin asosida qo‘shilmaydi.

## 6. Ishlab chiqish bosqichlari

### 6.1. Ish paketlari

| Bosqich | Ish | Yakuniy natija / o‘tish sharti |
|---|---|---|
| 1. Talablarni yakunlash | Markaz, SSV/poliklinika va NASP vakillari bilan jarayon; E-palliative chegarasi; 9-bo‘limdagi ochiq qoidalar; mavjud servislar inventari | Kelishilgan jarayon xaritasi, rol va ma’lumotlar ro‘yxati; noaniq klinik qoida taxmin bilan yopilmaydi |
| 2. Modul karkasi va kontrakt | Umumiy model, ma’lumotnomalar, statuslar, API kontrakti; yetti bo‘limning maketi; mavjud frontendga ulash | Ko‘rib chiqiladigan prototip va kelishilgan API; demo va haqiqiy ma’lumot aniq ajratiladi |
| 3. Yo‘llanma va statsionar | Murojaat/baholash, E-palliative/yozma yo‘llanma, ikki konsilium, o‘rinlar, muddat va chiqarish | Bitta bola bo‘yicha boshidan oxirigacha ishlaydigan statsionar ssenariy |
| 4. Mobil yordam va jihozlar | Individual reja, brigada/transport, tashriflar, real GPS, masofaviy maslahat, shartnoma va jihoz berish | Bosh hamshira va brigada ishtirokidagi amaliy ssenariy; uzilgan aloqa va qayta sinxronlash tekshirilgan |
| 5. Yakuniy jarayonlar va hisobot | Oilaviy shifokorga topshirish, qayta yo‘llash, vafot/epikriz/oilaga yordam; davriy hisobotlar; qo‘shimcha hisoblar bilan aloqa | Qabuldan keyingi hayot sikli ham qamrab olingan; hisobotlar manba yozuvlari bilan solishtirilgan |
| 6. Pilot va ishga tushirish | Markaz, kamida bitta yo‘llanma beruvchi muassasa va mobil brigada bilan pilot; xodimlarni o‘qitish; mavjud ishlarni ko‘chirish | Qabul mezonlari bajarilgan, faol bolalar/o‘rinlar/jihozlar boshlang‘ich qoldig‘i tekshirilgan, mas’ullar bilan ishga tushirish qarori |

Bosqichlar ketma-ketligi — taklif. Aniq kalendar muddat va ijrochilar soni backend, E-palliative, GPS va metodikalar tayyorligi aniqlangach baholanadi; faqat frontend checkoutiga qarab butun loyiha muddatini va’da qilish asosli emas. API kontrakti kelishilgach frontend va backend ishlari parallel yuritiladi.

### 6.2. Backend uchun oltita yirik vazifa

1. **Umumiy model va ma’lumotnomalar:** bola/oila ishi, vakolatli tashkilotlar, kasallik guruhlari, xizmat/resurs turlari, amal qilish versiyalari; mavjud shaxs/tashkilot servislariga ulanish.
2. **Yo‘llanma va baholash:** 2-ilova maydonlari, fayllar, tasdiqlar, uch ish kunlik muddat, elektron/yozma manba, E-palliative va dublikat nazorati.
3. **Konsilium va statsionar:** ikki turdagi qaror, sabablar, o‘rin bandligi, 14/28 kunlik hisob, muddatsiz qabul va 18 yoshga to‘lish istisnosi.
4. **Mobil xizmat va jihozlar:** individual reja, bahodan tashrif rejasi, brigada/avtomobil taqsimoti, GPS, tashrif natijalari, bepul foydalanish shartnomasi va jihoz harakati.
5. **Yakun va kuzatuv:** chiqarish, epikriz, oilaviy shifokorga topshirish, qayta yo‘llash, vafotga e’tiroz yo‘nalishi va oilaga uch oygacha yordam.
6. **Hisobot va boshqaruv:** oylik/choraklik/yillik hisobot, vazifa xabarlari, tashqi hisob tizimlari bilan bog‘lash, rol/tashkilot bo‘yicha ma’lumot doirasi va o‘zgarishlar tarixi.

### 6.3. Frontend uchun beshta yirik vazifa

1. **Modulni qobiqqa ulash:** modul kartasi, menyu, marshrutlar, huquqlar va umumiy dizayn; bosh sahifa va filtrlash.
2. **Bola/oila kartasi va yo‘llanma:** 2-ilova formasi, baholash, hujjatlar, tanlov/rozilik, elektron va yozma manbalar.
3. **Konsilium va statsionar:** qaror ish oynasi, mezonlar, o‘rinlar, muddat hisoblari, uzaytirish va chiqarish.
4. **Mobil ish joylari va jihozlar:** bosh hamshira jadvali/xaritasi, brigada uchun telefonda qulay tashrif oynasi, individual reja va jihoz shartnomasi.
5. **Kuzatuv va hisobot:** keyingi yordam, shikoyatga havola, davriy hisobot, ma’lumotnoma va qaror tarixini ko‘rish.

### 6.4. Birinchi ishga tushirish hajmi

Birinchi amaliy relizga bola/oila kartasi, to‘liq yo‘llanma, konsilium, statsionar va mobil epizodlar, individual reja, tashriflar/GPS, jihoz shartnomasi, chiqarish/kuzatuv va asosiy hisobot kiradi. Elektron yo‘llanma oqimi tasdiqlangan integratsiya orqali ishlaydi; 21-banddagi yozma yo‘llanma texnik nosozlik holati uchun saqlanadi. Integratsiya ishlab chiqilmaganini muntazam «texnik nosozlik» deb belgilash to‘liq joriy etish hisoblanmaydi.

Keyingi relizga avtomatik yo‘l optimallashtirish, telefoniya bilan chuqur integratsiya, vakil kabineti, kengaytirilgan boshqaruv tahlili va moliyaviy tizimlar bilan chuqur almashinuv qoldirilishi mumkin. Maxsus dori hisobi, klinik protokol, ishonch telefoni va ovqatlanish kabi amaldagi vazifalar shu sababli bekor bo‘lmaydi: ular uchun 5-bo‘limdagi mavjud rasmiy yoki tashkiliy ijro mexanizmi pilotgacha aniqlangan bo‘lishi kerak.

## 7. Joriy loyihaga texnik ulash

Taklif etiladigan modul katalogi: `src/features/palliative-care/`. Asosiy marshrut: `/apps/palliative-care`. Ichki sahifalar: `/cases`, `/consilium`, `/inpatient`, `/mobile`, `/equipment`, `/reports`.

| Fayl yoki qism | Keyingi ishlab chiqishdagi o‘zgarish |
|---|---|
| `src/features/palliative-care/` | `config.ts`, `types.ts`, sahifalar, komponentlar, API xizmatlari |
| `src/features/apps/registry/apps.ts` | Modul kartasi |
| `src/core/router/routes.ts` | Marshrutlar, modul nomi, breadcrumb va huquq metama’lumotlari |
| `src/layouts/app-layout/AppSidebar.vue` | Modulning ichki navigatsiyasi |
| `src/core/types/permissions.ts`, `src/core/constants/permissions.ts` | Modul va amallar uchun huquqlarni ulash |
| `src/core/guards/auth.guard.ts`, real kirish tizimi | Mavjud tekshiruvdan foydalanish, backendda ham vakolatni tekshirish |
| `src/core/services/api/client.ts` | Tasdiqlangan backend bilan ishlaydigan API qatlamini joriy etish |

1-ilova, PaPaS yoki qabul qoidalari PTPK modulidan faqat nomi o‘xshashligi uchun ko‘chirilmaydi. Umumiy UI komponentlardan qayta foydalaniladi; ushbu buyruqqa oid biznes qoidalar alohida versiyalanadi.

Tekshiruv paytida branch `codex/transport-benefits-vmq440` edi; marshrut, menyu, huquq va boshqa fayllarda oldindan o‘zgarishlar bor. Implementatsiya boshlanganda ularni saqlagan holda alohida ish chegarasi belgilanadi. Ushbu reja doirasida ular o‘zgartirilmadi.

## 8. Qabul qilish mezonlari va hisobotlar

### 8.1. Majburiy tekshiruv ssenariylari

| Ssenariy | Kutiladigan natija |
|---|---|
| Poliklinikada murojaat | Uch ish kunlik muddat tasdiqlangan ish kalendari bo‘yicha hisoblanadi; kechikish ko‘rinadi |
| PaPaS 14 va PaPaS 15 | 14 ball kuzatuvga; 15 ballning o‘zi qabul qilmaydi, tashxis/yo‘llanma va konsilium mezonlari ham tekshiriladi |
| Kasallik tarixidan ko‘chirmasiz yo‘llanma | To‘liq hujjat sifatida tasdiqlanmaydi; yetishmagan ilova aniq ko‘rsatiladi |
| Ikki konsilium | Yo‘llanma beruvchining xulosasi Markazning qabul qarorini almashtirmaydi |
| Yozma yo‘llanma, keyin elektron nusxa | Bir bola ishi bilan bog‘lanadi; ikki marta qabul yoki xizmat ochilmaydi |
| O‘rin yo‘q | O‘z-o‘zidan klinik rad etilmaydi; tegishli mezon va rozilik bilan mobil yo‘nalish konsiliumda ko‘riladi |
| 24-band holati | Vaqtincha to‘xtatish, tegishli tibbiyot muassasasiga yo‘naltirish va qayta ko‘rish saqlanadi; noaniq kichik band avtomatik hukm chiqarmaydi |
| Takroriy yotish va 14/28 kun chegarasi | Oldingi epizodlar hisobga olinadi; uzaytirish qarorsiz o‘zgarmaydi; tasdiqlangan kun hisoblash qoidasi qo‘llanadi |
| Muddatsiz qabul | Klinik asos saqlanadi; olti oylik avtomatik chiqarish sanasi yaratilmaydi |
| Yangi qabulda 18 yosh; statsionarda 18 yoshga to‘lish | Birinchi holat bilan davom ettirish istisnosi ajratiladi; davom ettirishda konsilium muddati va 21 yosh chegarasi nazorat qilinadi |
| Uy bahosi 20/21 va 24/25 | Mos ravishda 1/2 va 2/3 haftalik uy tashrifi; konsilium o‘zgartirishi alohida tarixga ega |
| GPS kechikishi yoki aloqa uzilishi | Oxirgi signal va aloqa holati ko‘rinadi; tashrif natijasi yo‘qolmaydi, qayta yuborishda takrorlanmaydi |
| Bitta o‘rin/jihoz/avtomobilga parallel so‘rov | Resurs bir vaqtning o‘zida ikki marta band qilinmaydi |
| Markazga joylashtirilgan bola vafoti | Epikriz va chiqarish; e’tiroz bo‘lsa tegishli yo‘naltirish; oilaga yordam uch oygacha alohida davom etishi mumkin |
| Chiqarish va qayta yo‘llash | Oilaviy shifokorga topshirish saqlanadi; yangi murojaatdan oldingi tarix ko‘rinadi |
| Hudud va vakolat | Boshqa tashkilot/vakolatsiz rol klinik yoki oilaviy ma’lumotga kira olmaydi |
| Nizom muddati almashishi | Eski yozuvlar va qo‘llangan qoidalar versiyasi saqlanadi; xizmatlar tarixsiz o‘chirilmaydi |

Ma’lumotlardan palliativ yordamni tashkil etish maqsadida foydalanish 42-band talabi. Texnik yechim sifatida rol, tashkilot va biriktirilgan ish bo‘yicha kirish chegarasi, ko‘rish/o‘zgartirish/eksport tarixi joriy etiladi. GPS harakati faqat xizmat vazifasiga doir doirada ishlatiladi; saqlash muddati alohida belgilanadi. **42–43-bandlar, PDF 9.**

Implementatsiya yakunida frontend uchun `npm run typecheck`, `npm run build`, rollar va asosiy jarayonlar bo‘yicha UI tekshiruvi; backend uchun yuqoridagi chegara, parallel resurs bandlash va integratsiya ssenariylari tekshiriladi. Hozirgi hujjat tayyorlash ishida dasturiy test/build bajarilmadi.

### 8.2. Hisobotlar

Buyruq mobil brigadalarning bosh shifokor va tegishli bo‘lim boshlig‘iga oylik, choraklik va yillik hisobot berishini belgilaydi. Shakl, aniq ko‘rsatkichlar va topshirish sanasi berilmagan. **41-band, PDF 9.**

Taklif qilinadigan ko‘rsatkichlar: yangi va takroriy murojaatlar; baholangan bolalar; uch ish kunida yakunlangan baholash ulushi; yo‘llanma va konsilium natijalari; statsionar qabul/o‘rin bandligi/yotish kunlari; mobil xizmat oluvchilar; rejalashtirilgan va bajarilgan uy tashriflari; masofaviy maslahatlar; berilgan jihozlar; oilaviy shifokorga topshirilgan ishlar; oilaga keyingi yordam; shikoyatlar. Hisobotlar hudud, muassasa, davr va xizmat shakli bo‘yicha filtrlanadi.

Bir bola ikki xil xizmat olganda umumiy bolalar soni ikki marta sanalmaydi. «Bola», «yo‘llanma», «epizod» va «tashrif» sonlari alohida ko‘rsatkichdir. Xizmat sifati faqat GPS tashrifiga qarab belgilanmaydi; individual reja ijrosi va vakolatli mutaxassis bahosi ham ko‘riladi.

## 9. Ishlab chiqishdan oldin yopiladigan ochiq masalalar

| Savol | Kim bilan aniqlashtiriladi | Qaysi ishga ta’sir qiladi |
|---|---|---|
| E-palliative mavjud tizimmi, NASPdagi aynan shu modulning nomimi yoki alohida platformami? API/fayl/status/imzo kontrakti qanday? | NASP va E-palliative egalari, SSV | Tashqi shifokor ish joyi, yo‘llanma va integratsiya arxitekturasi |
| Tasdiqlangan PaPaS savollari, ball formulasi, tarjima/versiya va qayta baholash tartibi qanday? | SSV va Markazning klinik mas’uli | Hisoblash va baholash formasi; hozircha tasdiqlangan natijani qayd qilish mumkin |
| 30-band JSST uslubiyoti qaysi hujjat? PaPaS bilan aynan bir xilmi? | SSV va Markaz | Uy tashriflari uchun baholash va versiya |
| 24-band «a» kichik bandining qarama-qarshi ifodasi qanday qo‘llanadi? | Buyruqni chiqargan vakolatli tomon va SSV | Klinik qoidani dasturlash |
| 14/28 kun, yil almashishi va kirish/chiqish kunlari qanday sanaladi? | Markaz va uslubiy/huquqiy mas’ul | Limit hisoblash va uzaytirish |
| 23-banddagi 18 yoshdan keyingi davom ettirish mobil xizmatga qanday tatbiq etiladi? 39-band statsionarni aniq ko‘rsatadi | Markaz va uslubiy/huquqiy mas’ul | Mobil epizodning yosh chegarasi; statsionar istisnoni umumiy qoida qilib yoymaslik |
| O‘rinlar soni, ustuvorlik/navbat, qayta ko‘rish muddatlari va konsilium ish tartibi qanday? | Markaz | Bandlik, navbat va vazifa muddatlari; buyruqda tayyor son/muddat yo‘q |
| GPS qurilma yoki xizmat telefoni, provayder, aloqa, saqlash muddati qanday? | Markaz va texnik mas’ullar | Real vaqtdagi monitoring va mobil texnik yechim |
| Klinik protokollar, maxsus dori jurnallari, jihoz shartnomasi, ichki tartib va hisobot shakllari qayerda yuritiladi? | Markaz, SSV va hisob tizimlari egalari | Qo‘shimcha jarayonlarni takrorlamasdan qoplash |
| 2027-yil 31-dekabrdan keyingi xizmatlar qaysi asos va o‘tish tartibida davom etadi? | Agentlik | Qoidalar versiyasi va faol ishlar davomiyligi |

Ushbu masalalar reja tayyorlashga to‘sqinlik qilmaydi. Ular tegishli klinik avtomatlashuv, integratsiya yoki to‘liq ishga tushirish uchun bog‘liqlik sifatida boshqariladi; ochiq qolgan qoida tasdiqlangan deb ko‘rsatilmaydi.

## 10. Hujjatning to‘liq qamrov xaritasi

| Manba | Mazmun | Ushbu rejada qoplanishi |
|---|---|---|
| Buyruq 1–3-bandlari, PDF 1 | Nizomni tasdiqlash, vazirliklar bilan kelishish, kuchga kirish | Manba va amal qilish davri |
| Nizom 1–7-bandlari, PDF 2–3 | Maqsad/doira, vaqtinchalik muddat, tushunchalar, huquqiy maqom, muassis, nom va manzil | 1-bo‘lim; tashkilot va normativ ma’lumotnoma |
| 8–9-bandlar, PDF 3 | Palliativ yordam, parvarish, oila, ishonch telefoni, xodimlar | 2 va 5-bo‘limlar |
| 10-band, PDF 3 | Bosh shifokorni tayinlash va uning qo‘shimcha lavozimi | Tashkilot/xodim ma’lumotnomasi va boshqaruv roli |
| 11–14-bandlar, PDF 3–4 | Dori vositalari, retsept, maxsus hisob va SSV protokol/nazorati | 5-bo‘lim; klinik/dorixona hisobiga bog‘lash |
| 15–16-bandlar, PDF 4 | Malaka, stajirovka, ta’lim va hamkorlar | 5-bo‘lim; o‘qitish va qo‘shimcha xizmatlar |
| 17–19-bandlar, PDF 4–5 | Hudud, murojaat, 3 ish kuni, PaPaS, 15/14 ball, tanlangan muassasa | 2.1–2.2 va qabul ssenariylari |
| 20–21-bandlar, PDF 5 | Tibbiy konsilium, Z51.5, E-palliative, yo‘llanma va yozma istisno | 2.2, 4.2, 4.4 |
| 22–24-bandlar, PDF 5–6 | Markaz konsiliumi, qabul, rozilik, yosh, vaqtincha to‘xtatish | 2.3 va 9-bo‘lim |
| 25-band, PDF 6–7 | 14/28 kun va muddatsiz qabul | 2.4, qabul ssenariylari va ochiq hisob qoidasi |
| 26–28-bandlar, PDF 7 | Mobil hudud, brigada tarkibi, ikki avtomobil va qo‘shimcha brigadalar | 2.5; sozlanadigan resurslar |
| 29–32-bandlar, PDF 7–8 | Individual reja, baholash, tashrif chastotasi va GPS | 2.5; mobil ish joylari va integratsiya |
| 33–34-bandlar, PDF 8 | Oilaga uch oygacha yordam, oilaviy shifokor va qayta yo‘llash | 2.6; alohida kuzatuv/oilaviy reja |
| 35–38-bandlar, PDF 8 | Sanitariya, jihoz, moliya, ovqatlanish va shtatlar | 2.6 va 5-bo‘lim |
| 39–40-bandlar, PDF 8–9 | 18 yoshdan keyingi davom, 21 yosh chegarasi, vafot va e’tiroz | 2.4, 2.6 va qabul ssenariylari |
| 41–43-bandlar, PDF 9 | Davriy hisobotlar, shaxsiy ma’lumot, Agentlik/inspeksiya nazorati | 3, 8-bo‘limlar |
| 44–46-bandlar, PDF 9 | Ichki tartib, shikoyat va javobgarlik | 5-bo‘lim; murojaatlar va harakatlar tarixi. Mustaqil jarima algoritmi nazarda tutilmagan |
| 1-ilova, PDF 10–11 | Tibbiy ko‘rsatmalar: to‘rt guruh, yetti band va quyi nomlar | 4.3; klinik tasdiqlanadigan umumiy ma’lumotnoma |
| 2-ilova, PDF 12 | Yo‘llanma shakli | 4.2; to‘liq maydonlar, ilovalar va tasdiqlar |
| Kelishish sahifasi, PDF 13 | Kiritish va vazirliklar imzo/muhrlari | Manba hujjat tarkibi; alohida yangi modul funksiyasi yo‘q |

**Manba chegarasi:** reja foydalanuvchi taqdim etgan PDFga asoslangan. Rasmiy ochiq saytlarda aynan 316-son buyruq va unda ko‘rsatilgan 2026-yil 24-iyundagi PQ-239ning to‘liq matni cheklangan qidiruvda tasdiqlanmadi; bu hujjatlar mavjud emas degani emas. E-palliative API kontrakti, tasdiqlangan PaPaS/JSST shakllari va keyingi o‘zgartirishlar ham ushbu tekshiruvda aniqlanmadi. Shuning uchun ular tasdiqlangan texnik yoki klinik qoida sifatida taxmin qilinmadi.
