import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface Props {
  name: string;
}

export default function WelcomeHeader({ name }: Props) {
  return (
    <Animatable.View animation="fadeInDown" duration={700} style={styles.container}>
      <Text style={styles.greeting}>👋 Welcome, {name}</Text>
      <Text style={styles.sub}>📍 Manage your Silent Zones</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
    paddingTop: Platform.OS === 'android' ? 40: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    display: 'flex',
    alignItems: 'center',
    shadowRadius: 5,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sub: {
    color: '#bdc3c7',
    fontSize: 14,
    marginTop: 4,
  },
});
