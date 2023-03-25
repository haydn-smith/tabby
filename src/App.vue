<script setup lang="ts">
import { ArrowSmallLeftIcon, ArrowSmallRightIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import TabbyButton from './components/TabbyButton.vue';
import TabbyInput from './components/TabbyInput.vue';
import TabbyModal from './components/TabbyModal.vue';
import TabbySection from './components/TabbySection.vue';
import useDownloader from './hooks/useDownloader';
import useStorage from './hooks/useStorage';
import template from './template.json';
import Cursor from './values/cursor';
import Section from './values/section';
import Tab from './values/tab';

const download = useDownloader();
const tab = useStorage(
  'tab',
  Tab.create(),
  (value) => JSON.stringify(value.toJson()),
  (string) => Tab.createFromJson(JSON.parse(string))
);
const cursor = ref(new Cursor());
const tabSettingsOpen = ref(false);
const welcomeOpen = ref(false);
const helpOpen = ref(false);
const isReadOnly = ref(false);
const isDisabled = ref(false);

onMounted(() => {
  if (tab.value.isNew()) {
    welcomeOpen.value = true;
    isDisabled.value = true;
  }

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
  isDisabled.value = false;
  tabSettingsOpen.value = false;
  welcomeOpen.value = false;
};

const onStartFromTemplateClicked = () => {
  tab.value = Tab.createFromJson(template);
  isDisabled.value = false;
  welcomeOpen.value = false;
};

const onStartFromBlankClicked = () => {
  tab.value = Tab.create();
  isDisabled.value = false;
  welcomeOpen.value = false;
  tabSettingsOpen.value = false;
};

const onHelpClicked = () => {
  helpOpen.value = true;
  isDisabled.value = true;
};

const onHelpClosed = () => {
  helpOpen.value = false;
  isDisabled.value = false;
};
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden bg-gray-100 text-gray-700">
    <div class="h-full overflow-scroll p-6 pb-24">
      <div class="w-fit">
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

          <div class="mt-5 text-center text-base font-semibold leading-6 text-gray-700">Delete Tab</div>
          <div class="mt-2 text-center">
            <TabbyButton class="" text="Delete Tab" @click="onStartFromBlankClicked" />
          </div>
        </TabbyModal>

        <TabbyModal title="Welcome to Tabby!" :no-footer="true" @closed="isDisabled = false" v-model="welcomeOpen">
          <div class="mt-2 mb-4 flex justify-center">
            <img class="h-12 w-12" src="/favicon.jpg" />
          </div>
          <div class="text-center text-sm leading-6 text-gray-700">
            Tabby can be used to create, edit, play, and export Guitar tablature. Choose where to start:
          </div>
          <div class="mt-2 text-center">
            <TabbyButton class="mr-1 mb-1" text="Start From a Template" @click="onStartFromTemplateClicked" />
            <TabbyButton class="mr-1 mb-1" text="Start From a Blank Tab" @click="onStartFromBlankClicked" />
            <TabbyInput class="mb-1" @file-changed="onFileUploaded" type="file" label="Import From .json" />
          </div>
        </TabbyModal>

        <TabbyModal @closed="onHelpClosed" v-model="helpOpen" title="Help">
          <div class="mb-5 text-center text-sm leading-6 text-gray-700">
            Interact with Tabby using the mouse pointer, or with hotkeys:
          </div>

          <div class="mb-2 flex items-center">Use mouse to select positions on the guitar tab.</div>

          <div class="mb-2 flex items-center">
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >↑</kbd
            >
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >↓</kbd
            >
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >→</kbd
            >
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >←</kbd
            >
            Move to a position on the guitar tab.
          </div>

          <div class="mb-2 flex items-center">
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >Enter</kbd
            >
            Edit the selected position.
          </div>

          <div class="mb-2 flex items-center">
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >Esc</kbd
            >
            <kbd
              class="mr-2 inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
              >Enter</kbd
            >
            Save the selected position.
          </div>

          <div class="mb-2 flex items-center">
            <div class="mr-2 flex h-4 w-4 items-center justify-center bg-blue-200 hover:bg-blue-300">
              <XMarkIcon class="h-4 w-4" />
            </div>
            Delete the selected column.
          </div>

          <div class="mb-2 flex items-center">
            <div class="mr-2 flex h-4 w-4 items-center justify-center rounded-l bg-blue-200 hover:bg-blue-300">
              <ArrowSmallLeftIcon class="h-4 w-4" />
            </div>
            <div class="mr-2 flex h-4 w-4 items-center justify-center rounded-r bg-blue-200 hover:bg-blue-300">
              <ArrowSmallRightIcon class="h-4 w-4" />
            </div>
            Insert a column before or after.
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
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 flex justify-between border-t border-t-gray-300 bg-gray-100 p-6 text-sm"
    >
      <div class="flex">
        <TabbyButton @click="onHelpClicked" class="mr-1" text="Help" />
        <TabbyButton @click="isReadOnly = !isReadOnly" :text="'Read Only: ' + (isReadOnly ? 'Yes' : 'No')" />
      </div>
      <div>
        <a class="hover:underline" href="https://github.com/BadMojoVeryBad/tabby" target="_blank">View on GitHub</a>
      </div>
    </div>
  </div>
</template>
