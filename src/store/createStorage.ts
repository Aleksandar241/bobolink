import { createMMKV } from 'react-native-mmkv';

export function createStorage(id: string) {
  const storage = createMMKV({ id });

  return storage;
}
