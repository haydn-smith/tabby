<script setup lang="ts">
import Panel from './components/Panel.vue'
import Tab from './values/tab';
import Button from './components/Button.vue';
import SectionComponent from './components/Section.vue';
import { onMounted, ref } from 'vue';
import Column from './values/column';
import Note from './values/note';
import Modifier from './enum/modifier';
import Section from './values/section';
import Position from './values/position';

const tab = ref(new Tab());

const position = ref(new Position());

onMounted(() => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && !position.value.active) {
      position.value.string--;
      position.value.active = false;
    } else if (event.key === 'ArrowDown' && !position.value.active) {
      position.value.string++;
      position.value.active = false;
    } else if (event.key === 'ArrowLeft' && !position.value.active) {
      position.value.column--;
      position.value.active = false;
    } else if (event.key === 'ArrowRight' && !position.value.active) {
      position.value.column++;
      position.value.active = false;
    } else if (event.key === 'Enter') {
      position.value.active = !position.value.active;
      event.stopPropagation();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      position.value.active = false;
      event.stopPropagation();
      event.preventDefault();
    }

    position.value.string = Math.max(1, Math.min(6, position.value.string));
    position.value.column = Math.max(0, Math.min(tab.value.sections[position.value.section].columns.length, position.value.column));
  });
});

const onSectionChanged = (
  sectionIndex: number,
  section: Section
) => {
  tab.value.sections[sectionIndex] = section;
}

const onNoteSelected = (string: number, column: number, section: number, active: boolean) => {
  position.value.section = section;
  position.value.string = string;
  position.value.column = column;
  position.value.active = active;
};

</script>

<template>
  <div class="relative p-6 bg-gray-100 w-screen h-screen overflow-hidden">
    <div class="font-bold text-lg mb-6">{{ tab.name }}</div>

    <div v-for="section, index in tab.sections" :key="index">
      <SectionComponent @note-selected="(string, active, column) => onNoteSelected(string, column, index, active)" @section-changed="section => onSectionChanged(index, section)" :cursor-position="position" :is-selected="position.section === index" :section="section"/>
    </div>

    <Button @click="tab.addSection()" text="Add Section"/>

    <div class="bottom-0 left-0 right-0 absolute m-6">
      <Panel>
        Hello there
      </Panel>
    </div>
  </div>
</template>
