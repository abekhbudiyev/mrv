export const questionnaireLanguages = [
  { code: "uzLatn", label: "O‘zbek tili (lotin yozuvi)" },
  { code: "uzCyrl", label: "O‘zbek tili (kirill yozuvi)" },
  { code: "ru", label: "Rus tili" },
  { code: "en", label: "Ingliz tili" },
  { code: "kaaLatn", label: "Qoraqalpoq tili (lotin yozuvi)" },
] as const;

export type QuestionnaireLanguage =
  (typeof questionnaireLanguages)[number]["code"];

export type QuestionnaireTranslations = Partial<
  Record<QuestionnaireLanguage, string>
>;

export type CompleteQuestionnaireTranslations = Record<
  QuestionnaireLanguage,
  string
>;

export function normalizeQuestionnaireTranslations(
  value: unknown,
  fallback: QuestionnaireTranslations = {},
): CompleteQuestionnaireTranslations {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return Object.fromEntries(
    questionnaireLanguages.map(({ code }) => [
      code,
      typeof source[code] === "string" ? source[code] : (fallback[code] ?? ""),
    ]),
  ) as CompleteQuestionnaireTranslations;
}

export function getFirstQuestionnaireTranslation(
  translations: QuestionnaireTranslations,
  preferredLanguages: readonly QuestionnaireLanguage[] = [
    "uzLatn",
    "uzCyrl",
    "ru",
    "en",
    "kaaLatn",
  ],
) {
  for (const language of preferredLanguages) {
    const value = translations[language]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}
