<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import Note from '../values/note';
import Cursor from '../values/cursor';

const props = defineProps<{
  note: Note,
  width: number
  isSelected: boolean,
  cursor: Cursor,
}>();

const emits = defineEmits<{
  (e: 'noteChanged', fret: string): void
  (e: 'noteSelected', active: boolean): void
}>();

const inputRef = ref<HTMLInputElement|null>(null);
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

watch(() => props.cursor, async () => {
  await nextTick();

  if (props.isSelected && props.cursor.isActive()) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <div @click="selectNote(true)" @keydown.enter="selectNote(true)" :class="{'bg-blue-300': isSelected}" class="cursor-pointer relative px-0 hover:bg-blue-200">
    <div>{{ note.paddedFret(width) }}-</div>
    <input ref="inputRef" @blur="selectNote(false)" v-show="isSelected && cursor.isActive()" v-model="modelValue" class="z-50 text-center focus:ring-0 w-full absolute inset-0 p-0 m-0 bg-white w-4 border-none rounded-none"/>
  </div>
</template>
