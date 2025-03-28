import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredData = async (key: string) => {
  try {
    const storedData = await AsyncStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : null
  } catch (error) {
    console.error(`Error getting data from AsyncStorage for key: ${key}`, error)
    return null;
  }
};