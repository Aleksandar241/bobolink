import { create } from 'zustand';
import {
  PersistOptions,
  StateStorage,
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import { createStorage } from './createStorage';

function createPersistStore<TState>(
  initializer: (set: any, get: any) => TState,
  name: string,
  options?: Partial<Omit<PersistOptions<TState>, 'name' | 'storage'>>
) {
  return create(
    persist(initializer, {
      ...options,
      name,
      storage: createJSONStorage(() => {
        const storage = createStorage(name);

        const adapter: StateStorage = {
          getItem: async (key: string) => {
            const value = storage.getString(key);
            return value ?? null;
          },
          setItem: async (key: string, value: string) => {
            storage.set(key, value);
          },
          removeItem: async (key: string) => {
            storage.remove(key);
          },
        };

        return adapter;
      }),
    })
  );
}

export { createPersistStore, create as createStore };
