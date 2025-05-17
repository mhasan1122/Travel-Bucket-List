import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useDestinations } from '@/context/DestinationContext';
import DestinationCard from '@/components/DestinationCard';
import { useTheme } from '@/context/ThemeContext';

export default function ExploreScreen() {
  const { destinations, isLoading, loadInitialData } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  // Check if we need to load initial data
  useEffect(() => {
    if (!isLoading && destinations.length === 0) {
      loadInitialData();
    }
  }, [isLoading, destinations.length]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Explore Destinations',
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
      
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={[styles.loadingText, isDark && styles.textDark]}>
            Loading destinations...
          </Text>
        </View>
      ) : destinations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, isDark && styles.textDark]}>
            No destinations found. Let's add some!
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadInitialData}
          >
            <Text style={styles.refreshButtonText}>
              Load Sample Destinations
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DestinationCard destination={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#334155', // neutral-700
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#334155', // neutral-700
    marginTop: 16,
  },
  textDark: {
    color: '#cbd5e1', // neutral-300
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0891b2', // primary-500
    borderRadius: 8,
  },
  refreshButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
  },
});