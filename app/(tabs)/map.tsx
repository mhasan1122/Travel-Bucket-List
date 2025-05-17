import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import type { Region } from 'react-native-maps';
import { Stack } from 'expo-router';
import { useDestinations } from '@/context/DestinationContext';
import { useTheme } from '@/context/ThemeContext';

// Only import MapView when not on web platform
let MapView: React.ComponentType<any>;
let Marker: React.ComponentType<any>;
let PROVIDER_GOOGLE: string;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function MapScreen() {
  const { visitedDestinations, isLoading } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  }>>([]);
  const mapRef = useRef<any>(null);

  const destinationsWithCoordinates = visitedDestinations
    .filter((dest): dest is typeof dest & { coordinates: NonNullable<typeof dest.coordinates> } =>
      dest.coordinates !== undefined
    )
    .map(dest => ({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      coordinates: dest.coordinates,
    }));

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    const searchTerm = text.toLowerCase().trim();
    const filteredResults = destinationsWithCoordinates.filter(dest => {
      const nameMatch = dest.name?.toLowerCase().includes(searchTerm);
      const countryMatch = dest.country?.toLowerCase().includes(searchTerm);
      return nameMatch || countryMatch;
    });
    setSearchResults(filteredResults);
  };

  const focusLocation = (destination: {
    coordinates: { latitude: number; longitude: number };
  }) => {
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: destination.coordinates.latitude,
        longitude: destination.coordinates.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const mapStyle = isDark
    ? [
        {
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }]
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }]
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }]
        }
      ]
    : [];

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.centered}>
          <MapPin size={48} color={isDark ? '#cbd5e1' : '#334155'} />
          <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
            Map is not available on web
          </Text>
          <Text style={[styles.emptySubtitle, isDark && styles.textSubDark]}>
            Please use our mobile app to view your visited destinations on the map
          </Text>
        </View>
      );
    }

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: destinationsWithCoordinates[0]?.coordinates?.latitude || 0,
          longitude: destinationsWithCoordinates[0]?.coordinates?.longitude || 0,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
      >
        {destinationsWithCoordinates.map(destination => (
          destination.coordinates && (
            <Marker
              key={destination.id}
              coordinate={{
                latitude: destination.coordinates.latitude,
                longitude: destination.coordinates.longitude,
              }}
              title={destination.name}
              description={destination.country}
              pinColor="#0891b2"
            />
          )
        ))}
      </MapView>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {Platform.OS !== 'web' && (
        <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, isDark && styles.searchInputDark]}
              placeholder="Search places..."
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              style={[styles.searchButton, isDark && styles.searchButtonDark]}
              onPress={() => handleSearch(searchQuery)}
            >
              <Search size={20} color={isDark ? '#f8fafc' : '#0f172a'} />
            </TouchableOpacity>
          </View>
          {searchResults.length > 0 && (
            <ScrollView style={[styles.searchResults, isDark && styles.searchResultsDark]}>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={[styles.resultItem, isDark && styles.resultItemDark]}
                  onPress={() => focusLocation(result)}
                >
                  <Text style={[styles.resultText, isDark && styles.resultTextDark]}>
                    {result.name}, {result.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Visited Places Map',
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
            Loading your map...
          </Text>
        </View>
      ) : destinationsWithCoordinates.length === 0 ? (
        <View style={styles.centered}>
          <MapPin size={48} color={isDark ? '#cbd5e1' : '#334155'} />
          <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
            No places on your map
          </Text>
          <Text style={[styles.emptySubtitle, isDark && styles.textSubDark]}>
            Mark destinations as visited to see them appear on this map
          </Text>
        </View>
      ) : renderMap()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainerDark: {
    backgroundColor: '#1e293b',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0f172a',
  },
  searchInputDark: {
    color: '#f8fafc',
  },
  searchButton: {
    padding: 12,
    backgroundColor: '#e2e8f0',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchButtonDark: {
    backgroundColor: '#334155',
  },
  searchResults: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  searchResultsDark: {
    borderTopColor: '#334155',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultItemDark: {
    borderBottomColor: '#334155',
  },
  resultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#334155',
  },
  resultTextDark: {
    color: '#cbd5e1',
  },
  map: {
    width: '100%',
    height: '100%',
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
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#334155',
    marginTop: 16,
  },
  textDark: {
    color: '#cbd5e1',
  },
  textSubDark: {
    color: '#94a3b8',
  },
});
