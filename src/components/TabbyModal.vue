<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import TabbyButton from './TabbyButton.vue';

withDefaults(
  defineProps<{
    title: string;
    noFooter?: boolean;
    modelValue: boolean;
  }>(),
  {
    noFooter: false,
  }
);

const emit = defineEmits<{
  (e: 'closed'): void;
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('closed');
};
</script>

<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm"
            >
              <DialogTitle
                as="h3"
                class="bg-gray-100 p-6 text-center text-base font-semibold leading-6 text-gray-700"
                >{{ title }}</DialogTitle
              >
              <div class="p-6">
                <div class="">
                  <div class="text-sm text-gray-500">
                    <slot></slot>
                  </div>
                </div>
              </div>
              <div v-if="!noFooter" class="bg-gray-100 p-6 text-center">
                <TabbyButton @click="close" text="Save and Close" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
