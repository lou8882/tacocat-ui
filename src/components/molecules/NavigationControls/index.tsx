import React from 'react';
import { View } from 'react-native';
import { NavButton } from '../../atoms';
import { styles } from './styles';

export interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onPreviousPlay: () => void;
  onNextPlay: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  canGoPreviousPlay: boolean;
  canGoNextPlay: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  onPreviousPlay,
  onNextPlay,
  canGoPrevious,
  canGoNext,
  canGoPreviousPlay,
  canGoNextPlay,
}) => {
  return (
    <View style={styles.container}>
      <NavButton onPress={onPreviousPlay} disabled={!canGoPreviousPlay}>
        ⏮ Prev Play
      </NavButton>
      <NavButton onPress={onPrevious} disabled={!canGoPrevious}>
        ← Prev Pitch
      </NavButton>
      <NavButton onPress={onNext} disabled={!canGoNext}>
        Next Pitch →
      </NavButton>
      <NavButton onPress={onNextPlay} disabled={!canGoNextPlay}>
        Next Play ⏭
      </NavButton>
    </View>
  );
};