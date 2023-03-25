import { onMounted, ref, Ref, watch } from 'vue';

export default function useQueryStringStorage<T>(
  key: string,
  initialValue: T,
  serialise: (value: T) => string,
  deserialise: (string: string) => T
) {
  const storedValue = ref<T>(initialValue) as Ref<T>;

  // Store on change.
  watch(storedValue, (newValue) => {
    localStorage.setItem(key, serialise(newValue));
  });

  // Hydrate on mount.
  onMounted(() => {
    try {
      const serialised = localStorage.getItem(key);
      if (serialised !== null) {
        storedValue.value = deserialise(serialised);
      }
    } catch {
      // ...
    }
  });

  return storedValue;
}
