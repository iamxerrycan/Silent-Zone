import * as TaskManager from 'expo-task-manager';
import { getSilentZones } from '../services/locationService';
import { checkProximity } from '../utils/checkProximity';
import { sendNotification } from '../utils/notify';
import { LocationObject } from 'expo-location';

const LOCATION_TASK = 'background-location-task';


TaskManager.defineTask(LOCATION_TASK, async ({
  data,
  error,
}: {
  data?: { locations: LocationObject[] };
  error: TaskManager.TaskManagerError | null;
}) => {
  if (error || !data?.locations?.length) return;

  const location = data.locations[0];
  const zones = await getSilentZones();

  const zoneName = checkProximity(zones, {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  if (zoneName) {
    await sendNotification('Silent Zone Alert', `You are inside '${zoneName}' silent zone. Please turn off your phone.`);
  }
});

export { LOCATION_TASK };


