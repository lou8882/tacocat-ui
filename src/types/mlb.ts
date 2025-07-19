// src/types/mlb.ts

export interface DiffPatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: any;
  from?: string;
}

export interface DiffPatchResponse {
  diff: DiffPatchOperation[];
  metaData?: {
    timeStamp: string;
    wait?: number;
    gameEvents?: string[];
    logicalEvents?: string[];
  };
}

export interface MLBTeam {
  id: number;
  name: string;
  teamName: string;
  locationName: string;
  abbreviation: string;
  teamCode: string;
  sport: {
    id: number;
    name: string;
  };
  league: {
    id: number;
    name: string;
  };
}

export interface TeamsResponse {
  teams: MLBTeam[];
}

// Complete MLB Game Feed Response
export interface MLBGameData {
  copyright: string;
  gamePk: number;
  link: string;
  metaData: {
    wait: number;
    timeStamp: string;
    gameEvents: string[];
    logicalEvents: string[];
  };
  gameData: {
    game: GameDetails;
    datetime: GameDateTime;
    status: GameStatus;
    teams: {
      away: TeamDetails;
      home: TeamDetails;
    };
    players: { [playerId: string]: PlayerDetails };
    venue: VenueDetails;
    weather?: WeatherDetails;
    gameInfo: GameInfoDetails;
    review?: ReviewDetails;
    flags?: FlagsDetails;
    alerts?: any[];
    probablePitchers?: {
      away?: PitcherDetails;
      home?: PitcherDetails;
    };
    officialVenue?: VenueDetails;
    moundVisits?: MoundVisitsDetails;
  };
  liveData: {
    plays: {
      allPlays: Play[];
      scoringPlays: number[];
      playsByInning: PlaysByInning[];
    };
    linescore?: LinescoreDetails;
    boxscore?: BoxscoreDetails;
    decisions?: DecisionsDetails;
    leaders?: LeadersDetails;
  };
}

// Game Details Interfaces
export interface GameDetails {
  pk: number;
  type: string;
  doubleHeader: string;
  id: string;
  gamedayType: string;
  tiebreaker: string;
  gameNumber: number;
  calendarEventID: string;
  season: string;
  seasonDisplay: string;
  datetime?: GameDateTime;
  status?: GameStatus;
}

export interface GameDateTime {
  dateTime: string;
  originalDate?: string;
  officialDate: string;
  dayNight: string;
  time: string;
  ampm: string;
}

export interface GameStatus {
  abstractGameState: string;
  codedGameState: string;
  detailedState: string;
  statusCode: string;
  startTimeTBD?: boolean;
  reason?: string;
}

// Team and Player Interfaces
export interface TeamDetails {
  id: number;
  name: string;
  link: string;
  season?: number;
  venue?: VenueDetails;
  teamCode: string;
  fileCode: string;
  abbreviation: string;
  teamName: string;
  locationName: string;
  firstYearOfPlay: string;
  league?: LeagueDetails;
  division?: DivisionDetails;
  sport?: SportDetails;
  shortName: string;
  franchiseName?: string;
  clubName?: string;
  active?: boolean;
}

export interface PlayerDetails {
  id: number;
  fullName: string;
  link: string;
  firstName: string;
  lastName: string;
  primaryNumber?: string;
  birthDate: string;
  currentAge: number;
  birthCity?: string;
  birthStateProvince?: string;
  birthCountry: string;
  height: string;
  weight: number;
  active: boolean;
  primaryPosition: PositionDetails;
  useName: string;
  useLastName?: string;
  middleName?: string;
  boxscoreName: string;
  nickName?: string;
  gender: string;
  isPlayer: boolean;
  isVerified: boolean;
  draftYear?: number;
  batSide?: HandDetails;
  pitchHand?: HandDetails;
  nameFirstLast: string;
  nameSlug: string;
  firstLastName: string;
  lastFirstName: string;
  lastInitName: string;
  initLastName: string;
  fullFMLName: string;
  fullLFMName: string;
  strikeZoneTop?: number;
  strikeZoneBottom?: number;
}

export interface PositionDetails {
  code: string;
  name: string;
  type: string;
  abbreviation: string;
}

export interface HandDetails {
  code: string;
  description: string;
}

export interface LeagueDetails {
  id: number;
  name: string;
  link: string;
}

export interface DivisionDetails {
  id: number;
  name: string;
  link: string;
}

export interface SportDetails {
  id: number;
  link: string;
  name: string;
}

// Venue and Weather Interfaces
export interface VenueDetails {
  id: number;
  name: string;
  link: string;
  location?: {
    address1?: string;
    city?: string;
    state?: string;
    stateAbbrev?: string;
    postalCode?: string;
    defaultCoordinates?: {
      latitude: number;
      longitude: number;
    };
    azimuthAngle?: number;
    elevation?: number;
  };
  timeZone?: {
    id: string;
    offset: number;
    tz: string;
  };
  active?: boolean;
  season?: string;
}

export interface WeatherDetails {
  condition: string;
  temp: string;
  wind: string;
}

export interface GameInfoDetails {
  attendance?: number;
  firstPitch?: string;
  gameDurationMinutes?: number;
}

export interface ReviewDetails {
  hasChallenges: boolean;
  away: {
    used: number;
    remaining: number;
  };
  home: {
    used: number;
    remaining: number;
  };
}

export interface FlagsDetails {
  awayTeamNoHitter?: boolean;
  awayTeamPerfectGame?: boolean;
  homeTeamNoHitter?: boolean;
  homeTeamPerfectGame?: boolean;
}

export interface MoundVisitsDetails {
  away: {
    used: number;
    remaining: number;
  };
  home: {
    used: number;
    remaining: number;
  };
}

// Play and Event Interfaces
export interface Play {
  result: {
    type: string;
    event: string;
    eventType: string;
    description: string;
    rbi?: number;
    awayScore: number;
    homeScore: number;
  };
  about: {
    atBatIndex: number;
    halfInning: string;
    isTopInning: boolean;
    inning: number;
    startTime?: string;
    endTime?: string;
    isComplete: boolean;
    isScoringPlay: boolean;
    hasReview: boolean;
    hasOut: boolean;
    captivatingIndex?: number;
  };
  count: {
    balls: number;
    strikes: number;
    outs: number;
  };
  matchup: {
    batter: {
      id: number;
      fullName: string;
      link: string;
    };
    batSide: {
      code: string;
      description: string;
    };
    pitcher: {
      id: number;
      fullName: string;
      link: string;
    };
    pitchHand: {
      code: string;
      description: string;
    };
    batterHotColdZones?: any[];
    pitcherHotColdZones?: any[];
    splits?: {
      batter: string;
      pitcher: string;
      menOnBase: string;
    };
  };
  pitchIndex?: number[];
  actionIndex?: number[];
  runnerIndex?: number[];
  runners?: RunnerDetails[];
  playEvents: PlayEvent[];
  playEndTime?: string;
  atBatIndex: number;
}

export interface RunnerDetails {
  movement: {
    originBase?: string;
    start?: string;
    end?: string;
    outBase?: string;
    isOut?: boolean;
    outNumber?: number;
  };
  details: {
    event: string;
    eventType: string;
    movementReason?: string;
    runner: {
      id: number;
      fullName: string;
      link: string;
    };
    responsiblePitcher?: {
      id: number;
      link: string;
    };
    isScoringEvent: boolean;
    rbi: boolean;
    earned: boolean;
    teamUnearned: boolean;
    playIndex?: number;
  };
  credits?: any[];
}

export interface PlaysByInning {
  startIndex: number;
  endIndex: number;
  top: number[];
  bottom: number[];
  hits: {
    away: number[];
    home: number[];
  };
}

export interface PlayEvent {
  details: EventDetails;
  count: {
    balls: number;
    strikes: number;
    outs: number;
  };
  pitchData?: PitchDataDetails;
  hitData?: HitDataDetails;
  index: number;
  startTime?: string;
  endTime?: string;
  isPitch: boolean;
  type: string;
  player?: {
    id: number;
    link: string;
  };
  pitchNumber?: number;
  playId?: string;
  playResult?: {
    type: string;
    event: string;
    eventType: string;
    description: string;
    rbi?: number;
    awayScore: number;
    homeScore: number;
  };
  matchup?: {
    batter: {
      id: number;
      fullName: string;
      link: string;
    };
    batSide: {
      code: string;
      description: string;
    };
    pitcher: {
      id: number;
      fullName: string;
      link: string;
    };
    pitchHand: {
      code: string;
      description: string;
    };
  };
}

export interface PitchDataDetails {
  startSpeed?: number;
  endSpeed?: number;
  nastyFactor?: number;
  strikeZoneTop: number;
  strikeZoneBottom: number;
  coordinates?: {
    aY?: number;
    aZ?: number;
    pfxX?: number;
    pfxZ?: number;
    pX?: number;
    pZ?: number;
    vX0?: number;
    vY0?: number;
    vZ0?: number;
    x?: number;
    y?: number;
    x0?: number;
    y0?: number;
    z0?: number;
    aX?: number;
  };
  breaks?: {
    breakAngle?: number;
    breakLength?: number;
    breakY?: number;
    breakVertical?: number;
    breakVerticalInduced?: number;
    breakHorizontal?: number;
    spinRate?: number;
    spinDirection?: number;
  };
  zone?: number;
  typeConfidence?: number;
  plateTime?: number;
  extension?: number;
}

export interface HitDataDetails {
  launchSpeed?: number;
  launchAngle?: number;
  totalDistance?: number;
  trajectory: string;
  hardness: string;
  location?: number;
  coordinates?: {
    coordX: number;
    coordY: number;
  };
}

export interface EventDetails {
  description: string;
  event?: string;
  eventType?: string;
  awayScore?: number;
  homeScore?: number;
  isScoringPlay?: boolean;
  isOut?: boolean;
  hasReview?: boolean;
  call?: {
    code: string;
    description: string;
  };
  code?: string;
  ballColor?: string;
  trailColor?: string;
  isInPlay?: boolean;
  isStrike?: boolean;
  isBall?: boolean;
  type?: {
    code: string;
    description: string;
  };
  runnerGoing?: boolean;
  fromCatcher?: boolean;
}

// Additional LiveData Interfaces
export interface LinescoreDetails {
  currentInning?: number;
  currentInningOrdinal?: string;
  inningState?: string;
  inningHalf?: string;
  isTopInning?: boolean;
  scheduledInnings?: number;
  innings: InningDetails[];
  teams: {
    home: {
      runs: number;
      hits: number;
      errors: number;
      leftOnBase: number;
    };
    away: {
      runs: number;
      hits: number;
      errors: number;
      leftOnBase: number;
    };
  };
  defense?: DefenseDetails;
  offense?: OffenseDetails;
  balls?: number;
  strikes?: number;
  outs?: number;
}

export interface InningDetails {
  num: number;
  ordinalNum: string;
  home?: {
    runs?: number;
    hits?: number;
    errors?: number;
    leftOnBase?: number;
  };
  away?: {
    runs?: number;
    hits?: number;
    errors?: number;
    leftOnBase?: number;
  };
}

export interface DefenseDetails {
  pitcher?: PlayerDetails;
  catcher?: PlayerDetails;
  first?: PlayerDetails;
  second?: PlayerDetails;
  third?: PlayerDetails;
  shortstop?: PlayerDetails;
  left?: PlayerDetails;
  center?: PlayerDetails;
  right?: PlayerDetails;
  batter?: PlayerDetails;
  onDeck?: PlayerDetails;
  inHole?: PlayerDetails;
  battingOrder?: number;
  team?: TeamDetails;
}

export interface OffenseDetails {
  batter?: PlayerDetails;
  onDeck?: PlayerDetails;
  inHole?: PlayerDetails;
  pitcher?: PlayerDetails;
  battingOrder?: number;
  team?: TeamDetails;
}

export interface BoxscoreDetails {
  teams: {
    away: TeamBoxscore;
    home: TeamBoxscore;
  };
  officials?: OfficialDetails[];
  info?: InfoDetails[];
  pitchingNotes?: string[];
}

export interface TeamBoxscore {
  team: TeamDetails;
  teamStats: {
    batting: BattingStats;
    pitching: PitchingStats;
    fielding: FieldingStats;
  };
  players: { [playerId: string]: PlayerBoxscore };
  batters: number[];
  pitchers: number[];
  bench: number[];
  bullpen: number[];
  battingOrder: number[];
  info?: InfoDetails[];
  note?: InfoDetails[];
}

export interface PlayerBoxscore {
  person: PlayerDetails;
  jerseyNumber: string;
  position: PositionDetails;
  stats: {
    batting?: BattingStats;
    pitching?: PitchingStats;
    fielding?: FieldingStats;
  };
  seasonStats?: {
    batting?: BattingStats;
    pitching?: PitchingStats;
    fielding?: FieldingStats;
  };
  gameStatus?: {
    isCurrentBatter?: boolean;
    isCurrentPitcher?: boolean;
    isOnBench?: boolean;
    isSubstitute?: boolean;
  };
  allPositions?: PositionDetails[];
}

export interface BattingStats {
  gamesPlayed?: number;
  flyOuts?: number;
  groundOuts?: number;
  runs?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  strikeOuts?: number;
  baseOnBalls?: number;
  intentionalWalks?: number;
  hits?: number;
  hitByPitch?: number;
  atBats?: number;
  caughtStealing?: number;
  stolenBases?: number;
  groundIntoDoublePlay?: number;
  rbi?: number;
  leftOnBase?: number;
  sacBunts?: number;
  sacFlies?: number;
  avg?: string;
  obp?: string;
  slg?: string;
  ops?: string;
  plateAppearances?: number;
  totalBases?: number;
}

export interface PitchingStats {
  gamesPlayed?: number;
  gamesStarted?: number;
  groundOuts?: number;
  airOuts?: number;
  runs?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  strikeOuts?: number;
  baseOnBalls?: number;
  intentionalWalks?: number;
  hits?: number;
  hitByPitch?: number;
  atBats?: number;
  caughtStealing?: number;
  stolenBases?: number;
  inningsPitched?: string;
  saveOpportunities?: number;
  earnedRuns?: number;
  battersFaced?: number;
  outs?: number;
  gamesPitched?: number;
  completeGames?: number;
  shutouts?: number;
  pitchesThrown?: number;
  balls?: number;
  strikes?: number;
  strikePercentage?: string;
  hitBatsmen?: number;
  balks?: number;
  wildPitches?: number;
  pickoffs?: number;
  rbi?: number;
  gamesFinished?: number;
  wins?: number;
  losses?: number;
  saves?: number;
  holds?: number;
  era?: string;
  whip?: string;
}

export interface FieldingStats {
  gamesStarted?: number;
  caughtStealing?: number;
  stolenBases?: number;
  assists?: number;
  putOuts?: number;
  errors?: number;
  chances?: number;
  fielding?: string;
  passedBall?: number;
}

export interface OfficialDetails {
  official: {
    id: number;
    fullName: string;
    link: string;
  };
  officialType: string;
}

export interface InfoDetails {
  label: string;
  value: string;
}

export interface DecisionsDetails {
  winner?: {
    id: number;
    fullName: string;
    link: string;
  };
  loser?: {
    id: number;
    fullName: string;
    link: string;
  };
  save?: {
    id: number;
    fullName: string;
    link: string;
  };
}

export interface LeadersDetails {
  hitDistance?: {
    team: TeamDetails;
    leaders: {
      value: string;
      players: PlayerDetails[];
    }[];
  };
  hitSpeed?: {
    team: TeamDetails;
    leaders: {
      value: string;
      players: PlayerDetails[];
    }[];
  };
  pitchSpeed?: {
    team: TeamDetails;
    leaders: {
      value: string;
      players: PlayerDetails[];
    }[];
  };
}

export interface PitcherDetails {
  id: number;
  fullName: string;
  link: string;
}

// Legacy interface for backward compatibility
export interface Matchup {
  batter: {
    id: number;
    fullName: string;
  };
  batSide: {
    code: string;
    description: string;
  };
  pitcher: {
    id: number;
    fullName: string;
  };
  pitchHand: {
    code: string;
    description: string;
  };
}

// Complete MLB Schedule Response
export interface MLBScheduleResponse {
  copyright: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  dates: ScheduleDate[];
}

export interface ScheduleDate {
  date: string;
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  games: ScheduleGame[];
  events: any[];
}

export interface ScheduleGame {
  gamePk: number;
  gameGuid?: string;
  link: string;
  gameType: string;
  season: string;
  gameDate: string;
  officialDate: string;
  status: GameStatus;
  teams: {
    away: ScheduleTeamPerformance;
    home: ScheduleTeamPerformance;
  };
  venue: VenueDetails;
  content?: { link: string };
  isTie?: boolean;
  gameNumber: number;
  publicFacing: boolean;
  doubleHeader: string;
  gamedayType: string;
  tiebreaker: string;
  calendarEventID?: string;
  seasonDisplay: string;
  dayNight: string;
  description?: string;
  scheduledInnings: number;
  reverseHomeAwayStatus: boolean;
  inningBreakLength?: number;
  gamesInSeries?: number;
  seriesGameNumber?: number;
  seriesDescription: string;
  recordSource: string;
  ifNecessary: string;
  ifNecessaryDescription: string;
  rescheduleDate?: string;
  rescheduleGameDate?: string;
  resumeDate?: string;
  resumeGameDate?: string;
  resumedFrom?: string;
  resumedFromDate?: string;
}

export interface ScheduleTeamPerformance {
  leagueRecord?: {
    wins: number;
    losses: number;
    pct: string;
  };
  score?: number;
  team: {
    id: number;
    name: string;
    link: string;
  };
  isWinner?: boolean;
  splitSquad?: boolean;
  seriesNumber?: number;
}