import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  icon?: string;
  title: string;
  color?: string;
}

export default function AnimatedHeader({ icon = 'volume-off', title, color = '#2c3e50' }: Props) {
  return (
    <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
      <Icon name={icon} size={26} color={color} style={{ marginRight: 8 }} />
      <Text style={[styles.title, { color }]}>{title}</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
