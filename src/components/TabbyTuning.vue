<script setup lang="ts">
import { ref, watch } from 'vue';
import Note from '../values/note';
import TabbyButton from './TabbyButton.vue';
import TabbyModal from './TabbyModal.vue';

const props = defineProps<{
  isOpen: boolean;
  tuning: Note[];
}>();

const emit = defineEmits<{
  (e: 'tuningChanged', tuning: Note[]): void;
}>();

const newTuning = ref<Array<Note>>(props.tuning.map((note) => new Note(note.semitone, note.octave)));

watch(
  () => props.tuning,
  () => {
    newTuning.value = props.tuning.map((note) => new Note(note.semitone, note.octave));
  }
);

const replaceNote = (note: Note, atIndex: number) => {
  newTuning.value = newTuning.value.map((n, index) => (index === atIndex ? note : n));
};

const onSave = () => {
  emit('tuningChanged', newTuning.value);
};
</script>

<template>
  <TabbyModal title="Tuning" @closed="onSave" :model-value="isOpen">
    <div class="text-left text-sm leading-6 text-gray-700">
      Add, remove, or adjust the tuning of the strings on this tab.

      <div class="mt-5 rounded bg-red-100 py-2 px-3 text-red-700">
        Note that this is a destructive action and you may lose tab data that has already been created.
      </div>
    </div>
    <div class="mt-5 text-left">
      <div
        class="flex items-center"
        v-for="(note, index) in newTuning"
        :key="`${note.semitone.valueOf()}${note.octave}${index}`"
      >
        <div class="mr-1 mb-1 w-8 rounded bg-gray-200 px-2 py-1 text-center font-mono text-xs text-gray-700">
          {{ note.asString() }}
        </div>
        <TabbyButton class="mr-1 mb-1" text="▼" @click="replaceNote(note.removeSemitones(1), index)" />
        <TabbyButton class="mr-1 mb-1" text="▲" @click="replaceNote(note.addSemitones(1), index)" />
        <TabbyButton class="mr-1 mb-1" text="Remove String" @click="newTuning.splice(index, 1)" />
      </div>

      <TabbyButton class="mt-5" text="Add String" @click="newTuning.push(Note.create())" />
    </div>
  </TabbyModal>
</template>
