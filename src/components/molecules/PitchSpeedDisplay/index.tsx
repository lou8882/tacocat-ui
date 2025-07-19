import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface PitchSpeedDisplayProps {
  speed: number;
}

export const PitchSpeedDisplay: React.FC<PitchSpeedDisplayProps> = ({ speed }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.speedText}>
        {speed.toFixed(1)} mph
      </Text>
      <Text style={styles.label}>Start Speed</Text>
    </View>
  );
};