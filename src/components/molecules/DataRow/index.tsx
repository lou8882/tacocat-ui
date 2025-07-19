import React from 'react';
import { View } from 'react-native';
import { DataLabel, DataValue } from '../../atoms';
import { styles } from './styles';

export interface DataRowProps {
  label: string;
  value: string | number;
}

export const DataRow: React.FC<DataRowProps> = ({ label, value }) => {
  return (
    <View style={styles.row}>
      <DataLabel>{label}</DataLabel>
      <DataValue>{value}</DataValue>
    </View>
  );
};