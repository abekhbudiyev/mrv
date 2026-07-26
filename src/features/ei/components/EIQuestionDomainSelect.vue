<script setup lang="ts">
import { Check, ChevronDown } from "lucide-vue-next";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  type AcceptableValue,
} from "reka-ui";
import type { DevelopmentDomain } from "@/features/ei/assessment-question-bank";
import { Label } from "@/shared/ui/shadcn/label";

defineProps<{
  id: string;
  modelValue: DevelopmentDomain;
  options: DevelopmentDomain[];
  labels: Record<DevelopmentDomain, string>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: DevelopmentDomain];
}>();

function updateValue(value: AcceptableValue) {
  if (typeof value === "string") {
    emit("update:modelValue", value as DevelopmentDomain);
  }
}
</script>

<template>
  <div class="space-y-2">
    <Label :for="id">Rivojlanish sohasi</Label>
    <SelectRoot :model-value="modelValue" @update:model-value="updateValue">
      <SelectTrigger
        :id="id"
        class="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-2.5 text-left text-sm text-foreground outline-none transition hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/30 data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/20"
      >
        <SelectValue class="min-w-0 truncate" placeholder="Sohani tanlang" />
        <ChevronDown
          class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180"
        />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          align="start"
          side="bottom"
          :side-offset="6"
          :collision-padding="12"
          class="z-[100] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <SelectViewport class="max-h-60 p-1">
            <SelectItem
              v-for="domain in options"
              :key="domain"
              :value="domain"
              class="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-9 text-sm outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[state=checked]:font-medium"
            >
              <SelectItemText>{{ labels[domain] }}</SelectItemText>
              <SelectItemIndicator
                class="absolute right-3 inline-flex items-center justify-center"
              >
                <Check class="h-4 w-4 text-primary" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
