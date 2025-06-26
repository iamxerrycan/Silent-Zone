import * as Notifications from 'expo-notifications';

export async function sendNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Silent Zone Alert: " + title,
      sound: true,
      body: "You are inside a silent zone. Please turn off your phone." + body,
    },
    trigger: null, // triggers immediately
  });
}
