import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface CountDisplayProps {
  balls: number;
  strikes: number;
  outs: number;
}

export const CountDisplay: React.FC<CountDisplayProps> = ({ balls, strikes, outs }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Count: {balls}-{strikes}
      </Text>
      <Text style={styles.text}>
        Outs: {outs}
      </Text>
    </View>
  );
};