import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { apiClient } from '../api/client';
import { ScheduleGame, MLBTeam } from '../types/mlb';
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

const findMostRecentGame = (games: ScheduleGame[], teamId: number): ScheduleGame | null => {
  const teamGames = games.filter(game => 
    (game.teams.home.team.id === teamId || game.teams.away.team.id === teamId) && 
    (game.status.abstractGameState === 'Final' || game.status.abstractGameState === 'Live')
  );
  
  if (teamGames.length === 0) return null;
  
  return teamGames.reduce((mostRecent, current) => {
    return new Date(current.gameDate) > new Date(mostRecent.gameDate) ? current : mostRecent;
  });
};

export const Welcome: React.FC<WelcomeProps> = ({ onGameSelected }) => {
  const [loading, setLoading] = useState(false);
  const [recentGame, setRecentGame] = useState<ScheduleGame | null>(null);
  const [teams, setTeams] = useState<MLBTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(136); // Seattle Mariners default
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const result = await apiClient.getMLBTeams();
      
      if (result.success && result.data) {
        // Filter for MLB teams only (sport.id === 1) and sort by name
        const mlbTeams = result.data.teams
          .filter(team => team.sport.id === 1)
          .sort((a, b) => a.name.localeCompare(b.name));
        setTeams(mlbTeams);
      } else {
        Alert.alert('Error', result.message || 'Failed to load teams data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch teams data');
    } finally {
      setLoadingTeams(false);
    }
  };

  const loadRecentGame = async (teamId: number = selectedTeamId) => {
    setLoading(true);
    try {
      const { startDate, endDate } = getPastThreeDays();
      const result = await apiClient.getMLBSchedule(startDate, endDate);
      
      if (result.success && result.data) {
        const allGames: ScheduleGame[] = [];
        result.data.dates.forEach(date => {
          allGames.push(...date.games);
        });
        
        const mostRecentGame = findMostRecentGame(allGames, teamId);
        
        if (mostRecentGame) {
          setRecentGame(mostRecentGame);
        } else {
          const selectedTeam = teams.find(team => team.id === teamId);
          const teamName = selectedTeam ? selectedTeam.name : `Team ID: ${teamId}`;
          Alert.alert('No Games Found', `No recent games found for ${teamName} in the past 3 days.`);
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

  const handleTeamChange = (teamId: number) => {
    setSelectedTeamId(teamId);
    setShowDropdown(false);
    setRecentGame(null); // Clear current game
    loadRecentGame(teamId);
  };

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      loadRecentGame();
    }
  }, [teams, selectedTeamId]); // eslint-disable-line react-hooks/exhaustive-deps

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
      
      {loadingTeams ? (
        <View style={styles.teamDropdownContainer}>
          <Text style={styles.dropdownLabel}>Loading teams...</Text>
        </View>
      ) : (
        <View style={styles.teamDropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Team:</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedTeam ? selectedTeam.name : 'Select a team...'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          
          <Modal
            visible={showDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDropdown(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDropdown(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Team</Text>
                  <TouchableOpacity 
                    onPress={() => setShowDropdown(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={teams}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.teamOption,
                        item.id === selectedTeamId && styles.selectedTeamOption
                      ]}
                      onPress={() => handleTeamChange(item.id)}
                    >
                      <Text style={[
                        styles.teamOptionText,
                        item.id === selectedTeamId && styles.selectedTeamOptionText
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.teamList}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      )}
      
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
          <Text style={styles.noGameText}>No recent games found for the selected team in the past 3 days.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadRecentGame()}>
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
  teamDropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  teamList: {
    maxHeight: 400,
  },
  teamOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedTeamOption: {
    backgroundColor: '#007AFF',
  },
  teamOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTeamOptionText: {
    color: 'white',
    fontWeight: '600',
  },
});