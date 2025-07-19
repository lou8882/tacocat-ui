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