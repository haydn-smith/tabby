import queryString from 'query-string';
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
    const domain = window.location.protocol + '//' + window.location.host + window.location.pathname;
    const params = queryString.parse(location.search);
    params[key] = serialise(newValue);
    const query = `?${queryString.stringify(params)}`;
    window.history.pushState({ path: domain + query }, '', domain + query);
  });

  // Hydrate on mount.
  onMounted(() => {
    try {
      const params = queryString.parse(location.search);
      const serialised = params[key];
      if (typeof serialised === 'string') {
        storedValue.value = deserialise(serialised);
      }
    } catch {}
  });

  return storedValue;
}
