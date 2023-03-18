<script setup lang="ts">
import Column from '../values/column';
import Note from '../values/note';
import Position from '../values/position';
import NoteComponent from './Note.vue';

const props = defineProps<{
  column?: Column,
  cursorPosition: Position,
  isSelected: boolean
}>();

const emits = defineEmits<{
  (e: 'columnChanged', column: Column): void,
  (e: 'noteSelected', string: number, active: boolean): void
}>();

const onNoteChanged = (fret: string, string: number) => {
  const column = new Column();

  if (props.column) {
    column.notes = props.column.notes.map((note) => {
      return (note.string === string) ? new Note(string, fret) : note;
    });
  }

  if (! column.notes.filter(note => note.string === string).length) {
    column.notes.push(new Note(string, fret));
  }

  emits('columnChanged', column);
};

const onNoteSelected = (string: number, active: boolean) => {
  emits('noteSelected', string, active);
};
</script>

<template>
  <div :class="{'text-blue-400': !column, 'bg-blue-100': isSelected}">
    <div v-for="string in [1, 2, 3, 4, 5, 6]" :key="string">
      <NoteComponent @note-selected="active => onNoteSelected(string, active)" :character-width="column ? column.getMaxCharacterWidth() : 1" :is-selected="isSelected && cursorPosition.string === string" :cursor-position="cursorPosition" :note="column ? column.getNoteAtString(string) : undefined" @noteChanged="fret => onNoteChanged(fret, string)"/>
    </div>
  </div>
</template>
