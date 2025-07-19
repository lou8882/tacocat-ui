import React from 'react';
import { View } from 'react-native';
import { SubSectionTitle } from '../../atoms';
import { DataRow } from '../../molecules';
import { styles } from './styles';

export interface BreaksSectionProps {
  breaks: {
    breakAngle?: number;
    breakLength?: number;
    breakY?: number;
    breakVertical?: number;
    breakHorizontal?: number;
    spinRate?: number;
    spinDirection?: number;
  };
}

export const BreaksSection: React.FC<BreaksSectionProps> = ({ breaks }) => {
  return (
    <View style={styles.container}>
      <SubSectionTitle>Break Data</SubSectionTitle>
      <View style={styles.dataGrid}>
        {breaks.breakAngle !== undefined && (
          <DataRow label="Break Angle:" value={`${breaks.breakAngle}°`} />
        )}
        {breaks.breakLength !== undefined && (
          <DataRow label="Break Length:" value={`${breaks.breakLength}"`} />
        )}
        {breaks.breakY !== undefined && (
          <DataRow label="Break Y:" value={`${breaks.breakY}"`} />
        )}
        {breaks.breakVertical !== undefined && (
          <DataRow label="Break Vertical:" value={`${breaks.breakVertical}"`} />
        )}
        {breaks.breakHorizontal !== undefined && (
          <DataRow label="Break Horizontal:" value={`${breaks.breakHorizontal}"`} />
        )}
        {breaks.spinRate !== undefined && (
          <DataRow label="Spin Rate:" value={`${breaks.spinRate} rpm`} />
        )}
        {breaks.spinDirection !== undefined && (
          <DataRow label="Spin Direction:" value={`${breaks.spinDirection}°`} />
        )}
      </View>
    </View>
  );
};