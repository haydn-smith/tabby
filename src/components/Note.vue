<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import Note from '../values/note';
import Position from '../values/position';

const props = withDefaults(defineProps<{
  note?: Note,
  characterWidth?: number
  isSelected: boolean,
  cursorPosition: Position,
}>(), {
  characterWidth: 1
});

const emits = defineEmits<{
  (e: 'noteChanged', fret: string): void
  (e: 'noteSelected', active: boolean): void
}>();

const inputRef = ref<HTMLInputElement|null>(null);
const modelValue = ref('');

onMounted(() => {
  if (props.note) {
    modelValue.value = props.note.fret;
  }
});

const focusInput = () => {
  emits('noteSelected', true);
};

const blurInput = () => {
  addNote();
  emits('noteSelected', false);
};

const addNote = () => {
  if (props.note || modelValue.value.length) {
    emits('noteChanged', modelValue.value);
  }

  if (!props.note) {
    modelValue.value = '';
  }
}

const pad = (str: string = '') => {
  while (str.length < props.characterWidth) {
    str += '-';
  }

  return str;
}

watch(props.cursorPosition, async () => {
  await nextTick();

  if (props.isSelected && props.cursorPosition.active) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div @click="focusInput()" @keydown.enter="focusInput" :class="{'bg-blue-300': isSelected}" class="cursor-pointer relative px-0 hover:bg-blue-200">
    <div v-if="note">{{ pad(String(note.fret)) }}-</div>
    <div v-else>{{ pad() }}-</div>
    <input ref="inputRef" @blur="blurInput" v-show="isSelected && cursorPosition.active" v-model="modelValue" type="text" class="z-50 text-center focus:ring-0 w-full absolute inset-0 p-0 m-0 bg-white w-4 border-none rounded-none"/>
  </div>
</template>
