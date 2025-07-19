import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { apiClient } from './src/api/client';
import { MLBGameData, PlayEvent } from './src/types/mlb';
import { GameHeader, EventHeader, NavigationControls, EventDetails, PitchDataSection, CoordinatesSection, BreaksSection, StrikeZoneSection, EventMetadata, MatchupDisplay } from './src/components';
import { Welcome } from './src/screens/Welcome';

function App(): React.JSX.Element {
  const [_gameData, setGameData] = useState<MLBGameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [allEvents, setAllEvents] = useState<PlayEvent[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedGamePk, setSelectedGamePk] = useState<number | null>(null);
  const [playBoundaries, setPlayBoundaries] = useState<number[]>([]);

  const loadGameData = async (gamePk?: number) => {
    const gameId = gamePk || selectedGamePk || 777121;
    setLoading(true);
    try {
      const result = await apiClient.getMLBGameData(gameId);
      
      if (result.success && result.data) {
        setGameData(result.data);
        
        // Extract all play events from all plays, inheriting matchup from parent play
        const events: PlayEvent[] = [];
        const boundaries: number[] = [];
        
        result.data.liveData.plays.allPlays.forEach(play => {
          // Mark the start of this play
          boundaries.push(events.length);
          
          play.playEvents.forEach(event => {
            events.push({
              ...event,
              matchup: play.matchup // Inherit matchup from parent play
            });
          });
        });
        
        setPlayBoundaries(boundaries);
        
        setAllEvents(events);
        setCurrentEventIndex(0);
      } else {
        Alert.alert('Error', result.message || 'Failed to load game data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch game data');
    } finally {
      setLoading(false);
    }
  };

  const goToNextEvent = () => {
    if (currentEventIndex < allEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const goToPreviousEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  const goToPreviousPlay = () => {
    const currentPlayIndex = playBoundaries.findIndex((boundary, index) => {
      const nextBoundary = playBoundaries[index + 1] || allEvents.length;
      return currentEventIndex >= boundary && currentEventIndex < nextBoundary;
    });
    
    if (currentPlayIndex > 0) {
      setCurrentEventIndex(playBoundaries[currentPlayIndex - 1]);
    }
  };

  const goToNextPlay = () => {
    const currentPlayIndex = playBoundaries.findIndex((boundary, index) => {
      const nextBoundary = playBoundaries[index + 1] || allEvents.length;
      return currentEventIndex >= boundary && currentEventIndex < nextBoundary;
    });
    
    if (currentPlayIndex >= 0 && currentPlayIndex < playBoundaries.length - 1) {
      setCurrentEventIndex(playBoundaries[currentPlayIndex + 1]);
    }
  };

  const handleGameSelected = (gamePk: number) => {
    setSelectedGamePk(gamePk);
    setShowWelcome(false);
    loadGameData(gamePk);
  };

  const currentEvent = allEvents[currentEventIndex];

  // Determine current play index for navigation
  const currentPlayIndex = playBoundaries.findIndex((boundary, index) => {
    const nextBoundary = playBoundaries[index + 1] || allEvents.length;
    return currentEventIndex >= boundary && currentEventIndex < nextBoundary;
  });

  const canGoPreviousPlay = currentPlayIndex > 0;
  const canGoNextPlay = currentPlayIndex >= 0 && currentPlayIndex < playBoundaries.length - 1;

  if (showWelcome) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Welcome onGameSelected={handleGameSelected} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {selectedGamePk ? (
          <View style={styles.gameInfo}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setShowWelcome(true)}
            >
              <Text style={styles.backButtonText}>← Back to Welcome</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <GameHeader onLoadGame={loadGameData} loading={loading} />
        )}
        
        {allEvents.length > 0 && currentEvent && (
          <>
            <MatchupDisplay matchup={currentEvent.matchup} />

            <EventHeader 
              currentIndex={currentEventIndex} 
              totalEvents={allEvents.length} 
              timeString={currentEvent.startTime || 'N/A'} 
            />

            <ScrollView style={styles.pitchDataScrollView} contentContainerStyle={styles.pitchDataContent}>
              <EventDetails
                description={currentEvent.details.description}
                event={currentEvent.details.event}
                call={currentEvent.details.call}
                type={currentEvent.details.type}
                count={currentEvent.count}
                awayScore={currentEvent.details.awayScore}
                homeScore={currentEvent.details.homeScore}
              />

              {currentEvent.pitchData && (
                <>
                  <PitchDataSection pitchData={currentEvent.pitchData} />
                  
                  {currentEvent.pitchData.coordinates && (
                    <CoordinatesSection coordinates={currentEvent.pitchData.coordinates} />
                  )}

                  {currentEvent.pitchData.breaks && (
                    <BreaksSection breaks={currentEvent.pitchData.breaks} />
                  )}

                  <StrikeZoneSection
                    strikeZoneTop={currentEvent.pitchData.strikeZoneTop}
                    strikeZoneBottom={currentEvent.pitchData.strikeZoneBottom}
                    typeConfidence={currentEvent.pitchData.typeConfidence}
                  />
                </>
              )}

              <EventMetadata
                type={currentEvent.type}
                index={currentEvent.index}
                isPitch={currentEvent.isPitch}
                pitchNumber={currentEvent.pitchNumber}
              />
            </ScrollView>

            <NavigationControls
              onPrevious={goToPreviousEvent}
              onNext={goToNextEvent}
              onPreviousPlay={goToPreviousPlay}
              onNextPlay={goToNextPlay}
              canGoPrevious={currentEventIndex > 0}
              canGoNext={currentEventIndex < allEvents.length - 1}
              canGoPreviousPlay={canGoPreviousPlay}
              canGoNextPlay={canGoNextPlay}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pitchDataScrollView: {
    flex: 1,
    marginVertical: 10,
  },
  pitchDataContent: {
    paddingBottom: 20,
  },
  gameInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gameInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default App;