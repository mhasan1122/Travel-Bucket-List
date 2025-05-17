import AsyncStorage from '@react-native-async-storage/async-storage';
import { Destination } from '@/types/destination';

const DESTINATION_KEY = 'travel_destinations';

export const saveDestinations = async (destinations: Destination[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(DESTINATION_KEY, JSON.stringify(destinations));
  } catch (error) {
    console.error('Error saving destinations', error);
    throw error;
  }
};

export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const data = await AsyncStorage.getItem(DESTINATION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting destinations', error);
    return [];
  }
};

export const addDestination = async (destination: Destination): Promise<void> => {
  try {
    const currentDestinations = await getDestinations();
    currentDestinations.push(destination);
    await saveDestinations(currentDestinations);
  } catch (error) {
    console.error('Error adding destination', error);
    throw error;
  }
};

export const updateDestination = async (updatedDestination: Destination): Promise<void> => {
  try {
    const currentDestinations = await getDestinations();
    const updatedDestinations = currentDestinations.map(dest => 
      dest.id === updatedDestination.id ? updatedDestination : dest
    );
    await saveDestinations(updatedDestinations);
  } catch (error) {
    console.error('Error updating destination', error);
    throw error;
  }
};

export const removeDestination = async (id: string): Promise<void> => {
  try {
    const currentDestinations = await getDestinations();
    const updatedDestinations = currentDestinations.filter(dest => dest.id !== id);
    await saveDestinations(updatedDestinations);
  } catch (error) {
    console.error('Error removing destination', error);
    throw error;
  }
};

export const toggleBucketList = async (id: string): Promise<void> => {
  try {
    const currentDestinations = await getDestinations();
    const updatedDestinations = currentDestinations.map(dest => {
      if (dest.id === id) {
        return { ...dest, isInBucketList: !dest.isInBucketList };
      }
      return dest;
    });
    await saveDestinations(updatedDestinations);
  } catch (error) {
    console.error('Error toggling bucket list', error);
    throw error;
  }
};

export const toggleVisited = async (id: string): Promise<void> => {
  try {
    const currentDestinations = await getDestinations();
    const updatedDestinations = currentDestinations.map(dest => {
      if (dest.id === id) {
        const now = new Date();
        return { 
          ...dest, 
          isVisited: !dest.isVisited,
          dateVisited: !dest.isVisited ? now.toISOString() : undefined
        };
      }
      return dest;
    });
    await saveDestinations(updatedDestinations);
  } catch (error) {
    console.error('Error toggling visited', error);
    throw error;
  }
};

export const resetAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DESTINATION_KEY);
  } catch (error) {
    console.error('Error resetting data', error);
    throw error;
  }
};