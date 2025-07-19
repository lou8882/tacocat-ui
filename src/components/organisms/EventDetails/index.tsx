import React from 'react';
import { View, Text } from 'react-native';
import { CountDisplay, ScoreDisplay } from '../../molecules';
import { styles } from './styles';

export interface EventDetailsProps {
  description: string;
  event?: string;
  call?: {
    code: string;
    description: string;
  };
  type?: {
    description: string;
  };
  count: {
    balls: number;
    strikes: number;
    outs: number;
  };
  awayScore?: number;
  homeScore?: number;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  description,
  event,
  call,
  type,
  count,
  awayScore,
  homeScore,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>{description}</Text>
      
      {event && (
        <Text style={styles.eventType}>
          Event: {event}
        </Text>
      )}

      {call && (
        <Text style={styles.callDescription}>
          Call: {call.description} ({call.code})
        </Text>
      )}

      {type && (
        <Text style={styles.pitchType}>
          Pitch Type: {type.description}
        </Text>
      )}

      <CountDisplay 
        balls={count.balls} 
        strikes={count.strikes} 
        outs={count.outs} 
      />

      {awayScore !== undefined && homeScore !== undefined && (
        <ScoreDisplay awayScore={awayScore} homeScore={homeScore} />
      )}
    </View>
  );
};