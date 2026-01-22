import * as SecureStore from 'expo-secure-store';

// Custom storage adapter for Supabase Auth using Expo SecureStore
// Note: SecureStore is not supported on Web, so we need a fallback or conditional check if you plan to support Web.
// For this app (Mobile focused), SecureStore is perfect.

export const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        console.log('SecureStoreAdapter: getItem', key);
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        console.log('SecureStoreAdapter: setItem', key);
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        console.log('SecureStoreAdapter: removeItem', key);
        return SecureStore.deleteItemAsync(key);
    },
};
