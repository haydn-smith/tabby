<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TabbyButton from './components/TabbyButton.vue';
import TabbyInput from './components/TabbyInput.vue';
import TabbyModal from './components/TabbyModal.vue';
import TabbySection from './components/TabbySection.vue';
import Cursor from './values/cursor';
import Section from './values/section';
import Tab from './values/tab';

const tab = ref(new Tab());
const cursor = ref(new Cursor());
const tabSettingsOpen = ref(false);

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
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
};

const onNoteSelected = (string: number, column: number, section: number, active: boolean) => {
  cursor.value = cursor.value
    .moveCursor(section, column, string)
    .toggleActive(active)
    .moveCursorWithinSectionBounds(tab.value);
};
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden bg-gray-100 p-6">
    <div class="mb-8 flex items-center text-lg font-bold">
      <div class="mr-4">{{ tab.name }}</div>
      <TabbyButton @click="tabSettingsOpen = true" text="Tab Settings" />
    </div>

    <TabbyModal title="Tab Settings" v-model="tabSettingsOpen">
      <TabbyInput label="Tab Name" placeholder="e.g. I Miss You by Blink 182" v-model="tab.name" />
    </TabbyModal>

    <div v-for="(section, index) in tab.sections" :key="index" v-memo="[cursor.sectionMemoKey(index)]">
      <TabbySection
        @note-selected="(string, active, column) => onNoteSelected(string, column, index, active)"
        @section-changed="(section) => onSectionChanged(index, section)"
        :cursor="cursor"
        :is-selected="cursor.isCurrentSection(index)"
        :section="section"
      />
    </div>

    <TabbyButton @click="tab = tab.addSection()" text="Add Section" />
  </div>
</template>
