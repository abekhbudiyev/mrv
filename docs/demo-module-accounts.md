# Modullar uchun demo hisoblar

Har bir hisob `/apps` ilovalar ro‘yxatini va faqat o‘z modulini ochadi. Boshqa modullar kartalari ro‘yxatda ko‘rinadi, lekin cheklangan bo‘ladi. Boshqa modulning ichki sahifasi yoki to‘g‘ridan-to‘g‘ri URL manziliga kirish ham tekshiriladi.

Login oynasidagi **Demo hisoblar** ro‘yxatidan **To‘ldirish** tugmasi bilan login va parolni formaga qo‘yib, **Kirish** tugmasini bosishingiz mumkin. Loginlar kichik harfda, parollar esa katta-kichik harfga sezgir; parolning boshiga yoki oxiriga bo‘sh joy qo‘shmang.

| Modul | Login | Demo parol | Modul manzili |
| --- | --- | --- | --- |
| Bolalar palliativ yordami | `palliative-care` | `PalliativDemo!26` | `/apps/palliative-care` |
| PTPK 2.0 | `ptpk` | `PtpkDemo!26` | `/apps/ptpk` |
| Transport imtiyozlari | `transport-benefits` | `TransportDemo!26` | `/apps/transport-benefits` |
| IPTK | `iptk` | `IptkDemo!26` | `/apps/iptk` |
| Muruvvat | `muruvvat` | `MuruvvatDemo!26` | `/apps/muruvvat` |
| Ijtimoiy navigator | `snav` | `NavigatorDemo!26` | `/apps/snav` |
| Erta aralashuv moduli | `ei` | `ErtaDemo!26` | `/apps/ei` |
| Dashboard | `dashboard` | `DashboardDemo!26` | `/apps/dashboard` |
| Fuqarolar reyestri | `citizens` | `FuqarolarDemo!26` | `/apps/citizens` |
| Arizalar | `applications` | `ArizalarDemo!26` | `/apps/applications` |
| Nafaqalar | `benefits` | `NafaqalarDemo!26` | `/apps/benefits` |
| To‘lovlar | `payments` | `TolovlarDemo!26` | `/apps/payments` |
| Hujjatlar | `documents` | `HujjatlarDemo!26` | `/apps/documents` |
| Monitoring | `monitoring` | `MonitoringDemo!26` | `/apps/monitoring` |
| Hisobotlar | `reports` | `HisobotlarDemo!26` | `/apps/reports` |
| Sozlamalar | `settings` | `SozlamalarDemo!26` | `/apps/settings` |
| Foydalanuvchilar va rollar | `users` | `FoydalanuvchiDemo!26` | `/apps/users` |

Amaldagi administrator hisobi va uning barcha 17 modulga kirishi saqlangan. Administrator paroli bu ro‘yxatga qo‘shilmagan.

## Sessiya va yo‘naltirish

- Modul hisobining ruxsatlari faqat `apps.view` va o‘z modulining `.view` ruxsatidan iborat. Boshqa modulning ruxsati login yoki sessiya tiklashda qo‘shilmaydi.
- **Meni eslab qolish** belgilansa hisob identifikatori `localStorage`da, belgilanmasa `sessionStorage`da saqlanadi. Parol va ruxsatlar ro‘yxati yangi sessiyaga yozilmaydi.
- Sahifa yangilanganda profil va ruxsatlar hisoblar katalogidan qayta olinadi. Eski sessiyadagi qo‘shimcha ruxsatlar, rol va ism e’tiborga olinmaydi. Eski administrator sessiyasi tan olinadi; noma’lum yoki buzilgan sessiya tozalanadi.
- Login `redirect` manzilini faqat shu hisobga ruxsat etilgan ichki sahifaga yo‘naltiradi. Boshqa modul yoki tashqi manzil berilsa `/apps` ochiladi.
- Hisobni almashtirish uchun joriy hisobdan chiqib, yangi login bilan kiring. Boshqa hisobning ruxsatlari yangi hisobga o‘tmaydi.
- OneID va E-IMZO ushbu frontend demoga ulanmagan. Ularning tugmalari tushuntirish beradi va administrator sifatida avtomatik kiritmaydi.

Bu ochiq demo hisoblar va frontend darajasidagi ruxsat namoyishidir. Backend, server sessiyasi yoki ishlab chiqarishdagi xavfsizlik tizimi yaratilmagan; brauzer kodi va saqlash joyini o‘zgartirishga qarshi haqiqiy server himoyasi mavjud emas.

## Tekshirish

```sh
node --test src/features/auth/data/demo-accounts.test.mjs
npx vue-tsc -p tsconfig.app.json --noEmit
```

Testlar 17 hisobning ajratilgan ruxsatlarini, haqiqiy route daraxtidagi ichki manzillarni, noto‘g‘ri parolni, sessiyaga qo‘shilgan ruxsatlar tiklanmasligini va login yo‘naltirishini tekshiradi.
