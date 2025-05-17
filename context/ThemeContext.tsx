import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as ColorSchemeName;
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  
  // Get the actual color scheme based on theme preference
  const colorScheme = theme === 'system' 
    ? (systemColorScheme || 'light') as 'light' | 'dark'
    : theme;

  // Load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.log('Error loading theme', error);
      }
    };
    
    loadTheme();
  }, []);

  // Update theme and save to storage
  const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.log('Error saving theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};