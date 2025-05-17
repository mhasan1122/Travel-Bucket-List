import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Destination } from '@/types/destination';
import { useDestinations } from '@/context/DestinationContext';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, Check, Trash2 } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

interface BucketListItemProps {
  destination: Destination;
}

export default function BucketListItem({ destination }: BucketListItemProps) {
  const { toggleVisited, removeDestination } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const swipeableRef = useRef<Swipeable>(null);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  
  const showCelebration = useSharedValue(false);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value
    };
  });
  
  const confettiAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: showCelebration.value ? 1 : 0,
      display: showCelebration.value ? 'flex' : 'none',
    };
  });
  
  const markAsVisited = async () => {
    if (!destination.isVisited) {
      // Animate card when marking as visited
      scale.value = withSequence(
        withTiming(0.95, { duration: 150 }),
        withTiming(1.02, { duration: 200 }),
        withTiming(1, { duration: 150 })
      );
      
      // Show celebration animation
      showCelebration.value = true;
      
      // Hide celebration after a delay
      setTimeout(() => {
        showCelebration.value = false;
      }, 2000);
    }
    
    await toggleVisited(destination.id);
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };
  
  const confirmDelete = () => {
    Alert.alert(
      'Remove Destination',
      `Are you sure you want to remove ${destination.name} from your bucket list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
          }
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: deleteItem
        }
      ]
    );
  };
  
  const deleteItem = async () => {
    // Animate when deleting
    scale.value = withTiming(0.9, { duration: 100 });
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(20, { duration: 300 });
    
    // Small delay before actual deletion
    setTimeout(async () => {
      await removeDestination(destination.id);
    }, 300);
  };
  
  const renderRightActions = () => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.visitedButton]}
          onPress={markAsVisited}
        >
          <Check size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={confirmDelete}
        >
          <Trash2 size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <Animated.View style={[animatedStyle, { position: 'relative' }]}>
      <Animated.View style={[
        styles.confettiContainer,
        confettiAnimatedStyle
      ]}>
        <LottieView
          source={require('../assets/animations/confetti.json')}
          autoPlay
          loop={false}
          style={styles.confetti}
        />
      </Animated.View>
      
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
      >
        <View style={[
          styles.container, 
          destination.isVisited && styles.visitedContainer,
          isDark && styles.containerDark,
          destination.isVisited && isDark && styles.visitedContainerDark
        ]}>
          <Image 
            source={{ uri: destination.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.name, 
                destination.isVisited && styles.visitedText,
                isDark && styles.textDark
              ]} numberOfLines={1}>
                {destination.name}
              </Text>
              
              {destination.isVisited && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Visited</Text>
                </View>
              )}
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[
                styles.location, 
                destination.isVisited && styles.visitedSubText,
                isDark && styles.locationDark
              ]}>
                {destination.country}
              </Text>
            </View>
            
            {destination.notes && (
              <Text style={[
                styles.notes, 
                destination.isVisited && styles.visitedSubText,
                isDark && styles.notesDark
              ]} numberOfLines={1}>
                {destination.notes}
              </Text>
            )}
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  containerDark: {
    backgroundColor: '#1e293b', // neutral-800
  },
  visitedContainer: {
    backgroundColor: '#f1f5f9', // neutral-100
    borderColor: '#e2e8f0', // neutral-200
    borderWidth: 1,
  },
  visitedContainerDark: {
    backgroundColor: '#0f172a', // neutral-900
    borderColor: '#1e293b', // neutral-800
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a', // neutral-900
    flex: 1,
  },
  visitedText: {
    color: '#64748b', // neutral-500
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  notes: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b', // neutral-500
  },
  notesDark: {
    color: '#94a3b8', // neutral-400
  },
  visitedSubText: {
    color: '#94a3b8', // neutral-400
  },
  badge: {
    backgroundColor: '#ecfdf5', // green-50
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5', // green-100
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981', // green-500
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
  },
  actionButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitedButton: {
    backgroundColor: '#10b981', // green-500
  },
  deleteButton: {
    backgroundColor: '#f04438', // accent-500
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  confetti: {
    width: 200,
    height: 200,
  },
  textDark: {
    color: '#f8fafc', // neutral-50
  },
});