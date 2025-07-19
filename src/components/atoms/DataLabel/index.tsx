import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface DataLabelProps {
  children: string;
}

export const DataLabel: React.FC<DataLabelProps> = ({ children }) => {
  return (
    <Text style={styles.label}>
      {children}
    </Text>
  );
};