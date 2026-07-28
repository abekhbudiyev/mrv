<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Ellipsis,
  Eye,
  FilePenLine,
  List,
  Plus,
  RotateCcw,
  Save,
  Search,
} from "lucide-vue-next";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";
import {
  eiProductionRecords,
  getEiProductionPageConfig,
  saveEiProductionRecord,
  type EiProductionField,
  type EiProductionRecord,
  type EiProductionValue,
} from "@/features/ei/production-pages";
import PageContainer from "@/shared/components/PageContainer.vue";
import SectionBlock from "@/shared/components/SectionBlock.vue";
import FilterPopover from "@/shared/components/FilterPopover.vue";
import FilterSelect from "@/shared/components/FilterSelect.vue";
import StatusTabs from "@/shared/components/StatusTabs.vue";
import { Button } from "@/shared/ui/shadcn/button";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";
import { cn } from "@/shared/lib/utils";

const EIQuestionnaireTemplateDetails = defineAsyncComponent(
  () => import("@/features/ei/pages/EIQuestionnaireTemplateDetails.vue"),
);

const EIQuestionnaireTemplateEditor = defineAsyncComponent(
  () => import("@/features/ei/pages/EIQuestionnaireTemplateEditor.vue"),
);

const props = withDefaults(
  defineProps<{
    pageKey: string;
    mode?: "list" | "view" | "edit";
  }>(),
  {
    mode: "list",
  },
);

const route = useRoute();
const router = useRouter();
const searchQuery = ref("");
const selectedStatuses = ref<string[]>([]);
const isFilterOpen = ref(false);
const selectedFilters = ref<Record<string, string>>({});
const formValues = ref<EiProductionRecord>({});
const formError = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(20);
const rowsPerPageOptions = [20, 50, 100, 200, 500];

const pageConfig = computed(() => getEiProductionPageConfig(props.pageKey));
const pageRecords = computed(() => eiProductionRecords[props.pageKey] ?? []);
const selectedRecordId = computed(() => String(route.params.id ?? ""));
const selectedRecord = computed(() =>
  pageRecords.value.find(
    (record) => String(record.id) === selectedRecordId.value,
  ),
);
const questionnaireEditorRecord = computed<EiProductionRecord | undefined>(
  () => {
    if (props.pageKey !== "questionnaires" || props.mode !== "edit") {
      return undefined;
    }

    return (
      selectedRecord.value ?? {
        id: getNextRecordId(),
        docNumber: "",
        docOn: new Intl.DateTimeFormat("ru-RU").format(new Date()),
        fullName: "",
        shortName: "KID",
        instrumentCode: "KID",
        ageRange: "2–16 oy",
        status: "Faol",
      }
    );
  },
);
const visibleFields = computed(() => pageConfig.value.fields);
const statusField = computed(() =>
  pageConfig.value.fields.find((field) => field.kind === "status"),
);
const editableFields = computed(() =>
  pageConfig.value.fields.filter((field) => field.key !== "id"),
);
const filterFields = computed(() =>
  (pageConfig.value.filterKeys ?? [])
    .map((key) => pageConfig.value.fields.find((field) => field.key === key))
    .filter((field): field is EiProductionField => Boolean(field))
    .filter((field) => field.key !== statusField.value?.key),
);
const activeFilterCount = computed(
  () => Object.values(selectedFilters.value).filter(Boolean).length,
);
const canViewRecord = computed(
  () => pageConfig.value.kind !== "reference" && pageConfig.value.canView,
);
const hasRowActions = computed(
  () => Boolean(canViewRecord.value || pageConfig.value.canEdit),
);

function getSearchableValue(value: EiProductionValue) {
  return typeof value === "object"
    ? Object.values(value).join(" ")
    : String(value);
}
const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase("uz-UZ");

  return pageRecords.value.filter((record) => {
    const matchesQuery =
      !query ||
      Object.values(record).some((value) =>
        getSearchableValue(value).toLocaleLowerCase("uz-UZ").includes(query),
      );
    const matchesStatus =
      !selectedStatuses.value.length ||
      (statusField.value &&
        selectedStatuses.value.includes(
          String(record[statusField.value.key] ?? ""),
        ));
    const matchesFilters = filterFields.value.every(
      (field) =>
        !selectedFilters.value[field.key] ||
        String(record[field.key] ?? "") === selectedFilters.value[field.key],
    );

    return matchesQuery && matchesStatus && matchesFilters;
  });
});
const statusTabs = computed(() => {
  if (!statusField.value) {
    return [];
  }

  const recordValues = pageRecords.value
    .map((record) => String(record[statusField.value!.key] ?? ""))
    .filter(Boolean);
  const values = [
    ...new Set([...(statusField.value.options ?? []), ...recordValues]),
  ];

  return [
    {
      label: "Barchasi",
      value: "all",
      count: pageRecords.value.length,
      dotClass: "bg-muted-foreground",
    },
    ...values.map((value) => ({
      label: value,
      value,
      count: pageRecords.value.filter(
        (record) => String(record[statusField.value!.key] ?? "") === value,
      ).length,
      dotClass: getStatusDotClass(value),
    })),
  ];
});
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRecords.value.length / rowsPerPage.value)),
);
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;

  return filteredRecords.value.slice(start, start + rowsPerPage.value);
});
const visibleRangeStart = computed(() =>
  filteredRecords.value.length
    ? (currentPage.value - 1) * rowsPerPage.value + 1
    : 0,
);
const visibleRangeEnd = computed(() =>
  Math.min(currentPage.value * rowsPerPage.value, filteredRecords.value.length),
);
const medicalSurveyRecords = computed(
  () => eiProductionRecords["medical-surveys"] ?? [],
);
const medicalDashboard = computed(() => {
  const records = medicalSurveyRecords.value;
  const recommended = records.filter(
    (record) => record.result === "Xizmat tavsiya etildi",
  ).length;
  const monitoring = records.filter(
    (record) => record.result === "Kuzatuv",
  ).length;
  const rejected = records.filter(
    (record) => record.result === "Tavsiya etilmadi",
  ).length;
  const regions = [...new Set(records.map((record) => String(record.region)))]
    .map((region) => {
      const regionRecords = records.filter(
        (record) => record.region === region,
      );
      const regionRecommended = regionRecords.filter(
        (record) => record.result === "Xizmat tavsiya etildi",
      ).length;

      return {
        region,
        total: regionRecords.length,
        recommended: regionRecommended,
        monitoring: regionRecords.filter(
          (record) => record.result === "Kuzatuv",
        ).length,
        rejected: regionRecords.filter(
          (record) => record.result === "Tavsiya etilmadi",
        ).length,
        rate: regionRecords.length
          ? Math.round((regionRecommended / regionRecords.length) * 100)
          : 0,
      };
    })
    .sort((left, right) => right.total - left.total);

  return {
    total: records.length,
    recommended,
    monitoring,
    rejected,
    recommendationRate: records.length
      ? Math.round((recommended / records.length) * 100)
      : 0,
    regions,
  };
});

watch(
  () => [props.pageKey, props.mode, selectedRecordId.value],
  () => {
    searchQuery.value = "";
    selectedStatuses.value = [];
    selectedFilters.value = {};
    isFilterOpen.value = false;
    formError.value = "";
    currentPage.value = 1;

    if (props.mode === "edit") {
      formValues.value = selectedRecord.value
        ? { ...selectedRecord.value }
        : getEmptyFormRecord();
    }
  },
  { immediate: true },
);

watch([filteredRecords, rowsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

watch(rowsPerPage, () => {
  currentPage.value = 1;
});

function getEmptyFormRecord(): EiProductionRecord {
  const record: EiProductionRecord = {};

  editableFields.value.forEach((field) => {
    record[field.key] = field.options?.[0] ?? "";
  });

  return record;
}

function getFilterOptions(field: EiProductionField) {
  return (
    field.options ??
    [
      ...new Set(
        pageRecords.value
          .map((record) => String(record[field.key] ?? ""))
          .filter(Boolean),
      ),
    ].sort((left, right) => left.localeCompare(right, "uz-UZ"))
  );
}

function clearFilters() {
  selectedStatuses.value = [];
  selectedFilters.value = {};
  searchQuery.value = "";
  isFilterOpen.value = false;
  currentPage.value = 1;
}

function handleStatusSelect(value: string) {
  selectedStatuses.value =
    value === "all" || selectedStatuses.value.includes(value) ? [] : [value];
  currentPage.value = 1;
}

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
}

function getStatusDotClass(value: string) {
  const status = value.toLocaleLowerCase("uz-UZ");

  if (
    ["faol", "yakunlangan", "xizmat tavsiya etildi", "xizmatda"].includes(
      status,
    )
  ) {
    return "bg-emerald-500";
  }

  if (["nofaol", "bekor qilingan", "tavsiya etilmadi"].includes(status)) {
    return "bg-red-500";
  }

  if (
    [
      "yangi",
      "kuzatuv",
      "boshlangan",
      "so‘rovnoma",
      "reja tuzish",
      "tibbiy baholash",
    ].includes(status)
  ) {
    return "bg-amber-500";
  }

  return "bg-muted-foreground";
}

function getStatusClasses(value: EiProductionValue | undefined) {
  const status = String(value).toLocaleLowerCase("uz-UZ");

  if (
    ["faol", "yakunlangan", "xizmat tavsiya etildi", "xizmatda"].includes(
      status,
    )
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-300";
  }

  if (["nofaol", "bekor qilingan", "tavsiya etilmadi"].includes(status)) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-300";
  }

  if (
    [
      "yangi",
      "kuzatuv",
      "boshlangan",
      "so‘rovnoma",
      "reja tuzish",
      "tibbiy baholash",
    ].includes(status)
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-300";
  }

  return "border-border bg-muted text-muted-foreground";
}

function getFieldValue(record: EiProductionRecord, field: EiProductionField) {
  const value = record[field.key];

  if (field.kind === "boolean") {
    return value === true || value === "Ha" ? "Ha" : "Yo‘q";
  }

  return value ?? "—";
}

function getProgressPercent(value: EiProductionValue | undefined) {
  const parts = String(value ?? "").split("/");
  const current = Number(parts[0]?.trim() ?? 0);
  const total = Number(parts[1]?.trim() ?? 0);

  return total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
}

function openCreate() {
  router.push(`${pageConfig.value.route}/0/edit`);
}

function openView(record: EiProductionRecord) {
  router.push(`${pageConfig.value.route}/${record.id}`);
}

function openEdit(record: EiProductionRecord) {
  router.push(`${pageConfig.value.route}/${record.id}/edit`);
}

function backToList() {
  router.push(pageConfig.value.route);
}

function cancelQuestionnaireEdit() {
  backToList();
}

function handleQuestionnaireSaved() {
  backToList();
}

function saveForm() {
  const requiredFields = editableFields.value.slice(0, 2);
  const missingField = requiredFields.find(
    (field) => !String(formValues.value[field.key] ?? "").trim(),
  );

  if (missingField) {
    formError.value = `${missingField.label} maydoni to‘ldirilishi shart`;
    return;
  }

  const recordId = selectedRecord.value?.id ?? getNextRecordId();
  saveEiProductionRecord(props.pageKey, {
    ...formValues.value,
    id: recordId,
  });
  backToList();
}

function getNextRecordId() {
  if (pageConfig.value.kind === "reference") {
    return (
      Math.max(
        0,
        ...pageRecords.value.map((record) => Number(record.id) || 0),
      ) + 1
    );
  }

  return `${props.pageKey.toLocaleUpperCase("uz-UZ").slice(0, 4)}-${String(Date.now()).slice(-6)}`;
}

function downloadCsv() {
  const fields = visibleFields.value;
  const rows = [
    fields.map((field) => field.label),
    ...filteredRecords.value.map((record) =>
      fields.map((field) => String(record[field.key] ?? "")),
    ),
  ];
  const csv = rows
    .map((row) =>
      row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ei-${props.pageKey}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <PageContainer>
    <template v-if="pageConfig.kind === 'dashboard'">
      <div
        class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 class="text-xl font-semibold text-foreground">
            {{ pageConfig.title }}
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ pageConfig.description }}
          </p>
        </div>
        <div
          class="inline-flex items-center rounded-lg border border-border bg-background p-0.5"
        >
          <Button
            variant="ghost"
            size="sm"
            class="h-8 gap-2"
            @click="router.push('/apps/ei/children/medical-surveys')"
          >
            <List class="h-4 w-4" />
            Ro‘yxat
          </Button>
          <Button size="sm" class="h-8 gap-2">
            <BarChart3 class="h-4 w-4" />
            Monitoring
          </Button>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent class="p-4">
            <p
              class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Jami so‘rov
            </p>
            <p class="mt-2 text-3xl font-semibold">
              {{ medicalDashboard.total }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <p
              class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Xizmat tavsiya etildi
            </p>
            <p class="mt-2 text-3xl font-semibold text-emerald-600">
              {{ medicalDashboard.recommended }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <p
              class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Kuzatuv
            </p>
            <p class="mt-2 text-3xl font-semibold text-amber-600">
              {{ medicalDashboard.monitoring }}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <p
              class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Tavsiya etilmadi
            </p>
            <p class="mt-2 text-3xl font-semibold text-red-600">
              {{ medicalDashboard.rejected }}
            </p>
          </CardContent>
        </Card>
        <Card class="border-primary/30 bg-primary/[0.04]">
          <CardContent class="p-4">
            <p
              class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Yo‘naltirish ulushi
            </p>
            <p class="mt-2 text-3xl font-semibold text-primary">
              {{ medicalDashboard.recommendationRate }}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        class="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]"
      >
        <SectionBlock
          title="Hududlar kesimi"
          description="Tibbiy so‘rov natijalarining hududlar bo‘yicha taqsimoti."
        >
          <div class="overflow-x-auto rounded-lg border border-border">
            <table class="w-full min-w-[42rem] text-sm">
              <thead
                class="bg-muted/45 text-xs uppercase tracking-wide text-muted-foreground"
              >
                <tr>
                  <th class="px-4 py-3 text-left">Hudud</th>
                  <th class="px-4 py-3 text-center">Jami</th>
                  <th class="px-4 py-3 text-center">Tavsiya</th>
                  <th class="px-4 py-3 text-center">Kuzatuv</th>
                  <th class="px-4 py-3 text-center">Rad</th>
                  <th class="px-4 py-3 text-left">Natija</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in medicalDashboard.regions"
                  :key="row.region"
                  class="border-t border-border"
                >
                  <td class="px-4 py-3 font-medium">{{ row.region }}</td>
                  <td class="px-4 py-3 text-center">{{ row.total }}</td>
                  <td class="px-4 py-3 text-center text-emerald-700">
                    {{ row.recommended }}
                  </td>
                  <td class="px-4 py-3 text-center text-amber-700">
                    {{ row.monitoring }}
                  </td>
                  <td class="px-4 py-3 text-center text-red-700">
                    {{ row.rejected }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          class="h-full rounded-full bg-primary"
                          :style="{ width: `${row.rate}%` }"
                        />
                      </div>
                      <span class="w-10 text-right font-medium"
                        >{{ row.rate }}%</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionBlock>

        <SectionBlock
          title="Natijalar tarkibi"
          description="Jami so‘rovlardagi ulush."
        >
          <div class="space-y-5">
            <div
              v-for="item in [
                {
                  label: 'Xizmat tavsiya etildi',
                  value: medicalDashboard.recommended,
                  color: 'bg-emerald-500',
                },
                {
                  label: 'Kuzatuv',
                  value: medicalDashboard.monitoring,
                  color: 'bg-amber-500',
                },
                {
                  label: 'Tavsiya etilmadi',
                  value: medicalDashboard.rejected,
                  color: 'bg-red-500',
                },
              ]"
              :key="item.label"
            >
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  :class="cn('h-full rounded-full', item.color)"
                  :style="{
                    width: `${medicalDashboard.total ? (item.value / medicalDashboard.total) * 100 : 0}%`,
                  }"
                />
              </div>
            </div>
          </div>
        </SectionBlock>
      </div>
    </template>

    <template v-else-if="mode === 'edit'">
      <SectionBlock
        class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden border-0 bg-transparent shadow-none"
        content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-y-auto p-0 pb-6"
        title=""
        description=""
      >
        <EIQuestionnaireTemplateEditor
          v-if="pageKey === 'questionnaires' && questionnaireEditorRecord"
          :record="questionnaireEditorRecord"
          :is-new="!selectedRecord"
          @cancel="cancelQuestionnaireEdit"
          @saved="handleQuestionnaireSaved"
        />
        <template v-else>
          <div
            class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-3">
              <Button variant="outline" class="h-10 gap-2" @click="backToList">
                <ChevronLeft class="h-4 w-4" />
                Ortga
              </Button>
              <div class="min-w-0">
                <h1 class="text-xl font-semibold text-foreground">
                  {{ selectedRecord ? "Yozuvni tahrirlash" : "Yangi yozuv" }}
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{ pageConfig.title }}
                </p>
              </div>
            </div>
            <Button class="gap-2" @click="saveForm">
              <Save class="h-4 w-4" />
              Saqlash
            </Button>
          </div>

          <SectionBlock
            :title="pageConfig.title"
            :description="pageConfig.description"
          >
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="field in editableFields"
                :key="field.key"
                class="space-y-2"
              >
                <FilterSelect
                  v-if="field.options"
                  :model-value="String(formValues[field.key] ?? '')"
                  :label="field.label"
                  :options="field.options"
                  all-label="Tanlang"
                  @update:model-value="formValues[field.key] = $event"
                />
                <template v-else>
                  <Label :for="`field-${field.key}`">{{ field.label }}</Label>
                  <Input
                    :id="`field-${field.key}`"
                    :model-value="String(formValues[field.key] ?? '')"
                    :type="field.kind === 'number' ? 'number' : 'text'"
                    @update:model-value="formValues[field.key] = String($event)"
                  />
                </template>
              </div>
            </div>
            <p v-if="formError" class="mt-4 text-sm font-medium text-red-600">
              {{ formError }}
            </p>
          </SectionBlock>
        </template>
      </SectionBlock>
    </template>

    <template v-else-if="mode === 'view'">
      <SectionBlock
        class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden border-0 bg-transparent shadow-none"
        content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-y-auto p-0 pb-6"
        title=""
        description=""
      >
        <div
          class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex min-w-0 items-center gap-3">
            <Button variant="outline" class="h-10 gap-2" @click="backToList">
              <ChevronLeft class="h-4 w-4" />
              Ortga
            </Button>
            <div v-if="pageKey !== 'questionnaires'" class="min-w-0">
              <h1 class="text-xl font-semibold text-foreground">
                {{ pageConfig.title }}
              </h1>
              <p class="mt-1 text-sm text-muted-foreground">
                Yozuv tafsilotlari
              </p>
            </div>
          </div>
          <Button
            v-if="pageConfig.canEdit && selectedRecord"
            variant="outline"
            class="gap-2"
            @click="openEdit(selectedRecord)"
          >
            <FilePenLine class="h-4 w-4" />
            Tahrirlash
          </Button>
        </div>

        <EIQuestionnaireTemplateDetails
          v-if="pageKey === 'questionnaires' && selectedRecord"
          :record="selectedRecord"
        />
        <SectionBlock v-else-if="selectedRecord" title="Asosiy ma’lumotlar">
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="field in visibleFields"
              :key="field.key"
              class="rounded-lg border border-border bg-muted/20 px-4 py-3"
            >
              <p
                class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {{ field.label }}
              </p>
              <span
                v-if="field.kind === 'status'"
                :class="
                  cn(
                    'mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                    getStatusClasses(getFieldValue(selectedRecord, field)),
                  )
                "
              >
                {{ getFieldValue(selectedRecord, field) }}
              </span>
              <p v-else class="mt-2 text-sm font-semibold text-foreground">
                {{ getFieldValue(selectedRecord, field) }}
              </p>
              <p
                v-if="field.secondaryKey"
                class="mt-1 text-xs text-muted-foreground"
              >
                {{ selectedRecord[field.secondaryKey] || "—" }}
              </p>
            </div>
          </div>
        </SectionBlock>
        <SectionBlock
          v-if="!selectedRecord"
          title="Ma’lumot topilmadi"
          description="Tanlangan yozuv mavjud emas."
        >
          <Button variant="outline" @click="backToList"
            >Ro‘yxatga qaytish</Button
          >
        </SectionBlock>
      </SectionBlock>
    </template>

    <template v-else>
      <SectionBlock
        class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
        content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-3 overflow-visible p-0"
        title=""
        description=""
      >
        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="relative w-full lg:max-w-sm">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              class="pl-9"
              placeholder="Qidirish"
              @update:model-value="currentPage = 1"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div
              v-if="pageKey === 'medical-surveys'"
              class="inline-flex items-center rounded-lg border border-border bg-background p-0.5"
            >
              <Button size="sm" class="h-7 gap-1.5">
                <List class="h-4 w-4" />
                Ro‘yxat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 gap-1.5"
                @click="router.push('/apps/ei/children/medical-monitoring')"
              >
                <BarChart3 class="h-4 w-4" />
                Monitoring
              </Button>
            </div>
            <FilterPopover
              v-if="filterFields.length"
              v-model:open="isFilterOpen"
              wrapper-class="order-1"
              :active-count="activeFilterCount"
            >
              <div class="flex flex-col gap-3">
                <FilterSelect
                  v-for="field in filterFields"
                  :key="field.key"
                  :model-value="selectedFilters[field.key] || ''"
                  :label="field.label"
                  :options="getFilterOptions(field)"
                  @update:model-value="selectedFilters[field.key] = $event"
                />
              </div>
              <template #footer>
                <div class="flex justify-end gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="!activeFilterCount"
                    @click="clearFilters"
                  >
                    Tozalash
                  </Button>
                  <Button size="sm" @click="isFilterOpen = false"
                    >Qo‘llash</Button
                  >
                </div>
              </template>
            </FilterPopover>
            <Button
              variant="outline"
              size="sm"
              class="order-2 h-7 gap-1.5"
              :disabled="!filteredRecords.length"
              @click="downloadCsv"
            >
              <Download class="h-4 w-4" />
              Yuklab olish
            </Button>
            <Button
              v-if="pageConfig.canCreate"
              size="sm"
              class="order-3 h-7 gap-1.5"
              @click="openCreate"
            >
              <Plus class="h-4 w-4" />
              Yaratish
            </Button>
          </div>
        </div>

        <StatusTabs
          v-if="statusTabs.length"
          :tabs="statusTabs"
          :selected-values="selectedStatuses"
          item-key-prefix="ei-production-status"
          @select="handleStatusSelect"
        />

        <div class="grid gap-3 xl:hidden">
          <div
            v-if="!paginatedRecords.length"
            class="flex min-h-[18rem] items-center justify-center rounded-lg border border-border bg-card px-4 py-10 text-center"
          >
            <div class="max-w-sm">
              <p class="text-sm font-medium text-foreground">
                Ma’lumot topilmadi
              </p>
              <p class="mt-2 text-sm text-muted-foreground">
                Qidiruv yoki filterlarga mos yozuv mavjud emas.
              </p>
              <Button
                variant="outline"
                size="sm"
                class="mt-4"
                @click="clearFilters"
                >Tozalash</Button
              >
            </div>
          </div>
          <Card v-for="record in paginatedRecords" :key="String(record.id)">
            <CardContent class="space-y-3 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold">
                    {{
                      getFieldValue(
                        record,
                        visibleFields[1] || visibleFields[0]!,
                      )
                    }}
                  </p>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ getFieldValue(record, visibleFields[0]!) }}
                  </p>
                </div>
                <span
                  v-if="visibleFields.find((field) => field.kind === 'status')"
                  :class="
                    cn(
                      'rounded-full border px-2.5 py-1 text-xs font-medium',
                      getStatusClasses(
                        record[
                          visibleFields.find(
                            (field) => field.kind === 'status',
                          )!.key
                        ],
                      ),
                    )
                  "
                >
                  {{
                    record[
                      visibleFields.find((field) => field.kind === "status")!
                        .key
                    ]
                  }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div
                  v-for="field in visibleFields.slice(1, 5)"
                  :key="field.key"
                >
                  <p class="text-xs text-muted-foreground">{{ field.label }}</p>
                  <p class="mt-1 font-medium">
                    {{ getFieldValue(record, field) }}
                  </p>
                </div>
              </div>
              <div
                v-if="hasRowActions"
                class="flex justify-end gap-2 border-t border-border pt-3"
              >
                <Button
                  v-if="canViewRecord"
                  variant="outline"
                  size="sm"
                  @click="openView(record)"
                >
                  <Eye class="h-4 w-4" />
                  Ko‘rish
                </Button>
                <Button
                  v-if="pageConfig.canEdit"
                  variant="outline"
                  size="sm"
                  @click="openEdit(record)"
                >
                  <FilePenLine class="h-4 w-4" />
                  Tahrirlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card max-xl:hidden xl:min-h-0 xl:flex-1"
        >
          <div
            class="relative block min-h-0 min-w-0 max-w-full flex-1 overflow-auto overscroll-contain"
          >
            <table
              class="w-full min-w-[64rem] border-separate border-spacing-0 text-sm"
            >
              <thead
                class="sticky top-0 z-10 bg-card text-left text-muted-foreground"
              >
                <tr>
                  <th
                    v-for="field in visibleFields"
                    :key="field.key"
                    class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground first:rounded-tl-lg"
                  >
                    {{ field.label }}
                  </th>
                  <th
                    v-if="hasRowActions"
                    class="h-10 w-24 whitespace-nowrap rounded-tr-lg border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground"
                  >
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="record in paginatedRecords"
                  :key="String(record.id)"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td
                    v-for="field in visibleFields"
                    :key="field.key"
                    class="max-w-80 border-b border-border p-2 align-middle"
                  >
                    <span
                      v-if="field.kind === 'status'"
                      :class="
                        cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                          getStatusClasses(getFieldValue(record, field)),
                        )
                      "
                    >
                      {{ getFieldValue(record, field) }}
                    </span>
                    <div v-else-if="field.kind === 'progress'" class="min-w-28">
                      <div class="mb-1 flex justify-between text-xs">
                        <span>{{ getFieldValue(record, field) }}</span>
                        <span
                          >{{
                            getProgressPercent(getFieldValue(record, field))
                          }}%</span
                        >
                      </div>
                      <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          class="h-full rounded-full bg-primary"
                          :style="{
                            width: `${getProgressPercent(getFieldValue(record, field))}%`,
                          }"
                        />
                      </div>
                    </div>
                    <div v-else>
                      <p class="truncate font-medium text-foreground">
                        {{ getFieldValue(record, field) }}
                      </p>
                      <p
                        v-if="field.secondaryKey"
                        class="mt-1 truncate text-xs text-muted-foreground"
                      >
                        {{ record[field.secondaryKey] || "—" }}
                      </p>
                    </div>
                  </td>
                  <td
                    v-if="hasRowActions"
                    class="border-b border-border p-2 align-middle"
                  >
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          class="h-7 w-7 rounded-md p-0"
                          aria-label="Amallar"
                        >
                          <Ellipsis class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            v-if="canViewRecord"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="openView(record)"
                          >
                            <Eye class="h-4 w-4 shrink-0" />
                            Ko‘rish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="pageConfig.canEdit"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="openEdit(record)"
                          >
                            <FilePenLine class="h-4 w-4 shrink-0" />
                            Tahrirlash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
                <tr v-if="!paginatedRecords.length">
                  <td
                    :colspan="visibleFields.length + (hasRowActions ? 1 : 0)"
                    class="px-6 py-16 text-center text-muted-foreground"
                  >
                    Ma’lumot topilmadi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex flex-wrap items-center gap-3">
            <label class="inline-flex items-center gap-2">
              <span>Qatorlar soni</span>
              <select
                v-model.number="rowsPerPage"
                class="h-8 rounded-md border border-border bg-background px-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option
                  v-for="option in rowsPerPageOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>
            <span
              >Sahifada:
              <strong class="font-semibold text-foreground"
                >{{ visibleRangeStart }}-{{ visibleRangeEnd }} /
                {{ filteredRecords.length }}</strong
              ></span
            >
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              class="gap-2"
              @click="clearFilters"
            >
              <RotateCcw class="h-4 w-4" />
              Tiklash
            </Button>
            <div
              class="flex h-8 items-center rounded-lg border border-border bg-background px-1"
            >
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 p-0"
                :disabled="currentPage === 1"
                aria-label="Birinchi sahifa"
                @click="goToPage(1)"
              >
                <ChevronsLeft class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 p-0"
                :disabled="currentPage === 1"
                aria-label="Oldingi sahifa"
                @click="goToPage(currentPage - 1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span
                class="min-w-14 px-2 text-center font-semibold text-foreground"
                >{{ currentPage }}/{{ totalPages }}</span
              >
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 p-0"
                :disabled="currentPage === totalPages"
                aria-label="Keyingi sahifa"
                @click="goToPage(currentPage + 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 p-0"
                :disabled="currentPage === totalPages"
                aria-label="Oxirgi sahifa"
                @click="goToPage(totalPages)"
              >
                <ChevronsRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SectionBlock>
    </template>
  </PageContainer>
</template>
