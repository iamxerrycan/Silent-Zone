import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSilentZones, deleteZoneByName } from '../services/locationService';
import { checkProximity } from '../utils/checkProximity';
import { Zone, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { sendNotification } from '../utils/notify';

export default function HomeScreen() {
  const [zones, setZones] = useState<Zone[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadZones = async () => {
      const storedZones = await getSilentZones();
      setZones(storedZones);
    };
    const unsubscribe = navigation.addListener('focus', loadZones);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const checkSilent = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      const zoneName = checkProximity(zones, {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      if (zoneName) {
        sendNotification("Silent Zone Alert", `आप '${zoneName}' Silent Zone में हैं। कृपया Silent करें।`);
      }
    };
    checkSilent();
  }, [zones]);

  const handleDelete = async (name: string) => {
    await deleteZoneByName(name);
    const updated = await getSilentZones();
    setZones(updated);
  };

  const renderItem = ({ item }: { item: Zone }) => (
    <View style={styles.zoneCard}>
      <Text style={styles.zoneTitle}>{item.name}</Text>
      <Text style={styles.zoneInfo}>📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</Text>
      <Text style={styles.zoneInfo}>📏 Radius: {item.radius}m</Text>

      <View style={styles.cardButtons}>
        <Pressable style={styles.editBtn} onPress={() => navigation.navigate('Location', { editZone: item })}>
          <Text style={styles.btnText}> Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.name)}>
          <Text style={styles.btnText}>🗑 Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📵 Silent Zones</Text>

      <FlatList
        data={zones}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>कोई ज़ोन सेव नहीं है।</Text>}
        contentContainerStyle={zones.length === 0 && styles.emptyList}
      />

      <Pressable style={styles.addBtn} onPress={() => navigation.navigate('Location', {})}>
        <Text style={styles.addBtnText}> Add New Zone</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f9',
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#2c3e50',
  },
  zoneCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  zoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 6,
  },
  zoneInfo: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    marginTop: 16,
    fontSize: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 100,
    color: '#7f8c8d',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
