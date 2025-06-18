<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  modelValue: string;
  label: 'Solved' | 'Pending';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});
</script>
<template>
  <div class="flex items-center gap-2">
    <RadioButton v-model="model" :inputId="label" name="status" :value="label" size="small" />
    <label :for="label" class="text-[0.6rem]">{{ label }}</label>
  </div>
</template>

<style scoped></style>
