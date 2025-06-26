import 'dotenv/config';

export default {
  expo: {
    name: "auto-silent-app",
    slug: "auto-silent-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.iamxerrycan.autosilentapp",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/icon.png"
    },
    plugins: [
      "expo-notifications",
      "expo-location",
      "expo-task-manager"
    ],
    extra: {
      eas: {
        projectId: "a3ae8aa3-0e4a-4d71-9afd-89ac4f20318b"
      }
    }
  }
};
