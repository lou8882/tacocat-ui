import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface MatchupDisplayProps {
  matchup?: {
    batter: {
      id: number;
      fullName: string;
    };
    batSide: {
      code: string;
      description: string;
    };
    pitcher: {
      id: number;
      fullName: string;
    };
    pitchHand: {
      code: string;
      description: string;
    };
  };
}

export const MatchupDisplay: React.FC<MatchupDisplayProps> = ({ matchup }) => {
  if (!matchup) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchup</Text>
      
      <View style={styles.playersContainer}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerLabel}>Pitcher</Text>
          <Text style={styles.playerName}>{matchup.pitcher.fullName}</Text>
          <Text style={styles.handedness}>({matchup.pitchHand.description})</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vs}>vs</Text>
        </View>
        
        <View style={styles.playerInfo}>
          <Text style={styles.playerLabel}>Batter</Text>
          <Text style={styles.playerName}>{matchup.batter.fullName}</Text>
          <Text style={styles.handedness}>({matchup.batSide.description})</Text>
        </View>
      </View>
    </View>
  );
};