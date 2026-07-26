<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronDown, Languages } from "lucide-vue-next";
import {
  normalizeQuestionnaireTranslations,
  questionnaireLanguages,
  type QuestionnaireLanguage,
  type QuestionnaireTranslations,
} from "@/features/ei/questionnaire-languages";
import { Input } from "@/shared/ui/shadcn/input";

const props = withDefaults(
  defineProps<{
    modelValue: QuestionnaireTranslations;
    idPrefix: string;
    multiline?: boolean;
    baseLanguage?: QuestionnaireLanguage;
    readOnly?: boolean;
  }>(),
  {
    multiline: false,
    baseLanguage: "uzLatn",
    readOnly: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: QuestionnaireTranslations];
}>();

const isOpen = ref(false);
const translationLanguages = computed(() =>
  questionnaireLanguages.filter(
    (language) => language.code !== props.baseLanguage,
  ),
);
const normalizedTranslations = computed(() =>
  normalizeQuestionnaireTranslations(props.modelValue),
);
const filledCount = computed(
  () =>
    translationLanguages.value.filter(
      ({ code }) => normalizedTranslations.value[code].trim().length > 0,
    ).length,
);

function updateTranslation(language: QuestionnaireLanguage, value: string) {
  emit("update:modelValue", {
    ...normalizedTranslations.value,
    [language]: value,
  });
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-dashed border-border">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-3 bg-muted/20 px-3 py-2.5 text-left transition hover:bg-muted/50"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <span class="flex min-w-0 items-center gap-2">
        <Languages class="h-4 w-4 shrink-0 text-primary" />
        <span class="text-sm font-medium text-foreground">Tarjimalar</span>
        <span
          class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
        >
          {{ filledCount }}/{{ translationLanguages.length }}
        </span>
      </span>
      <ChevronDown
        :class="[
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
          isOpen && 'rotate-180',
        ]"
      />
    </button>

    <div
      v-if="isOpen"
      class="grid gap-3 border-t border-border bg-background p-3 md:grid-cols-2"
    >
      <div
        v-for="language in translationLanguages"
        :key="language.code"
        class="space-y-1.5"
      >
        <span class="text-xs font-medium text-muted-foreground">
          {{ language.label }}
        </span>
        <div
          v-if="readOnly"
          :id="`${idPrefix}-${language.code}`"
          :class="[
            'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
            multiline ? 'min-h-[4.75rem] whitespace-pre-wrap leading-6' : '',
          ]"
        >
          {{ normalizedTranslations[language.code] || "—" }}
        </div>
        <textarea
          v-else-if="multiline"
          :id="`${idPrefix}-${language.code}`"
          :value="normalizedTranslations[language.code]"
          rows="3"
          :placeholder="`${language.label} tilidagi matn`"
          class="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          @input="
            updateTranslation(
              language.code,
              ($event.target as HTMLTextAreaElement).value,
            )
          "
        />
        <Input
          v-else
          :id="`${idPrefix}-${language.code}`"
          :model-value="normalizedTranslations[language.code]"
          :placeholder="`${language.label} tilidagi qiymat`"
          @update:model-value="updateTranslation(language.code, String($event))"
        />
      </div>
    </div>
  </div>
</template>
