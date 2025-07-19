Atomic Design Component Breakdown Plan

  Based on analyzing your App.tsx file, here's how I'd break it down:

  Atoms (Basic building blocks)

  src/components/atoms/
  ├── LoadButton/           # "Load Game Data" button
  ├── NavButton/            # Previous/Next navigation buttons
  ├── DataLabel/            # Text labels for data fields
  ├── DataValue/            # Text values for data fields
  ├── SectionTitle/         # Main section headers ("Pitch Data")
  ├── SubSectionTitle/      # Subsection headers ("Coordinates")
  ├── EventCounter/         # "Event X of Y" display
  └── EventTime/            # Formatted time display

  Molecules (Combinations of atoms)

  src/components/molecules/
  ├── DataRow/              # Label + Value pair in a row
  ├── PitchSpeedDisplay/    # Highlighted pitch speed container
  ├── EventHeader/          # Event counter + time in header
  ├── LoadingIndicator/     # Spinner with container styling
  ├── NavigationControls/   # Previous + Next buttons together
  ├── CountDisplay/         # Balls-strikes-outs information
  └── ScoreDisplay/         # Away/Home score display

  Organisms (Complex UI sections)

  src/components/organisms/
  ├── GameHeader/           # Title + Load button + Loading state
  ├── EventDetails/         # Description, event type, call, pitch type
  ├── PitchDataSection/     # Complete pitch data container
  ├── CoordinatesSection/   # Coordinates data grid
  ├── BreaksSection/        # Break data measurements
  ├── StrikeZoneSection/    # Strike zone boundaries
  ├── EventMetadata/        # Event type and index information
  └── EventContainer/       # Complete event display wrapper

  Implementation Strategy

  1. Start with Atoms: Create the smallest, most reusable components first
  2. Build Molecules: Combine atoms into logical groupings
  3. Construct Organisms: Assemble molecules into major UI sections
  4. Refactor App.tsx: Replace verbose code with component composition

  Directory Structure

  Each component folder will contain:
  - index.tsx - Main component file
  - styles.ts - StyleSheet definitions
  - types.ts - TypeScript interfaces (when needed)

  Key Benefits

  - Reusability: DataRow can be used throughout the app
  - Maintainability: Each component has a single responsibility
  - Testability: Smaller components are easier to test
  - Consistency: Standardized styling and behavior