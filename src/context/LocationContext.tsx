// src/context/LocationContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';

type LocationCoords = { latitude: number; longitude: number } | null;

interface LocationContextType {
  location: LocationCoords;
  refreshLocation: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  refreshLocation: async () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationCoords>(null);

  const getLocation = async () => {
    try {
      const fg = await Location.requestForegroundPermissionsAsync();
      const bg = await Location.requestBackgroundPermissionsAsync(); // ✅ Optional

      if (fg.status !== 'granted') return;

      const last = await Location.getLastKnownPositionAsync({});
      if (last) {
        setLocation(last.coords);
      } else {
        const fresh = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(fresh.coords);
      }
    } catch (err) {
      console.log('Location error:', err);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, refreshLocation: getLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
