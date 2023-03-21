<script setup lang="ts">
import { v1 } from 'uuid';
import { ref } from 'vue';

withDefaults(
  defineProps<{
    type?: 'text' | 'file';
    label: string;
    placeholder?: string;
    modelValue?: string;
  }>(),
  {
    type: 'text',
    placeholder: '',
    modelValue: '',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
  (e: 'fileChanged', text: string): void;
}>();

const id = ref(v1());
const file = ref<HTMLInputElement | null>(null);

const onFileChanged = async () => {
  emit('fileChanged', (await file.value?.files?.item(0)?.text()) ?? '');
};
</script>

<template>
  <div>
    <div v-if="type === 'file'">
      <label :for="id">
        <div
          class="inline-block cursor-pointer rounded bg-blue-400 py-1 px-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {{ label }}
        </div>
      </label>
      <input ref="file" :id="id" class="hidden" type="file" @change="onFileChanged()" />
    </div>

    <div
      v-if="type === 'text'"
      class="rounded-md px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 transition focus-within:ring-2 focus-within:ring-blue-400"
    >
      <label for="name" class="block text-xs font-medium text-gray-900">{{ label }}</label>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type"
        name="name"
        id="name"
        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>
