import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { apiClient } from '../api/client';
import { ScheduleGame } from '../types/mlb';
import { LoadingIndicator } from '../components';

interface WelcomeProps {
  onGameSelected: (gamePk: number) => void;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getPastThreeDays = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  
  return {
    startDate: formatDate(threeDaysAgo),
    endDate: formatDate(today),
  };
};

const findMostRecentHomeGame = (games: ScheduleGame[], homeTeamId: number): ScheduleGame | null => {
  const homeGames = games.filter(game => 
    game.teams.home.team.id === homeTeamId && 
    (game.status.abstractGameState === 'Final' || game.status.abstractGameState === 'Live')
  );
  
  if (homeGames.length === 0) return null;
  
  return homeGames.reduce((mostRecent, current) => {
    return new Date(current.gameDate) > new Date(mostRecent.gameDate) ? current : mostRecent;
  });
};

export const Welcome: React.FC<WelcomeProps> = ({ onGameSelected }) => {
  const [loading, setLoading] = useState(false);
  const [recentGame, setRecentGame] = useState<ScheduleGame | null>(null);

  const loadRecentGame = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getPastThreeDays();
      const result = await apiClient.getMLBSchedule(startDate, endDate);
      
      if (result.success && result.data) {
        const allGames: ScheduleGame[] = [];
        result.data.dates.forEach(date => {
          allGames.push(...date.games);
        });
        
        const mostRecentGame = findMostRecentHomeGame(allGames, 136);
        
        if (mostRecentGame) {
          setRecentGame(mostRecentGame);
        } else {
          Alert.alert('No Games Found', 'No recent games found for the home team (ID: 136) in the past 3 days.');
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to load schedule data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch schedule data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentGame();
  }, []);

  const handleContinueToGame = () => {
    if (recentGame) {
      onGameSelected(recentGame.gamePk);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
        <Text style={styles.loadingText}>Loading recent games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TacoCat UI</Text>
      
      
      {recentGame ? (
        <View style={styles.gameCard}>
          <Text style={styles.gameTitle}>Most Recent Game</Text>
          <View style={styles.teamsContainer}>
            <Text style={styles.teamName}>{recentGame.teams.away.team.name}</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.teamName}>{recentGame.teams.home.team.name}</Text>
          </View>
          
          {recentGame.teams.away.score !== undefined && recentGame.teams.home.score !== undefined && (
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {recentGame.teams.away.score} - {recentGame.teams.home.score}
              </Text>
            </View>
          )}
          
          <Text style={styles.gameDate}>
            {new Date(recentGame.gameDate).toLocaleDateString()} at {new Date(recentGame.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.venue}>{recentGame.venue.name}</Text>
          <Text style={styles.gameId}>Game ID: {recentGame.gamePk}</Text>
          
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueToGame}>
            <Text style={styles.continueButtonText}>Continue to Game Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noGameCard}>
          <Text style={styles.noGameText}>No recent games found for the home team in the past 3 days.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRecentGame}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#007AFF',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  gameDate: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  venue: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameId: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noGameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  noGameText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});