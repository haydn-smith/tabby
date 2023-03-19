<script setup lang="ts">
import Panel from './components/Panel.vue'
import Tab from './values/tab';
import Button from './components/Button.vue';
import SectionComponent from './components/Section.vue';
import Modal from './components/Modal.vue';
import Input from './components/Input.vue';
import { onMounted, ref, watch } from 'vue';
import Column from './values/column';
import Note from './values/note';
import Modifier from './enum/modifier';
import Section from './values/section';
import Cursor from './values/cursor';

const tab = ref(new Tab());
const cursor = ref(new Cursor());
const tabSettingsOpen = ref(false);

onMounted(() => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    cursor.value = cursor.value
      .moveCursorFromKeyboardEvent(event)
      .moveCursorBetweenSections(tab.value)
      .moveCursorWithinSectionBounds(tab.value);

    // We stop this from happening so that using our cursor doesn't have
    // unintended side effects like clicking buttons.
    if (['Enter', 'Escape'].includes(event.key)) {
      event.stopPropagation();
      event.preventDefault();
    }
  });
});

const onSectionChanged = (sectionIndex: number, section: Section) => {
  tab.value = tab.value.setSection(section, sectionIndex);
}

const onNoteSelected = (string: number, column: number, section: number, active: boolean) => {
  cursor.value = cursor.value
    .moveCursor(section, column, string)
    .toggleActive(active)
    .moveCursorWithinSectionBounds(tab.value);
};
</script>

<template>
  <div class="relative p-6 bg-gray-100 w-screen h-screen overflow-hidden">
    <div class="font-bold text-lg mb-8 flex items-center">
      <div class="mr-4">{{ tab.name }}</div>
      <Button @click="tabSettingsOpen = true" text="Tab Settings"/>
    </div>

    <Modal title="Tab Settings" v-model="tabSettingsOpen">
      <Input label="Tab Name" placeholder="e.g. I Miss You by Blink 182" v-model="tab.name"/>
    </Modal>

    <div v-for="section, index in tab.sections" :key="index" v-memo="[cursor.sectionMemoKey(index)]">
      <SectionComponent
        @note-selected="(string, active, column) => onNoteSelected(string, column, index, active)"
        @section-changed="section => onSectionChanged(index, section)"
        :cursor="cursor"
        :is-selected="cursor.isCurrentSection(index)"
        :section="section"
        />
    </div>

    <Button @click="tab = tab.addSection()" text="Add Section"/>
  </div>
</template>
