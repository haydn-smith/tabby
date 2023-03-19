<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import TabbyButton from './components/TabbyButton.vue';
import TabbyInput from './components/TabbyInput.vue';
import TabbyModal from './components/TabbyModal.vue';
import TabbySection from './components/TabbySection.vue';
import Cursor from './values/cursor';
import Section from './values/section';
import Tab from './values/tab';

const tab = ref(Tab.make());
const cursor = ref(new Cursor());
const tabSettingsOpen = ref(false);
const isReadOnly = ref(false);

watch(tab, (oldVal, newVal) => {
  const asString = JSON.stringify(newVal);

  const asBase64 = btoa(asString);

  const domain = window.location.protocol + '//' + window.location.host + window.location.pathname;
  const query = `?data=` + asBase64;
  window.history.pushState({ path: domain + query }, '', domain + query);

  console.log(asBase64);
});

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    // There are no key events in readonly mode.
    if (isReadOnly.value) {
      return;
    }

    cursor.value = cursor.value
      .moveCursorFromKeyboardEvent(event)
      .moveCursorBetweenSections(tab.value)
      .moveCursorWithinSectionBounds(tab.value);

    // We stop this from happening so that using our cursor doesn't have
    // unintended side effects like clicking buttons.
    if (['Enter', 'Escape', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
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
  <div class="relative h-screen w-screen overflow-hidden bg-gray-100 text-gray-700">
    <div class="h-full overflow-scroll p-6 pb-24">
      <div class="mb-8 flex items-center text-lg font-bold">
        <div class="mr-4">{{ tab.name }}</div>
        <TabbyButton
          v-if="!isReadOnly"
          @click="
            isReadOnly = true;
            tabSettingsOpen = true;
          "
          text="Tab Settings"
        />
      </div>

      <TabbyModal title="Tab Settings" @closed="isReadOnly = false" v-model="tabSettingsOpen">
        <TabbyInput label="Tab Name" placeholder="e.g. I Miss You by Blink 182" v-model="tab.name" />
      </TabbyModal>

      <div
        v-for="(section, index) in tab.sections"
        :key="index"
        v-memo="[cursor.sectionMemoKey(index), isReadOnly, section.name]"
      >
        <TabbySection
          @note-selected="(string, active, column) => onNoteSelected(string, column, index, active)"
          @section-changed="(section) => onSectionChanged(index, section)"
          @settings-opened="isReadOnly = true"
          @settings-closed="isReadOnly = false"
          :cursor="cursor"
          :is-selected="cursor.isCurrentSection(index)"
          :is-read-only="isReadOnly"
          :section="section"
        />
      </div>

      <TabbyButton v-if="!isReadOnly" @click="tab = tab.addSection()" text="Add Section" />
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 flex justify-between border-t border-t-gray-300 bg-gray-100 p-6 text-sm"
    >
      <TabbyButton @click="isReadOnly = !isReadOnly" :text="'Read Only: ' + (isReadOnly ? 'Yes' : 'No')" />
      <div>
        <a class="hover:underline" href="https://github.com/BadMojoVeryBad/tabby" target="_blank">View on GitHub</a>
      </div>
    </div>
  </div>
</template>
