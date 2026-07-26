import { reactive } from "vue";
import { assessmentQuestionBank } from "./assessment-question-bank";
import type {
  AssessmentInstrument,
  DevelopmentDomain,
} from "./assessment-question-bank";
import { questionnaireAnswerOptions } from "./questionnaire-answer-options";
import type { AssessmentAnswer } from "./questionnaire-answer-options";

export { assessmentQuestionBank };
export type {
  AssessmentInstrument,
  AssessmentQuestion,
  DevelopmentDomain,
} from "./assessment-question-bank";
export type { AssessmentAnswer } from "./questionnaire-answer-options";

export type AssessmentStatus =
  "Boshlanmagan" | "Jarayonda" | "Tekshiruv kerak" | "Yakunlangan";

export type AssessmentChild = {
  id: string;
  fullName: string;
  pinfl: string;
  birthDate: string;
  gestationalWeek: number;
  region: string;
  district: string;
  guardian: string;
  applicationNumber: string;
};

export type AssessmentRecord = {
  id: string;
  childId: string;
  instrument: AssessmentInstrument;
  questionnaireTemplateId?: string;
  assessmentDate: string;
  informant: string;
  assessor: string;
  startedAt: string;
  completedAt?: string;
  status: AssessmentStatus;
  answers: Record<string, AssessmentAnswer>;
  qualityIssues: string[];
  planCreated?: boolean;
};

export type DomainResult = {
  domain: DevelopmentDomain;
  label: string;
  shortLabel: string;
  achieved: number;
  total: number;
  score: number;
  developmentAgeMonths: number;
  referenceAgeMonths: number;
  delayMonths: number;
  level: "Yoshiga mos" | "Kuzatuv" | "Ustuvor";
};

export const answerOptions = questionnaireAnswerOptions;

export const domainCatalog: Record<
  DevelopmentDomain,
  {
    label: string;
    shortLabel: string;
  }
> = {
  cognitive: { label: "Bilish jarayonlari", shortLabel: "Bilish" },
  motor: { label: "Harakat rivojlanishi", shortLabel: "Harakat" },
  language: { label: "Nutq va muloqot", shortLabel: "Nutq" },
  selfCare: { label: "O‘ziga xizmat", shortLabel: "O‘ziga xizmat" },
  social: { label: "Ijtimoiy rivojlanish", shortLabel: "Ijtimoiy" },
  grossMotor: { label: "Yirik motorika", shortLabel: "Yirik motorika" },
  fineMotor: { label: "Mayda motorika", shortLabel: "Mayda motorika" },
  expressiveLanguage: { label: "Faol nutq", shortLabel: "Faol nutq" },
  receptiveLanguage: { label: "Nutqni tushunish", shortLabel: "Tushunish" },
};

export const instrumentCatalog: Record<
  AssessmentInstrument,
  {
    title: string;
    ageRange: string;
    minAgeMonths: number;
    maxAgeMonths: number;
    officialItemCount: number;
    domains: DevelopmentDomain[];
  }
> = {
  KID: {
    title: "KID rivojlanish so‘rovnomasi",
    ageRange: "2–16 oy",
    minAgeMonths: 2,
    maxAgeMonths: 16,
    officialItemCount: 252,
    domains: ["cognitive", "motor", "language", "selfCare", "social"],
  },
  "RCDI-2000": {
    title: "RCDI-2000 rivojlanish so‘rovnomasi",
    ageRange: "14–42 oy",
    minAgeMonths: 14,
    maxAgeMonths: 42,
    officialItemCount: 216,
    domains: [
      "social",
      "selfCare",
      "grossMotor",
      "fineMotor",
      "expressiveLanguage",
      "receptiveLanguage",
    ],
  },
};

export const assessmentChildren: AssessmentChild[] = [
  {
    id: "CH-001",
    fullName: "KARIMOVA MADINA DILSHOD QIZI",
    pinfl: "51302•••••3212",
    birthDate: "2025-09-18",
    gestationalWeek: 40,
    region: "Toshkent shahri",
    district: "Yunusobod tumani",
    guardian: "Karimova Mohira Baxtiyor qizi",
    applicationNumber: "ARZ-2026-00125",
  },
  {
    id: "CH-002",
    fullName: "SAIDOVA MUSLIMA AKMAL QIZI",
    pinfl: "51504•••••3216",
    birthDate: "2024-04-12",
    gestationalWeek: 39,
    region: "Samarqand viloyati",
    district: "Samarqand shahri",
    guardian: "Saidova Dilnoza Komil qizi",
    applicationNumber: "ARZ-2026-00126",
  },
  {
    id: "CH-003",
    fullName: "TURSUNOVA MAFTUNA RAVSHAN QIZI",
    pinfl: "51706•••••3210",
    birthDate: "2025-07-28",
    gestationalWeek: 34,
    region: "Farg‘ona viloyati",
    district: "Qo‘qon shahri",
    guardian: "Tursunova Shahnoza Sherzod qizi",
    applicationNumber: "ARZ-2026-00127",
  },
  {
    id: "CH-004",
    fullName: "MURODOVA ZILOLA SHAVKAT QIZI",
    pinfl: "51908•••••3214",
    birthDate: "2023-12-02",
    gestationalWeek: 38,
    region: "Toshkent shahri",
    district: "Mirzo Ulug‘bek tumani",
    guardian: "Murodova Maftuna Bahodir qizi",
    applicationNumber: "ARZ-2026-00131",
  },
  {
    id: "CH-005",
    fullName: "ABDULLAYEV MUHAMMADALI AZIZ O‘G‘LI",
    pinfl: "52011•••••6541",
    birthDate: "2025-11-06",
    gestationalWeek: 36,
    region: "Qashqadaryo viloyati",
    district: "Qarshi shahri",
    guardian: "Abdullayeva Marjona Akmal qizi",
    applicationNumber: "ARZ-2026-00138",
  },
  {
    id: "CH-006",
    fullName: "RAXMONOVA SOLIHA UMID QIZI",
    pinfl: "52103•••••1187",
    birthDate: "2024-10-21",
    gestationalWeek: 40,
    region: "Namangan viloyati",
    district: "Chortoq tumani",
    guardian: "Raxmonova Gulnoza Rasul qizi",
    applicationNumber: "ARZ-2026-00142",
  },
  {
    id: "CH-007",
    fullName: "XOLMATOV DILSHODBEK SHERZOD O‘G‘LI",
    pinfl: "52205•••••2048",
    birthDate: "2025-05-15",
    gestationalWeek: 35,
    region: "Andijon viloyati",
    district: "Asaka tumani",
    guardian: "Xolmatova Dildora Odil qizi",
    applicationNumber: "ARZ-2026-00145",
  },
  {
    id: "CH-008",
    fullName: "ERGASHEVA NIGINA AKMAL QIZI",
    pinfl: "52312•••••7701",
    birthDate: "2024-12-03",
    gestationalWeek: 40,
    region: "Buxoro viloyati",
    district: "G‘ijduvon tumani",
    guardian: "Ergasheva Mohira Ulug‘bek qizi",
    applicationNumber: "ARZ-2026-00149",
  },
  {
    id: "CH-009",
    fullName: "NORQULOVA SHAHZODA OYBEK QIZI",
    pinfl: "52401•••••4620",
    birthDate: "2026-01-14",
    gestationalWeek: 38,
    region: "Jizzax viloyati",
    district: "Zomin tumani",
    guardian: "Norqulova Madina Anvar qizi",
    applicationNumber: "ARZ-2026-00152",
  },
  {
    id: "CH-010",
    fullName: "SAPAROV BEKZOD AZAMAT O‘G‘LI",
    pinfl: "52503•••••9982",
    birthDate: "2023-03-20",
    gestationalWeek: 40,
    region: "Qoraqalpog‘iston Respublikasi",
    district: "Nukus shahri",
    guardian: "Saparova Gulnaz Marat qizi",
    applicationNumber: "ARZ-2026-00158",
  },
  {
    id: "CH-011",
    fullName: "XUDOYBERDIYEVA OMINA BOBUR QIZI",
    pinfl: "52612•••••3487",
    birthDate: "2025-12-01",
    gestationalWeek: 32,
    region: "Surxondaryo viloyati",
    district: "Termiz shahri",
    guardian: "Xudoyberdiyeva Nargiza Jamshid qizi",
    applicationNumber: "ARZ-2026-00163",
  },
  {
    id: "CH-012",
    fullName: "RO‘ZIMURODOV YUSUF SHERALI O‘G‘LI",
    pinfl: "52708•••••5519",
    birthDate: "2024-08-27",
    gestationalWeek: 40,
    region: "Xorazm viloyati",
    district: "Urganch shahri",
    guardian: "Ro‘zimurodova Malika Otabek qizi",
    applicationNumber: "ARZ-2026-00167",
  },
  {
    id: "CH-013",
    fullName: "QODIROVA MADINA RUSTAM QIZI",
    pinfl: "52803•••••8104",
    birthDate: "2025-03-05",
    gestationalWeek: 37,
    region: "Navoiy viloyati",
    district: "Karmana tumani",
    guardian: "Qodirova Dilafruz Erkin qizi",
    applicationNumber: "ARZ-2026-00171",
  },
  {
    id: "CH-014",
    fullName: "SODIQOVA IMRONA JAVOHIR QIZI",
    pinfl: "52910•••••1752",
    birthDate: "2025-10-19",
    gestationalWeek: 39,
    region: "Sirdaryo viloyati",
    district: "Guliston shahri",
    guardian: "Sodiqova Munisa Alisher qizi",
    applicationNumber: "ARZ-2026-00175",
  },
  {
    id: "CH-015",
    fullName: "YO‘LDOSHEV SHOHJAHON ILHOM O‘G‘LI",
    pinfl: "53001•••••6238",
    birthDate: "2024-01-30",
    gestationalWeek: 40,
    region: "Toshkent viloyati",
    district: "Chirchiq shahri",
    guardian: "Yo‘ldosheva Shahnoza Umid qizi",
    applicationNumber: "ARZ-2026-00179",
  },
  {
    id: "CH-016",
    fullName: "MAMATQULOVA ZUHRA ODIL QIZI",
    pinfl: "53106•••••9076",
    birthDate: "2025-06-11",
    gestationalWeek: 35,
    region: "Andijon viloyati",
    district: "Shahrixon tumani",
    guardian: "Mamatqulova Sevara Nodir qizi",
    applicationNumber: "ARZ-2026-00183",
  },
  {
    id: "CH-017",
    fullName: "HAMROYEV AZIZBEK ALISHER O‘G‘LI",
    pinfl: "53211•••••4365",
    birthDate: "2023-11-08",
    gestationalWeek: 39,
    region: "Buxoro viloyati",
    district: "Buxoro shahri",
    guardian: "Hamroyeva Malohat To‘lqin qizi",
    applicationNumber: "ARZ-2026-00188",
  },
  {
    id: "CH-018",
    fullName: "ALLAMBERGENOVA MARYAM TIMUR QIZI",
    pinfl: "53302•••••2841",
    birthDate: "2026-02-17",
    gestationalWeek: 36,
    region: "Qoraqalpog‘iston Respublikasi",
    district: "Xo‘jayli tumani",
    guardian: "Allambergenova Aynura Ruslan qizi",
    applicationNumber: "ARZ-2026-00192",
  },
];

const goalCatalog: Record<DevelopmentDomain, string[]> = {
  cognitive: [
    "Yashirilgan buyumni izlash ko‘nikmasini kundalik o‘yinlarda mustahkamlash",
    "Sodda sabab-oqibatli o‘yinchoqlar bilan maqsadli harakatni rivojlantirish",
  ],
  motor: [
    "Tana muvozanatini saqlash va tayanchdan foydalanishni mashq qilish",
    "Mustaqil harakatlanishga tayyorlovchi xavfsiz o‘yinlarni kun tartibiga kiritish",
  ],
  language: [
    "Tovush va bo‘g‘inlarga javob qaytarish uchun navbatli muloqot o‘yinlarini o‘tkazish",
    "Kundalik vaziyatlarda faol ishlatiladigan so‘zlar zaxirasini kengaytirish",
  ],
  selfCare: [
    "Ovqatlanish jarayonida mustaqil harakat ulushini bosqichma-bosqich oshirish",
    "Kiyinish va yechinishda bitta amaliy qadamni mustaqil bajarishga o‘rgatish",
  ],
  social: [
    "Kattalar va tengdoshlar bilan navbatli o‘yinlarni muntazam tashkil etish",
    "Ijtimoiy ishora va hissiyotlarga mos javobni kundalik vaziyatlarda mashq qilish",
  ],
  grossMotor: [
    "Yurish, muvozanat va ikki oyoqli harakatlarni xavfsiz mashqlar orqali rivojlantirish",
    "To‘p bilan maqsadli harakatlarni haftalik mashg‘ulotlarga kiritish",
  ],
  fineMotor: [
    "Ushlash, joylashtirish va qurish harakatlarini mayda buyumlar bilan mashq qilish",
    "Qalam va ikki qo‘l ishtirokidagi faoliyatlarni kundalik rejaga kiritish",
  ],
  expressiveLanguage: [
    "Ikki so‘zli iboralarni kundalik ehtiyojlarni ifodalashda qo‘llashga rag‘batlantirish",
    "Rasm va real voqealar asosida faol so‘zlashni kengaytirish",
  ],
  receptiveLanguage: [
    "Bir va ikki bosqichli ko‘rsatmalarni o‘yin davomida bajarishni mashq qilish",
    "Fazoviy va predmet tushunchalarini kundalik vaziyatlarda mustahkamlash",
  ],
};

function buildAnswers(
  instrument: AssessmentInstrument,
  answeredCount: number,
  notAchievedEvery = 5,
): Record<string, AssessmentAnswer> {
  return Object.fromEntries(
    assessmentQuestionBank[instrument]
      .slice(0, answeredCount)
      .map((question, index) => [
        question.id,
        index > 0 && index % notAchievedEvery === 0
          ? 3
          : index % 3 === 0
            ? 1
            : 2,
      ]),
  );
}

const reviewAnswers = buildAnswers("KID", assessmentQuestionBank.KID.length, 6);
reviewAnswers["KID-172"] = 3;
reviewAnswers["KID-220"] = 2;

const reviewRcdiAnswers = buildAnswers(
  "RCDI-2000",
  assessmentQuestionBank["RCDI-2000"].length,
  6,
);
reviewRcdiAnswers["RCDI-143"] = 3;
reviewRcdiAnswers["RCDI-159"] = 2;

const secondReviewRcdiAnswers = buildAnswers(
  "RCDI-2000",
  assessmentQuestionBank["RCDI-2000"].length,
  5,
);
secondReviewRcdiAnswers["RCDI-192"] = 3;
secondReviewRcdiAnswers["RCDI-190"] = 2;

const defaultAssessments: AssessmentRecord[] = [
  {
    id: "BAH-2026-0049",
    childId: "CH-001",
    instrument: "KID",
    assessmentDate: "2026-07-18",
    informant: "Onasi",
    assessor: "Karimova Mohira Baxtiyor qizi",
    startedAt: "2026-07-18T09:20:00",
    completedAt: "2026-07-18T10:04:00",
    status: "Yakunlangan",
    answers: buildAnswers("KID", assessmentQuestionBank.KID.length, 7),
    qualityIssues: [],
    planCreated: true,
  },
  {
    id: "BAH-2026-0050",
    childId: "CH-002",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-22",
    informant: "Onasi",
    assessor: "Saidov Akmal Olimovich",
    startedAt: "2026-07-22T14:10:00",
    status: "Jarayonda",
    answers: buildAnswers("RCDI-2000", 87, 5),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0051",
    childId: "CH-003",
    instrument: "KID",
    assessmentDate: "2026-07-23",
    informant: "Otasi",
    assessor: "Tursunova Shahnoza Sherzod qizi",
    startedAt: "2026-07-23T11:30:00",
    completedAt: "2026-07-23T12:15:00",
    status: "Tekshiruv kerak",
    answers: reviewAnswers,
    qualityIssues: [
      "Harakat domenida o‘zaro mos kelmaydigan ikkita javob aniqlandi.",
    ],
  },
  {
    id: "BAH-2026-0052",
    childId: "CH-004",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-24",
    informant: "Onasi",
    assessor: "Karimova Mohira Baxtiyor qizi",
    startedAt: "2026-07-24T10:05:00",
    completedAt: "2026-07-24T11:02:00",
    status: "Yakunlangan",
    answers: buildAnswers(
      "RCDI-2000",
      assessmentQuestionBank["RCDI-2000"].length,
      4,
    ),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0053",
    childId: "CH-005",
    instrument: "KID",
    assessmentDate: "2026-07-25",
    informant: "Onasi",
    assessor: "Tursunova Shahnoza Sherzod qizi",
    startedAt: "2026-07-25T15:40:00",
    status: "Boshlanmagan",
    answers: {},
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0054",
    childId: "CH-006",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-25",
    informant: "Buvisi",
    assessor: "Saidov Akmal Olimovich",
    startedAt: "2026-07-25T16:20:00",
    status: "Jarayonda",
    answers: buildAnswers("RCDI-2000", 54, 4),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0055",
    childId: "CH-007",
    instrument: "KID",
    assessmentDate: "2026-07-10",
    informant: "Onasi",
    assessor: "Nazarova Diyora Baxtiyor qizi",
    startedAt: "2026-07-10T09:10:00",
    completedAt: "2026-07-10T09:52:00",
    status: "Yakunlangan",
    answers: buildAnswers("KID", assessmentQuestionBank.KID.length, 5),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0056",
    childId: "CH-008",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-12",
    informant: "Otasi",
    assessor: "Rahimov Doston Olim o‘g‘li",
    startedAt: "2026-07-12T10:30:00",
    completedAt: "2026-07-12T11:18:00",
    status: "Yakunlangan",
    answers: buildAnswers(
      "RCDI-2000",
      assessmentQuestionBank["RCDI-2000"].length,
      7,
    ),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0057",
    childId: "CH-009",
    instrument: "KID",
    assessmentDate: "2026-07-14",
    informant: "Onasi",
    assessor: "Nazarova Diyora Baxtiyor qizi",
    startedAt: "2026-07-14T14:05:00",
    status: "Jarayonda",
    answers: buildAnswers("KID", 164, 4),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0058",
    childId: "CH-010",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-15",
    informant: "Onasi",
    assessor: "Saparova Gulnaz Marat qizi",
    startedAt: "2026-07-15T09:40:00",
    completedAt: "2026-07-15T10:35:00",
    status: "Tekshiruv kerak",
    answers: reviewRcdiAnswers,
    qualityIssues: [
      "Faol nutqda ibora bor, ma’noli so‘zlar esa yo‘q deb belgilangan.",
    ],
  },
  {
    id: "BAH-2026-0059",
    childId: "CH-011",
    instrument: "KID",
    assessmentDate: "2026-07-17",
    informant: "Onasi",
    assessor: "Qodirova Dilnoza Anvar qizi",
    startedAt: "2026-07-17T11:20:00",
    status: "Boshlanmagan",
    answers: {},
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0060",
    childId: "CH-012",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-18",
    informant: "Onasi",
    assessor: "Olloyorova Sevara Komil qizi",
    startedAt: "2026-07-18T13:05:00",
    completedAt: "2026-07-18T14:00:00",
    status: "Yakunlangan",
    answers: buildAnswers(
      "RCDI-2000",
      assessmentQuestionBank["RCDI-2000"].length,
      5,
    ),
    qualityIssues: [],
    planCreated: true,
  },
  {
    id: "BAH-2026-0061",
    childId: "CH-013",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-19",
    informant: "Buvisi",
    assessor: "Qodirova Dilnoza Anvar qizi",
    startedAt: "2026-07-19T15:15:00",
    status: "Jarayonda",
    answers: buildAnswers("RCDI-2000", 103, 6),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0062",
    childId: "CH-014",
    instrument: "KID",
    assessmentDate: "2026-07-20",
    informant: "Onasi",
    assessor: "Nazarova Diyora Baxtiyor qizi",
    startedAt: "2026-07-20T10:00:00",
    completedAt: "2026-07-20T10:41:00",
    status: "Yakunlangan",
    answers: buildAnswers("KID", assessmentQuestionBank.KID.length, 8),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0063",
    childId: "CH-015",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-21",
    informant: "Otasi",
    assessor: "Karimova Mohira Baxtiyor qizi",
    startedAt: "2026-07-21T08:50:00",
    completedAt: "2026-07-21T09:46:00",
    status: "Yakunlangan",
    answers: buildAnswers(
      "RCDI-2000",
      assessmentQuestionBank["RCDI-2000"].length,
      4,
    ),
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0064",
    childId: "CH-016",
    instrument: "KID",
    assessmentDate: "2026-07-22",
    informant: "Onasi",
    assessor: "Nazarova Diyora Baxtiyor qizi",
    startedAt: "2026-07-22T16:00:00",
    status: "Boshlanmagan",
    answers: {},
    qualityIssues: [],
  },
  {
    id: "BAH-2026-0065",
    childId: "CH-017",
    instrument: "RCDI-2000",
    assessmentDate: "2026-07-23",
    informant: "Onasi",
    assessor: "Rahimov Doston Olim o‘g‘li",
    startedAt: "2026-07-23T12:10:00",
    completedAt: "2026-07-23T13:04:00",
    status: "Tekshiruv kerak",
    answers: secondReviewRcdiAnswers,
    qualityIssues: [
      "Ikki bosqichli ko‘rsatma bajariladi, bir bosqichli ko‘rsatma esa bajarilmaydi deb belgilangan.",
    ],
  },
  {
    id: "BAH-2026-0066",
    childId: "CH-018",
    instrument: "KID",
    assessmentDate: "2026-07-26",
    informant: "Onasi",
    assessor: "Saparova Gulnaz Marat qizi",
    startedAt: "2026-07-26T09:25:00",
    status: "Jarayonda",
    answers: buildAnswers("KID", 71, 5),
    qualityIssues: [],
  },
];

const STORAGE_KEY = "nasp.ei.assessments.v2";

function loadAssessments(): AssessmentRecord[] {
  if (typeof window === "undefined") {
    return defaultAssessments;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const savedRecords = saved ? (JSON.parse(saved) as AssessmentRecord[]) : [];

    if (!savedRecords.length) {
      return defaultAssessments;
    }

    const savedIds = new Set(savedRecords.map((record) => record.id));
    return [
      ...savedRecords,
      ...defaultAssessments.filter((record) => !savedIds.has(record.id)),
    ];
  } catch {
    return defaultAssessments;
  }
}

export const assessmentRecords =
  reactive<AssessmentRecord[]>(loadAssessments());

export function persistAssessments() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assessmentRecords));
  }
}

export function getAssessmentChild(childId: string) {
  return assessmentChildren.find((child) => child.id === childId);
}

export function getAssessmentRecord(recordId: string) {
  return assessmentRecords.find((record) => record.id === recordId);
}

export function createAssessmentRecord(input: {
  childId: string;
  instrument: AssessmentInstrument;
  questionnaireTemplateId: string;
  assessmentDate: string;
  informant: string;
}) {
  const nextNumber =
    Math.max(
      54,
      ...assessmentRecords.map(
        (record) => Number(record.id.split("-").slice(-1)[0]) || 0,
      ),
    ) + 1;
  const record: AssessmentRecord = {
    id: `BAH-2026-${String(nextNumber).padStart(4, "0")}`,
    childId: input.childId,
    instrument: input.instrument,
    questionnaireTemplateId: input.questionnaireTemplateId,
    assessmentDate: input.assessmentDate,
    informant: input.informant,
    assessor: "Karimova Mohira Baxtiyor qizi",
    startedAt: new Date().toISOString(),
    status: "Boshlanmagan",
    answers: {},
    qualityIssues: [],
  };

  assessmentRecords.unshift(record);
  persistAssessments();
  return record;
}

export function updateAssessmentRecord(
  recordId: string,
  patch: Partial<Omit<AssessmentRecord, "id">>,
) {
  const record = getAssessmentRecord(recordId);

  if (!record) {
    return;
  }

  Object.assign(record, patch);
  persistAssessments();
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function getChronologicalAgeMonths(
  birthDate: string,
  assessmentDate: string,
) {
  const start = parseDate(birthDate).getTime();
  const end = parseDate(assessmentDate).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return 0;
  }

  return (end - start) / (1000 * 60 * 60 * 24 * 30.4375);
}

export function getCorrectedAgeMonths(
  birthDate: string,
  assessmentDate: string,
  gestationalWeek: number,
) {
  const chronologicalAge = getChronologicalAgeMonths(birthDate, assessmentDate);

  if (gestationalWeek >= 37 || chronologicalAge >= 24) {
    return chronologicalAge;
  }

  const correctionMonths = (Math.max(0, 40 - gestationalWeek) * 7) / 30.4375;
  return Math.max(0, chronologicalAge - correctionMonths);
}

export function formatAge(ageMonths: number) {
  const months = Math.max(0, Math.floor(ageMonths));
  const days = Math.max(0, Math.round((ageMonths - months) * 30.4375));
  return `${months} oy${days ? ` ${days} kun` : ""}`;
}

export function recommendInstrument(ageMonths: number): AssessmentInstrument {
  return ageMonths < 14 ? "KID" : "RCDI-2000";
}

export function isInstrumentAgeAppropriate(
  instrument: AssessmentInstrument,
  ageMonths: number,
) {
  const metadata = instrumentCatalog[instrument];
  return (
    ageMonths >= metadata.minAgeMonths && ageMonths <= metadata.maxAgeMonths
  );
}

export function getAssessmentProgress(record: AssessmentRecord) {
  const total = assessmentQuestionBank[record.instrument].length;
  const answered = assessmentQuestionBank[record.instrument].filter(
    (question) => record.answers[question.id] !== undefined,
  ).length;

  return {
    answered,
    total,
    percent: total ? Math.round((answered / total) * 100) : 0,
  };
}

export function getContradictionIssues(record: AssessmentRecord) {
  const pairs: Array<[string, string, string]> =
    record.instrument === "KID"
      ? [
          [
            "KID-172",
            "KID-220",
            "Harakat domenida murakkabroq ko‘nikma bor, tayanch ko‘nikma esa yo‘q deb belgilangan.",
          ],
          [
            "KID-067",
            "KID-029",
            "Nutq domenida ma’noli so‘z bor, bo‘g‘inli tovushlar esa yo‘q deb belgilangan.",
          ],
        ]
      : [
          [
            "RCDI-143",
            "RCDI-159",
            "Faol nutqda ibora bor, ma’noli so‘zlar esa yo‘q deb belgilangan.",
          ],
          [
            "RCDI-192",
            "RCDI-190",
            "Ikki bosqichli ko‘rsatma bajariladi, bir bosqichli ko‘rsatma esa bajarilmaydi deb belgilangan.",
          ],
        ];

  return pairs
    .filter(
      ([foundationId, advancedId]) =>
        record.answers[foundationId] === 3 &&
        [1, 2].includes(record.answers[advancedId] ?? 0),
    )
    .map(([, , issue]) => issue);
}

export function calculateDomainResults(
  record: AssessmentRecord,
): DomainResult[] {
  const child = getAssessmentChild(record.childId);
  const questions = assessmentQuestionBank[record.instrument];
  const referenceAgeMonths = child
    ? getCorrectedAgeMonths(
        child.birthDate,
        record.assessmentDate,
        child.gestationalWeek,
      )
    : 0;

  return instrumentCatalog[record.instrument].domains.map((domain) => {
    const domainQuestions = questions.filter(
      (question) =>
        question.domain === domain ||
        question.additionalDomains?.includes(domain),
    );
    const achieved = domainQuestions.filter((question) =>
      [1, 2].includes(record.answers[question.id] ?? 0),
    ).length;
    const score = domainQuestions.length
      ? Math.round((achieved / domainQuestions.length) * 100)
      : 0;
    const developmentRatio = 0.62 + (score / 100) * 0.48;
    const developmentAgeMonths = Math.min(
      instrumentCatalog[record.instrument].maxAgeMonths,
      Math.round(referenceAgeMonths * developmentRatio * 10) / 10,
    );
    const delayMonths = Math.max(
      0,
      Math.round((referenceAgeMonths - developmentAgeMonths) * 10) / 10,
    );
    const watchThreshold = record.instrument === "KID" ? 1.5 : 3;
    const priorityThreshold = record.instrument === "KID" ? 3 : 6;
    const level =
      delayMonths >= priorityThreshold
        ? "Ustuvor"
        : delayMonths >= watchThreshold
          ? "Kuzatuv"
          : "Yoshiga mos";

    return {
      domain,
      ...domainCatalog[domain],
      achieved,
      total: domainQuestions.length,
      score,
      developmentAgeMonths,
      referenceAgeMonths,
      delayMonths,
      level,
    };
  });
}

export function getSuggestedGoals(record: AssessmentRecord) {
  return calculateDomainResults(record)
    .sort((left, right) => left.score - right.score)
    .slice(0, 3)
    .flatMap((result) =>
      goalCatalog[result.domain].slice(0, 1).map((title, index) => ({
        id: `${record.id}-${result.domain}-${index}`,
        domain: result.domain,
        domainLabel: result.label,
        title,
        duration: "3 oy",
        selected: true,
      })),
    );
}
