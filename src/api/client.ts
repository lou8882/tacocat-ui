// src/api/client.ts
import { MLBGameData, MLBScheduleResponse } from '../types/mlb';

const MLB_API_BASE = 'https://statsapi.mlb.com';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const apiClient = {
  async getMLBGameData(gamePk: number): Promise<ApiResponse<MLBGameData>> {
    try {
      const response = await fetch(`${MLB_API_BASE}/api/v1.1/game/${gamePk}/feed/live`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async getMLBSchedule(startDate: string, endDate: string): Promise<ApiResponse<MLBScheduleResponse>> {
    try {
      const response = await fetch(`${MLB_API_BASE}/api/v1/schedule/games/?sportId=1&startDate=${startDate}&endDate=${endDate}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};