import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { apiClient } from './src/api/client';
import { MLBGameData, PlayEvent } from './src/types/mlb';

function App(): React.JSX.Element {
  const [gameData, setGameData] = useState<MLBGameData | null>(null);
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

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString();
  };

  const currentEvent = allEvents[currentEventIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>MLB Game Event Viewer</Text>
          
          <TouchableOpacity 
            style={styles.loadButton} 
            onPress={loadGameData}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Load Game Data'}
            </Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}

          {allEvents.length > 0 && (
            <View style={styles.eventContainer}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventCounter}>
                  Event {currentEventIndex + 1} of {allEvents.length}
                </Text>
                <Text style={styles.eventTime}>
                  {formatTime(currentEvent.startTime)}
                </Text>
              </View>

              <View style={styles.eventDetails}>
                <Text style={styles.eventDescription}>
                  {currentEvent.details.description}
                </Text>
                
                {currentEvent.details.event && (
                  <Text style={styles.eventType}>
                    Event: {currentEvent.details.event}
                  </Text>
                )}

                {currentEvent.details.call && (
                  <Text style={styles.callDescription}>
                    Call: {currentEvent.details.call.description} ({currentEvent.details.call.code})
                  </Text>
                )}

                {currentEvent.details.type && (
                  <Text style={styles.pitchType}>
                    Pitch Type: {currentEvent.details.type.description}
                  </Text>
                )}

                <View style={styles.countContainer}>
                  <Text style={styles.countText}>
                    Count: {currentEvent.count.balls}-{currentEvent.count.strikes}
                  </Text>
                  <Text style={styles.countText}>
                    Outs: {currentEvent.count.outs}
                  </Text>
                </View>

                {currentEvent.details.awayScore !== undefined && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                      Away: {currentEvent.details.awayScore} | Home: {currentEvent.details.homeScore}
                    </Text>
                  </View>
                )}

                {currentEvent.pitchData && (
                  <View style={styles.pitchDataContainer}>
                    <Text style={styles.sectionTitle}>Pitch Data</Text>
                    
                    <View style={styles.pitchSpeedContainer}>
                      <Text style={styles.pitchSpeedText}>
                        {currentEvent.pitchData.startSpeed?.toFixed(1)} mph
                      </Text>
                      <Text style={styles.pitchSpeedLabel}>Start Speed</Text>
                    </View>

                    <View style={styles.dataGrid}>
                      <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>End Speed:</Text>
                        <Text style={styles.dataValue}>{currentEvent.pitchData.endSpeed?.toFixed(1)} mph</Text>
                      </View>
                      <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Extension:</Text>
                        <Text style={styles.dataValue}>{currentEvent.pitchData.extension?.toFixed(1)} ft</Text>
                      </View>
                      <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Plate Time:</Text>
                        <Text style={styles.dataValue}>{currentEvent.pitchData.plateTime?.toFixed(3)} s</Text>
                      </View>
                      <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Zone:</Text>
                        <Text style={styles.dataValue}>{currentEvent.pitchData.zone}</Text>
                      </View>
                    </View>

                    {currentEvent.pitchData.coordinates && (
                      <View style={styles.coordinatesContainer}>
                        <Text style={styles.subSectionTitle}>Coordinates</Text>
                        <View style={styles.dataGrid}>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>pX:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.pX?.toFixed(3)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>pZ:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.pZ?.toFixed(3)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>x:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.x?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>y:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.y?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>vX0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.vX0?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>vY0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.vY0?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>vZ0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.vZ0?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>aX:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.aX?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>aY:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.aY?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>aZ:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.aZ?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>pfxX:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.pfxX?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>pfxZ:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.pfxZ?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>x0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.x0?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>y0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.y0?.toFixed(2)}</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>z0:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.coordinates.z0?.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {currentEvent.pitchData.breaks && (
                      <View style={styles.breaksContainer}>
                        <Text style={styles.subSectionTitle}>Break Data</Text>
                        <View style={styles.dataGrid}>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Break Angle:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.breakAngle}°</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Break Length:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.breakLength}" </Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Break Y:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.breakY}" </Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Break Vertical:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.breakVertical}" </Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Break Horizontal:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.breakHorizontal}" </Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Spin Rate:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.spinRate} rpm</Text>
                          </View>
                          <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Spin Direction:</Text>
                            <Text style={styles.dataValue}>{currentEvent.pitchData.breaks.spinDirection}°</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    <View style={styles.strikeZoneContainer}>
                      <Text style={styles.subSectionTitle}>Strike Zone</Text>
                      <View style={styles.dataGrid}>
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Top:</Text>
                          <Text style={styles.dataValue}>{currentEvent.pitchData.strikeZoneTop?.toFixed(2)} ft</Text>
                        </View>
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Bottom:</Text>
                          <Text style={styles.dataValue}>{currentEvent.pitchData.strikeZoneBottom?.toFixed(2)} ft</Text>
                        </View>
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Confidence:</Text>
                          <Text style={styles.dataValue}>{(currentEvent.pitchData.typeConfidence * 100).toFixed(1)}%</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.eventMeta}>
                  <Text style={styles.metaText}>
                    Type: {currentEvent.type} | Index: {currentEvent.index}
                  </Text>
                  {currentEvent.isPitch && (
                    <Text style={styles.metaText}>
                      Pitch #{currentEvent.pitchNumber}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.navigationContainer}>
                <TouchableOpacity 
                  style={[styles.navButton, currentEventIndex === 0 && styles.navButtonDisabled]}
                  onPress={goToPreviousEvent}
                  disabled={currentEventIndex === 0}
                >
                  <Text style={[styles.navButtonText, currentEventIndex === 0 && styles.navButtonTextDisabled]}>
                    ← Previous
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.navButton, currentEventIndex === allEvents.length - 1 && styles.navButtonDisabled]}
                  onPress={goToNextEvent}
                  disabled={currentEventIndex === allEvents.length - 1}
                >
                  <Text style={[styles.navButtonText, currentEventIndex === allEvents.length - 1 && styles.navButtonTextDisabled]}>
                    Next →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  eventContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventDetails: {
    marginBottom: 20,
  },
  eventDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  eventType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  callDescription: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  pitchType: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 10,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
  pitchDataContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    marginTop: 15,
  },
  pitchSpeedContainer: {
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  pitchSpeedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  pitchSpeedLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  dataGrid: {
    gap: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  coordinatesContainer: {
    marginTop: 10,
  },
  breaksContainer: {
    marginTop: 10,
  },
  eventMeta: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
});

export default App;