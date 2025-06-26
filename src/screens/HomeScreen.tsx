import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSilentZones, deleteZoneByName } from '../services/locationService';
import { checkProximity } from '../utils/checkProximity';
import { Zone, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sendNotification } from '../utils/notify';
import AnimatedHeader from './AnimationHeader';
import { LocationContext } from '../context/LocationContext';

export default function HomeScreen() {
  const [zones, setZones] = useState<Zone[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { location } = useContext(LocationContext); 

  useEffect(() => {
    const fetchZones = async () => {
      const storedZones = await getSilentZones();
      setZones(storedZones);
    };

    const unsubscribe = navigation.addListener('focus', fetchZones);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!location) return;

    const zoneName = checkProximity(zones, {
      latitude: location.latitude,
      longitude: location.longitude,
    });

    if (zoneName) {
      sendNotification(
        'Silent Zone Alert',
        `आप '${zoneName}' Silent Zone में हैं। कृपया Silent करें।`
      );
    }
  }, [location, zones]);

  const handleDelete = async (name: string) => {
    await deleteZoneByName(name);
    const updated = await getSilentZones();
    setZones(updated);
  };

  const renderItem = ({ item }: { item: Zone }) => (
    <View style={styles.zoneCard}>
      <Text style={styles.zoneTitle}>{item.name}</Text>
      <Text style={styles.zoneInfo}>
        📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
      </Text>
      <Text style={styles.zoneInfo}>📏 Radius: {item.radius}m</Text>

      <View style={styles.cardButtons}>
        <Pressable
          style={styles.editBtn}
          onPress={() => navigation.navigate('Location', { editZone: item })}
        >
          <Text style={styles.btnText}> Edit</Text>
        </Pressable>
        <Pressable
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.name)}
        >
          <Text style={styles.btnText}>🗑 Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader title="Silent Zones" icon="volume-off" />

      <FlatList
        data={zones}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}> No Silent Zones Found !</Text>
        }
        contentContainerStyle={zones.length === 0 && styles.emptyList}
      />

      <Pressable
        style={styles.addBtn}
        onPress={() => navigation.navigate('Location', {})}
      >
        <Text style={styles.addBtnText}>➕ Add New Zone</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef3f9', padding: 16 },
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
  zoneInfo: { color: '#7f8c8d', fontSize: 14, marginBottom: 4 },
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
  btnText: { color: '#fff', fontWeight: '600' },
  addBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 100,
    color: '#7f8c8d',
  },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
});
