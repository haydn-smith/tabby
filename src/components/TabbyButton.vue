<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);
</script>

<template>
  <button
    type="button"
    :class="{ 'opacity-25 hover:bg-blue-400': disabled }"
    class="rounded bg-blue-400 py-1 px-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>
