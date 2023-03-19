<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import Column from '../values/column';
import Cursor from '../values/cursor';
import Section from '../values/section';
import TabbyButton from './TabbyButton.vue';
import TabbyColumn from './TabbyColumn.vue';
import TabbyInput from './TabbyInput.vue';
import TabbyModal from './TabbyModal.vue';

const props = withDefaults(
  defineProps<{
    section: Section;
    cursor: Cursor;
    isSelected: boolean;
    isReadOnly?: boolean;
  }>(),
  {
    isReadOnly: false,
  }
);

const emits = defineEmits<{
  (e: 'sectionChanged', section: Section): void;
  (e: 'noteSelected', string: number, active: boolean, index: number): void;
  (e: 'settingsOpened'): void;
  (e: 'settingsClosed'): void;
}>();

const sectionSettingsOpen = ref(false);
const updatedName = ref(props.section.name);

watch(
  () => props.cursor,
  () => {
    if (!props.isReadOnly && props.isSelected && props.cursor.isCurrentColumn(props.section.columns.length)) {
      createColumn(props.cursor.currentString(), false);
    }
  }
);

const onColumnChanged = (column: Column, columnIndex: number) => {
  emits('sectionChanged', props.section.setColumn(column, columnIndex));
};

const createColumn = async (string: number, active: boolean) => {
  emits('sectionChanged', props.section.addColumn());
  await nextTick();
  emits('noteSelected', string, active, props.section.columns.length - 1);
};

const onNoteSelected = (string: number, active: boolean, index: number) => {
  emits('noteSelected', string, active, index);
};

const onSettingsClosed = () => {
  emits('sectionChanged', props.section.updateName(updatedName.value));
  emits('settingsClosed');
};
</script>

<template>
  <div class="mb-6">
    <div class="text-md mb-4 flex items-center font-bold">
      <div class="mr-4">{{ section.name }}</div>
      <TabbyButton
        v-if="!isReadOnly"
        @click="
          $emit('settingsOpened');
          sectionSettingsOpen = true;
        "
        text="Section Settings"
      />
    </div>

    <TabbyModal title="Section Settings" @closed="onSettingsClosed" v-model="sectionSettingsOpen">
      <TabbyInput label="Section Name" placeholder="e.g. Verse 1" v-model="updatedName" />
    </TabbyModal>

    <div class="text-md flex font-mono font-bold leading-none text-gray-700">
      <div>
        <div v-for="(tuning, index) in section.getTuning()" :key="index">{{ tuning }}</div>
      </div>
      <div>
        <div v-for="(tuning, index) in section.getTuning()" :key="index">|</div>
      </div>
      <div>
        <div v-for="(tuning, index) in section.getTuning()" :key="index">--</div>
      </div>

      <div
        v-for="(column, index) in section.columns"
        :key="column.id"
        v-memo="[cursor.columnMemoKey(index), isReadOnly]"
      >
        <TabbyColumn
          @note-selected="(string, active) => onNoteSelected(string, active, index)"
          @column-changed="(column) => onColumnChanged(column, index)"
          :is-selected="isSelected && cursor.isCurrentColumn(index)"
          :is-read-only="isReadOnly"
          :cursor="cursor"
          :column="column"
        />
      </div>

      <div v-if="!isReadOnly">
        <div
          v-for="(tuning, index) in section.getTuning()"
          :key="index"
          @click="createColumn(index + 1, true)"
          class="cursor-pointer text-blue-400 hover:bg-blue-200"
        >
          --
        </div>
      </div>
    </div>
  </div>
</template>
