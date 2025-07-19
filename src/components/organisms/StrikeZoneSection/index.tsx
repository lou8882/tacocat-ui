import React from 'react';
import { View } from 'react-native';
import { SubSectionTitle } from '../../atoms';
import { DataRow } from '../../molecules';
import { styles } from './styles';

export interface StrikeZoneSectionProps {
  strikeZoneTop?: number;
  strikeZoneBottom?: number;
  typeConfidence?: number;
}

export const StrikeZoneSection: React.FC<StrikeZoneSectionProps> = ({
  strikeZoneTop,
  strikeZoneBottom,
  typeConfidence,
}) => {
  return (
    <View style={styles.container}>
      <SubSectionTitle>Strike Zone</SubSectionTitle>
      <View style={styles.dataGrid}>
        {strikeZoneTop !== undefined && (
          <DataRow label="Top:" value={`${strikeZoneTop.toFixed(2)} ft`} />
        )}
        {strikeZoneBottom !== undefined && (
          <DataRow label="Bottom:" value={`${strikeZoneBottom.toFixed(2)} ft`} />
        )}
        {typeConfidence !== undefined && (
          <DataRow label="Confidence:" value={`${(typeConfidence * 100).toFixed(1)}%`} />
        )}
      </View>
    </View>
  );
};