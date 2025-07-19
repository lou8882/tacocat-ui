import React from 'react';
import { View } from 'react-native';
import { SubSectionTitle } from '../../atoms';
import { DataRow } from '../../molecules';
import { styles } from './styles';

export interface CoordinatesSectionProps {
  coordinates: {
    pX?: number;
    pZ?: number;
    x?: number;
    y?: number;
    vX0?: number;
    vY0?: number;
    vZ0?: number;
    aX?: number;
    aY?: number;
    aZ?: number;
    pfxX?: number;
    pfxZ?: number;
    x0?: number;
    y0?: number;
    z0?: number;
  };
}

export const CoordinatesSection: React.FC<CoordinatesSectionProps> = ({ coordinates }) => {
  return (
    <View style={styles.container}>
      <SubSectionTitle>Coordinates</SubSectionTitle>
      <View style={styles.dataGrid}>
        {coordinates.pX !== undefined && (
          <DataRow label="pX:" value={coordinates.pX.toFixed(3)} />
        )}
        {coordinates.pZ !== undefined && (
          <DataRow label="pZ:" value={coordinates.pZ.toFixed(3)} />
        )}
        {coordinates.x !== undefined && (
          <DataRow label="x:" value={coordinates.x.toFixed(2)} />
        )}
        {coordinates.y !== undefined && (
          <DataRow label="y:" value={coordinates.y.toFixed(2)} />
        )}
        {coordinates.vX0 !== undefined && (
          <DataRow label="vX0:" value={coordinates.vX0.toFixed(2)} />
        )}
        {coordinates.vY0 !== undefined && (
          <DataRow label="vY0:" value={coordinates.vY0.toFixed(2)} />
        )}
        {coordinates.vZ0 !== undefined && (
          <DataRow label="vZ0:" value={coordinates.vZ0.toFixed(2)} />
        )}
        {coordinates.aX !== undefined && (
          <DataRow label="aX:" value={coordinates.aX.toFixed(2)} />
        )}
        {coordinates.aY !== undefined && (
          <DataRow label="aY:" value={coordinates.aY.toFixed(2)} />
        )}
        {coordinates.aZ !== undefined && (
          <DataRow label="aZ:" value={coordinates.aZ.toFixed(2)} />
        )}
        {coordinates.pfxX !== undefined && (
          <DataRow label="pfxX:" value={coordinates.pfxX.toFixed(2)} />
        )}
        {coordinates.pfxZ !== undefined && (
          <DataRow label="pfxZ:" value={coordinates.pfxZ.toFixed(2)} />
        )}
        {coordinates.x0 !== undefined && (
          <DataRow label="x0:" value={coordinates.x0.toFixed(2)} />
        )}
        {coordinates.y0 !== undefined && (
          <DataRow label="y0:" value={coordinates.y0.toFixed(2)} />
        )}
        {coordinates.z0 !== undefined && (
          <DataRow label="z0:" value={coordinates.z0.toFixed(2)} />
        )}
      </View>
    </View>
  );
};