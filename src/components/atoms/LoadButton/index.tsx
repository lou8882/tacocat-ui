import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

export interface LoadButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const LoadButton: React.FC<LoadButtonProps> = ({ 
  onPress, 
  loading = false, 
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.text}>
        {loading ? 'Loading...' : 'Load Game Data'}
      </Text>
    </TouchableOpacity>
  );
};