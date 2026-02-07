
import React, { useState, useCallback } from 'react';
import { UserStats, Gender, ActivityLevel, Goal, CalculationResults, AIAdvice } from './types';
import { ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS } from './constants';
import CalculatorForm from './components/CalculatorForm';
import ResultsView from './components/ResultsView';
import { getHealthAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    age: 51,
    gender: Gender.FEMALE,
    weight: 70,
    height: 174,
    activity: ActivityLevel.MODERATE,
    goal: Goal.WEIGHT_LOSS,
    hormonalStatus: "пременопауза",
    fatigue: "высокая",
    hemoglobin: "низкий",
    bloodPressure: "100/65",
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const calculate = useCallback(async () => {
    let bmr = (10 * stats.weight) + (6.25 * stats.height) - (5 * stats.age);
    if (stats.gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[stats.activity];
    const targetCalories = tdee + GOAL_ADJUSTMENTS[stats.goal];

    // --- Улучшенная логика БЖУ для коррекции здоровья ---
    
    // 1. БЕЛКИ: Повышены до 2.0г/кг. Белок критичен для синтеза гемоглобина.
    const protein = stats.weight * 2.0;
    const proteinCals = protein * 4;
    
    // 2. ЖИРЫ: 30% для поддержки гормонального синтеза в пременопаузе.
    const fatCals = targetCalories * 0.30;
    const fat = fatCals / 9;

    // 3. УГЛЕВОДЫ: Остаток. При высокой утомляемости важны сложные угли.
    const carbCals = targetCalories - proteinCals - fatCals;
    const carbs = Math.max(carbCals / 4, 50);

    const macroJustifications = {
      protein: "Повышен до 2г/кг для поддержки синтеза гемоглобина и предотвращения мышечной слабости при похудении.",
      fat: "30% рациона выделено на полезные жиры для стабилизации гормонального фона в период пременопаузы.",
      carbs: "Распределены для обеспечения стабильного уровня сахара в крови, чтобы минимизировать дневную усталость."
    };

    const newResults: CalculationResults = {
      bmr,
      tdee,
      targetCalories,
      macros: { protein, fat, carbs },
      macroJustifications
    };

    setResults(newResults);
    setLoadingAI(true);
    
    const advice = await getHealthAdvice(stats, newResults);
    setAiAdvice(advice);
    setLoadingAI(false);
  }, [stats]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-emerald-600 text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Смарт-Диетолог <span className="text-emerald-200">AI</span>
          </h1>
          <p className="text-emerald-50 text-lg max-w-2xl mx-auto opacity-90">
            Персональный расчет питания с учетом вашего здоровья, гормонального фона и самочувствия.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Ваш профиль
              </h2>
              <CalculatorForm 
                stats={stats} 
                onChange={setStats} 
                onSubmit={calculate} 
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            {results ? (
              <ResultsView 
                results={results} 
                aiAdvice={aiAdvice} 
                loadingAI={loadingAI} 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/40 border-2 border-dashed border-emerald-200 rounded-3xl min-h-[500px]">
                <div className="bg-emerald-50 p-6 rounded-full mb-6">
                  <svg className="w-16 h-16 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700">Персональный план готов к расчету</h3>
                <p className="text-gray-500 max-w-sm mt-3 leading-relaxed">
                  Мы учтем ваши показатели (гемоглобин, давление и активность), чтобы создать идеальный план похудения.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-gray-400 text-sm px-4 border-t border-gray-100 pt-10">
        <p>© 2024 Смарт-Диетолог. Информация носит справочный характер.</p>
        <p className="mt-1">При низком гемоглобине и давлении обязательно проконсультируйтесь с лечащим врачом.</p>
      </footer>
    </div>
  );
};

export default App;
