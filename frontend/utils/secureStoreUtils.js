import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Set a value in SecureStore
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {Promise<boolean>} - True if successful, throws error otherwise
 */
export const setSecureItem = async (key, value) => {
    try {
        const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error setting secure store item:', error);
        throw new Error(`Failed to set ${key} in secure storage`);
    }
};

/**
 * Get a value from SecureStore
 * @param {string} key - The key to retrieve
 * @returns {Promise<any>} - The stored value
 */
export const getSecureItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value != null) {
            return value;
        }
        return null;
    } catch (error) {
        console.error('Error getting secure store item:', error);
        throw new Error(`Failed to get ${key} from secure storage`);
    }
};

/**
 * Remove a value from SecureStore
 * @param {string} key - The key to remove
 * @returns {Promise<boolean>} - True if successful, throws error otherwise
 */
export const removeSecureItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing secure store item:', error);
        throw new Error(`Failed to remove ${key} from secure storage`);
    }
};

/**
 * Update a value in SecureStore
 * @param {string} key - The key to update
 * @param {Function} updateFn - Function that receives the old value and returns the new value
 * @returns {Promise<any>} - The updated value
 */
export const updateSecureItem = async (key, updateFn) => {
    try {
        const currentValue = await getSecureItem(key);
        const newValue = updateFn(currentValue);
        await setSecureItem(key, newValue);
        return newValue;
    } catch (error) {
        console.error('Error updating secure store item:', error);
        throw new Error(`Failed to update ${key} in secure storage`);
    }
};

/**
 * Check if a key exists in SecureStore
 * @param {string} key - The key to check
 * @returns {Promise<boolean>} - True if key exists, false otherwise
 */
export const hasSecureItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null;
    } catch (error) {
        console.error('Error checking secure store item:', error);
        throw new Error(`Failed to check ${key} in secure storage`);
    }
};

// Common keys used in the app
export const SECURE_STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    USER_DATA: 'user_data',
};