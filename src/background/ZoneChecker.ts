import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';
import { getSilentZones } from '../services/locationService';
import { checkProximity } from '../utils/checkProximity';

const TASK_NAME = 'background-silent-check';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return BackgroundFetch.BackgroundFetchResult.NoData;

    const location = await Location.getCurrentPositionAsync({});
    const zones = await getSilentZones();

    const zoneName = checkProximity(zones, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (zoneName) {
      console.log(`🔕 Silent zone reached: ${zoneName}`);
      // In future: show local notification here
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    console.error('Silent background check failed', e);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60, // run every 60 seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
