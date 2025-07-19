import React from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../../atoms';
import { PitchSpeedDisplay, DataRow } from '../../molecules';
import { styles } from './styles';

export interface PitchDataSectionProps {
  pitchData: {
    startSpeed?: number;
    endSpeed?: number;
    extension?: number;
    plateTime?: number;
    zone?: number;
  };
}

export const PitchDataSection: React.FC<PitchDataSectionProps> = ({ pitchData }) => {
  if (!pitchData.startSpeed) return null;

  return (
    <View style={styles.container}>
      <SectionTitle>Pitch Data</SectionTitle>
      
      <PitchSpeedDisplay speed={pitchData.startSpeed} />

      <View style={styles.dataGrid}>
        {pitchData.endSpeed && (
          <DataRow label="End Speed:" value={`${pitchData.endSpeed.toFixed(1)} mph`} />
        )}
        {pitchData.extension && (
          <DataRow label="Extension:" value={`${pitchData.extension.toFixed(1)} ft`} />
        )}
        {pitchData.plateTime && (
          <DataRow label="Plate Time:" value={`${pitchData.plateTime.toFixed(3)} s`} />
        )}
        {pitchData.zone && (
          <DataRow label="Zone:" value={pitchData.zone} />
        )}
      </View>
    </View>
  );
};