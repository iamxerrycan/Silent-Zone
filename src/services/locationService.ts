import AsyncStorage from '@react-native-async-storage/async-storage';

const ZONE_KEY = 'SILENT_ZONES';

export type Zone = {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
};

// Save a new zone to AsyncStorage
export const saveZone = async (zone: Zone): Promise<void> => {
  const zones = await getSilentZones();
  zones.push(zone);
  await AsyncStorage.setItem(ZONE_KEY, JSON.stringify(zones));
};

// Get all saved zones
export const getSilentZones = async (): Promise<Zone[]> => {
  const json = await AsyncStorage.getItem(ZONE_KEY);
  return json ? JSON.parse(json) : [];
};

// Clear all zones
export const clearZones = async (): Promise<void> => {
  await AsyncStorage.removeItem(ZONE_KEY);
};

export const deleteZoneByName = async (name: string): Promise<void> => {
  const zones = await getSilentZones();
  const updatedZones = zones.filter(zone => zone.name !== name);
  await AsyncStorage.setItem(ZONE_KEY, JSON.stringify(updatedZones));
};
