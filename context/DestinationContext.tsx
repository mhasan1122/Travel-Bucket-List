import React, { createContext, useContext, useState, useEffect } from 'react';
import { Destination } from '@/types/destination';
import * as Storage from '@/services/storage';
import { sampleDestinations } from '@/data/sampleDestinations';

type DestinationContextType = {
  destinations: Destination[];
  bucketList: Destination[];
  visitedDestinations: Destination[];
  addDestination: (destination: Destination) => Promise<void>;
  removeDestination: (id: string) => Promise<void>;
  toggleBucketList: (id: string) => Promise<void>;
  toggleVisited: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  isLoading: boolean;
};

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bucketList = destinations.filter(dest => dest.isInBucketList);
  const visitedDestinations = destinations.filter(dest => dest.isVisited);

  // Load destinations from storage
  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const storedDestinations = await Storage.getDestinations();
      if (storedDestinations.length > 0) {
        setDestinations(storedDestinations);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      console.error('Error loading destinations', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Storage.saveDestinations(sampleDestinations);
      setDestinations(sampleDestinations);
    } catch (error) {
      console.error('Error loading initial data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addDestination = async (destination: Destination) => {
    try {
      await Storage.addDestination(destination);
      setDestinations(prev => [...prev, destination]);
    } catch (error) {
      console.error('Error adding destination', error);
    }
  };

  const removeDestination = async (id: string) => {
    try {
      await Storage.removeDestination(id);
      setDestinations(prev => prev.filter(dest => dest.id !== id));
    } catch (error) {
      console.error('Error removing destination', error);
    }
  };

  const toggleBucketList = async (id: string) => {
    try {
      await Storage.toggleBucketList(id);
      setDestinations(prev => 
        prev.map(dest => 
          dest.id === id ? { ...dest, isInBucketList: !dest.isInBucketList } : dest
        )
      );
    } catch (error) {
      console.error('Error toggling bucket list', error);
    }
  };

  const toggleVisited = async (id: string) => {
    try {
      await Storage.toggleVisited(id);
      setDestinations(prev => 
        prev.map(dest => {
          if (dest.id === id) {
            const now = new Date();
            return { 
              ...dest, 
              isVisited: !dest.isVisited,
              dateVisited: !dest.isVisited ? now.toISOString() : undefined
            };
          }
          return dest;
        })
      );
    } catch (error) {
      console.error('Error toggling visited', error);
    }
  };

  const resetAllData = async () => {
    try {
      await Storage.resetAllData();
      setDestinations([]);
    } catch (error) {
      console.error('Error resetting data', error);
    }
  };

  return (
    <DestinationContext.Provider 
      value={{ 
        destinations, 
        bucketList, 
        visitedDestinations,
        addDestination, 
        removeDestination, 
        toggleBucketList, 
        toggleVisited,
        resetAllData,
        loadInitialData,
        isLoading,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = () => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestinations must be used within a DestinationProvider');
  }
  return context;
};