import React from 'react';
import { View, Text } from 'react-native';
import { LoadButton, LoadingIndicator } from '../../molecules';
import { styles } from './styles';

export interface GameHeaderProps {
  onLoadGame: () => void;
  loading: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onLoadGame, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MLB Game Event Viewer</Text>
      <LoadButton onPress={onLoadGame} loading={loading} />
      {loading && <LoadingIndicator />}
    </View>
  );
};