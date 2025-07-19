import React from 'react';
import { View } from 'react-native';
import { EventHeader, NavigationControls } from '../../molecules';
import { EventDetails, PitchDataSection, CoordinatesSection, BreaksSection, StrikeZoneSection, EventMetadata } from '../';
import { PlayEvent } from '../../../types/mlb';
import { styles } from './styles';

export interface EventContainerProps {
  event: PlayEvent;
  currentIndex: number;
  totalEvents: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const EventContainer: React.FC<EventContainerProps> = ({
  event,
  currentIndex,
  totalEvents,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <View style={styles.container}>
      <EventHeader 
        currentIndex={currentIndex} 
        totalEvents={totalEvents} 
        timeString={event.startTime} 
      />

      <EventDetails
        description={event.details.description}
        event={event.details.event}
        call={event.details.call}
        type={event.details.type}
        count={event.count}
        awayScore={event.details.awayScore}
        homeScore={event.details.homeScore}
      />

      {event.pitchData && (
        <>
          <PitchDataSection pitchData={event.pitchData} />
          
          {event.pitchData.coordinates && (
            <CoordinatesSection coordinates={event.pitchData.coordinates} />
          )}

          {event.pitchData.breaks && (
            <BreaksSection breaks={event.pitchData.breaks} />
          )}

          <StrikeZoneSection
            strikeZoneTop={event.pitchData.strikeZoneTop}
            strikeZoneBottom={event.pitchData.strikeZoneBottom}
            typeConfidence={event.pitchData.typeConfidence}
          />
        </>
      )}

      <EventMetadata
        type={event.type}
        index={event.index}
        isPitch={event.isPitch}
        pitchNumber={event.pitchNumber}
      />

      <NavigationControls
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </View>
  );
};