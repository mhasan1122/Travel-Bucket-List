import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useDestinations } from '@/context/DestinationContext';
import { useTheme } from '@/context/ThemeContext';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddDestinationScreen() {
  const { addDestination } = useDestinations();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    if (!name || !country) {
      Alert.alert('Required fields', 'Please enter name and country at minimum.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newDestination = {
        id: Date.now().toString(),
        name,
        country,
        description: description || `Destination in ${country}`,
        imageUrl: imageUrl || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
        isInBucketList: true,
        isVisited: false,
        dateAdded: new Date().toISOString(),
        notes,
        coordinates: latitude && longitude ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        } : undefined,
      };
      
      await addDestination(newDestination);
      
      // Reset form
      setName('');
      setCountry('');
      setDescription('');
      setNotes('');
      setImageUrl('');
      setLatitude('');
      setLongitude('');
      
      // Navigate to bucket list
      router.push('/bucket-list');
    } catch (error) {
      Alert.alert('Error', 'Failed to add destination. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Add Destination',
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
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imagePickerContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.previewImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, isDark && styles.placeholderImageDark]}>
              <ImageIcon size={32} color={isDark ? '#cbd5e1' : '#64748b'} />
              <Text style={[styles.placeholderText, isDark && styles.textDark]}>
                Add destination image
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.pickImageButton} 
            onPress={pickImage}
          >
            <Camera size={16} color="#ffffff" />
            <Text style={styles.pickImageText}>
              {imageUrl ? 'Change Image' : 'Select Image'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.label, isDark && styles.labelDark]}>Name*</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Tokyo"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        
        <Text style={[styles.label, isDark && styles.labelDark]}>Country*</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={country}
          onChangeText={setCountry}
          placeholder="e.g. Japan"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        
        <Text style={[styles.label, isDark && styles.labelDark]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, isDark && styles.inputDark]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe this destination..."
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          multiline
          numberOfLines={Platform.OS === 'ios' ? 0 : 4}
          textAlignVertical="top"
        />
        
        <Text style={[styles.label, isDark && styles.labelDark]}>Personal Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea, isDark && styles.inputDark]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add your personal notes about this place..."
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          multiline
          numberOfLines={Platform.OS === 'ios' ? 0 : 4}
          textAlignVertical="top"
        />
        
        <Text style={[styles.label, isDark && styles.labelDark]}>Coordinates (optional)</Text>
        <View style={styles.coordinatesContainer}>
          <TextInput
            style={[styles.input, styles.coordinateInput, isDark && styles.inputDark]}
            value={latitude}
            onChangeText={setLatitude}
            placeholder="Latitude"
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.coordinateInput, isDark && styles.inputDark]}
            value={longitude}
            onChangeText={setLongitude}
            placeholder="Longitude"
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            keyboardType="numeric"
          />
        </View>
        
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Add to Bucket List
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0', // neutral-200
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderImageDark: {
    backgroundColor: '#334155', // neutral-700
  },
  placeholderText: {
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    color: '#64748b', // neutral-500
  },
  pickImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2', // primary-500
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pickImageText: {
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 6,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#334155', // neutral-700
    marginBottom: 6,
  },
  labelDark: {
    color: '#cbd5e1', // neutral-300
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0', // neutral-200
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b', // neutral-800
  },
  inputDark: {
    backgroundColor: '#1e293b', // neutral-800
    borderColor: '#334155', // neutral-700
    color: '#f8fafc', // neutral-50
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateInput: {
    flex: 0.48,
  },
  submitButton: {
    backgroundColor: '#0891b2', // primary-500
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    fontSize: 16,
  },
  textDark: {
    color: '#cbd5e1', // neutral-300
  },
});