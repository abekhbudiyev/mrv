<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ChevronLeft, Save } from "lucide-vue-next";
import {
  assessmentQuestionBank,
  saveAssessmentQuestionChanges,
  sortAssessmentQuestionsForDisplay,
  type AssessmentInstrument,
  type AssessmentQuestion,
  type DevelopmentDomain,
} from "@/features/ei/assessment-question-bank";
import {
  getFirstQuestionnaireTranslation,
  normalizeQuestionnaireTranslations,
  questionnaireLanguages,
  type CompleteQuestionnaireTranslations,
  type QuestionnaireLanguage,
  type QuestionnaireTranslations,
} from "@/features/ei/questionnaire-languages";
import {
  saveEiProductionRecord,
  type EiProductionRecord,
} from "@/features/ei/production-pages";
import EIQuestionDomainSelect from "@/features/ei/components/EIQuestionDomainSelect.vue";
import EITranslationDisclosure from "@/features/ei/components/EITranslationDisclosure.vue";
import FilterSelect from "@/shared/components/FilterSelect.vue";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Label } from "@/shared/ui/shadcn/label";

const props = withDefaults(
  defineProps<{
    record: EiProductionRecord;
    isNew?: boolean;
  }>(),
  {
    isNew: false,
  },
);

const emit = defineEmits<{
  cancel: [];
  saved: [recordId: string];
}>();

type TemplateForm = {
  instrumentCode: string;
  shortNames: CompleteQuestionnaireTranslations;
  names: CompleteQuestionnaireTranslations;
  minAge: string;
  maxAge: string;
  status: string;
};

const domainLabels: Record<DevelopmentDomain, string> = {
  cognitive: "Bilish jarayonlari",
  motor: "Harakat rivojlanishi",
  language: "Nutq va muloqot",
  selfCare: "O‘ziga xizmat",
  social: "Ijtimoiy rivojlanish",
  grossMotor: "Yirik motorika",
  fineMotor: "Mayda motorika",
  expressiveLanguage: "Faol nutq",
  receptiveLanguage: "Nutqni tushunish",
};

const form = ref<TemplateForm>({
  instrumentCode: "",
  shortNames: normalizeQuestionnaireTranslations({}),
  names: normalizeQuestionnaireTranslations({}),
  minAge: "",
  maxAge: "",
  status: "Faol",
});
const questionDrafts = ref<AssessmentQuestion[]>([]);
const formError = ref("");

const resolvedInstrument = computed<AssessmentInstrument | null>(() => {
  const value = form.value.instrumentCode.trim().toUpperCase();

  if (value === "KID") {
    return "KID";
  }

  if (value === "RCDI" || value === "RCDI-2000") {
    return "RCDI-2000";
  }

  return null;
});

const availableDomains = computed(() => [
  ...new Set(questionDrafts.value.map((question) => question.domain)),
]);

watch(() => props.record.id, loadEditor, { immediate: true });

watch(
  () => form.value.instrumentCode,
  (value, previousValue) => {
    if (!props.isNew || value === previousValue) {
      return;
    }

    const instrument = resolvedInstrument.value;

    if (!instrument) {
      questionDrafts.value = [];
      return;
    }

    const previousShortName =
      previousValue.trim().toUpperCase() === "RCDI-2000"
        ? "RCDI"
        : previousValue.trim().toUpperCase();

    if (
      !form.value.shortNames.uzLatn.trim() ||
      form.value.shortNames.uzLatn.trim().toUpperCase() === previousShortName
    ) {
      form.value.shortNames.uzLatn =
        instrument === "RCDI-2000" ? "RCDI" : instrument;
    }

    questionDrafts.value = sortAssessmentQuestionsForDisplay(
      instrument,
      assessmentQuestionBank[instrument].map(cloneQuestion),
    );

    if (instrument === "KID") {
      form.value.minAge = "2";
      form.value.maxAge = "16";
    } else {
      form.value.minAge = "14";
      form.value.maxAge = "42";
    }
  },
);

function cloneQuestion(question: AssessmentQuestion): AssessmentQuestion {
  return {
    ...question,
    translations: normalizeQuestionnaireTranslations(question.translations, {
      ru: question.text,
    }),
    additionalDomains: question.additionalDomains
      ? [...question.additionalDomains]
      : undefined,
  };
}

function parseAgeRange(value: string) {
  const values = value
    .match(/\d+(?:[.,]\d+)?/g)
    ?.slice(0, 2)
    .map((item) => item.replace(",", "."));

  return {
    minAge: values?.[0] ?? "",
    maxAge: values?.[1] ?? "",
  };
}

function formatAgeRange(minAge: string, maxAge: string) {
  const formatter = new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 1,
  });

  return `${formatter.format(Number(minAge))}–${formatter.format(Number(maxAge))} oy`;
}

function loadEditor() {
  const ageRange = parseAgeRange(String(props.record.ageRange ?? ""));
  const shortName = String(props.record.shortName ?? "");
  const instrumentCode = String(
    props.record.instrumentCode ?? shortName,
  ).toUpperCase();

  form.value = {
    instrumentCode: instrumentCode === "RCDI-2000" ? "RCDI" : instrumentCode,
    shortNames: normalizeQuestionnaireTranslations(
      props.record.shortNameTranslations,
      {
        uzLatn: shortName,
      },
    ),
    names: normalizeQuestionnaireTranslations(props.record.nameTranslations, {
      uzLatn: String(props.record.fullName ?? ""),
    }),
    minAge: ageRange.minAge,
    maxAge: ageRange.maxAge,
    status: String(props.record.status ?? "Faol"),
  };

  const instrument = resolvedInstrument.value;
  const questions = instrument
    ? sortAssessmentQuestionsForDisplay(
        instrument,
        assessmentQuestionBank[instrument].map(cloneQuestion),
      )
    : [];

  questionDrafts.value = questions;
  formError.value = "";
}

function trimTranslations(translations: CompleteQuestionnaireTranslations) {
  return Object.fromEntries(
    questionnaireLanguages.map(({ code }) => [code, translations[code].trim()]),
  ) as CompleteQuestionnaireTranslations;
}

function updateQuestionTranslation(
  question: AssessmentQuestion,
  language: QuestionnaireLanguage,
  value: string,
) {
  const translations = normalizeQuestionnaireTranslations(
    question.translations,
    { ru: question.text },
  );

  translations[language] = value;
  question.translations = translations;

  if (language === "ru") {
    question.text = value;
  }
}

function getQuestionTranslation(
  question: AssessmentQuestion,
  language: QuestionnaireLanguage,
) {
  return normalizeQuestionnaireTranslations(question.translations, {
    ru: question.text,
  })[language];
}

function updateQuestionTranslations(
  question: AssessmentQuestion,
  translations: QuestionnaireTranslations,
) {
  const normalizedTranslations = normalizeQuestionnaireTranslations(
    translations,
    {
      ru: question.text,
    },
  );

  question.translations = normalizedTranslations;
  question.text = getFirstQuestionnaireTranslation(normalizedTranslations, [
    "ru",
    "uzLatn",
    "uzCyrl",
    "en",
    "kaaLatn",
  ]);
}

function getQuestionTranslations(question: AssessmentQuestion) {
  return normalizeQuestionnaireTranslations(question.translations, {
    ru: question.text,
  });
}

function getCanonicalQuestionText(question: AssessmentQuestion) {
  const translations = normalizeQuestionnaireTranslations(
    question.translations,
    { ru: question.text },
  );

  return getFirstQuestionnaireTranslation(translations, [
    "ru",
    "uzLatn",
    "uzCyrl",
    "en",
    "kaaLatn",
  ]);
}

function updateQuestionAge(question: AssessmentQuestion, value: string) {
  question.skillAgeMonths = Number(value);
}

function saveTemplate() {
  formError.value = "";

  const shortNameTranslations = trimTranslations(form.value.shortNames);
  const nameTranslations = trimTranslations(form.value.names);
  const shortName = getFirstQuestionnaireTranslation(shortNameTranslations);
  const templateName = getFirstQuestionnaireTranslation(nameTranslations);

  if (!form.value.instrumentCode.trim() || !shortName || !templateName) {
    formError.value = "So‘rovnoma turi, qisqa nom va to‘liq nomni kiriting";
    return;
  }

  const minAge = Number(form.value.minAge);
  const maxAge = Number(form.value.maxAge);

  if (
    !form.value.minAge.trim() ||
    !form.value.maxAge.trim() ||
    !Number.isFinite(minAge) ||
    !Number.isFinite(maxAge) ||
    minAge < 0 ||
    maxAge < 0
  ) {
    formError.value = "Minimal va maksimal yoshni oy hisobida kiriting";
    return;
  }

  if (maxAge < minAge) {
    formError.value =
      "Maksimal yosh minimal yoshdan kichik bo‘lishi mumkin emas";
    return;
  }

  const invalidQuestion = questionDrafts.value.find(
    (question) =>
      !getCanonicalQuestionText(question) ||
      !Number.isFinite(question.skillAgeMonths) ||
      question.skillAgeMonths < 0,
  );

  if (invalidQuestion) {
    formError.value = `${invalidQuestion.sourceNumber}-savol matni yoki ko‘nikma yoshini tekshiring`;
    return;
  }

  const instrument = resolvedInstrument.value;

  if (!instrument) {
    formError.value = "Shablon instrumenti aniqlanmadi";
    return;
  }

  const recordId = String(props.record.id ?? Date.now());
  const updatedRecord: EiProductionRecord = {
    ...props.record,
    id: props.record.id ?? recordId,
    docNumber:
      String(props.record.docNumber ?? "").trim() ||
      `SHB-${recordId.padStart(3, "0")}`,
    docOn:
      String(props.record.docOn ?? "").trim() ||
      new Intl.DateTimeFormat("ru-RU").format(new Date()),
    instrumentCode: form.value.instrumentCode.trim(),
    shortName,
    shortNameTranslations,
    fullName: templateName,
    nameTranslations,
    ageRange: formatAgeRange(form.value.minAge, form.value.maxAge),
    status: form.value.status,
  };

  saveEiProductionRecord("questionnaires", updatedRecord);
  saveAssessmentQuestionChanges(
    instrument,
    questionDrafts.value.map((question) => {
      const translations = trimTranslations(
        normalizeQuestionnaireTranslations(question.translations, {
          ru: question.text,
        }),
      );

      return {
        id: question.id,
        text: getFirstQuestionnaireTranslation(translations, [
          "ru",
          "uzLatn",
          "uzCyrl",
          "en",
          "kaaLatn",
        ]),
        translations,
        domain: question.domain,
        additionalDomains: question.additionalDomains
          ? [...question.additionalDomains]
          : undefined,
        skillAgeMonths: question.skillAgeMonths,
      };
    }),
  );
  emit("saved", String(updatedRecord.id));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <Button variant="outline" class="h-10 gap-2" @click="emit('cancel')">
        <ChevronLeft class="h-4 w-4" />
        Ortga
      </Button>
      <Button class="gap-2" @click="saveTemplate">
        <Save class="h-4 w-4" />
        Saqlash
      </Button>
    </div>

    <Card class="overflow-hidden border border-border ring-0 hover:shadow-none">
      <CardContent class="space-y-3 p-4">
        <div class="grid gap-4 md:grid-cols-2">
          <FilterSelect
            v-if="props.isNew"
            v-model="form.instrumentCode"
            label="So‘rovnoma turi"
            :options="['KID', 'RCDI']"
            :searchable="false"
            all-label="Tanlang"
          />
          <div class="space-y-3 rounded-lg border border-border p-3">
            <Label for="template-short-name">Qisqa nomi</Label>
            <Input
              id="template-short-name"
              v-model="form.shortNames.uzLatn"
              placeholder="Qisqa nomini kiriting"
            />
            <EITranslationDisclosure
              v-model="form.shortNames"
              id-prefix="template-short-name-translation"
            />
          </div>

          <div class="space-y-3 rounded-lg border border-border p-3">
            <Label for="template-full-name">To‘liq nomi</Label>
            <Input
              id="template-full-name"
              v-model="form.names.uzLatn"
              placeholder="To‘liq nomini kiriting"
            />
            <EITranslationDisclosure
              v-model="form.names"
              id-prefix="template-full-name-translation"
            />
          </div>

          <div class="grid gap-4 md:col-span-2 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="template-min-age">Minimal yosh (oy)</Label>
              <Input
                id="template-min-age"
                v-model="form.minAge"
                type="number"
                min="0"
                step="0.1"
                placeholder="Masalan: 2"
              />
            </div>
            <div class="space-y-2">
              <Label for="template-max-age">Maksimal yosh (oy)</Label>
              <Input
                id="template-max-age"
                v-model="form.maxAge"
                type="number"
                min="0"
                step="0.1"
                placeholder="Masalan: 16"
              />
            </div>
          </div>
        </div>

        <p v-if="formError" class="text-sm font-medium text-red-600">
          {{ formError }}
        </p>
      </CardContent>
    </Card>

    <div class="space-y-3">
      <article
        v-for="question in questionDrafts"
        :key="question.id"
        class="question-editor-card rounded-xl border border-border bg-card p-4"
      >
        <div class="flex items-start gap-3">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary"
          >
            {{ question.sourceNumber }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_15rem_10rem]">
              <div class="space-y-3">
                <Label :for="`question-text-${question.id}`">
                  Savol matni
                </Label>
                <textarea
                  :id="`question-text-${question.id}`"
                  :value="getQuestionTranslation(question, 'uzLatn')"
                  rows="3"
                  placeholder="Savol matnini kiriting"
                  class="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  @input="
                    updateQuestionTranslation(
                      question,
                      'uzLatn',
                      ($event.target as HTMLTextAreaElement).value,
                    )
                  "
                />
                <EITranslationDisclosure
                  :model-value="getQuestionTranslations(question)"
                  :id-prefix="`question-${question.id}-translation`"
                  multiline
                  @update:model-value="
                    updateQuestionTranslations(question, $event)
                  "
                />
              </div>
              <EIQuestionDomainSelect
                :id="`question-domain-${question.id}`"
                v-model="question.domain"
                :options="availableDomains"
                :labels="domainLabels"
              />
              <div class="space-y-2">
                <Label :for="`question-age-${question.id}`"
                  >Ko‘nikma yoshi</Label
                >
                <Input
                  :id="`question-age-${question.id}`"
                  :model-value="String(question.skillAgeMonths)"
                  type="number"
                  min="0"
                  step="0.1"
                  @update:model-value="
                    updateQuestionAge(question, String($event))
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <p
      v-if="formError"
      class="sticky bottom-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
    >
      {{ formError }}
    </p>
  </div>
</template>

<style scoped>
.question-editor-card {
  content-visibility: auto;
  contain-intrinsic-size: 190px;
}
</style>
