<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import Note from '../values/note';

const props = withDefaults(defineProps<{
  note?: Note,
  characterWidth?: number
}>(), {
  characterWidth: 1
});

const emits = defineEmits<{
  (e: 'noteChanged', fret: string): void
}>();

const inputRef = ref(null);
const isInputDisplayed = ref(false);
const modelValue = ref('');

const focusInput = async () => {
  isInputDisplayed.value = true;
  await nextTick();
  inputRef.value.focus();
};

const addNote = () => {
  isInputDisplayed.value = false;
  emits('noteChanged', modelValue.value);
}

const pad = (str: string = '') => {
  while (str.length < props.characterWidth) {
    str += '-';
  }

  return str;
}
</script>

<template>
  <div @click="focusInput()" class="cursor-pointer relative px-0 hover:bg-blue-300">
    <div v-if="note">{{ pad(String(note.fret)) }}-</div>
    <div v-else>{{ pad() }}-</div>
    <input ref="inputRef" v-show="isInputDisplayed" v-model="modelValue" @blur="addNote" type="text" class="text-center focus:ring-0 w-full absolute inset-0 p-0 m-0 bg-white w-4 border-none rounded-none"/>
  </div>
</template>
