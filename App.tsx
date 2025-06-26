import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationScreen from './src/screens/LocationScreen';
import { RootStackParamList } from './src/types';
import { registerBackgroundTask } from './src/background/ZoneChecker';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { LOCATION_TASK } from './src/background/LocationTask';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Background zone checker
  useEffect(() => {
    registerBackgroundTask();
  }, []);

  // Start background location tracking
  useEffect(() => {
    const startLocationTask = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
      if (!isStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 900000,
          distanceInterval: 100,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Silent Zone Tracker',
            notificationBody: 'App silently tracking your location for silent zones.',
          },
        });
      }
    };

    startLocationTask();
  }, []);

  // Request notification permission
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // Custom App Theme (optional)
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#eef2f5', // light grey background
    },
  };

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: '#eef2f5',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '📍 Silent Zones' }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={({ route }) => ({
            title: route.params?.editZone ? '✏️ Edit Zone' : '➕ Add Zone',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
