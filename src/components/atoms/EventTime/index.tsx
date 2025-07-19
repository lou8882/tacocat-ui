import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface EventTimeProps {
  timeString: string;
}

export const EventTime: React.FC<EventTimeProps> = ({ timeString }) => {
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <Text style={styles.time}>
      {formatTime(timeString)}
    </Text>
  );
};