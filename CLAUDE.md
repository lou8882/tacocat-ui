
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TacoCat UI is a React Native application that displays MLB game data and pitch-by-pitch analysis. The app connects to MLB's official StatsAPI to fetch live game data and presents detailed pitch tracking information including velocity, spin rate, break data, and coordinates.

## Technology Stack

- **React Native 0.80.1** with TypeScript for cross-platform mobile development
- **React 19.1.0** for UI components and state management
- **TypeScript 5.8.3** for type safety
- **Jest** for testing with React Native preset
- **ESLint** with React Native configuration for code quality
- **Prettier 2.8.8** for code formatting
- **Metro** bundler for React Native
- **Babel** with React Native preset for code transformation

## Development Commands

### Basic Commands
- `npm start` - Start Metro bundler
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS (requires CocoaPods setup)
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### iOS Setup Requirements
For iOS development, install dependencies first:
```bash
bundle install          # Install Ruby dependencies
bundle exec pod install # Install CocoaPods dependencies
```

### Platform-Specific Commands
- **Android**: `npm run android` 
- **iOS**: `npm run ios` (requires Xcode and iOS Simulator)

## Code Architecture

### Project Structure
```
src/
├── api/
│   └── client.ts          # MLB API client with error handling
├── screens/
│   └── game.tsx           # Main game data visualization screen
├── types/
│   └── mlb.ts            # TypeScript interfaces for MLB API data
└── utils/
    └── tooltips.ts       # Pitch data tooltips and educational content
```

### Key Components

**API Layer** (`src/api/client.ts`):
- Single API client for MLB StatsAPI integration
- Standardized error handling with `ApiResponse<T>` interface
- Uses MLB official API endpoint: `https://statsapi.mlb.com`

**Data Types** (`src/types/mlb.ts`):
- Complete TypeScript definitions for MLB game data
- `MLBGameData` interface for top-level game structure
- `PlayEvent` interface for individual pitch/play events
- `EventDetails` interface for comprehensive event metadata

**Screen Components**:
- `App.tsx` - Main application entry point with game event viewer
- `src/screens/game.tsx` - Detailed game screen (duplicate of App.tsx functionality)
- Both screens provide event-by-event navigation through game data

**Utilities** (`src/utils/tooltips.ts`):
- Comprehensive tooltip system for baseball terminology
- Educational content for pitch tracking data (velocity, spin rate, coordinates)
- Modal-based tooltip components with detailed explanations

### State Management
- Uses React hooks (`useState`) for local component state
- No external state management library (Redux, Zustand, etc.)
- Main state includes: game data, loading status, current event index, all events array

### Data Flow
1. User loads game data via API call to MLB StatsAPI
2. Raw game data is processed to extract individual play events
3. Events are navigated sequentially with Previous/Next controls
4. Detailed pitch data is displayed when available (velocity, coordinates, break data)

## Code Conventions

### TypeScript
- Always use TypeScript for all new code
- Strict TypeScript configuration enabled
- All components use React.JSX.Element return type
- Interface definitions in dedicated `types/` directory
- Optional chaining used extensively for pitch data safety

### Component Architecture
- Prefer atomic design principles using atoms/molecules/organisms when building components
- Follow existing component structure in `src/` directory
- Ask questions when facing uncertainty or ambiguity about implementation
- Ask about preferred code structure and directory placement for new code

### Styling
- StyleSheet.create() for all component styles
- Consistent color scheme: blue (#007AFF) for primary, gray variants for text
- Responsive design using Dimensions.get('window')
- Shadow/elevation for card-like containers

### API Integration
- All API calls wrapped in try-catch blocks
- Loading states for user feedback
- Error handling with Alert.alert() for user notification
- Type-safe API responses with generic ApiResponse interface

## Testing

- Jest configuration with React Native preset
- Test files in `__tests__/` directory
- Current test: `App.test.tsx` for basic app rendering

## Platform Differences

### iOS
- Requires CocoaPods dependency management
- Uses Podfile for native dependency configuration
- Xcode project structure in `ios/` directory

### Android
- Gradle-based build system
- Android-specific configuration in `android/` directory
- Support for Android SDK and emulator

## Notable Features

### MLB Data Integration
- Real game data from MLB's official StatsAPI
- Comprehensive pitch tracking data including:
  - Velocity (start/end speed)
  - Coordinates (3D position and movement)
  - Break data (spin rate, direction, movement)
  - Strike zone information

### Educational Content
- Extensive tooltip system explaining baseball terminology
- Detailed explanations for pitch tracking metrics
- User-friendly presentation of complex baseball analytics

### Navigation
- Event-by-event navigation through entire games
- Visual indicators for current position in game
- Time-based event organization