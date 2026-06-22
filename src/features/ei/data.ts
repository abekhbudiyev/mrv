export type EiStatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger'

interface EiStatusTabItem {
  label: string
  value: string
  count: number
  dotClass?: string
  badgeClass?: string
}

export interface EiRecord {
  id: string
  title: string
  tin?: string
  applicant?: {
    fullName: string
    pinfl: string
  }
  subject: string
  region: string
  district: string
  owner: string
  status: string
  tone: EiStatusTone
  submittedAt: string
  dueAt: string
  nextAction: string
  summary: string
  amount?: string
  result?: 'Ijobiy' | 'Salbiy'
  metadata: Array<{
    label: string
    value: string
  }>
  history: Array<{
    label: string
    date: string
  }>
}

export const eiStatusClasses: Record<EiStatusTone, string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  danger: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300',
}

const eiStatusDots: Record<EiStatusTone, string> = {
  neutral: 'bg-muted-foreground',
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  danger: 'bg-red-500',
}

const eiStatusBadges: Record<EiStatusTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export const eiWorkflows: Record<string, string[]> = {
  providers: ['Ariza', 'O‘rganish', 'Xulosa', 'Tasdiqlash', 'Reyestr'],
  children: ['Ariza', 'Hujjat tekshiruvi', 'Vaucher', 'Tashkilot tanlash', 'Buyurtma'],
  service: ['Buyurtma qabul qilish', 'Reja', 'Xizmat', 'Davomat', 'Tugatish'],
  finance: ['Davomat', 'Buyurtmanoma', 'Hisoblash', 'To‘lov'],
  dashboard: ['Murojaat', 'Vaucher', 'Xizmat', 'Subsidiyalash'],
}

export function getEiWorkflow(pageKey: string) {
  if (pageKey.startsWith('providers-')) return eiWorkflows.providers
  if (pageKey.startsWith('children-')) return eiWorkflows.children
  if (pageKey.startsWith('service-')) return eiWorkflows.service
  if (pageKey.startsWith('finance-')) return eiWorkflows.finance

  return eiWorkflows.dashboard
}

export const eiRecordsByPageKey: Record<string, EiRecord[]> = {
  'providers-applications': [
    {
      id: 'EA-PRA-2026-0012',
      title: 'Mehrli Qadam MCHJ',
      tin: '309845672',
      applicant: {
        fullName: 'Rahimov Abror Anvar o‘g‘li',
        pinfl: '30401876543210',
      },
      subject: 'Nodavlat xizmat ko‘rsatuvchi arizasi',
      region: 'Toshkent shahri',
      district: 'Yunusobod',
      owner: 'Hududiy boshqarma',
      status: 'O‘rganilmoqda',
      tone: 'warning',
      submittedAt: '2026-06-18',
      dueAt: '2026-06-25',
      nextAction: 'Ishchi guruh xulosasini kiritish',
      summary: 'Xizmat joyi, mutaxassislar tarkibi va minimal talablarga mosligi o‘rganilmoqda.',
      metadata: [
        { label: 'Tashkilot turi', value: 'Yuridik shaxs' },
        { label: 'Xizmat manzili', value: 'Yunusobod tumani, 7-mavze' },
        { label: 'Xodimlar', value: '6 nafar mutaxassis' },
      ],
      history: [
        { label: 'Ariza qabul qilindi', date: '18.06.2026' },
        { label: 'O‘rganishga yuborildi', date: '19.06.2026' },
      ],
    },
    {
      id: 'EA-PRA-2026-0013',
      title: 'Kelajak Reabilitatsiya NNT',
      tin: '302471895',
      applicant: {
        fullName: 'Madaminova Dilfuza Karimovna',
        pinfl: '40502876543211',
      },
      subject: 'Nodavlat tashkilot arizasi',
      region: 'Samarqand',
      district: 'Samarqand shahri',
      owner: 'Ishchi guruh',
      status: 'Yangi',
      tone: 'info',
      submittedAt: '2026-06-21',
      dueAt: '2026-06-28',
      nextAction: 'Hujjatlarni birlamchi tekshirish',
      summary: 'Tashkilot bolalar uchun korreksion pedagogik va reabilitatsiya xizmatlarini ko‘rsatishga ariza yuborgan.',
      metadata: [
        { label: 'Tashkilot turi', value: 'NNT' },
        { label: 'Xizmat manzili', value: 'Samarqand shahri, Universitet xiyoboni' },
        { label: 'Xodimlar', value: '4 nafar mutaxassis' },
      ],
      history: [
        { label: 'Ariza yuborildi', date: '21.06.2026' },
      ],
    },
    {
      id: 'EA-PRA-2026-0009',
      title: 'Bolajon Terapiya Markazi',
      tin: '614923780',
      applicant: {
        fullName: 'Abdullayev Javlon Bahodir o‘g‘li',
        pinfl: '30603876543212',
      },
      subject: 'Yakka tartibdagi tadbirkor arizasi',
      region: 'Farg‘ona',
      district: 'Qo‘qon',
      owner: 'Hududiy boshqarma',
      status: 'Rad etilgan',
      tone: 'danger',
      submittedAt: '2026-06-10',
      dueAt: '2026-06-17',
      nextAction: 'Rad etish sababini SMS orqali yuborish',
      summary: 'Minimal talablar bo‘yicha xodimlar malakasini tasdiqlovchi hujjatlar yetarli emas.',
      metadata: [
        { label: 'Tashkilot turi', value: 'YTT' },
        { label: 'Kamchilik', value: 'Malaka hujjatlari to‘liq emas' },
        { label: 'Qayta murojaat', value: 'Ruxsat etiladi' },
      ],
      history: [
        { label: 'Ariza qabul qilindi', date: '10.06.2026' },
        { label: 'Rad etish loyihasi tayyorlandi', date: '16.06.2026' },
      ],
    },
  ],
  'providers-conclusions': [
    {
      id: 'EA-CON-2026-0041',
      title: 'Mehrli Qadam MCHJ',
      tin: '309845672',
      applicant: {
        fullName: 'Rahimov Abror Anvar o‘g‘li',
        pinfl: '30401876543210',
      },
      subject: 'Xizmat ko‘rsatishga tayyorlik xulosasi',
      region: 'Toshkent shahri',
      district: 'Yunusobod',
      owner: 'Boshqarma boshlig‘i',
      status: 'Yuborilgan',
      tone: 'warning',
      submittedAt: '2026-06-20',
      dueAt: '2026-06-24',
      nextAction: 'Boshqarma boshlig‘i tasdig‘ini kutish',
      summary: 'Ishchi guruh tashkilotni xizmat ko‘rsatishga tayyor deb baholagan.',
      result: 'Ijobiy',
      metadata: [
        { label: 'Xulosa turi', value: 'Ijobiy' },
        { label: 'Ishchi guruh', value: '5 nafar a’zo' },
        { label: 'Tekshiruv sanasi', value: '20.06.2026' },
      ],
      history: [
        { label: 'O‘rganish yakunlandi', date: '20.06.2026' },
        { label: 'Xulosa kiritildi', date: '20.06.2026' },
      ],
    },
    {
      id: 'EA-CON-2026-0037',
      title: 'Yuksalish Bolalar Markazi',
      tin: '301582746',
      applicant: {
        fullName: 'Saidova Malika Olimovna',
        pinfl: '40804876543213',
      },
      subject: 'Xizmat ko‘rsatishga tayyorlik xulosasi',
      region: 'Buxoro',
      district: 'Buxoro shahri',
      owner: 'Hududiy boshqarma',
      status: 'Qabul qilingan',
      tone: 'success',
      submittedAt: '2026-06-14',
      dueAt: '2026-06-15',
      nextAction: 'Reyestrga avtomatik kiritish',
      summary: 'Xulosa tasdiqlangan, tashkilot elektron reyestrga kiritishga tayyor.',
      result: 'Ijobiy',
      metadata: [
        { label: 'Xulosa turi', value: 'Ijobiy' },
        { label: 'Qabul qilingan sana', value: '15.06.2026' },
        { label: 'Xabarnoma', value: 'SMS yuborilgan' },
      ],
      history: [
        { label: 'Xulosa kiritildi', date: '14.06.2026' },
        { label: 'Qabul qilindi', date: '15.06.2026' },
      ],
    },
  ],
  'providers-registry': [
    {
      id: 'EA-REG-2026-0007',
      title: 'Yuksalish Bolalar Markazi',
      applicant: {
        fullName: 'Saidova Malika Olimovna',
        pinfl: '40804876543213',
      },
      subject: 'Elektron reyestr yozuvi',
      region: 'Buxoro',
      district: 'Buxoro shahri',
      owner: 'Shaxsiy kabinet',
      status: 'Reyestrda',
      tone: 'success',
      submittedAt: '2026-06-15',
      dueAt: '2029-06-15',
      nextAction: 'Xizmatlar katalogini yangilash',
      summary: 'Tashkilotga shaxsiy kabinet ochilgan, buyurtmalarni qabul qilish imkoniyati mavjud.',
      metadata: [
        { label: 'Kabinet holati', value: 'Faol' },
        { label: 'Ko‘rsatiladigan xizmatlar', value: '5 tur' },
        { label: 'Malaka oshirish', value: '2026-07-30 gacha' },
      ],
      history: [
        { label: 'Reyestrga kiritildi', date: '15.06.2026' },
        { label: 'Shaxsiy kabinet ochildi', date: '15.06.2026' },
      ],
    },
    {
      id: 'EA-REG-2026-0005',
      title: 'Imkon Terapiya NNT',
      applicant: {
        fullName: 'Tursunov Elyor Akmal o‘g‘li',
        pinfl: '30705876543214',
      },
      subject: 'Elektron reyestr yozuvi',
      region: 'Andijon',
      district: 'Asaka',
      owner: 'Monitoring guruhi',
      status: 'Ogohlantirilgan',
      tone: 'warning',
      submittedAt: '2026-05-28',
      dueAt: '2026-07-01',
      nextAction: 'Minimal talablar bo‘yicha qayta monitoring',
      summary: 'Davomat qayd etishdagi kamchilik bo‘yicha tashkilotga ogohlantirish yuborilgan.',
      metadata: [
        { label: 'Kabinet holati', value: 'Faol' },
        { label: 'Kamchilik', value: 'Davomat qaydi' },
        { label: 'Keyingi monitoring', value: '01.07.2026' },
      ],
      history: [
        { label: 'Reyestrga kiritildi', date: '28.05.2026' },
        { label: 'Ogohlantirish yuborildi', date: '18.06.2026' },
      ],
    },
  ],
  'children-questionnaires': [
    {
      id: 'EA-CHQ-2026-0210',
      title: 'Saidov A.',
      subject: 'Bola bo‘yicha ariza',
      region: 'Toshkent viloyati',
      district: 'Zangiota',
      owner: 'Inson markazi',
      status: 'Tekshirilmoqda',
      tone: 'warning',
      submittedAt: '2026-06-21',
      dueAt: '2026-06-22',
      nextAction: 'Asos bo‘luvchi hujjatni tekshirish',
      summary: 'Oilaviy shifokor xulosasi asosida ota-ona nomidan ariza kiritilgan.',
      metadata: [
        { label: 'Bola yoshi', value: '2 yosh 4 oy' },
        { label: 'Asos hujjat', value: 'Oilaviy shifokor xulosasi' },
        { label: 'Murojaat kanali', value: 'Ijtimoiy xodim' },
      ],
      history: [
        { label: 'Ariza to‘ldirildi', date: '21.06.2026' },
      ],
    },
    {
      id: 'EA-CHQ-2026-0208',
      title: 'Karimova M.',
      subject: 'Bola bo‘yicha ariza',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Hududiy boshqarma',
      status: 'Vaucher shakllandi',
      tone: 'success',
      submittedAt: '2026-06-19',
      dueAt: '2026-07-19',
      nextAction: 'Xizmat ko‘rsatuvchini tanlash',
      summary: 'Ma’lumotlarda kamchilik aniqlanmagan, vaucher avtomatik shakllangan.',
      metadata: [
        { label: 'Bola yoshi', value: '1 yosh 9 oy' },
        { label: 'Asos hujjat', value: 'Nogironlik ma’lumotnomasi' },
        { label: 'Vaucher muddati', value: '30 kun' },
      ],
      history: [
        { label: 'Ariza qabul qilindi', date: '19.06.2026' },
        { label: 'Vaucher shakllandi', date: '20.06.2026' },
      ],
    },
  ],
  'children-vouchers': [
    {
      id: 'EA-VCH-2026-0134',
      title: 'Karimova M.',
      subject: 'Vaucher',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Ota-ona',
      status: 'Faol',
      tone: 'success',
      submittedAt: '2026-06-20',
      dueAt: '2026-07-20',
      nextAction: 'Reyestrdagi tashkilotni tanlash',
      summary: 'Vaucher 30 kun ichida xizmat ko‘rsatuvchi tashkilotni tanlash uchun faol.',
      metadata: [
        { label: 'QR-kod', value: 'Shakllangan' },
        { label: 'Muddati', value: '30 kun' },
        { label: 'Asos hujjat', value: 'Nogironlik ma’lumotnomasi' },
      ],
      history: [
        { label: 'Vaucher shakllandi', date: '20.06.2026' },
        { label: 'SMS yuborildi', date: '20.06.2026' },
      ],
    },
    {
      id: 'EA-VCH-2026-0127',
      title: 'Nazarov D.',
      subject: 'Vaucher',
      region: 'Qashqadaryo',
      district: 'Qarshi',
      owner: 'Ijtimoiy xodim',
      status: 'Bekor qilingan',
      tone: 'danger',
      submittedAt: '2026-05-17',
      dueAt: '2026-06-16',
      nextAction: 'Bekor qilingan vaucherlar ro‘yxatiga kiritish',
      summary: 'Vaucher belgilangan muddat ichida foydalanilmagan.',
      metadata: [
        { label: 'Muddati', value: 'Tugagan' },
        { label: 'Foydalanish', value: 'Boshlanmagan' },
        { label: 'Bekor qilingan sana', value: '17.06.2026' },
      ],
      history: [
        { label: 'Vaucher shakllandi', date: '17.05.2026' },
        { label: 'Bekor qilindi', date: '17.06.2026' },
      ],
    },
  ],
  'children-orders': [
    {
      id: 'EA-ORD-2026-0081',
      title: 'Karimova M. → Yuksalish Bolalar Markazi',
      subject: 'Xizmat buyurtmasi',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Nodavlat tashkilot',
      status: 'Qabul qilindi',
      tone: 'success',
      submittedAt: '2026-06-21',
      dueAt: '2026-06-22',
      nextAction: 'Erta aralashuv rejasini ishlab chiqish',
      summary: 'Ota-ona vaucher orqali reyestrdagi tashkilotni tanlab, buyurtma bergan.',
      metadata: [
        { label: 'Vaucher', value: 'EA-VCH-2026-0134' },
        { label: 'Qabul muddati', value: '1 ish kuni' },
        { label: 'Reja muddati', value: '10 ish kuni' },
      ],
      history: [
        { label: 'Buyurtma berildi', date: '21.06.2026' },
        { label: 'Buyurtma qabul qilindi', date: '22.06.2026' },
      ],
    },
  ],
  'service-active': [
    {
      id: 'EA-SRV-2026-0032',
      title: 'Karimova M.',
      subject: 'Xizmat olayotgan bola',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Yuksalish Bolalar Markazi',
      status: 'Xizmat ko‘rsatilmoqda',
      tone: 'success',
      submittedAt: '2026-06-22',
      dueAt: '2026-07-20',
      nextAction: 'Haftalik davomatni tasdiqlash',
      summary: 'Bola erta aralashuv rejasi asosida haftasiga 6 soatgacha xizmat olmoqda.',
      metadata: [
        { label: 'Haftalik limit', value: '6 soat' },
        { label: 'Kunlik limit', value: '2 soat' },
        { label: 'Vaucher', value: 'EA-VCH-2026-0134' },
      ],
      history: [
        { label: 'Reja tasdiqlandi', date: '22.06.2026' },
        { label: 'Xizmat boshlandi', date: '22.06.2026' },
      ],
    },
  ],
  'service-plans': [
    {
      id: 'EA-PLN-2026-0044',
      title: 'Karimova M.',
      subject: 'Erta aralashuv rejasi',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Yuksalish Bolalar Markazi',
      status: 'Reja tasdiqlangan',
      tone: 'success',
      submittedAt: '2026-06-22',
      dueAt: '2026-07-20',
      nextAction: 'Reja bo‘yicha xizmatlarni davom ettirish',
      summary: 'Rejada pedagogik korreksiya, oilaviy maslahat va reabilitatsiya mashg‘ulotlari belgilangan.',
      metadata: [
        { label: 'Reja muddati', value: 'Vaucher amal qilish davri' },
        { label: 'Mutaxassislar', value: 'Pedagog, psixolog, reabilitolog' },
        { label: 'Oila ishtiroki', value: 'Haftalik maslahat' },
      ],
      history: [
        { label: 'Reja loyihasi yaratildi', date: '22.06.2026' },
        { label: 'Ota-ona bilan kelishildi', date: '22.06.2026' },
      ],
    },
  ],
  'service-attendance': [
    {
      id: 'EA-ATT-2026-0098',
      title: 'Karimova M.',
      subject: 'Davomat qaydi',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Yuksalish Bolalar Markazi',
      status: 'Tasdiqlangan',
      tone: 'success',
      submittedAt: '2026-06-22',
      dueAt: '2026-06-22',
      nextAction: 'Buyurtmanomaga kiritish',
      summary: 'Davomat ota-onaning biometrik tasdig‘i va geolokatsiya orqali qayd etilgan.',
      metadata: [
        { label: 'Mashg‘ulot', value: '2 soat' },
        { label: 'Biometrik tasdiq', value: 'Bor' },
        { label: 'Geolokatsiya', value: 'Mos' },
      ],
      history: [
        { label: 'Davomat kiritildi', date: '22.06.2026' },
        { label: 'Biometrik tasdiqlandi', date: '22.06.2026' },
      ],
    },
  ],
  'service-terminated': [
    {
      id: 'EA-END-2026-0016',
      title: 'Nazarov D.',
      subject: 'Xizmati tugatilgan yozuv',
      region: 'Qashqadaryo',
      district: 'Qarshi',
      owner: 'Inson markazi',
      status: 'Tugatilgan',
      tone: 'neutral',
      submittedAt: '2026-06-17',
      dueAt: '2026-06-17',
      nextAction: 'Xizmat ko‘rsatuvchiga xabarnoma yuborish',
      summary: 'Vaucher muddatining tugashi sababli xizmatdan foydalanish tugatilgan.',
      metadata: [
        { label: 'Tugatish asosi', value: 'Vaucher muddati tugashi' },
        { label: 'Xabarnoma', value: 'Shaxsiy kabinetga yuboriladi' },
        { label: 'Yakuniy holat', value: 'Arxiv' },
      ],
      history: [
        { label: 'Vaucher muddati tugadi', date: '16.06.2026' },
        { label: 'Xizmat tugatildi', date: '17.06.2026' },
      ],
    },
  ],
  'finance-subsidy-requests': [
    {
      id: 'EA-SUB-2026-0022',
      title: 'Yuksalish Bolalar Markazi',
      subject: 'Subsidiya buyurtmanomasi',
      region: 'Namangan',
      district: 'Chust',
      owner: 'Moliya bo‘limi',
      status: 'To‘lovga tayyor',
      tone: 'warning',
      submittedAt: '2026-06-22',
      dueAt: '2026-06-25',
      nextAction: 'Hisob-kitobni tasdiqlash',
      summary: 'Davomat ma’lumotlari asosida xizmat ko‘rsatilgan har bir bola uchun buyurtmanoma shakllangan.',
      amount: '3 744 000 so‘m',
      metadata: [
        { label: 'Bolalar soni', value: '6 nafar' },
        { label: 'Jami soat', value: '48 soat' },
        { label: 'Hisobot oyi', value: 'Iyun 2026' },
      ],
      history: [
        { label: 'Davomat jamlandi', date: '22.06.2026' },
        { label: 'Buyurtmanoma shakllandi', date: '22.06.2026' },
      ],
    },
  ],
  'finance-payments': [
    {
      id: 'EA-PAY-2026-0014',
      title: 'Yuksalish Bolalar Markazi',
      subject: 'Subsidiya to‘lovi',
      region: 'Buxoro',
      district: 'Buxoro shahri',
      owner: 'Jamg‘arma',
      status: 'To‘landi',
      tone: 'success',
      submittedAt: '2026-06-01',
      dueAt: '2026-06-05',
      nextAction: 'To‘lov reyestrini yangilash',
      summary: 'Vaucherning haqiqatda foydalanilgan qismi bo‘yicha subsidiya to‘lovi amalga oshirilgan.',
      amount: '5 616 000 so‘m',
      metadata: [
        { label: 'To‘lov manbasi', value: 'Jamg‘arma' },
        { label: 'Hisobot oyi', value: 'May 2026' },
        { label: 'Bank hisobvarag‘i', value: 'Tijorat banki' },
      ],
      history: [
        { label: 'Buyurtmanoma tasdiqlandi', date: '03.06.2026' },
        { label: 'To‘lov amalga oshirildi', date: '05.06.2026' },
      ],
    },
  ],
}

type EiStatusSample = Pick<EiRecord, 'status' | 'tone' | 'nextAction'> & Partial<Pick<EiRecord, 'title' | 'tin' | 'applicant' | 'subject' | 'owner' | 'summary' | 'submittedAt' | 'dueAt' | 'amount' | 'result'>>

const eiRequiredStatusSamplesByPageKey: Record<string, EiStatusSample[]> = {
  'providers-applications': [
    { status: 'Yangi', tone: 'info', nextAction: 'Hujjatlarni birlamchi tekshirish' },
    { status: 'O‘rganilmoqda', tone: 'warning', nextAction: 'Ishchi guruh xulosasini kiritish' },
    {
      status: 'Qabul qilingan',
      tone: 'success',
      nextAction: 'Xulosalar bo‘limida hududiy boshqarma tasdig‘iga yuborish',
      title: 'Umidli Qadam Reabilitatsiya MCHJ',
      tin: '304781629',
      applicant: {
        fullName: 'Nazarova Shoira Baxtiyorovna',
        pinfl: '40906876543215',
      },
      subject: 'Nodavlat xizmat ko‘rsatuvchi arizasi',
      submittedAt: '2026-06-17',
      dueAt: '2026-06-27',
    },
    { status: 'Rad etilgan', tone: 'danger', nextAction: 'Rad etish sababini xabarnoma qilish' },
  ],
  'providers-conclusions': [
    {
      status: 'Yangi',
      tone: 'info',
      nextAction: 'Xulosani shakllantirish',
      title: 'Kelajak Reabilitatsiya NNT',
      tin: '302471895',
      applicant: {
        fullName: 'Madaminova Dilfuza Karimovna',
        pinfl: '40502876543211',
      },
      submittedAt: '2026-06-21',
      dueAt: '2026-06-24',
      result: 'Ijobiy',
    },
    {
      status: 'Tahrirlangan',
      tone: 'warning',
      nextAction: 'Xulosani yuborish',
      title: 'Imkon Terapiya NNT',
      tin: '306814752',
      applicant: {
        fullName: 'Tursunov Elyor Akmal o‘g‘li',
        pinfl: '30705876543214',
      },
      submittedAt: '2026-06-19',
      dueAt: '2026-06-23',
      result: 'Salbiy',
    },
    { status: 'Yuborilgan', tone: 'warning', nextAction: 'Boshqarma boshlig‘i tasdig‘ini kutish', result: 'Ijobiy' },
    {
      status: 'Qaytarilgan',
      tone: 'warning',
      nextAction: 'Kamchiliklarni bartaraf etib qayta yuborish',
      title: 'Sog‘lom Avlod Reabilitatsiya Markazi',
      tin: '308217496',
      applicant: {
        fullName: 'Qodirova Nargiza Ilhomovna',
        pinfl: '41007876543216',
      },
      submittedAt: '2026-06-16',
      dueAt: '2026-06-20',
      result: 'Salbiy',
    },
    { status: 'Qabul qilingan', tone: 'success', nextAction: 'Reyestrga kiritish', result: 'Ijobiy' },
  ],
  'providers-registry': [
    { status: 'Reyestrda', tone: 'success', nextAction: 'Xizmatlar katalogini yangilash' },
    { status: 'Ogohlantirilgan', tone: 'warning', nextAction: 'Qayta monitoring belgilash' },
    {
      status: 'Faoliyati to‘xtatilgan',
      tone: 'danger',
      nextAction: 'Tashkilot kabinetini cheklash',
      title: 'Sog‘lom Avlod Reabilitatsiya Markazi',
      applicant: {
        fullName: 'Qodirova Nargiza Ilhomovna',
        pinfl: '41007876543216',
      },
    },
  ],
  'children-questionnaires': [
    { status: 'Yangi', tone: 'info', nextAction: 'Arizani birlamchi tekshirish' },
    { status: 'Tekshirilmoqda', tone: 'warning', nextAction: 'Asos bo‘luvchi hujjatni tekshirish' },
    { status: 'Vaucher shakllandi', tone: 'success', nextAction: 'Xizmat ko‘rsatuvchini tanlash' },
    { status: 'Rad etilgan', tone: 'danger', nextAction: 'Rad etish sababini xabarnoma qilish' },
  ],
  'children-vouchers': [
    { status: 'Faol', tone: 'success', nextAction: 'Reyestrdagi tashkilotni tanlash' },
    { status: 'Foydalanilgan', tone: 'neutral', nextAction: 'Buyurtmani xizmat ko‘rsatuvchiga yuborish' },
    { status: 'Bekor qilingan', tone: 'danger', nextAction: 'Bekor qilingan vaucherlar ro‘yxatiga kiritish' },
  ],
  'children-orders': [
    { status: 'Kutilmoqda', tone: 'warning', nextAction: 'Tashkilot qabulini kutish' },
    { status: 'Qabul qilindi', tone: 'success', nextAction: 'Erta aralashuv rejasini ishlab chiqish' },
    { status: 'Bekor qilingan', tone: 'danger', nextAction: 'Ota-onaga xabarnoma yuborish' },
  ],
  'service-active': [
    { status: 'Reja kutilmoqda', tone: 'warning', nextAction: 'Individual reja loyihasini yaratish' },
    { status: 'Xizmat ko‘rsatilmoqda', tone: 'success', nextAction: 'Haftalik davomatni tasdiqlash' },
    { status: 'Monitoringda', tone: 'info', nextAction: 'Xizmat sifati monitoringini yakunlash' },
  ],
  'service-plans': [
    { status: 'Loyiha', tone: 'info', nextAction: 'Reja bandlarini to‘ldirish' },
    { status: 'Kelishilmoqda', tone: 'warning', nextAction: 'Oila bilan rejani kelishish' },
    { status: 'Reja tasdiqlangan', tone: 'success', nextAction: 'Reja bo‘yicha xizmatlarni davom ettirish' },
  ],
  'service-attendance': [
    { status: 'Kutilmoqda', tone: 'warning', nextAction: 'Davomatni biometrik tasdiqlash' },
    { status: 'Tekshirilmoqda', tone: 'info', nextAction: 'Geolokatsiya va vaqtni solishtirish' },
    { status: 'Tasdiqlangan', tone: 'success', nextAction: 'Buyurtmanomaga kiritish' },
    { status: 'Rad etilgan', tone: 'danger', nextAction: 'Davomat sababini izoh bilan qaytarish' },
  ],
  'service-terminated': [
    { status: 'Tugatish jarayonida', tone: 'warning', nextAction: 'Tugatish asosini tasdiqlash' },
    { status: 'Tugatilgan', tone: 'neutral', nextAction: 'Xizmat ko‘rsatuvchiga xabarnoma yuborish' },
    { status: 'Arxivlangan', tone: 'success', nextAction: 'Yakuniy ma’lumotlarni arxivga o‘tkazish' },
  ],
  'finance-subsidy-requests': [
    { status: 'Hisoblanmoqda', tone: 'info', nextAction: 'Davomat soatlarini hisoblash' },
    { status: 'To‘lovga tayyor', tone: 'warning', nextAction: 'Hisob-kitobni tasdiqlash' },
    { status: 'Qaytarilgan', tone: 'danger', nextAction: 'Kamchiliklarni tuzatish uchun qaytarish' },
  ],
  'finance-payments': [
    { status: 'To‘lovda', tone: 'warning', nextAction: 'To‘lov topshirig‘ini yuborish' },
    { status: 'To‘landi', tone: 'success', nextAction: 'To‘lov reyestrini yangilash' },
    { status: 'Bekor qilingan', tone: 'danger', nextAction: 'Bekor qilish sababini rasmiylashtirish' },
  ],
}

function buildSupplementalRecordId(pageKey: string, records: EiRecord[], index: number) {
  const fallbackId = `EA-${pageKey.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}-${String(index + 1).padStart(2, '0')}`
  const templateId = records[0]?.id
  const templateMatch = templateId?.match(/^(.*-)(\d+)$/)

  if (!templateMatch) {
    return fallbackId
  }

  const idPrefix = templateMatch[1]
  const templateSequence = templateMatch[2]

  if (!idPrefix || !templateSequence) {
    return fallbackId
  }

  const sequenceWidth = templateSequence.length
  const maxExistingSequence = records.reduce((maxSequence, record) => {
    const recordMatch = record.id.match(/^(.*-)(\d+)$/)

    if (!recordMatch || recordMatch[1] !== idPrefix) {
      return maxSequence
    }

    return Math.max(maxSequence, Number(recordMatch[2]))
  }, Number(templateSequence))

  return `${idPrefix}${String(maxExistingSequence + index + 1).padStart(sequenceWidth, '0')}`
}

function buildStatusSampleRecord(pageKey: string, records: EiRecord[], template: EiRecord, sample: EiStatusSample, index: number): EiRecord {
  const metadata = template.metadata.map((item) => ({ ...item }))
  const conclusionType = metadata.find((item) => item.label === 'Xulosa turi')

  if (sample.result && conclusionType) {
    conclusionType.value = sample.result
  }

  return {
    ...template,
    id: buildSupplementalRecordId(pageKey, records, index),
    title: sample.title ?? template.title,
    tin: sample.tin ?? template.tin,
    applicant: sample.applicant
      ? { ...sample.applicant }
      : template.applicant
        ? { ...template.applicant }
        : undefined,
    subject: sample.subject ?? template.subject,
    owner: sample.owner ?? template.owner,
    status: sample.status,
    tone: sample.tone,
    submittedAt: sample.submittedAt ?? template.submittedAt,
    dueAt: sample.dueAt ?? template.dueAt,
    nextAction: sample.nextAction,
    summary: sample.summary ?? template.summary,
    amount: sample.amount ?? template.amount,
    result: sample.result ?? template.result,
    metadata,
    history: template.history.map((item) => ({ ...item })),
  }
}

function sortEiRecordsByStatusOrder(pageKey: string, records: EiRecord[]) {
  const statusOrder = new Map(
    (eiRequiredStatusSamplesByPageKey[pageKey] ?? []).map((sample, index) => [sample.status, index]),
  )

  if (!statusOrder.size) {
    return records
  }

  return [...records].sort((left, right) => {
    const leftOrder = statusOrder.get(left.status) ?? Number.MAX_SAFE_INTEGER
    const rightOrder = statusOrder.get(right.status) ?? Number.MAX_SAFE_INTEGER

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder
    }

    return new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  })
}

export function getEiRecords(pageKey: string) {
  const records = eiRecordsByPageKey[pageKey] ?? []
  const requiredStatuses = eiRequiredStatusSamplesByPageKey[pageKey] ?? []
  const existingStatuses = new Set(records.map((record) => record.status))
  const template = records[0]

  if (!template) {
    return records
  }

  const supplementalRecords = requiredStatuses
    .filter((sample) => !existingStatuses.has(sample.status))
    .map((sample, index) => buildStatusSampleRecord(pageKey, records, template, sample, index))

  return sortEiRecordsByStatusOrder(pageKey, [...records, ...supplementalRecords])
}

export function buildEiStatusTabs(records: EiRecord[]): EiStatusTabItem[] {
  const statusMap = new Map<string, { count: number, tone: EiStatusTone }>()

  for (const record of records) {
    const current = statusMap.get(record.status)

    statusMap.set(record.status, {
      count: (current?.count ?? 0) + 1,
      tone: current?.tone ?? record.tone,
    })
  }

  return [
    {
      label: 'Barchasi',
      value: 'all',
      count: records.length,
      dotClass: 'bg-muted-foreground',
      badgeClass: 'bg-muted text-muted-foreground',
    },
    ...Array.from(statusMap.entries()).map(([status, value]) => ({
      label: status,
      value: status,
      count: value.count,
      dotClass: eiStatusDots[value.tone],
      badgeClass: eiStatusBadges[value.tone],
    })),
  ]
}

export function getEiDashboardRecords() {
  return Object.keys(eiRecordsByPageKey).flatMap((pageKey) => getEiRecords(pageKey))
}
