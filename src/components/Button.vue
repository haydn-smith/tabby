<script setup lang="ts">
defineProps<{
  text: string
}>();
</script>

<template>
  <button type="button" class="rounded-full bg-white py-1 px-2.5 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 transition">{{ text }}</button>
</template>
