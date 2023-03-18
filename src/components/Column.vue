<script setup lang="ts">
import Column from '../values/column';
import Note from '../values/note';
import NoteComponent from './Note.vue';

const props = defineProps<{
  column?: Column,
}>();

const emits = defineEmits<{
  (e: 'columnChanged', column: Column)
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
</script>

<template>
  <div class="hover:bg-blue-100" :class="{'text-blue-400': !column}">
    <div v-for="string in [1, 2, 3, 4, 5, 6]" :key="string">
      <NoteComponent :character-width="column ? column.getMaxCharacterWidth() : 1" :note="column ? column.getNoteAtString(string) : undefined" @noteChanged="fret => onNoteChanged(fret, string)"/>
    </div>
  </div>
</template>
