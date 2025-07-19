import React from 'react';
import { View } from 'react-native';
import { NavButton } from '../../atoms';
import { styles } from './styles';

export interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <View style={styles.container}>
      <NavButton onPress={onPrevious} disabled={!canGoPrevious}>
        ← Previous
      </NavButton>
      <NavButton onPress={onNext} disabled={!canGoNext}>
        Next →
      </NavButton>
    </View>
  );
};