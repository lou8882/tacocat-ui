import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Tooltip definitions for all pitch data values
export const PITCH_DATA_TOOLTIPS = {
  // Basic pitch data
  startSpeed: {
    title: 'Start Speed',
    definition: 'The velocity of the pitch as it leaves the pitcher\'s hand, measured in miles per hour (mph).'
  },
  endSpeed: {
    title: 'End Speed',
    definition: 'The velocity of the pitch as it crosses home plate, measured in miles per hour (mph). Always lower than start speed due to air resistance.'
  },
  extension: {
    title: 'Extension',
    definition: 'The distance in feet that the pitcher releases the ball in front of the pitching rubber, effectively shortening the distance to home plate.'
  },
  plateTime: {
    title: 'Plate Time',
    definition: 'The time in seconds it takes for the pitch to travel from the pitcher\'s hand to home plate.'
  },
  zone: {
    title: 'Zone',
    definition: 'The numbered zone where the pitch crossed the plate. Zones 1-9 are strikes, zones 11-14 are specific ball locations.'
  },
  
  // Coordinates
  pX: {
    title: 'pX (Horizontal Location)',
    definition: 'The horizontal location of the pitch as it crosses home plate, measured in feet from the center of the plate. Negative values are toward the left-handed batter\'s box.'
  },
  pZ: {
    title: 'pZ (Vertical Location)',
    definition: 'The vertical location of the pitch as it crosses home plate, measured in feet above the ground.'
  },
  x: {
    title: 'x (Pixel X)',
    definition: 'The horizontal pixel coordinate of the pitch location on the tracking system\'s camera view.'
  },
  y: {
    title: 'y (Pixel Y)',
    definition: 'The vertical pixel coordinate of the pitch location on the tracking system\'s camera view.'
  },
  vX0: {
    title: 'vX0 (Initial X Velocity)',
    definition: 'The initial horizontal velocity component of the pitch at release, measured in feet per second.'
  },
  vY0: {
    title: 'vY0 (Initial Y Velocity)',
    definition: 'The initial velocity component toward home plate at release, measured in feet per second.'
  },
  vZ0: {
    title: 'vZ0 (Initial Z Velocity)',
    definition: 'The initial vertical velocity component of the pitch at release, measured in feet per second.'
  },
  aX: {
    title: 'aX (Horizontal Acceleration)',
    definition: 'The horizontal acceleration of the pitch due to spin and air resistance, measured in feet per second squared.'
  },
  aY: {
    title: 'aY (Forward Acceleration)',
    definition: 'The acceleration toward home plate due to air resistance, measured in feet per second squared. Always negative.'
  },
  aZ: {
    title: 'aZ (Vertical Acceleration)',
    definition: 'The vertical acceleration of the pitch due to gravity and spin, measured in feet per second squared.'
  },
  pfxX: {
    title: 'pfxX (Horizontal Break)',
    definition: 'The horizontal movement of the pitch due to spin, measured in inches. Positive values break toward the first base side.'
  },
  pfxZ: {
    title: 'pfxZ (Vertical Break)',
    definition: 'The vertical movement of the pitch due to spin, measured in inches. Positive values have more "rise" than expected from gravity alone.'
  },
  x0: {
    title: 'x0 (Initial X Position)',
    definition: 'The horizontal position of the pitch at release point, measured in feet from the center of the pitching rubber.'
  },
  y0: {
    title: 'y0 (Initial Y Position)',
    definition: 'The distance from home plate where the pitch was released, measured in feet. Typically around 55 feet.'
  },
  z0: {
    title: 'z0 (Initial Z Position)',
    definition: 'The height above the ground where the pitch was released, measured in feet.'
  },
  
  // Break data
  breakAngle: {
    title: 'Break Angle',
    definition: 'The angle of the pitch\'s break relative to a straight line, measured in degrees.'
  },
  breakLength: {
    title: 'Break Length',
    definition: 'The distance in inches that the pitch deviates from a straight line due to spin and air resistance.'
  },
  breakY: {
    title: 'Break Y',
    definition: 'The distance in inches that the pitch breaks horizontally from a straight line path.'
  },
  breakVertical: {
    title: 'Break Vertical',
    definition: 'The vertical component of the pitch\'s break, measured in inches.'
  },
  breakHorizontal: {
    title: 'Break Horizontal',
    definition: 'The horizontal component of the pitch\'s break, measured in inches.'
  },
  spinRate: {
    title: 'Spin Rate',
    definition: 'The rate of spin on the baseball, measured in revolutions per minute (RPM). Higher spin rates typically create more movement.'
  },
  spinDirection: {
    title: 'Spin Direction',
    definition: 'The direction of the spin axis, measured in degrees. Affects the direction and magnitude of the pitch\'s movement.'
  },
  
  // Strike zone
  strikeZoneTop: {
    title: 'Strike Zone Top',
    definition: 'The top boundary of the strike zone for this specific batter, measured in feet above the ground.'
  },
  strikeZoneBottom: {
    title: 'Strike Zone Bottom',
    definition: 'The bottom boundary of the strike zone for this specific batter, measured in feet above the ground.'
  },
  typeConfidence: {
    title: 'Type Confidence',
    definition: 'The system\'s confidence level in the pitch type classification, expressed as a percentage.'
  }
};

export interface TooltipProps {
  visible: boolean;
  title: string;
  definition: string;
  onClose: () => void;
}

export const TooltipModal: React.FC<TooltipProps> = ({ visible, title, definition, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipTitle}>{title}</Text>
          <Text style={styles.tooltipDefinition}>{definition}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export interface TooltipTriggerProps {
  children: React.ReactNode;
  tooltipKey: keyof typeof PITCH_DATA_TOOLTIPS;
  onPress: (tooltipKey: keyof typeof PITCH_DATA_TOOLTIPS) => void;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, tooltipKey, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tooltipTrigger}
      onPress={() => onPress(tooltipKey)}
      activeOpacity={0.7}
    >
      {children}
      <Text style={styles.infoIcon}>ℹ️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxWidth: screenWidth - 40,
    maxHeight: screenHeight * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tooltipDefinition: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tooltipTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoIcon: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default {
  PITCH_DATA_TOOLTIPS,
  TooltipModal,
  TooltipTrigger,
};