import { Tabs } from 'expo-router';
import { MapPin, List, Plus, Map, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0891b2', // primary-500
        tabBarInactiveTintColor: isDark ? '#cbd5e1' : '#64748b', // neutral-300 or neutral-500
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff', // neutral-800 or white
          borderTopColor: isDark ? '#334155' : '#e2e8f0', // neutral-700 or neutral-200
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff', // neutral-800 or white
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          color: isDark ? '#f8fafc' : '#0f172a', // neutral-50 or neutral-900
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bucket-list"
        options={{
          title: 'Bucket List',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}