import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { apiClient } from './src/api/client';
import { MLBGameData, PlayEvent } from './src/types/mlb';
import { GameHeader, EventHeader, NavigationControls, EventDetails, PitchDataSection, CoordinatesSection, BreaksSection, StrikeZoneSection, EventMetadata, MatchupDisplay } from './src/components';
import { Welcome } from './src/screens/Welcome';

function App(): React.JSX.Element {
  const [gameData, setGameData] = useState<MLBGameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [allEvents, setAllEvents] = useState<PlayEvent[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedGamePk, setSelectedGamePk] = useState<number | null>(null);
  const [playBoundaries, setPlayBoundaries] = useState<number[]>([]);
  const [gameTimestamp, setGameTimestamp] = useState<string | null>(null);
  const [originalTimestamp, setOriginalTimestamp] = useState<string | null>(null);

  const loadGameData = async (gamePk?: number) => {
    const gameId = gamePk || selectedGamePk || 777121;
    setLoading(true);
    try {
      const result = await apiClient.getMLBGameData(gameId);
      
      if (result.success && result.data) {
        setGameData(result.data);
        setGameTimestamp(result.data.metaData.timeStamp);
        setOriginalTimestamp(result.data.metaData.timeStamp); // Store original timestamp for diffPatch calls
        
        // Extract all play events from all plays, inheriting matchup from parent play
        const events: PlayEvent[] = [];
        const boundaries: number[] = [];
        
        result.data.liveData.plays.allPlays.forEach(play => {
          // Mark the start of this play
          boundaries.push(events.length);
          
          play.playEvents.forEach(event => {
            events.push({
              ...event,
              matchup: play.matchup, // Inherit matchup from parent play
              playResult: play.result // Inherit play result from parent play
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

  // JSON Patch application utility function
  const applyJsonPatch = (obj: any, operations: any[]): any => {
    const result = JSON.parse(JSON.stringify(obj)); // Deep clone
    
    operations.forEach(op => {
      const path = op.path.split('/').slice(1); // Remove leading empty string
      
      switch (op.op) {
        case 'replace':
        case 'add':
          setValueAtPath(result, path, op.value);
          break;
        case 'remove':
          removeValueAtPath(result, path);
          break;
        case 'copy':
          if (op.from) {
            const fromPath = op.from.split('/').slice(1);
            const value = getValueAtPath(result, fromPath);
            setValueAtPath(result, path, value);
          }
          break;
      }
    });
    
    return result;
  };

  const setValueAtPath = (obj: any, path: string[], value: any): void => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current)) {
        current[key] = isNaN(Number(path[i + 1])) ? {} : [];
      }
      current = current[key];
    }
    current[path[path.length - 1]] = value;
  };

  const removeValueAtPath = (obj: any, path: string[]): void => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
      if (!current) return;
    }
    if (Array.isArray(current)) {
      current.splice(parseInt(path[path.length - 1], 10), 1);
    } else {
      delete current[path[path.length - 1]];
    }
  };

  const getValueAtPath = (obj: any, path: string[]): any => {
    let current = obj;
    for (const key of path) {
      current = current?.[key];
      if (current === undefined) return undefined;
    }
    return current;
  };

  const processGameData = (data: any) => {
    // Extract all play events from all plays, inheriting matchup from parent play
    const events: PlayEvent[] = [];
    const boundaries: number[] = [];
    
    data.liveData.plays.allPlays.forEach((play: any) => {
      boundaries.push(events.length);
      play.playEvents.forEach((event: any) => {
        events.push({
          ...event,
          matchup: play.matchup,
          playResult: play.result
        });
      });
    });
    
    setPlayBoundaries(boundaries);
    setAllEvents(events);
    
    // Go to the last event
    if (events.length > 0) {
      setCurrentEventIndex(events.length - 1);
    }
    return events.length;
  };

  const goToLive = async (retryCount = 0): Promise<void> => {
    if (!gameData || !selectedGamePk || !originalTimestamp) {
      // Fallback to just going to last event if no timestamp
      if (allEvents.length > 0) {
        setCurrentEventIndex(allEvents.length - 1);
      }
      return;
    }

    // Check if game is finished - if so, don't try to update data
    if (gameData.gameData.status.codedGameState === 'F') {
      // Game is final, just go to last event without fetching updates
      if (allEvents.length > 0) {
        setCurrentEventIndex(allEvents.length - 1);
      }
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching diffPatch for game:', selectedGamePk, 'using original timestamp:', originalTimestamp, 'retry:', retryCount);
      const diffResult = await apiClient.getMLBGameDiffPatch(selectedGamePk, originalTimestamp);
      console.log('DiffPatch result success:', diffResult.success);
      
      if (diffResult.success && diffResult.data) {
        console.log('DiffPatch data type:', Array.isArray(diffResult.data) ? 'array' : typeof diffResult.data);
        
        // Case 1: Empty array - no updates available
        if (Array.isArray(diffResult.data) && diffResult.data.length === 0) {
          console.log('No updates available, retrying in 7 seconds...');
          if (retryCount < 3) { // Limit retries to prevent infinite loops
            setTimeout(() => {
              goToLive(retryCount + 1);
            }, 7000); // Wait 7 seconds
            return;
          } else {
            console.log('Max retries reached, going to last event');
            if (allEvents.length > 0) {
              setCurrentEventIndex(allEvents.length - 1);
            }
            return;
          }
        }
        
        // Case 2: Full game data update (response has gameData, liveData, etc.)
        if ((diffResult.data as any).gameData && (diffResult.data as any).liveData) {
          console.log('Received full game data update');
          const fullGameData = diffResult.data as MLBGameData;
          setGameData(fullGameData);
          setGameTimestamp(fullGameData.metaData?.timeStamp || gameTimestamp);
          
          const eventCount = processGameData(fullGameData);
          console.log('Successfully replaced game data with', eventCount, 'events');
          return;
        }
        
        // Case 3: Diff patch array response
        let diffOperations: any[] = [];
        
        if (Array.isArray(diffResult.data)) {
          // Extract diff operations from array response
          diffOperations = diffResult.data.reduce((acc: any[], item: any) => {
            if (item.diff && Array.isArray(item.diff)) {
              return [...acc, ...item.diff];
            }
            return acc;
          }, []);
          console.log('Extracted', diffOperations.length, 'operations from array response');
        } else if (diffResult.data.diff && Array.isArray(diffResult.data.diff)) {
          // Standard diff response format
          diffOperations = diffResult.data.diff;
          console.log('Using standard diff format with', diffOperations.length, 'operations');
        }
        
        if (diffOperations.length > 0) {
          console.log('Applying diff patch with', diffOperations.length, 'operations');
          try {
            // Apply diff patch to current game data
            const updatedGameData = applyJsonPatch(gameData, diffOperations);
            setGameData(updatedGameData);
            
            // Extract the new timestamp from the updated game data
            const updatedTimestamp = updatedGameData.metaData?.timeStamp || gameTimestamp;
            console.log('New timestamp after patch:', updatedTimestamp);
            setGameTimestamp(updatedTimestamp);
            
            const eventCount = processGameData(updatedGameData);
            console.log('Successfully applied diff patch with', eventCount, 'events');
          } catch (patchError) {
            console.error('Error applying patch:', patchError);
            throw new Error(`Failed to apply game updates: ${patchError instanceof Error ? patchError.message : 'Unknown patch error'}`);
          }
        } else {
          console.log('No valid diff data found, going to last event');
          if (allEvents.length > 0) {
            setCurrentEventIndex(allEvents.length - 1);
          }
        }
      } else {
        console.error('DiffPatch API call failed:', diffResult.message);
        Alert.alert('Error', `Failed to fetch live updates: ${diffResult.message || 'Unknown error'}`);
        // Fallback to just going to last event
        if (allEvents.length > 0) {
          setCurrentEventIndex(allEvents.length - 1);
        }
      }
    } catch (error) {
      console.error('Error in goToLive:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to update live data: ${errorMessage}`);
      // Fallback to just going to last event
      if (allEvents.length > 0) {
        setCurrentEventIndex(allEvents.length - 1);
      }
    } finally {
      setLoading(false);
    }
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
        {!selectedGamePk && (
          <GameHeader onLoadGame={loadGameData} loading={loading} />
        )}
        
        {allEvents.length > 0 && currentEvent && (
          <>
            <MatchupDisplay 
              matchup={currentEvent.matchup}
              playResult={currentEvent.playResult}
              showBackButton={!!selectedGamePk}
              onBackPress={() => setShowWelcome(true)}
              onGoToLive={goToLive}
            />

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
});

export default App;