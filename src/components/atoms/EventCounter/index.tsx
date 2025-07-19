import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface EventCounterProps {
  current: number;
  total: number;
}

export const EventCounter: React.FC<EventCounterProps> = ({ current, total }) => {
  return (
    <Text style={styles.counter}>
      Event {current} of {total}
    </Text>
  );
};