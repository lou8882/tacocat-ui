import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

export interface NavButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: string;
}

export const NavButton: React.FC<NavButtonProps> = ({ 
  onPress, 
  disabled = false, 
  children 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};