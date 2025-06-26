// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LocationScreen from './src/screens/LocationScreen';
import WelcomeHeader from './src/screens/Navbar';
import { RootStackParamList } from './src/types';
import { registerBackgroundTask } from './src/background/ZoneChecker';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { LOCATION_TASK } from './src/background/LocationTask';
import { LocationProvider } from './src/context/LocationContext';

// ✅ Import background task definition at root level
import './src/background/LocationTask';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    registerBackgroundTask();
  }, []);

  useEffect(() => {
    const startLocationTask = async () => {
      try {
        const fg = await Location.requestForegroundPermissionsAsync();
        const bg = await Location.requestBackgroundPermissionsAsync();

        if (fg.status !== 'granted' || bg.status !== 'granted') return;

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
      } catch (e) {
        console.error('Background Task Error:', e);
      }
    };

    startLocationTask();
  }, []);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#eef2f5',
    },
  };

  return (
    <LocationProvider>
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {() => (
              <>
                <WelcomeHeader name="Rajshish" />
                <HomeScreen />
              </>
            )}
          </Stack.Screen>
          <Stack.Screen name="Location">
            {() => (
              <>
                <WelcomeHeader name="User" />
                <LocationScreen />
              </>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}
