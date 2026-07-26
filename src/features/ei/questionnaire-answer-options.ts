import type { QuestionnaireLanguage } from "./questionnaire-languages";

export type AssessmentAnswer = 1 | 2 | 3;

export type QuestionnaireAnswerCopy = {
  title: string;
  description: string;
  result: string;
};

export type QuestionnaireAnswerOption = QuestionnaireAnswerCopy & {
  value: AssessmentAnswer;
  translations: Record<QuestionnaireLanguage, QuestionnaireAnswerCopy>;
};

const answerCopies: Record<
  AssessmentAnswer,
  Record<QuestionnaireLanguage, QuestionnaireAnswerCopy>
> = {
  1: {
    uzLatn: {
      title: "Yaqinda boshladi",
      description: "Ko‘nikma so‘nggi bir oy ichida paydo bo‘lgan.",
      result: "Ko‘nikma mavjud",
    },
    uzCyrl: {
      title: "Яқинда бошлади",
      description: "Кўникма сўнгги бир ой ичида пайдо бўлган.",
      result: "Кўникма мавжуд",
    },
    ru: {
      title: "Делает это недавно",
      description: "Навык появился в течение последнего месяца.",
      result: "Навык сформирован",
    },
    en: {
      title: "Started recently",
      description: "The skill emerged within the past month.",
      result: "Skill present",
    },
    kaaLatn: {
      title: "Jaqında orınlay basladı",
      description: "Kónlikpe sońǵı bir ay ishinde payda bolǵan.",
      result: "Kónlikpe bar",
    },
  },
  2: {
    uzLatn: {
      title: "Avvaldan bajaradi",
      description: "Ko‘nikma barqaror shakllangan.",
      result: "Ko‘nikma mavjud",
    },
    uzCyrl: {
      title: "Аввалдан бажаради",
      description: "Кўникма барқарор шаклланган.",
      result: "Кўникма мавжуд",
    },
    ru: {
      title: "Делает это давно",
      description: "Навык устойчиво сформирован.",
      result: "Навык сформирован",
    },
    en: {
      title: "Has done it for a while",
      description: "The skill is firmly established.",
      result: "Skill present",
    },
    kaaLatn: {
      title: "Burınnan orınlaydı",
      description: "Kónlikpe turaqlı qáliplesken.",
      result: "Kónlikpe bar",
    },
  },
  3: {
    uzLatn: {
      title: "Hali bajarmaydi",
      description: "Ko‘nikma hozircha kuzatilmagan.",
      result: "Ko‘nikma mavjud emas",
    },
    uzCyrl: {
      title: "Ҳали бажармайди",
      description: "Кўникма ҳозирча кузатилмаган.",
      result: "Кўникма мавжуд эмас",
    },
    ru: {
      title: "Пока не делает",
      description: "Навык пока не наблюдается.",
      result: "Навык не сформирован",
    },
    en: {
      title: "Does not do it yet",
      description: "The skill has not yet been observed.",
      result: "Skill not present",
    },
    kaaLatn: {
      title: "Ele orınlamaydı",
      description: "Kónlikpe házirinshe baqlanbaǵan.",
      result: "Kónlikpe joq",
    },
  },
};

export const questionnaireAnswerOptions: QuestionnaireAnswerOption[] = (
  [1, 2, 3] as AssessmentAnswer[]
).map((value) => ({
  value,
  ...answerCopies[value].uzLatn,
  translations: answerCopies[value],
}));
