import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useDestinations } from '@/context/DestinationContext';
import BucketListItem from '@/components/BucketListItem';
import { useTheme } from '@/context/ThemeContext';
import { MapPin } from 'lucide-react-native';

export default function BucketListScreen() {
  const { bucketList, isLoading } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'My Bucket List',
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
            Loading your bucket list...
          </Text>
        </View>
      ) : bucketList.length === 0 ? (
        <View style={styles.centered}>
          <MapPin size={48} color={isDark ? '#cbd5e1' : '#334155'} />
          <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
            Your bucket list is empty
          </Text>
          <Text style={[styles.emptySubtitle, isDark && styles.textSubDark]}>
            Explore destinations and add them to your bucket list
          </Text>
        </View>
      ) : (
        <FlatList
          data={bucketList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BucketListItem destination={item} />}
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
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#334155', // neutral-700
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b', // neutral-500
    textAlign: 'center',
    paddingHorizontal: 32,
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
  textSubDark: {
    color: '#94a3b8', // neutral-400
  },
});