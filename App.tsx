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
import { GameHeader, EventContainer } from './src/components';

function App(): React.JSX.Element {
  const [_gameData, setGameData] = useState<MLBGameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [allEvents, setAllEvents] = useState<PlayEvent[]>([]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const result = await apiClient.getMLBGameData(777121);
      
      if (result.success && result.data) {
        setGameData(result.data);
        
        // Extract all play events from all plays
        const events: PlayEvent[] = [];
        result.data.liveData.plays.allPlays.forEach(play => {
          events.push(...play.playEvents);
        });
        
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

  const currentEvent = allEvents[currentEventIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.content}>
          <GameHeader onLoadGame={loadGameData} loading={loading} />
          
          {allEvents.length > 0 && currentEvent && (
            <EventContainer
              event={currentEvent}
              currentIndex={currentEventIndex}
              totalEvents={allEvents.length}
              onPrevious={goToPreviousEvent}
              onNext={goToNextEvent}
              canGoPrevious={currentEventIndex > 0}
              canGoNext={currentEventIndex < allEvents.length - 1}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});

export default App;