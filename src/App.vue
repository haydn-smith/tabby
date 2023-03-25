<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TabbyButton from './components/TabbyButton.vue';
import TabbyInput from './components/TabbyInput.vue';
import TabbyModal from './components/TabbyModal.vue';
import TabbySection from './components/TabbySection.vue';
import useDownloader from './hooks/useDownloader';
import Cursor from './values/cursor';
import Section from './values/section';
import Tab from './values/tab';

const download = useDownloader();
const tab = ref(Tab.create());
const cursor = ref(new Cursor());
const tabSettingsOpen = ref(false);
const isReadOnly = ref(false);
const isDisabled = ref(false);

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    // There are no key events in readonly mode.
    if (isReadOnly.value || isDisabled.value) {
      return;
    }

    // Move the cursor based on the key that is pressed.
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

const onSectionDeleted = (index: number) => {
  tab.value = tab.value.deleteSection(index);
  isDisabled.value = false;
};

const onNoteSelected = (string: number, column: number, section: number, active: boolean) => {
  cursor.value = cursor.value
    .moveCursor(section, column, string)
    .toggleActive(active)
    .moveCursorWithinSectionBounds(tab.value);
};

const onExportJsonClicked = () => {
  download('tabby.json', JSON.stringify(tab.value.toJson(), undefined, 2));
};

const onExportTextClicked = () => {
  download('tabby.txt', tab.value.toText());
};

const onFileUploaded = (text: string) => {
  const json = JSON.parse(text);
  tab.value = Tab.createFromJson(json);
  isReadOnly.value = false;
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
            isDisabled = true;
            tabSettingsOpen = true;
          "
          text="Tab Settings"
          :disabled="isDisabled"
        />
      </div>

      <TabbyModal title="Tab Settings" @closed="isDisabled = false" v-model="tabSettingsOpen">
        <TabbyInput label="Tab Name" placeholder="e.g. I Miss You by Blink 182" v-model="tab.name" />

        <div class="mt-5 text-center text-base font-semibold leading-6 text-gray-700">Export</div>
        <div class="text-center text-sm leading-6 text-gray-700">Export your guitar tab so you can use it later!</div>
        <div class="mt-2 text-center">
          <TabbyButton class="mr-1" text="Export as tabby.json" @click="onExportJsonClicked" />
          <TabbyButton class="" text="Export as tabby.txt" @click="onExportTextClicked" />
        </div>

        <div class="mt-5 text-center text-base font-semibold leading-6 text-gray-700">Import</div>
        <div class="text-center text-sm leading-6 text-gray-700">
          Import your guitar tab from a <strong>tabby.json</strong> file.
        </div>
        <div class="mt-2 text-center">
          <TabbyInput @file-changed="onFileUploaded" type="file" label="Import" />
        </div>
      </TabbyModal>

      <div
        v-for="(section, index) in tab.sections"
        :key="index"
        v-memo="[cursor.sectionMemoKey(index), isReadOnly, isDisabled, section.name]"
      >
        <TabbySection
          @note-selected="(string, active, column) => onNoteSelected(string, column, index, active)"
          @section-changed="(section) => onSectionChanged(index, section)"
          @section-deleted="onSectionDeleted(index)"
          @settings-opened="isDisabled = true"
          @settings-closed="isDisabled = false"
          @section-played="isDisabled = true"
          @section-stopped="isDisabled = false"
          :cursor="cursor"
          :is-selected="cursor.isCurrentSection(index)"
          :is-read-only="isReadOnly"
          :is-disabled="isDisabled"
          :section="section"
        />
      </div>

      <TabbyButton :disabled="isDisabled" v-if="!isReadOnly" @click="tab = tab.addSection()" text="Add Section" />
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
