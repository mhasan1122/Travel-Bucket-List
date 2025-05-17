import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useDestinations } from '@/context/DestinationContext';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const { resetAllData, isLoading } = useDestinations();
  const { theme, setTheme, colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [isResetting, setIsResetting] = useState(false);
  
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your saved destinations. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await resetAllData();
              Alert.alert('Success', 'All data has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Settings',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 18,
            color: isDark ? '#f8fafc' : '#0f172a',
          },
          headerStyle: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
          },
        }} 
      />
      
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Appearance</Text>
        
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            theme === 'light' && styles.selectedOption,
            isDark && styles.optionButtonDark,
            theme === 'light' && isDark && styles.selectedOptionDark
          ]}
          onPress={() => handleThemeChange('light')}
        >
          <View style={styles.optionIcon}>
            <Sun size={20} color={theme === 'light' ? '#0891b2' : (isDark ? '#cbd5e1' : '#64748b')} />
          </View>
          <Text style={[
            styles.optionText, 
            theme === 'light' && styles.selectedOptionText,
            isDark && styles.textDark,
            theme === 'light' && isDark && styles.selectedOptionTextDark
          ]}>
            Light Mode
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            theme === 'dark' && styles.selectedOption,
            isDark && styles.optionButtonDark,
            theme === 'dark' && isDark && styles.selectedOptionDark
          ]}
          onPress={() => handleThemeChange('dark')}
        >
          <View style={styles.optionIcon}>
            <Moon size={20} color={theme === 'dark' ? '#0891b2' : (isDark ? '#cbd5e1' : '#64748b')} />
          </View>
          <Text style={[
            styles.optionText, 
            theme === 'dark' && styles.selectedOptionText,
            isDark && styles.textDark,
            theme === 'dark' && isDark && styles.selectedOptionTextDark
          ]}>
            Dark Mode
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.optionButton, 
            theme === 'system' && styles.selectedOption,
            isDark && styles.optionButtonDark,
            theme === 'system' && isDark && styles.selectedOptionDark
          ]}
          onPress={() => handleThemeChange('system')}
        >
          <View style={styles.optionIcon}>
            <View style={styles.systemIcon}>
              <Sun size={14} color={theme === 'system' ? '#0891b2' : (isDark ? '#cbd5e1' : '#64748b')} />
              <Moon size={14} color={theme === 'system' ? '#0891b2' : (isDark ? '#cbd5e1' : '#64748b')} />
            </View>
          </View>
          <Text style={[
            styles.optionText, 
            theme === 'system' && styles.selectedOptionText,
            isDark && styles.textDark,
            theme === 'system' && isDark && styles.selectedOptionTextDark
          ]}>
            Use System Setting
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Data Management</Text>
        
        <TouchableOpacity 
          style={[styles.dangerButton, isResetting && styles.disabledButton]}
          onPress={handleResetData}
          disabled={isResetting || isLoading}
        >
          {isResetting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Trash2 size={20} color="#ffffff" />
              <Text style={styles.dangerButtonText}>Reset All Data</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={[styles.disclaimer, isDark && styles.disclaimerDark]}>
          This action will delete all your saved destinations and cannot be undone.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
          Travel Bucket List v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // neutral-50
  },
  containerDark: {
    backgroundColor: '#0f172a', // neutral-900
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1e293b', // neutral-800
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#334155', // neutral-700
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc', // neutral-50
  },
  optionButtonDark: {
    backgroundColor: '#0f172a', // neutral-900
  },
  selectedOption: {
    backgroundColor: '#e0f2fe', // light blue-100
  },
  selectedOptionDark: {
    backgroundColor: '#0c4a6e', // blue-900
  },
  optionIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#334155', // neutral-700
  },
  selectedOptionText: {
    color: '#0891b2', // primary-500
    fontFamily: 'Inter-SemiBold',
  },
  selectedOptionTextDark: {
    color: '#22d3ee', // cyan-400
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  themeSwitchText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#334155', // neutral-700
  },
  dangerButton: {
    backgroundColor: '#f04438', // accent-500
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  dangerButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b', // neutral-500
    marginTop: 8,
    textAlign: 'center',
  },
  disclaimerDark: {
    color: '#94a3b8', // neutral-400
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b', // neutral-500
  },
  footerTextDark: {
    color: '#94a3b8', // neutral-400
  },
  textDark: {
    color: '#cbd5e1', // neutral-300
  },
});