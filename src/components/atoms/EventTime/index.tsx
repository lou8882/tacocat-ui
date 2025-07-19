import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface EventTimeProps {
  timeString: string;
}

export const EventTime: React.FC<EventTimeProps> = ({ timeString }) => {
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString();
  };

  return (
    <Text style={styles.time}>
      {formatTime(timeString)}
    </Text>
  );
};