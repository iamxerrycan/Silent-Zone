import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSilentZones } from '../services/locationService';
import { RootStackParamList, Zone } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function LocationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Location'>>();
  const editZone = route.params?.editZone;

  const [name, setName] = useState(editZone?.name || '');
  const [radius, setRadius] = useState(String(editZone?.radius || '50'));
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const init = async () => {
      if (editZone) {
        setLocation({
          latitude: editZone.latitude,
          longitude: editZone.longitude,
        });
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!name || !radius || !location) {
      Alert.alert('Validation', 'All fields and location required');
      return;
    }

    const newZone: Zone = {
      name,
      latitude: location.latitude,
      longitude: location.longitude,
      radius: parseInt(radius),
    };

    const zones = await getSilentZones();
    const filtered = zones.filter(z => z.name !== editZone?.name);
    const updated = [...filtered, newZone];

    await AsyncStorage.setItem('SILENT_ZONES', JSON.stringify(updated));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {editZone ? 'Edit Zone' : 'Add Silent Zone'}
      </Text>

      <Text style={styles.label}>Zone Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Ex: Library, Temple"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Radius (in meters)</Text>
      <TextInput
        value={radius}
        onChangeText={setRadius}
        style={styles.input}
        placeholder="Ex: 100"
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} title={name || 'Zone Location'} />
            <Circle
              center={location}
              radius={parseInt(radius)}
              strokeColor="rgba(0, 122, 255, 0.6)"
              fillColor="rgba(0, 122, 255, 0.2)"
            />
          </MapView>
        </View>
      )}

      <Pressable
        style={[
          styles.saveBtn,
          !location && { backgroundColor: '#95a5a6' },
        ]}
        onPress={handleSave}
        disabled={!location}
      >
        <Text style={styles.saveBtnText}>
          {!location
            ? '⏳ Loading Location...'
            : editZone
            ? 'Update Zone'
            : '💾 Save Zone'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 18,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    fontSize: 15,
    color: '#2c3e50',
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 250,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
