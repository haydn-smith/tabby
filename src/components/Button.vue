<script setup lang="ts">
defineProps<{
  text: string
}>();
</script>

<template>
  <button type="button" class="rounded bg-blue-400 py-1 px-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
    {{ text }}
  </button>
</template>
