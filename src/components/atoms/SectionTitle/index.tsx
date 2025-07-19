import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export interface SectionTitleProps {
  children: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <Text style={styles.title}>
      {children}
    </Text>
  );
};