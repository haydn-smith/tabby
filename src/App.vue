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

const tab = ref(new Tab());

onMounted(() => {
  document.addEventListener("keyup", (event: KeyboardEvent) => {
    console.log(event.key);
  });
});

const onSectionChanged = (
  sectionIndex: number,
  section: Section
) => {
  tab.value.sections[sectionIndex] = section;
}

</script>

<template>
  <div class="relative p-6 bg-gray-100 w-screen h-screen overflow-hidden">
    <div class="font-bold text-lg mb-6">{{ tab.name }}</div>

    <div v-for="section, index in tab.sections" :key="index">
      <SectionComponent @section-changed="section => onSectionChanged(index, section)" :section="section"/>
    </div>

    <Button @click="tab.addSection()" text="Add Section"/>

    <div class="bottom-0 left-0 right-0 absolute m-6">
      <Panel>
        Hello there
      </Panel>
    </div>
  </div>
</template>
