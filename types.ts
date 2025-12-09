export enum FishStage {
  ALEVINAJE = 'Alevinaje',
  JUVENIL = 'Juvenil',
  ENGORDE = 'Engorde',
  COSECHA = 'Cosecha'
}

export interface Batch {
  id: string;
  name: string;
  tankId: string;
  startDate: string;
  initialQuantity: number;
  currentQuantity: number;
  averageWeight: number; // in grams
  stage: FishStage;
}

export interface WaterQualityLog {
  id: string;
  date: string;
  tankId: string;
  ph: number;
  temperature: number; // Celsius
  oxygen: number; // mg/L
  ammonia: number; // mg/L
  notes?: string;
}

export type ExpenseCategory = 'Feed' | 'Energy' | 'Labor' | 'Maintenance' | 'Fry' | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type ViewState = 'DASHBOARD' | 'BATCHES' | 'WATER' | 'FINANCE' | 'ADVISOR';