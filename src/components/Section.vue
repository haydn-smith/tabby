<script setup lang="ts">
import Column from '../values/column';
import Position from '../values/position';
import Section from '../values/section';
import ColumnComponent from './Column.vue';

const props = defineProps<{
  section: Section,
  cursorPosition: Position,
  isSelected: boolean
}>();

const emits = defineEmits<{
  (e: 'sectionChanged', section: Section): void
  (e: 'noteSelected', string: number, active: boolean, index: number): void
}>();

const onColumnChanged = (changedColumn: Column, changedColumnIndex?: number) => {
  const section = new Section();

  section.columns = props.section.columns.map((column, index) => {
    return index === changedColumnIndex ? changedColumn : column;
  });

  if (changedColumnIndex === undefined) {
    section.columns.push(changedColumn);
  }

  emits('sectionChanged', section);
}

const onNoteSelected = (string: number, active: boolean, index: number) => {
  emits('noteSelected', string, active, index);
};
</script>

<template>
  <div class="mb-6">
    <div class="mb-1 font-normal text-md">{{ section.name }}</div>

    <div class="flex font-mono text-sm leading-none">
      <div>
        <div>e</div>
        <div>B</div>
        <div>G</div>
        <div>D</div>
        <div>A</div>
        <div>E</div>
      </div>
      <div>
        <div>|</div>
        <div>|</div>
        <div>|</div>
        <div>|</div>
        <div>|</div>
        <div>|</div>
      </div>
      <div>
        <div>-</div>
        <div>-</div>
        <div>-</div>
        <div>-</div>
        <div>-</div>
        <div>-</div>
      </div>

      <div v-for="column, index in section.columns" :key="index">
        <ColumnComponent @note-selected="(string, active) => onNoteSelected(string, active, index)" @column-changed="column => onColumnChanged(column, index)" :is-selected="isSelected && cursorPosition.column === index" :cursor-position="cursorPosition" :column="column"/>
      </div>

      <ColumnComponent @note-selected="(string, active) => onNoteSelected(string, active, section.columns.length)" @column-changed="onColumnChanged" :is-selected="isSelected && cursorPosition.column === section.columns.length" :cursor-position="cursorPosition" />
    </div>
  </div>
</template>
