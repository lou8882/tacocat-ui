import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface ScoreDisplayProps {
  awayScore: number;
  homeScore: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ awayScore, homeScore }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Away: {awayScore} | Home: {homeScore}
      </Text>
    </View>
  );
};