<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val)
})
</script>
<template>
  <FloatLabel variant="on" class="mb-3">
    <label for="title" class="text-[0.7rem]">Title</label>
    <Textarea v-model="model" autoResize rows="1" cols="30" style="font-size: 0.8rem" />
  </FloatLabel>
</template>

<style scoped></style>
