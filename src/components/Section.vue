<script setup lang="ts">
import Column from '../values/column';
import Section from '../values/section';
import ColumnComponent from './Column.vue';

const props = defineProps<{
  section: Section,
}>();

const emits = defineEmits<{
  (e: 'sectionChanged', section: Section)
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
        <ColumnComponent @column-changed="column => onColumnChanged(column, index)" :column="column"/>
      </div>

      <ColumnComponent @column-changed="onColumnChanged" />
    </div>
  </div>
</template>
