import React from 'react';
import { View } from 'react-native';
import { EventCounter, EventTime } from '../../atoms';
import { styles } from './styles';

export interface EventHeaderProps {
  currentIndex: number;
  totalEvents: number;
  timeString: string;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ 
  currentIndex, 
  totalEvents, 
  timeString 
}) => {
  return (
    <View style={styles.header}>
      <EventCounter current={currentIndex + 1} total={totalEvents} />
      <EventTime timeString={timeString} />
    </View>
  );
};