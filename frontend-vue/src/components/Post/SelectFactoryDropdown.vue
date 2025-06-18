<script setup lang="ts">
import { computed } from 'vue';
import { factoryData } from '../../constant';

type factoryType = {
    name: string;
    code: string;
};

const props = defineProps<{
    modelValue: factoryType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val)
})
</script>
<template>
  <Select v-model="model" :options="factoryData" optionLabel="name" placeholder="Select a Factory" class="mb-4 w-48" size="small" :labelStyle="{ fontSize: '0.65rem' }">
    <template #value="slotProps">
      <div v-if="slotProps.value.name != ''" class="flex items-center">
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <div class="text-[0.7rem]">{{ slotProps.option.name }}</div>
      </div>
    </template>
    <template #dropdownicon>
      <i class="pi pi-warehouse" style="font-size: 0.8rem" />
    </template>
  </Select>
</template>

<style scoped></style>
