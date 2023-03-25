<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import Position from '../values/position';

const props = withDefaults(
  defineProps<{
    note: Position;
    width: number;
    isSelected: boolean;
    isActive: boolean;
    isReadOnly?: boolean;
  }>(),
  {
    isReadOnly: false,
  }
);

const emits = defineEmits<{
  (e: 'noteChanged', fret: string): void;
  (e: 'noteSelected', active: boolean): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const modelValue = ref('');

onMounted(() => {
  modelValue.value = props.note.fret;
});

const selectNote = (active: boolean) => {
  if (!props.isReadOnly) {
    if (!active) {
      emits('noteChanged', modelValue.value);
    }

    emits('noteSelected', active);
  }
};

watch(
  () => props.isActive,
  async () => {
    await nextTick();

    if (props.isActive) {
      inputRef.value?.focus();
    }
  }
);
</script>

<template>
  <div
    @click="selectNote(true)"
    @keydown.enter="selectNote(true)"
    :class="{ 'bg-blue-300': isSelected && !isReadOnly, 'cursor-pointer hover:bg-blue-200': !isReadOnly }"
    class="relative"
  >
    <div>{{ note.padFret(width) }}-</div>
    <input
      ref="inputRef"
      @blur="selectNote(false)"
      v-show="isActive && !isReadOnly"
      v-model="modelValue"
      class="absolute inset-0 z-50 m-0 w-full rounded-none border-none bg-white p-0 text-center focus:ring-0"
    />
  </div>
</template>
