<script setup lang="ts">
import { computed } from "vue";
import { BookOpenCheck } from "lucide-vue-next";
import {
  assessmentQuestionBank,
  sortAssessmentQuestionsForDisplay,
  type AssessmentInstrument,
  type AssessmentQuestion,
  type DevelopmentDomain,
} from "@/features/ei/assessment-question-bank";
import {
  normalizeQuestionnaireTranslations,
  type CompleteQuestionnaireTranslations,
  type QuestionnaireLanguage,
} from "@/features/ei/questionnaire-languages";
import type { EiProductionRecord } from "@/features/ei/production-pages";
import EITranslationDisclosure from "@/features/ei/components/EITranslationDisclosure.vue";
import { useI18n } from "@/shared/i18n";
import { Label } from "@/shared/ui/shadcn/label";

const props = defineProps<{
  record: EiProductionRecord;
}>();

const { locale } = useI18n();

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

const selectedQuestionnaireLanguage = computed<QuestionnaireLanguage>(() => {
  if (locale.value === "ru") {
    return "ru";
  }

  if (locale.value === "en") {
    return "en";
  }

  return "uzLatn";
});

function getQuestionTranslations(question: AssessmentQuestion) {
  return normalizeQuestionnaireTranslations(question.translations, {
    ru: question.text,
  });
}

function getQuestionText(question: AssessmentQuestion) {
  const translations = getQuestionTranslations(question);

  return getSelectedTranslation(translations, question.text);
}

function getSelectedTranslation(
  translations: CompleteQuestionnaireTranslations,
  fallback = "",
) {
  return (
    translations[selectedQuestionnaireLanguage.value] ||
    translations.uzLatn ||
    fallback ||
    "—"
  );
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

const templateInfo = computed(() => {
  const shortName = String(props.record.shortName ?? "");
  const ageRange = parseAgeRange(String(props.record.ageRange ?? ""));

  return {
    instrumentCode: String(props.record.instrumentCode ?? shortName),
    shortNames: normalizeQuestionnaireTranslations(
      props.record.shortNameTranslations,
      { uzLatn: shortName },
    ),
    names: normalizeQuestionnaireTranslations(props.record.nameTranslations, {
      uzLatn: String(props.record.fullName ?? ""),
    }),
    minAge: ageRange.minAge,
    maxAge: ageRange.maxAge,
  };
});

const resolvedInstrument = computed<AssessmentInstrument | null>(() => {
  const value = templateInfo.value.instrumentCode.trim().toUpperCase();

  if (value === "KID") {
    return "KID";
  }

  if (value === "RCDI" || value === "RCDI-2000") {
    return "RCDI-2000";
  }

  return null;
});

const questions = computed<AssessmentQuestion[]>(() => {
  const instrument = resolvedInstrument.value;

  return instrument
    ? sortAssessmentQuestionsForDisplay(
        instrument,
        assessmentQuestionBank[instrument],
      )
    : [];
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="rounded-xl border border-border bg-card p-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-3 rounded-lg border border-border p-3">
          <Label>Qisqa nomi</Label>
          <div
            class="flex min-h-9 items-center rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {{ getSelectedTranslation(templateInfo.shortNames) }}
          </div>
          <EITranslationDisclosure
            :model-value="templateInfo.shortNames"
            id-prefix="template-short-name-translation-view"
            :base-language="selectedQuestionnaireLanguage"
            read-only
          />
        </div>

        <div class="space-y-3 rounded-lg border border-border p-3">
          <Label>To‘liq nomi</Label>
          <div
            class="flex min-h-9 items-center rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {{ getSelectedTranslation(templateInfo.names) }}
          </div>
          <EITranslationDisclosure
            :model-value="templateInfo.names"
            id-prefix="template-full-name-translation-view"
            :base-language="selectedQuestionnaireLanguage"
            read-only
          />
        </div>

        <div class="grid gap-4 md:col-span-2 md:grid-cols-2">
          <div class="space-y-2">
            <Label>Minimal yosh (oy)</Label>
            <div
              class="flex h-9 items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              {{ templateInfo.minAge || "—" }}
            </div>
          </div>
          <div class="space-y-2">
            <Label>Maksimal yosh (oy)</Label>
            <div
              class="flex h-9 items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              {{ templateInfo.maxAge || "—" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="space-y-3">
      <template v-if="questions.length">
        <ol class="space-y-3">
          <li
            v-for="question in questions"
            :key="question.id"
            class="question-card rounded-xl border border-border bg-card p-4"
          >
            <article class="flex min-w-0 gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary"
              >
                {{ question.sourceNumber }}
              </span>
              <div class="min-w-0 flex-1">
                <div
                  class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_15rem_10rem]"
                >
                  <div class="space-y-3">
                    <Label>Savol matni</Label>
                    <div
                      class="min-h-[5.25rem] whitespace-pre-wrap rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground"
                    >
                      {{ getQuestionText(question) }}
                    </div>
                    <EITranslationDisclosure
                      :model-value="getQuestionTranslations(question)"
                      :id-prefix="`question-${question.id}-translation-view`"
                      :base-language="selectedQuestionnaireLanguage"
                      multiline
                      read-only
                    />
                  </div>

                  <div class="space-y-2">
                    <Label>Rivojlanish sohasi</Label>
                    <div
                      class="flex min-h-9 items-center rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      {{ domainLabels[question.domain] }}
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label>Ko‘nikma yoshi</Label>
                    <div
                      class="flex h-9 items-center rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      {{ question.skillAgeMonths }}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </li>
        </ol>
      </template>

      <div
        v-else
        class="rounded-xl border border-dashed border-border px-6 py-14 text-center"
      >
        <BookOpenCheck class="mx-auto h-8 w-8 text-muted-foreground" />
        <p class="mt-3 text-sm font-semibold text-foreground">
          So‘rovnoma savollari topilmadi
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          Shablon uchun KID yoki RCDI instrumentini belgilang.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.question-card {
  content-visibility: auto;
  contain-intrinsic-size: 150px;
}
</style>
