<script setup lang="ts">
import Column from '../values/column';
import Cursor from '../values/cursor';
import TabbyNote from './TabbyNote.vue';

const props = defineProps<{
  column: Column;
  isSelected: boolean;
  cursor: Cursor;
}>();

const emits = defineEmits<{
  (e: 'columnChanged', column: Column): void;
  (e: 'noteSelected', string: number, active: boolean): void;
}>();

const onNoteChanged = (string: number, fret: string) => {
  emits('columnChanged', props.column.setNote(string, fret));
};

const onNoteSelected = (string: number, active: boolean) => {
  emits('noteSelected', string, active);
};
</script>

<template>
  <div :class="{ 'text-blue-400': !column, 'bg-blue-100': isSelected }">
    <div v-for="string in column.getStrings()" :key="string">
      <TabbyNote
        @note-selected="(active) => onNoteSelected(string, active)"
        @note-changed="(fret) => onNoteChanged(string, fret)"
        :width="column.getCharacterWidth()"
        :is-selected="isSelected && cursor.isCurrentString(string)"
        :is-active="isSelected && cursor.isCurrentString(string) && cursor.isActive()"
        :note="column.getNoteForString(string)"
      />
    </div>
  </div>
</template>
