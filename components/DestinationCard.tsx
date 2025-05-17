import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Destination } from '@/types/destination';
import { useDestinations } from '@/context/DestinationContext';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, Plus, Check } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
  Easing,
  withTiming
} from 'react-native-reanimated';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { toggleBucketList } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` }
      ]
    };
  });
  
  const handleAddToBucketList = async () => {
    if (!destination.isInBucketList) {
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      
      rotation.value = withSequence(
        withTiming(-2, { duration: 50 }),
        withTiming(2, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
    }
    
    await toggleBucketList(destination.id);
  };
  
  return (
    <Animated.View style={[
      styles.container, 
      isDark && styles.containerDark,
      animatedStyle
    ]}>
      <Image 
        source={{ uri: destination.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, isDark && styles.textDark]} numberOfLines={1}>
            {destination.name}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={isDark ? '#94a3b8' : '#64748b'} />
            <Text style={[styles.location, isDark && styles.locationDark]} numberOfLines={1}>
              {destination.country}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.description, isDark && styles.descriptionDark]} numberOfLines={2}>
          {destination.description}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.button,
            destination.isInBucketList ? styles.addedButton : styles.addButton
          ]}
          onPress={handleAddToBucketList}
        >
          {destination.isInBucketList ? (
            <>
              <Check size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Added to Bucket List</Text>
            </>
          ) : (
            <>
              <Plus size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Add to Bucket List</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: '#1e293b', // neutral-800
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0f172a', // neutral-900
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748b', // neutral-500
    marginLeft: 4,
  },
  locationDark: {
    color: '#94a3b8', // neutral-400
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#334155', // neutral-700
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#cbd5e1', // neutral-300
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  addButton: {
    backgroundColor: '#0891b2', // primary-500
  },
  addedButton: {
    backgroundColor: '#15803d', // green-700
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
  },
  textDark: {
    color: '#f8fafc', // neutral-50
  },
});