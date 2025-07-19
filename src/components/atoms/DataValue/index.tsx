import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface DataValueProps {
  children: string | number;
}

export const DataValue: React.FC<DataValueProps> = ({ children }) => {
  return (
    <Text style={styles.value}>
      {children}
    </Text>
  );
};