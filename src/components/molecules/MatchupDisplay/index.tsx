import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  playResult?: {
    type: string;
    event: string;
    eventType: string;
    description: string;
    rbi?: number;
    awayScore: number;
    homeScore: number;
  };
  showBackButton?: boolean;
  onBackPress?: () => void;
  onGoToLive?: () => void;
}

export const MatchupDisplay: React.FC<MatchupDisplayProps> = ({ matchup, playResult, showBackButton, onBackPress, onGoToLive }) => {
  if (!matchup) {
    return null;
  }

  return (
    <View style={styles.container}>
      {(showBackButton || onGoToLive) && (
        <View style={styles.buttonContainer}>
          {showBackButton && onBackPress && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBackPress}
            >
              <Text style={styles.backButtonText}>← Back to Welcome</Text>
            </TouchableOpacity>
          )}
          
          {onGoToLive && (
            <TouchableOpacity 
              style={styles.goToLiveButton} 
              onPress={onGoToLive}
            >
              <Text style={styles.goToLiveButtonText}>Go to Live →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
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
      
      {playResult && (
        <View style={styles.playResultContainer}>
          <Text style={styles.playResultLabel}>Play Result:</Text>
          <Text style={styles.playResultEvent}>{playResult.event}</Text>
        </View>
      )}
    </View>
  );
};