import queryString from 'query-string';
import create from 'zustand';
import { devtools, persist, StateStorage } from 'zustand/middleware';
import Tab from '../values/tab';

export interface UrlStore {
  tab: Tab;
  setState: (state: Partial<UrlStore>) => void;
}

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const params = queryString.parse(location.search);
    const data = Buffer.from(params[`${name}`] as string, 'base64').toString('binary');
    const json = `{"state":${data},"version":0}`;
    return Promise.resolve(json);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const state = JSON.stringify(JSON.parse(value).state);
    const domain = window.location.protocol + '//' + window.location.host + window.location.pathname;
    const query = `?${name}=` + Buffer.from(state, 'binary').toString('base64');
    window.history.pushState({ path: domain + query }, '', domain + query);
    return Promise.resolve();
  },
  removeItem: async (): Promise<void> => {
    // Not sure why we need this one.
    return Promise.resolve();
  },
};

/**
 * The non-volatile global store for this application.
 */
const useUrlStore = create<UrlStore>()(
  devtools(
    persist(
      (set) => ({
        tab: Tab.make(),
        setState: (state: Partial<UrlStore>) => {
          set(state);
        },
      }),
      {
        name: 'store',
        getStorage: () => storage,
      }
    )
  )
);

export default useUrlStore;
