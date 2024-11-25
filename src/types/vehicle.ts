export interface VehicleState {
  years: number[];
  makes: string[];
  models: string[];
  selectedYear: number | null;
  selectedMake: string | null;
  selectedModel: string | null;
}

export interface ApiError {
  message: string;
  code?: string;
}