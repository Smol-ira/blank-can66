
import { ActivityLevel, Goal } from './types';

export const ACTIVITY_MULTIPLIERS = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const GOAL_ADJUSTMENTS = {
  [Goal.MAINTAIN]: 0,
  [Goal.MILD_LOSS]: -250,
  [Goal.WEIGHT_LOSS]: -500,
  [Goal.EXTREME_LOSS]: -1000,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  [ActivityLevel.SEDENTARY]: 'Малоподвижный (сидячая работа)',
  [ActivityLevel.LIGHT]: 'Легкая активность (1-3 раза в неделю)',
  [ActivityLevel.MODERATE]: 'Умеренная активность (3-5 раз в неделю)',
  [ActivityLevel.ACTIVE]: 'Высокая активность (6-7 раз в неделю)',
  [ActivityLevel.VERY_ACTIVE]: 'Экстремальная активность (тяжёлый труд)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  [Goal.MAINTAIN]: 'Поддержание веса',
  [Goal.MILD_LOSS]: 'Медленное похудение (0.25 кг/нед)',
  [Goal.WEIGHT_LOSS]: 'Обычное похудение (0.5 кг/нед)',
  [Goal.EXTREME_LOSS]: 'Быстрое похудение (1 кг/нед)',
};
