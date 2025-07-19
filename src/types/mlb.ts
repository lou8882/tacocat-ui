// src/types/mlb.ts
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
  liveData: {
    plays: {
      allPlays: Play[];
    };
  };
}

export interface Play {
  playEvents: PlayEvent[];
  matchup?: {
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
  };
}

export interface PlayEvent {
  details: EventDetails;
  count: {
    balls: number;
    strikes: number;
    outs: number;
  };
  index: number;
  startTime: string;
  endTime: string;
  isPitch: boolean;
  type: string;
  pitchNumber?: number;
  pitchData?: any; // We can expand this if needed
  matchup?: {
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
}

export interface MLBScheduleResponse {
  copyright: string;
  totalGames: number;
  dates: ScheduleDate[];
}

export interface ScheduleDate {
  date: string;
  totalGames: number;
  games: ScheduleGame[];
}

export interface ScheduleGame {
  gamePk: number;
  gameDate: string;
  status: {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    statusCode: string;
  };
  teams: {
    away: {
      score?: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
    home: {
      score?: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
  };
  venue: {
    id: number;
    name: string;
    link: string;
  };
}