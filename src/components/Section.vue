<script setup lang="ts">
import { nextTick, watch } from 'vue';
import Column from '../values/column';
import Cursor from '../values/cursor';
import Section from '../values/section';
import ColumnComponent from './Column.vue';

const props = defineProps<{
  section: Section,
  cursor: Cursor,
  isSelected: boolean
}>();

const emits = defineEmits<{
  (e: 'sectionChanged', section: Section): void
  (e: 'noteSelected', string: number, active: boolean, index: number): void
}>();

watch(() => props.cursor, () => {
  if (props.isSelected && props.cursor.isCurrentColumn(props.section.columns.length)) {
   createColumn(props.cursor.currentString(), false);
  }
});

const onColumnChanged = (column: Column, columnIndex: number) => {
  emits('sectionChanged', props.section.setColumn(column, columnIndex));
}

const createColumn = async (string: number, active: boolean) => {
  emits('sectionChanged', props.section.addColumn());
  await nextTick();
  emits('noteSelected', string, active, props.section.columns.length - 1);
}

const onNoteSelected = (string: number, active: boolean, index: number) => {
  emits('noteSelected', string, active, index);
};
</script>

<template>
  <div class="mb-6">
    <div class="mb-1 font-normal text-md">{{ section.name }}</div>

    <div class="flex font-mono text-md leading-none">
      <div>
        <div v-for="tuning, index in section.getTuning()" :key="index">{{ tuning }}</div>
      </div>
      <div>
        <div v-for="tuning, index in section.getTuning()" :key="index">|</div>
      </div>
      <div>
        <div v-for="tuning, index in section.getTuning()" :key="index">--</div>
      </div>

      <div v-for="column, index in section.columns" :key="column.id">
        <ColumnComponent
          @note-selected="(string, active) => onNoteSelected(string, active, index)"
          @column-changed="column => onColumnChanged(column, index)"
          :is-selected="isSelected && cursor.isCurrentColumn(index)"
          :cursor="cursor"
          :column="column"
        />
      </div>

      <div>
        <div v-for="tuning, index in section.getTuning()" :key="index" @click="createColumn(index + 1, true)" class="text-blue-400 hover:bg-blue-200 cursor-pointer">--</div>
      </div>
    </div>
  </div>
</template>
