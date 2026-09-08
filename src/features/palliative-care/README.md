# Bolalar palliativ yordami — frontend prototipi

316-son buyruq asosida mavjud NASP qobig‘iga ulangan Vue 3 / TypeScript modulidir. Asosiy birlik — bola va oilaning yagona ishi: murojaat → baholash → manba konsiliumi va yo‘llanma → Markaz konsiliumi → statsionar yoki mobil xizmat → keyingi kuzatuv / oilaga yordam.

Boshlanish manzili: `/apps/palliative-care`. Demo misollar ro‘yxati: `/apps/palliative-care/cases?view=scenarios`. Bola kartasi: `cases/:caseId`.

Sahifa nomi faqat umumiy headerda ko‘rsatiladi; sahifa ichida forma, karta va mazmuniy bo‘lim sarlavhalari saqlanadi.

Yon menyuda ish jarayoni (bolalar va yo‘llanmalar, konsilium, statsionar, mobil yordam, jihoz berish), ma’lumotnomalar (`references` kataloglari), hisobotlar va yordam (biznes jarayon, qo‘llanmalar) alohida guruhlangan. Barcha havolalar ochiq ko‘rinadi. Kataloglar manzili: `/apps/palliative-care/references`; qo‘llanmalar: `/apps/palliative-care/guides`.

Bu faqat frontend demo: ma’lumotlar ochiq ilova sessiyasining tezkor xotirasida turadi. Backend, lokal ma’lumotlar bazasi va brauzerga saqlash ishlatilmaydi. Sahifani yangilash yoki demo namunalarini qayta boshlash dastlabki misollarni tiklaydi; shu sessiyadagi o‘zgartirishlar tugaydi. Oldingi prototipning localStorage yozuvi o‘qilmaydi va o‘zgartirilmaydi.

Modul uchun demo login: `palliative-care`, parol: `PalliativDemo!26`. Barcha 17 modul hisobi `docs/demo-module-accounts.md` va login oynasidagi «Demo hisoblar» ro‘yxatida berilgan. Modul hisobi `/apps`da barcha kartalarni ko‘radi, faqat o‘z moduliga kiradi; ichki URLlar ham tekshiriladi.

Barcha bolalar, klinik izohlar, hujjatlar va xizmat qaydlari sun’iy namunalardir. E-palliative, shaxs reyestri, haqiqiy hujjat yuklash, elektron imzo va GPS ulanmagan. Hujjat maydonlari namuna rekvizitlari va tavsiflar bilan ishlaydi.

`domain.ts` jarayon qoidalarini, `store.ts` umumiy reaktiv holat va namunalarga qaytishni, `demo-data.ts` misollarni yuritadi. Klinik xulosa va konsilium qarori foydalanuvchi tomonidan kiritiladi. PaPaS va uyda yordamga muhtojlik baholari ajratilgan. 14/28 kunlik hisob va uch ish kunini sanashning prototip talqinlari interfeysda ko‘rsatiladi. Nizomdagi 24-band nomuvofiqligi avtomatik klinik qarorga aylantirilmagan.

Demo vaziyatlar murojaat va past PaPaS ballidan tortib hujjati yetishmaydigan yo‘llanma, ikki konsilium, vaqtincha to‘xtatish, qabulni rad etish, o‘rin kutish, vaqtinchalik va muddatsiz statsionar, uzaytirish, 18 yoshdan keyingi davom ettirish, haftasiga 1/2/3 mobil tashrif, chiqarish/topshirish, qayta yo‘llanma va vafotdan keyingi oilaviy yordamgacha bo‘lgan holatlarni qamrab oladi. Har bir namuna kartasidagi «Demo misol» blokini ochib, boshlang‘ich vaziyat va tekshirish qadamlarini ko‘rish mumkin; joriy holat va keyingi qadam esa bajarilgan amallarga qarab yangilanadi.

«Qo‘llanmalar» bo‘limidagi 11 mavzu 8 formatda berilgan: tushuntirish, qadamlar, flowchart, maydonlar, qoidalar jadvali, xatolar va yechimlar, savol-javob, demo misollar. Har bir mavzuda boshlash shartlari, mas’ul va natijasi ko‘rsatilgan amallar, maydonlarning majburiyligi va to‘ldirish namunalari, haqiqiy tekshiruv xatolari va yechimlari, yakuniy tekshiruvlar hamda bog‘liq qo‘llanmalar mavjud. Matn mundarijasi, barcha tafsilotlar bo‘yicha qidiruv va maydon ichidagi alohida qidiruv ishlaydi. 29 atama va 8 rolning vazifalari tushuntirilgan. Har bir mavzuda ikkita batafsil va bitta qisqa flowchart bor: jami 33 sxema. Qaror va qayta ishlash tarmoqlari alohida izohlanadi. Tizim va qo‘llanmadagi ranglar: yashil — tasdiqlash/bajarilgan, qizil — rad etish/cheklov, sariq — kutish/qayta ko‘rish, kulrang — bekor qilish/yopish, ko‘k — oddiy amal yoki jarayondagi ish. Oqim tugunlari aniq identifikatorlari orqali ranglangan; matn va belgilar ham saqlanadi. Ranglar yorug‘ va qorong‘i mavzuda, Mermaid hamda SVG eksportida mavjud. Sxemani katta oynada ochish, 5–300% kattalashtirish, kenglikka moslash, to‘liq ko‘rish, sichqoncha bilan surish va strelkalar bilan aylantirish mumkin. Qadamlar ichidagi tekshiruv belgilarini qo‘yish bola kartasidagi xizmatni bajarmaydi. Har bir ish oynasining «Qo‘llanma» havolasi shu jarayonga tegishli mavzuni ochadi; bola kartasida mavzu uning joriy holatiga mos keladi. Masalan: `/apps/palliative-care/guides?topic=consilium&view=flowchart&flow=detailed`. «Biznes jarayon» sahifasidan ham batafsil umumiy sxemaga o‘tiladi. Matnni Markdown, chizilgan sxemani SVG shaklida yuklab olish mumkin. Bitta mavzu yoki barcha mavzular eksporti tafsilotlar, sxemalarning Mermaid manbasi, tarmoqlar izohi, lug‘at va rol tavsiflarini o‘z ichiga oladi. Asl buyruq PDFi va mavzuga tegishli manba betlariga havolalar beriladi. Qo‘llanma komponenti faqat shu bo‘lim ochilganda yuklanadi.

Hisobot bola, xizmat epizodi va tashrifni alohida sanaydi; vafotdan keyingi oilaviy tashriflar bolalar soniga qo‘shilmaydi. Yuborilgan joriy va tarixiy yo‘llanmalar ID bo‘yicha takrorsiz hisoblanadi. CSV sahifadagi davr bilan filtrlangan qaydlarni yuklaydi va formula sifatida talqin qilinadigan matnlarni himoyalaydi.

Loyiha ildizidan ishga tushirish va tekshirish:

```sh
npm run dev
npx vue-tsc -p tsconfig.app.json --noEmit
node --test src/features/palliative-care/domain.test.mjs
npm run build
```

Sinab ko‘rish:

1. Demo misollar ro‘yxatidan vaziyatni oching; boshlang‘ich tavsif va tekshirish qadamlarini ko‘ring.
2. «Davom etish» orqali baholash, yo‘llanma yoki konsilium oynasini oching. «Namuna bilan to‘ldirish» tayyor demo qiymatlarni qo‘yadi; ularni ko‘rib, alohida saqlang; kartadagi joriy holat va tarix yangilanishini tekshiring.
3. Statsionarda o‘rin, uzaytirish qarori va chiqarishni; mobil yordamda «Barcha sanalar» filtridan rejalashtirilgan, boshlangan, bajarilgan va bekor qilingan tashriflarni ko‘ring.
4. Operatsion oynalarda ham «Namuna bilan to‘ldirish» bo‘sh matnlarni to‘ldiradi. Sana, bola, brigada, jihoz va checkbox tanlovlari saqlanadi; amallar alohida tasdiqlanadi. «Jihoz berish» sahifasida berish/qaytarish tarixi va ta’mirga ajratilgan birliklarni; «Davriy hisobot»da davr, bola/epizod/tashrif soni va CSVni tekshiring.
5. «Qo‘llanma» havolasini oching, mavzuni turli formatlarda o‘rganing va tegishli demo misol kartasiga o‘ting.
6. Sahifani yangilang yoki demo namunalarini qayta boshlang: dastlabki misollar qaytadi.
