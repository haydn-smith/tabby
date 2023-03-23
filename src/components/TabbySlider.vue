<script setup lang="ts">
defineProps<{
  min: number;
  max: number;
  modelValue: number;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', modelValue: number): void;
}>();
</script>

<template>
  <input
    :class="{ 'pointer-events-none opacity-25': disabled }"
    class="slider transition"
    type="range"
    :min="min"
    :max="max"
    :value="modelValue"
    @change="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
  />
</template>

<style scoped>
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  background: #60a5fa;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #60a5fa;
  cursor: pointer;
  border-radius: 999px;
  border: none;
  transition: background 0.25s;
}

.slider::-webkit-slider-thumb:hover {
  background: #3b82f6;
}

.slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #60a5fa;
  cursor: pointer;
  border-radius: 999px;
  border: none;
  transition: background 0.25s;
}

.slider::-moz-range-thumb:hover {
  background: #3b82f6;
}
</style>
