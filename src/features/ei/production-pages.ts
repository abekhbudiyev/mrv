import { reactive } from "vue";
import {
  normalizeQuestionnaireTranslations,
  type QuestionnaireTranslations,
} from "./questionnaire-languages";
import {
  assessmentAnswerScoringRules,
  assessmentDomainReferences,
  assessmentResultCriteria,
} from "./assessment-calculation-reference";

export type EiProductionValue =
  string | number | boolean | QuestionnaireTranslations;
export type EiProductionRecord = Record<string, EiProductionValue>;

export type EiProductionField = {
  key: string;
  label: string;
  kind?: "status" | "date" | "number" | "boolean" | "progress";
  secondaryKey?: string;
  options?: string[];
};

export type EiProductionPageConfig = {
  key: string;
  title: string;
  description: string;
  route: string;
  section: string;
  kind: "reference" | "workflow" | "dashboard";
  fields: EiProductionField[];
  filterKeys?: string[];
  canCreate?: boolean;
  canEdit?: boolean;
  canView?: boolean;
};

const activeOptions = ["Faol", "Nofaol"];

export const eiProductionPageConfigs: EiProductionPageConfig[] = [
  {
    key: "requirements",
    title: "Talablar",
    description:
      "Erta aralashuv xizmatini ko‘rsatish uchun normativ va tashkiliy talablar.",
    route: "/apps/ei/info/requirements",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "orderCode", label: "Tartib kodi" },
      { key: "shortName", label: "Qisqa nomi" },
      { key: "fullName", label: "To‘liq nomi" },
      {
        key: "hasText",
        label: "Izoh talab qilinadi",
        kind: "boolean",
        options: ["Ha", "Yo‘q"],
      },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "credentials",
    title: "Malakalar",
    description:
      "Xizmat ko‘rsatuvchi mutaxassislar uchun malaka va sertifikat turlari.",
    route: "/apps/ei/info/credentials",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "fullName", label: "To‘liq nomi" },
      { key: "shortName", label: "Qisqa nomi" },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "credential-types",
    title: "Malaka turlari",
    description:
      "Diplom, sertifikat va boshqa tasdiqlovchi hujjatlar klassifikatori.",
    route: "/apps/ei/info/credential-types",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "fullName", label: "To‘liq nomi" },
      { key: "shortName", label: "Qisqa nomi" },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "equipment",
    title: "Jihozlar",
    description:
      "Xizmat xonalari uchun talab etiladigan jihoz va vositalar ro‘yxati.",
    route: "/apps/ei/info/equipment",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "orderCode", label: "Tartib kodi" },
      { key: "shortName", label: "Qisqa nomi" },
      { key: "fullName", label: "To‘liq nomi" },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "diagnoses",
    title: "Tashxislar",
    description:
      "Tibbiy ko‘rik va baholash jarayonida qo‘llaniladigan tashxislar.",
    route: "/apps/ei/info/diagnoses",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "shortName", label: "Kodi" },
      { key: "fullName", label: "Tashxis nomi" },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "answer-templates",
    title: "Javob shablonlari",
    description:
      "So‘rovnomalar uchun standart javob variantlari va ball qiymatlari.",
    route: "/apps/ei/info/answer-templates",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "code", label: "Kod" },
      { key: "shortName", label: "Qisqa nomi" },
      { key: "fullName", label: "To‘liq nomi" },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["state"],
  },
  {
    key: "questionnaires",
    title: "So‘rovnoma shablonlari",
    description:
      "KID va RCDI orqali bolaning rivojlanishini baholash so‘rovnomalari.",
    route: "/apps/ei/info/questionnaires",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "docNumber", label: "Hujjat", secondaryKey: "docOn" },
      { key: "fullName", label: "So‘rovnoma nomi", secondaryKey: "shortName" },
      { key: "ageRange", label: "Yosh chegarasi" },
      {
        key: "status",
        label: "Holati",
        kind: "status",
        options: activeOptions,
      },
    ],
    filterKeys: ["fullName", "status"],
  },
  {
    key: "development-domains",
    title: "Rivojlanish sohalari",
    description:
      "KID va RCDI-2000 natijalari hisoblanadigan rivojlanish sohalari.",
    route: "/apps/ei/info/development-domains",
    section: "Ma’lumotnomalar",
    kind: "reference",
    fields: [
      { key: "orderNumber", label: "T/r", kind: "number" },
      {
        key: "instrument",
        label: "So‘rovnoma",
        options: ["KID", "RCDI-2000"],
      },
      { key: "code", label: "Soha kodi" },
      { key: "fullName", label: "Soha nomi", secondaryKey: "shortName" },
      {
        key: "state",
        label: "Holati",
        kind: "status",
        options: activeOptions,
      },
    ],
    filterKeys: ["instrument", "state"],
  },
  {
    key: "answer-scoring",
    title: "Javoblarni baholash",
    description:
      "So‘rovnoma javoblarini xom ball va ko‘nikma natijasiga o‘tkazish qoidalari.",
    route: "/apps/ei/info/answer-scoring",
    section: "Ma’lumotnomalar",
    kind: "reference",
    fields: [
      {
        key: "instrument",
        label: "So‘rovnoma",
        options: ["KID", "RCDI-2000"],
      },
      { key: "code", label: "Javob kodi" },
      { key: "fullName", label: "Javob" },
      { key: "score", label: "Ball", kind: "number" },
      { key: "skillResult", label: "Ko‘nikma natijasi" },
      {
        key: "state",
        label: "Holati",
        kind: "status",
        options: activeOptions,
      },
    ],
    filterKeys: ["instrument", "skillResult", "state"],
  },
  {
    key: "result-criteria",
    title: "Natija mezonlari",
    description:
      "Rivojlanish yoshidagi kechikishni yakuniy natija darajasiga o‘tkazish chegaralari.",
    route: "/apps/ei/info/result-criteria",
    section: "Ma’lumotnomalar",
    kind: "reference",
    fields: [
      {
        key: "instrument",
        label: "So‘rovnoma",
        options: ["KID", "RCDI-2000"],
      },
      { key: "level", label: "Natija darajasi" },
      { key: "delayRange", label: "Kechikish oralig‘i" },
      { key: "version", label: "Versiya" },
      {
        key: "methodologyStatus",
        label: "Metodika holati",
        kind: "status",
        options: ["Loyiha", "Tasdiqlangan"],
      },
    ],
    filterKeys: ["instrument", "level", "methodologyStatus"],
  },
  {
    key: "employees",
    title: "Xodimlar",
    description:
      "Erta aralashuv xizmatiga biriktirilgan mutaxassis va xodimlar.",
    route: "/apps/ei/info/employees",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "personFullName", label: "F.I.Sh." },
      { key: "position", label: "Lavozimi" },
      {
        key: "region",
        label: "Hudud",
        options: ["Farg‘ona", "Samarqand", "Toshkent shahri"],
      },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["region", "state"],
  },
  {
    key: "reasons",
    title: "Sabablar",
    description:
      "Xizmatni rad etish, to‘xtatish va bekor qilish sabablari klassifikatori.",
    route: "/apps/ei/info/reasons",
    section: "Ma’lumotnomalar",
    kind: "reference",
    canCreate: true,
    canEdit: true,
    fields: [
      { key: "id", label: "ID", kind: "number" },
      { key: "orderNumber", label: "Tartib raqami", kind: "number" },
      { key: "fullName", label: "To‘liq nomi" },
      { key: "shortName", label: "Qisqa nomi" },
      {
        key: "reasonType",
        label: "Sabab turi",
        options: ["Rad etish", "Xizmatni tugatish", "Bekor qilish"],
      },
      { key: "state", label: "Holati", kind: "status", options: activeOptions },
    ],
    filterKeys: ["reasonType", "state"],
  },
  {
    key: "application-hub",
    title: "Arizalar markazi",
    description:
      "Bola bo‘yicha barcha ariza, tashxis, baholash va jarayon bosqichlari yagona ro‘yxatda.",
    route: "/apps/ei/children/application-hub",
    section: "Bolalar murojaatlari",
    kind: "workflow",
    canView: true,
    fields: [
      { key: "docNumber", label: "Hujjat", secondaryKey: "docOn" },
      {
        key: "serviceRecipient",
        label: "Xizmat oluvchi",
        secondaryKey: "pinfl",
      },
      { key: "serviceRecipientType", label: "Xizmat oluvchi turi" },
      { key: "diagnosis", label: "Tashxis" },
      { key: "applicationType", label: "Ariza turi" },
      {
        key: "region",
        label: "Manzil",
        secondaryKey: "district",
        options: ["Farg‘ona", "Samarqand", "Toshkent shahri"],
      },
      {
        key: "currentStep",
        label: "Joriy bosqich",
        kind: "status",
        options: ["Tibbiy baholash", "So‘rovnoma", "Reja tuzish", "Xizmatda"],
      },
    ],
    filterKeys: ["region", "currentStep"],
  },
  {
    key: "medical-surveys",
    title: "Tibbiy so‘rovlar",
    description:
      "DMED orqali kelgan tibbiy baholashlar va ularning natijalari.",
    route: "/apps/ei/children/medical-surveys",
    section: "Bolalar murojaatlari",
    kind: "workflow",
    canView: true,
    fields: [
      { key: "id", label: "ID" },
      { key: "createdAt", label: "Yaratilgan sana", kind: "date" },
      { key: "childName", label: "Bola", secondaryKey: "childPinfl" },
      {
        key: "region",
        label: "Hudud",
        secondaryKey: "district",
        options: ["Farg‘ona", "Samarqand", "Toshkent shahri"],
      },
      { key: "organization", label: "Tibbiyot tashkiloti" },
      {
        key: "surveyType",
        label: "So‘rov turi",
        options: ["Birlamchi ko‘rik", "Qayta ko‘rik", "Kompleks baholash"],
      },
      {
        key: "result",
        label: "Natija",
        kind: "status",
        options: ["Xizmat tavsiya etildi", "Kuzatuv", "Tavsiya etilmadi"],
      },
    ],
    filterKeys: ["region", "surveyType", "result"],
  },
  {
    key: "service-surveys",
    title: "Baholash so‘rovnomalari",
    description:
      "Bola va oila ehtiyojlarini baholash uchun boshlangan va yakunlangan so‘rovnomalar.",
    route: "/apps/ei/service/surveys",
    section: "Xizmat ko‘rsatish",
    kind: "workflow",
    canView: true,
    canEdit: true,
    fields: [
      { key: "docNumber", label: "Hujjat", secondaryKey: "docOn" },
      { key: "person", label: "Xizmat oluvchi", secondaryKey: "pinfl" },
      {
        key: "region",
        label: "Manzil",
        secondaryKey: "district",
        options: ["Farg‘ona", "Samarqand", "Toshkent shahri"],
      },
      { key: "period", label: "Davr" },
      {
        key: "questionnaireType",
        label: "So‘rovnoma turi",
        options: ["Tibbiy", "Ijtimoiy", "Kompleks"],
      },
      { key: "progress", label: "Javoblar", kind: "progress" },
      {
        key: "status",
        label: "Holati",
        kind: "status",
        options: ["Boshlangan", "Yakunlangan"],
      },
    ],
    filterKeys: ["region", "questionnaireType", "status"],
  },
  {
    key: "medical-monitoring",
    title: "Tibbiy monitoring",
    description:
      "Tibbiy so‘rov natijalari, hududlar kesimi va xizmatga yo‘naltirish ko‘rsatkichlari.",
    route: "/apps/ei/children/medical-monitoring",
    section: "Bolalar murojaatlari",
    kind: "dashboard",
    fields: [],
  },
];

const records: Record<string, EiProductionRecord[]> = {
  requirements: [
    {
      id: 1,
      orderCode: "REQ-01",
      shortName: "Mutaxassislar",
      fullName: "Malakali mutaxassislar faoliyati tashkil etilganligi",
      hasText: "Ha",
      state: "Faol",
    },
    {
      id: 2,
      orderCode: "REQ-02",
      shortName: "Xonalar",
      fullName: "Individual va guruh mashg‘ulotlari uchun xonalar mavjudligi",
      hasText: "Ha",
      state: "Faol",
    },
    {
      id: 3,
      orderCode: "REQ-03",
      shortName: "Jihozlar",
      fullName: "Xonalar zarur jihoz va vositalar bilan ta’minlanganligi",
      hasText: "Yo‘q",
      state: "Faol",
    },
  ],
  credentials: [
    {
      id: 1,
      fullName: "Maxsus pedagogika bo‘yicha oliy ma’lumot",
      shortName: "Maxsus pedagog",
      state: "Faol",
    },
    {
      id: 2,
      fullName: "Logopediya bo‘yicha malaka sertifikati",
      shortName: "Logoped",
      state: "Faol",
    },
    {
      id: 3,
      fullName: "Davolovchi jismoniy tarbiya yo‘riqchisi",
      shortName: "DJT yo‘riqchisi",
      state: "Faol",
    },
  ],
  "credential-types": [
    {
      id: 1,
      fullName: "Oliy ma’lumot diplomi",
      shortName: "Diplom",
      state: "Faol",
    },
    {
      id: 2,
      fullName: "Malaka oshirish sertifikati",
      shortName: "Sertifikat",
      state: "Faol",
    },
    {
      id: 3,
      fullName: "Kasbiy qayta tayyorlash guvohnomasi",
      shortName: "Guvohnoma",
      state: "Faol",
    },
  ],
  equipment: [
    {
      id: 1,
      orderCode: "EQ-001",
      shortName: "Sensor to‘plam",
      fullName: "Sensor integratsiya mashg‘ulotlari uchun jihozlar to‘plami",
      state: "Faol",
    },
    {
      id: 2,
      orderCode: "EQ-002",
      shortName: "Logoped oynasi",
      fullName: "Logopedik mashg‘ulotlar uchun maxsus oyna",
      state: "Faol",
    },
    {
      id: 3,
      orderCode: "EQ-003",
      shortName: "Reabilitatsiya stoli",
      fullName: "Balandligi sozlanadigan reabilitatsiya stoli",
      state: "Faol",
    },
  ],
  diagnoses: [
    {
      id: 1,
      shortName: "F80.1",
      fullName: "Ekspressiv nutq rivojlanishining buzilishi",
      state: "Faol",
    },
    {
      id: 2,
      shortName: "F82",
      fullName: "Harakat funksiyalari rivojlanishining o‘ziga xos buzilishi",
      state: "Faol",
    },
    {
      id: 3,
      shortName: "R62.0",
      fullName: "Rivojlanish bosqichlarining kechikishi",
      state: "Faol",
    },
  ],
  "answer-templates": [
    {
      id: 1,
      code: "YES_NO",
      shortName: "Ha / Yo‘q",
      fullName: "Ikkita variantli standart javob",
      state: "Faol",
    },
    {
      id: 2,
      code: "SCALE_5",
      shortName: "1–5 shkala",
      fullName: "Besh darajali baholash shkalasi",
      state: "Faol",
    },
    {
      id: 3,
      code: "FREQUENCY",
      shortName: "Takrorlanish",
      fullName: "Hech qachon / Ba’zan / Tez-tez / Doimo",
      state: "Faol",
    },
  ],
  questionnaires: [
    {
      id: 1,
      docNumber: "KID-252",
      docOn: "26.07.2026",
      instrumentCode: "KID",
      fullName: "KID rivojlanish so‘rovnomasi",
      shortName: "KID",
      shortNameTranslations: {
        uzLatn: "KID",
        uzCyrl: "KID",
        ru: "KID",
        en: "KID",
        kaaLatn: "KID",
      },
      nameTranslations: {
        uzLatn: "KID rivojlanish so‘rovnomasi",
        uzCyrl: "KID ривожланиш сўровномаси",
        ru: "Шкала развития младенцев KID",
        en: "KID Infant Development Inventory",
        kaaLatn: "KID bóbekler rawajlanıwı sorawnaması",
      },
      ageRange: "2–16 oy",
      status: "Faol",
    },
    {
      id: 2,
      docNumber: "RCDI-216",
      docOn: "26.07.2026",
      instrumentCode: "RCDI",
      fullName: "RCDI-2000 rivojlanish so‘rovnomasi",
      shortName: "RCDI",
      shortNameTranslations: {
        uzLatn: "RCDI",
        uzCyrl: "RCDI",
        ru: "RCDI",
        en: "RCDI",
        kaaLatn: "RCDI",
      },
      nameTranslations: {
        uzLatn: "RCDI-2000 rivojlanish so‘rovnomasi",
        uzCyrl: "RCDI-2000 бола ривожланиши сўровномаси",
        ru: "Опросник развития ребенка RCDI-2000",
        en: "RCDI-2000 Child Development Inventory",
        kaaLatn: "RCDI-2000 bala rawajlanıwı sorawnaması",
      },
      ageRange: "14–42 oy",
      status: "Faol",
    },
  ],
  "development-domains": assessmentDomainReferences.map((domain, index) => ({
    id: index + 1,
    orderNumber: domain.orderNumber,
    instrument: domain.instrument,
    code: domain.code,
    fullName: domain.fullName,
    shortName: domain.shortName,
    state: "Faol",
  })),
  "answer-scoring": assessmentAnswerScoringRules.map((rule, index) => ({
    id: index + 1,
    instrument: rule.instrument,
    code: rule.code,
    fullName: rule.fullName,
    score: rule.score,
    skillResult: rule.skillResult,
    state: "Faol",
  })),
  "result-criteria": assessmentResultCriteria.map((criterion, index) => ({
    id: index + 1,
    instrument: criterion.instrument,
    level: criterion.level,
    delayRange: criterion.maxDelayMonths === undefined
      ? `${criterion.minDelayMonths} oy va undan ko‘p`
      : `${criterion.minDelayMonths}–${criterion.maxDelayMonths} oy`,
    version: criterion.version,
    methodologyStatus: criterion.status,
  })),
  employees: [
    {
      id: 1,
      personFullName: "Karimova Mohira Baxtiyor qizi",
      position: "Maxsus pedagog",
      region: "Toshkent shahri",
      state: "Faol",
    },
    {
      id: 2,
      personFullName: "Saidov Akmal Olimovich",
      position: "Logoped",
      region: "Samarqand",
      state: "Faol",
    },
    {
      id: 3,
      personFullName: "Tursunova Shahnoza Sherzod qizi",
      position: "Psixolog",
      region: "Farg‘ona",
      state: "Faol",
    },
  ],
  reasons: [
    {
      id: 1,
      orderNumber: 1,
      fullName: "Bola uch yoshga to‘ldi",
      shortName: "Yosh chegarasi",
      reasonType: "Xizmatni tugatish",
      state: "Faol",
    },
    {
      id: 2,
      orderNumber: 2,
      fullName: "Oila xizmatdan yozma ravishda voz kechdi",
      shortName: "Voz kechish",
      reasonType: "Xizmatni tugatish",
      state: "Faol",
    },
    {
      id: 3,
      orderNumber: 3,
      fullName: "Talab etilgan hujjatlar taqdim etilmadi",
      shortName: "Hujjatlar yo‘q",
      reasonType: "Rad etish",
      state: "Faol",
    },
  ],
  "application-hub": [
    {
      id: "HUB-001",
      docNumber: "ARZ-2026-00125",
      docOn: "04.07.2026",
      serviceRecipient: "KARIMOVA MADINA DILSHOD QIZI",
      pinfl: "51302876543212",
      serviceRecipientType: "Bola",
      diagnosis: "R62.0",
      applicationType: "Erta aralashuv",
      region: "Toshkent shahri",
      district: "Yunusobod",
      currentStep: "Xizmatda",
    },
    {
      id: "HUB-002",
      docNumber: "ARZ-2026-00126",
      docOn: "08.07.2026",
      serviceRecipient: "SAIDOVA MUSLIMA AKMAL QIZI",
      pinfl: "51504876543216",
      serviceRecipientType: "Bola",
      diagnosis: "F80.1",
      applicationType: "Erta aralashuv",
      region: "Samarqand",
      district: "Samarqand shahri",
      currentStep: "Reja tuzish",
    },
    {
      id: "HUB-003",
      docNumber: "ARZ-2026-00127",
      docOn: "11.07.2026",
      serviceRecipient: "TURSUNOVA MAFTUNA RAVSHAN QIZI",
      pinfl: "51706876543210",
      serviceRecipientType: "Bola",
      diagnosis: "F82",
      applicationType: "Erta aralashuv",
      region: "Farg‘ona",
      district: "Qo‘qon",
      currentStep: "So‘rovnoma",
    },
  ],
  "medical-surveys": [
    {
      id: "DMED-001",
      createdAt: "02.07.2026",
      childName: "KARIMOVA MADINA DILSHOD QIZI",
      childPinfl: "51302876543212",
      region: "Toshkent shahri",
      district: "Yunusobod",
      organization: "7-son bolalar poliklinikasi",
      surveyType: "Kompleks baholash",
      result: "Xizmat tavsiya etildi",
    },
    {
      id: "DMED-002",
      createdAt: "05.07.2026",
      childName: "SAIDOVA MUSLIMA AKMAL QIZI",
      childPinfl: "51504876543216",
      region: "Samarqand",
      district: "Samarqand shahri",
      organization: "Viloyat bolalar markazi",
      surveyType: "Birlamchi ko‘rik",
      result: "Kuzatuv",
    },
    {
      id: "DMED-003",
      createdAt: "09.07.2026",
      childName: "TURSUNOVA MAFTUNA RAVSHAN QIZI",
      childPinfl: "51706876543210",
      region: "Farg‘ona",
      district: "Qo‘qon",
      organization: "Qo‘qon shahar tibbiyot birlashmasi",
      surveyType: "Qayta ko‘rik",
      result: "Xizmat tavsiya etildi",
    },
    {
      id: "DMED-004",
      createdAt: "14.07.2026",
      childName: "MURODOVA ZILOLA SHAVKAT QIZI",
      childPinfl: "51908876543214",
      region: "Toshkent shahri",
      district: "Mirzo Ulug‘bek",
      organization: "5-son bolalar poliklinikasi",
      surveyType: "Birlamchi ko‘rik",
      result: "Tavsiya etilmadi",
    },
  ],
  "service-surveys": [
    {
      id: "SUR-001",
      docNumber: "SRV-2026-0041",
      docOn: "05.07.2026",
      person: "KARIMOVA MADINA DILSHOD QIZI",
      pinfl: "51302876543212",
      region: "Toshkent shahri",
      district: "Yunusobod",
      period: "05.07.2026 / 08.07.2026",
      questionnaireType: "Kompleks",
      progress: "24 / 24",
      status: "Yakunlangan",
    },
    {
      id: "SUR-002",
      docNumber: "SRV-2026-0042",
      docOn: "10.07.2026",
      person: "SAIDOVA MUSLIMA AKMAL QIZI",
      pinfl: "51504876543216",
      region: "Samarqand",
      district: "Samarqand shahri",
      period: "10.07.2026 / —",
      questionnaireType: "Ijtimoiy",
      progress: "11 / 18",
      status: "Boshlangan",
    },
    {
      id: "SUR-003",
      docNumber: "SRV-2026-0043",
      docOn: "16.07.2026",
      person: "TURSUNOVA MAFTUNA RAVSHAN QIZI",
      pinfl: "51706876543210",
      region: "Farg‘ona",
      district: "Qo‘qon",
      period: "16.07.2026 / —",
      questionnaireType: "Tibbiy",
      progress: "8 / 20",
      status: "Boshlangan",
    },
  ],
};

const QUESTIONNAIRE_RECORDS_STORAGE_KEY = "nasp.ei.questionnaire-records.v1";

function hydrateQuestionnaireRecords() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const saved = window.localStorage.getItem(
      QUESTIONNAIRE_RECORDS_STORAGE_KEY,
    );
    const savedRecords = saved
      ? (JSON.parse(saved) as EiProductionRecord[])
      : [];

    if (savedRecords.length) {
      const savedById = new Map(
        savedRecords.map((record) => [String(record.id), record]),
      );
      records.questionnaires = (records.questionnaires ?? []).map((record) => {
        const savedRecord = savedById.get(String(record.id));

        if (!savedRecord) {
          return record;
        }

        return {
          ...record,
          ...savedRecord,
          instrumentCode: String(
            savedRecord.instrumentCode ?? record.instrumentCode ?? "",
          ),
          shortNameTranslations: normalizeQuestionnaireTranslations(
            savedRecord.shortNameTranslations,
            record.shortNameTranslations as QuestionnaireTranslations,
          ),
          nameTranslations: normalizeQuestionnaireTranslations(
            savedRecord.nameTranslations,
            record.nameTranslations as QuestionnaireTranslations,
          ),
        };
      });
    }
  } catch {
    // Invalid local demo data falls back to the built-in templates.
  }
}

hydrateQuestionnaireRecords();

export const eiProductionRecords = reactive(records);

function persistQuestionnaireRecords() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      QUESTIONNAIRE_RECORDS_STORAGE_KEY,
      JSON.stringify(eiProductionRecords.questionnaires ?? []),
    );
  }
}

export function getEiProductionPageConfig(pageKey: string) {
  return (
    eiProductionPageConfigs.find((page) => page.key === pageKey) ??
    eiProductionPageConfigs[0]!
  );
}

export function saveEiProductionRecord(
  pageKey: string,
  record: EiProductionRecord,
) {
  const pageRecords =
    eiProductionRecords[pageKey] ?? (eiProductionRecords[pageKey] = []);
  const index = pageRecords.findIndex(
    (item) => String(item.id) === String(record.id),
  );

  if (index >= 0) {
    pageRecords[index] = { ...pageRecords[index], ...record };
  } else {
    pageRecords.unshift(record);
  }

  if (pageKey === "questionnaires") {
    persistQuestionnaireRecords();
  }
}
