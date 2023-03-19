<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-10" @close="$emit('update:modelValue', false)">
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <!-- <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"> -->
                <!--   <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" /> -->
                <!-- </div> -->
                <div class="">
                  <DialogTitle as="h3" class="text-center text-base font-semibold leading-6 text-gray-900">{{
                    title
                  }}</DialogTitle>
                  <div class="mt-5 text-sm text-gray-500">
                    <slot></slot>
                  </div>
                </div>
              </div>
              <div class="mt-5 text-center sm:mt-6">
                <Button @click="$emit('update:modelValue', false)" text="Save and Close" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import Button from './Button.vue';

defineProps<{
  title: string;
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
}>();
</script>
