import { createContext, useContext, useReducer, ReactNode } from 'react';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

interface MealState {
  meals: Meal[];
  dailyGoal: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

type MealAction =
  | { type: 'ADD_MEAL'; payload: Meal }
  | { type: 'REMOVE_MEAL'; payload: string }
  | { type: 'UPDATE_DAILY_GOAL'; payload: Partial<MealState['dailyGoal']> };

const initialState: MealState = {
  meals: [],
  dailyGoal: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  },
};

const MealContext = createContext<{
  state: MealState;
  dispatch: React.Dispatch<MealAction>;
} | null>(null);

function mealReducer(state: MealState, action: MealAction): MealState {
  switch (action.type) {
    case 'ADD_MEAL':
      return {
        ...state,
        meals: [...state.meals, action.payload],
      };
    case 'REMOVE_MEAL':
      return {
        ...state,
        meals: state.meals.filter((meal) => meal.id !== action.payload),
      };
    case 'UPDATE_DAILY_GOAL':
      return {
        ...state,
        dailyGoal: { ...state.dailyGoal, ...action.payload },
      };
    default:
      return state;
  }
}

export function MealProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mealReducer, initialState);

  return (
    <MealContext.Provider value={{ state, dispatch }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeal() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
} 