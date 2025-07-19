import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface EventMetadataProps {
  type: string;
  index: number;
  isPitch?: boolean;
  pitchNumber?: number;
}

export const EventMetadata: React.FC<EventMetadataProps> = ({
  type,
  index,
  isPitch,
  pitchNumber,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Type: {type} | Index: {index}
      </Text>
      {isPitch && pitchNumber && (
        <Text style={styles.text}>
          Pitch #{pitchNumber}
        </Text>
      )}
    </View>
  );
};