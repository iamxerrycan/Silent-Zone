import { Zone } from '../types';

type Location = {
  latitude: number;
  longitude: number;
};

export function checkProximity(zones: Zone[], currentLocation: Location): string | null {
  for (const zone of zones) {
    const dist = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      zone.latitude,
      zone.longitude
    );
    if (dist <= zone.radius) return zone.name;
  }
  return null;
}

// Haversine formula
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}
