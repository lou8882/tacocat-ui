import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface SubSectionTitleProps {
  children: string;
}

export const SubSectionTitle: React.FC<SubSectionTitleProps> = ({ children }) => {
  return (
    <Text style={styles.title}>
      {children}
    </Text>
  );
};