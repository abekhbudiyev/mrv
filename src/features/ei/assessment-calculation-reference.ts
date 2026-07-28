import type { AssessmentAnswer } from "./questionnaire-answer-options";
import type {
  AssessmentInstrument,
  DevelopmentDomain,
} from "./assessment-question-bank";

export type AssessmentDomainReference = {
  instrument: AssessmentInstrument;
  code: DevelopmentDomain;
  fullName: string;
  shortName: string;
  orderNumber: number;
};

export type AssessmentAnswerScoringRule = {
  instrument: AssessmentInstrument;
  answer: AssessmentAnswer;
  code: string;
  fullName: string;
  score: number;
  skillResult: "Mavjud" | "Mavjud emas";
};

export type AssessmentResultCriterion = {
  instrument: AssessmentInstrument;
  level: "Yoshiga mos" | "Kuzatuv" | "Ustuvor";
  minDelayMonths: number;
  maxDelayMonths?: number;
  version: string;
  status: "Loyiha" | "Tasdiqlangan";
};

export const assessmentDomainReferences: AssessmentDomainReference[] = [
  { instrument: "KID", code: "cognitive", fullName: "Bilish jarayonlari", shortName: "Bilish", orderNumber: 1 },
  { instrument: "KID", code: "motor", fullName: "Harakat rivojlanishi", shortName: "Harakat", orderNumber: 2 },
  { instrument: "KID", code: "language", fullName: "Nutq va muloqot", shortName: "Nutq", orderNumber: 3 },
  { instrument: "KID", code: "selfCare", fullName: "O‘ziga xizmat", shortName: "O‘ziga xizmat", orderNumber: 4 },
  { instrument: "KID", code: "social", fullName: "Ijtimoiy rivojlanish", shortName: "Ijtimoiy", orderNumber: 5 },
  { instrument: "RCDI-2000", code: "social", fullName: "Ijtimoiy rivojlanish", shortName: "Ijtimoiy", orderNumber: 1 },
  { instrument: "RCDI-2000", code: "selfCare", fullName: "O‘ziga xizmat", shortName: "O‘ziga xizmat", orderNumber: 2 },
  { instrument: "RCDI-2000", code: "grossMotor", fullName: "Yirik motorika", shortName: "Yirik motorika", orderNumber: 3 },
  { instrument: "RCDI-2000", code: "fineMotor", fullName: "Mayda motorika", shortName: "Mayda motorika", orderNumber: 4 },
  { instrument: "RCDI-2000", code: "expressiveLanguage", fullName: "Faol nutq", shortName: "Faol nutq", orderNumber: 5 },
  { instrument: "RCDI-2000", code: "receptiveLanguage", fullName: "Nutqni tushunish", shortName: "Tushunish", orderNumber: 6 },
];

export const assessmentAnswerScoringRules: AssessmentAnswerScoringRule[] = (
  ["KID", "RCDI-2000"] as AssessmentInstrument[]
).flatMap((instrument) => [
  {
    instrument,
    answer: 1 as AssessmentAnswer,
    code: "RECENT",
    fullName: "Yaqinda boshladi",
    score: 1,
    skillResult: "Mavjud" as const,
  },
  {
    instrument,
    answer: 2 as AssessmentAnswer,
    code: "ESTABLISHED",
    fullName: "Avvaldan bajaradi",
    score: 1,
    skillResult: "Mavjud" as const,
  },
  {
    instrument,
    answer: 3 as AssessmentAnswer,
    code: "NOT_YET",
    fullName: "Hali bajarmaydi",
    score: 0,
    skillResult: "Mavjud emas" as const,
  },
]);

// These thresholds preserve the current prototype behavior. They remain drafts
// until the approved KID and RCDI-2000 normative manuals are entered.
export const assessmentResultCriteria: AssessmentResultCriterion[] = [
  { instrument: "KID", level: "Yoshiga mos", minDelayMonths: 0, maxDelayMonths: 1.49, version: "DEMO-1", status: "Loyiha" },
  { instrument: "KID", level: "Kuzatuv", minDelayMonths: 1.5, maxDelayMonths: 2.99, version: "DEMO-1", status: "Loyiha" },
  { instrument: "KID", level: "Ustuvor", minDelayMonths: 3, version: "DEMO-1", status: "Loyiha" },
  { instrument: "RCDI-2000", level: "Yoshiga mos", minDelayMonths: 0, maxDelayMonths: 2.99, version: "DEMO-1", status: "Loyiha" },
  { instrument: "RCDI-2000", level: "Kuzatuv", minDelayMonths: 3, maxDelayMonths: 5.99, version: "DEMO-1", status: "Loyiha" },
  { instrument: "RCDI-2000", level: "Ustuvor", minDelayMonths: 6, version: "DEMO-1", status: "Loyiha" },
];

export function getAssessmentAnswerScore(
  instrument: AssessmentInstrument,
  answer?: AssessmentAnswer,
) {
  if (answer === undefined) {
    return 0;
  }

  return assessmentAnswerScoringRules.find(
    (rule) => rule.instrument === instrument && rule.answer === answer,
  )?.score ?? 0;
}

export function getAssessmentResultLevel(
  instrument: AssessmentInstrument,
  delayMonths: number,
) {
  return assessmentResultCriteria.find(
    (criterion) =>
      criterion.instrument === instrument
      && delayMonths >= criterion.minDelayMonths
      && (
        criterion.maxDelayMonths === undefined
        || delayMonths <= criterion.maxDelayMonths
      ),
  )?.level ?? "Yoshiga mos";
}
