import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSilentZones } from '../services/locationService';
import { RootStackParamList, Zone } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Circle } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import AnimatedHeader from './AnimationHeader';
import { LocationContext } from '../context/LocationContext';

export default function LocationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Location'>>();
  const editZone = route.params?.editZone;

  const [name, setName] = useState(editZone?.name || '');
  const [radius, setRadius] = useState(String(editZone?.radius || '50'));
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { location: globalLocation } = useContext(LocationContext);

  useEffect(() => {
    if (editZone) {
      setLocation({
        latitude: editZone.latitude,
        longitude: editZone.longitude,
      });
    } else if (globalLocation) {
      setLocation(globalLocation);
    }
  }, [editZone, globalLocation]);

  const handleSave = async () => {
    if (!name.trim() || !radius || !location) {
      Alert.alert('Validation Error', 'Please fill all fields and allow location.');
      return;
    }

    const newZone: Zone = {
      name,
      latitude: location.latitude,
      longitude: location.longitude,
      radius: parseInt(radius) || 50,
    };

    try {
      const storedZones = await getSilentZones();

      const updatedZones = editZone
        ? storedZones.filter((z) => z.name !== editZone.name).concat(newZone)
        : [...storedZones, newZone];

      await AsyncStorage.setItem('SILENT_ZONES', JSON.stringify(updatedZones));
      Alert.alert('Success', editZone ? 'Zone updated!' : 'Zone saved!');
      navigation.goBack();
    } catch (e) {
      console.error('Error saving zone:', e);
      Alert.alert('Error', 'Failed to save the zone. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader
        title={editZone ? 'Edit Zone' : 'Add Silent Zone'}
        icon={editZone ? 'map-marker-edit' : 'map-marker-plus'}
      />

      <Text style={styles.label}>Zone Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ex: Library, Temple"
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      <Text style={styles.label}>Radius (meters)</Text>
      <TextInput
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
        placeholder="Ex: 100"
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      {!location ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0984e3" />
          <Text style={{ marginTop: 10, color: '#636e72' }}>
            📍 Loading Location...
          </Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} title={name || 'Zone Location'} />
            <Circle
              center={location}
              radius={parseInt(radius) || 50}
              strokeColor="rgba(0,122,255,0.6)"
              fillColor="rgba(0,122,255,0.2)"
            />
          </MapView>
        </View>
      )}

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>
          {editZone ? 'Update Zone' : '💾 Save Zone'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f5', padding: 20 },
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
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  loadingBox: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe6e9',
    marginTop: 20,
    borderRadius: 12,
  },
  mapContainer: {
    height: 250,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
