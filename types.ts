
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE'
}

export enum Goal {
  MAINTAIN = 'MAINTAIN',
  MILD_LOSS = 'MILD_LOSS',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  EXTREME_LOSS = 'EXTREME_LOSS'
}

export interface UserStats {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activity: ActivityLevel;
  goal: Goal;
  hormonalStatus?: string;
  fatigue?: string;
  hemoglobin?: string;
  bloodPressure?: string;
}

export interface CalculationResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  macroJustifications: {
    protein: string;
    fat: string;
    carbs: string;
  };
}

export interface DayMenu {
  day: number;
  meals: {
    time: string;
    dish: string;
    calories: number;
  }[];
}

export interface AIAdvice {
  tips: string[];
  warning?: string;
  weeklyMenu?: DayMenu[];
}
