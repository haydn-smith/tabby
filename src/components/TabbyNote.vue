<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import Note from '../values/note';

const props = defineProps<{
  note: Note;
  width: number;
  isSelected: boolean;
  isActive: boolean;
}>();

const emits = defineEmits<{
  (e: 'noteChanged', fret: string): void;
  (e: 'noteSelected', active: boolean): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const modelValue = ref('');

onMounted(() => {
  modelValue.value = props.note.fret;
});

const selectNote = (active: boolean) => {
  if (!active) {
    emits('noteChanged', modelValue.value);
  }

  emits('noteSelected', active);
};

watch(
  () => props.isActive,
  async () => {
    await nextTick();

    if (props.isActive) {
      inputRef.value?.focus();
    }
  }
);
</script>

<template>
  <div
    @click="selectNote(true)"
    @keydown.enter="selectNote(true)"
    :class="{ 'bg-blue-300': isSelected }"
    class="relative cursor-pointer px-0 hover:bg-blue-200"
  >
    <div>{{ note.paddedFret(width) }}-</div>
    <input
      ref="inputRef"
      @blur="selectNote(false)"
      v-show="isActive"
      v-model="modelValue"
      class="absolute inset-0 z-50 m-0 w-full w-4 rounded-none border-none bg-white p-0 text-center focus:ring-0"
    />
  </div>
</template>
