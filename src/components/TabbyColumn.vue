<script setup lang="ts">
import { ArrowSmallLeftIcon, ArrowSmallRightIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import Column from '../values/column';
import Cursor from '../values/cursor';
import TabbyPosition from './TabbyPosition.vue';

const props = withDefaults(
  defineProps<{
    column: Column;
    isSelected: boolean;
    cursor: Cursor;
    isReadOnly?: boolean;
  }>(),
  {
    isReadOnly: false,
  }
);

const emits = defineEmits<{
  (e: 'columnDeleted'): void;
  (e: 'insertColumnBefore'): void;
  (e: 'insertColumnAfter'): void;
  (e: 'columnChanged', column: Column): void;
  (e: 'noteSelected', string: number, active: boolean): void;
}>();

const onNoteChanged = (string: number, fret: string) => {
  emits('columnChanged', props.column.setNote(string, fret));
};

const onNoteSelected = (string: number, active: boolean) => {
  emits('noteSelected', string, active);
};

const onDeleteClicked = () => {
  emits('columnDeleted');
};
</script>

<template>
  <div class="relative" :class="{ 'text-blue-400': !column, 'bg-blue-100': isSelected && !isReadOnly }">
    <div v-for="string in column.getStrings()" :key="string">
      <TabbyPosition
        @note-selected="(active) => onNoteSelected(string, active)"
        @note-changed="(fret) => onNoteChanged(string, fret)"
        :width="column.getCharacterWidth()"
        :is-selected="isSelected && cursor.isCurrentString(string)"
        :is-active="isSelected && cursor.isCurrentString(string) && cursor.isActive()"
        :is-read-only="isReadOnly"
        :note="column.getStringPosition(string)"
      />
    </div>
    <div v-if="isSelected && !isReadOnly" class="absolute left-0 right-0 flex h-4">
      <div
        @click="emits('insertColumnBefore')"
        class="absolute right-full flex h-4 w-4 cursor-pointer items-center justify-center rounded-l bg-blue-200 hover:bg-blue-300"
      >
        <ArrowSmallLeftIcon class="h-4" />
      </div>
      <div
        @click="onDeleteClicked"
        class="absolute inset-0 flex h-4 cursor-pointer items-center justify-center bg-blue-200 hover:bg-blue-300"
      >
        <XMarkIcon class="h-4" />
      </div>
      <div
        @click="emits('insertColumnAfter')"
        class="absolute left-full flex h-4 w-4 cursor-pointer items-center justify-center rounded-r bg-blue-200 hover:bg-blue-300"
      >
        <ArrowSmallRightIcon class="h-4" />
      </div>
    </div>
  </div>
</template>
