// src/background/LocationTask.ts
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('LOCATION_TASK Error:', error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    const location = locations[0];
    console.log('📍 Background Location:', location);
    // Optional: Save or notify
  }
});

