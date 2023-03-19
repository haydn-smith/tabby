<script setup lang="ts">
defineProps<{
  label: string,
  placeholder: string,
  modelValue: string,
}>();

defineEmits<{
  (e: 'update:modelValue', modelValue: string)
}>();
</script>

<template>
  <div class="rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-400 transition">
    <label for="name" class="block text-xs font-medium text-gray-900">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      name="name"
      id="name"
      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
      :placeholder="placeholder"
    />
  </div>
</template>
