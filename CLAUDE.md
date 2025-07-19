
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
│   └── client.ts          # MLB API client with schedule and game data methods
├── components/
│   ├── atoms/             # Basic UI building blocks
│   │   ├── DataLabel/     # Styled labels for data fields
│   │   ├── DataValue/     # Styled values for data fields
│   │   ├── EventCounter/  # Event navigation counter display
│   │   ├── EventTime/     # Time display for events
│   │   ├── LoadButton/    # Game loading button
│   │   ├── NavButton/     # Navigation button component
│   │   ├── SectionTitle/  # Section heading component
│   │   └── SubSectionTitle/ # Subsection heading component
│   ├── molecules/         # Composite UI components
│   │   ├── CountDisplay/  # Ball/strike/out count display
│   │   ├── DataRow/       # Data label/value row layout
│   │   ├── EventHeader/   # Event information header
│   │   ├── LoadingIndicator/ # Loading state indicator
│   │   ├── MatchupDisplay/ # Pitcher/batter matchup info
│   │   ├── NavigationControls/ # Event/play navigation controls
│   │   ├── PitchSpeedDisplay/ # Pitch velocity display
│   │   └── ScoreDisplay/  # Game score display
│   └── organisms/         # Complex feature components
│       ├── BreaksSection/ # Pitch break data visualization
│       ├── CoordinatesSection/ # Pitch coordinate data
│       ├── EventContainer/ # Main event display container
│       ├── EventDetails/  # Event description and metadata
│       ├── EventMetadata/ # Technical event information
│       ├── GameHeader/    # Game loading interface
│       ├── PitchDataSection/ # Primary pitch data display
│       └── StrikeZoneSection/ # Strike zone information
├── screens/
│   ├── Welcome.tsx        # Welcome screen with recent game selection
│   └── game.tsx           # Alternative game display screen (legacy)
├── types/
│   └── mlb.ts            # Complete TypeScript interfaces for MLB API
└── utils/
    └── tooltips.tsx      # Educational tooltips for baseball terminology
```

### Key Components

**API Layer** (`src/api/client.ts`):
- `getMLBGameData()` - Fetches live game feed data
- `getMLBSchedule()` - Fetches game schedule for date ranges
- Standardized error handling with `ApiResponse<T>` interface
- Uses MLB official API endpoint: `https://statsapi.mlb.com`

**Data Types** (`src/types/mlb.ts`):
- `MLBGameData` - Complete game data structure
- `MLBScheduleResponse` - Schedule API response structure
- `PlayEvent` - Individual pitch/play event with inherited matchup data
- `EventDetails` - Event metadata, scoring, and play information
- `Play` - Container for play events with matchup information

**Application Flow**:
- **Welcome Screen** (`src/screens/Welcome.tsx`):
  - Automatically loads recent games for team ID 136 (hardcoded)
  - Searches past 3 days for most recent home game
  - Displays game information and "Continue to Game Details" option
- **Main App** (`App.tsx`):
  - Primary game event viewer with comprehensive pitch-by-pitch navigation
  - Processes game data to extract all play events with inherited matchup data
  - Provides event-level and play-level navigation controls
  - Displays detailed pitch data, coordinates, break information

**Component Architecture**:
- **Atomic Design Pattern**: Components organized as atoms → molecules → organisms
- **Atoms**: Basic UI elements (buttons, labels, displays)
- **Molecules**: Composed components (data rows, navigation controls)
- **Organisms**: Feature-complete sections (pitch data, coordinates, metadata)
- All components have co-located styles in separate `.ts` files

### State Management
- React hooks (`useState`) for all state management
- No external state management libraries
- **Main App State**:
  - `gameData` - Complete MLB game data
  - `allEvents` - Flattened array of all play events
  - `currentEventIndex` - Current event being viewed
  - `playBoundaries` - Array tracking start indices of each play
  - `showWelcome` - Welcome screen visibility toggle
  - `selectedGamePk` - Currently selected game ID

### Data Flow
1. **Welcome Screen**: Loads recent games, user selects game
2. **Game Loading**: Fetches complete game data via MLB API
3. **Data Processing**: Extracts and flattens all play events, inheriting matchup data from parent plays
4. **Navigation**: Users navigate through events with Previous/Next controls at event and play levels
5. **Data Display**: Shows comprehensive pitch data when available (velocity, coordinates, break data, strike zone info)

### Navigation System
- **Event Navigation**: Step through individual pitches/events within plays
- **Play Navigation**: Jump between complete at-bat sequences
- **Boundary Tracking**: `playBoundaries` array tracks play start positions for efficient play-level navigation

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
- Real game data from MLB's official StatsAPI (https://statsapi.mlb.com)
- **Game Feed**: `/api/v1.1/game/{gamePk}/feed/live` - Live game data with play-by-play
- **Schedule**: `/api/v1/schedule/games/?sportId=1&startDate={date}&endDate={date}` - Game schedules
- Comprehensive pitch tracking data including:
  - Velocity (start/end speed)
  - Coordinates (3D position and movement)
  - Break data (spin rate, direction, movement)
  - Strike zone information

### Educational Content
- Extensive tooltip system explaining baseball terminology (`src/utils/tooltips.tsx`)
- Detailed explanations for pitch tracking metrics
- User-friendly presentation of complex baseball analytics

### Navigation Features
- **Dual Navigation**: Event-by-event and play-by-play navigation
- **Smart Boundaries**: Tracks play boundaries for efficient play-level jumping
- **Inherited Context**: Events inherit matchup data from parent plays for consistent display
- **Real-time Indicators**: Current position tracking through entire games

### Welcome Screen Integration  
- **Auto-discovery**: Automatically finds recent games for team ID 136
- **Smart Filtering**: Searches for completed or live home games in past 3 days
- **One-click Access**: Direct game loading from schedule selection

### Component Reusability
- **Atomic Design**: Highly modular component system
- **Co-located Styles**: Each component has dedicated styles file
- **Type Safety**: Comprehensive TypeScript coverage across all components