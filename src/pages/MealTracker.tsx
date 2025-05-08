import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restaurant as FoodIcon,
  LocalDining as MealIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeal } from '../context/MealContext';
import { useTheme } from '@mui/material/styles';

const MotionCard = motion(Card);

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default function MealTracker() {
  const { state, dispatch } = useMeal();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    type: 'breakfast',
  });

  const handleAddMeal = () => {
    const meal = {
      id: Date.now().toString(),
      name: newMeal.name || '',
      calories: Number(newMeal.calories) || 0,
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      timestamp: new Date(),
      type: newMeal.type as Meal['type'],
    };
    dispatch({ type: 'ADD_MEAL', payload: meal });
    setOpen(false);
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      type: 'breakfast',
    });
  };

  const totalCalories = state.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = state.meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = state.meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = state.meals.reduce((sum, meal) => sum + meal.fat, 0);

  const [goals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  });

  const totalNutrition = state.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Meal Tracker</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Meal
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Calories
              </Typography>
              <Typography variant="h4">
                {totalCalories} / {state.dailyGoal.calories}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(totalCalories / state.dailyGoal.calories) * 100}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Protein
              </Typography>
              <Typography variant="h4">
                {totalProtein}g / {state.dailyGoal.protein}g
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(totalProtein / state.dailyGoal.protein) * 100}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Carbs
              </Typography>
              <Typography variant="h4">
                {totalCarbs}g / {state.dailyGoal.carbs}g
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(totalCarbs / state.dailyGoal.carbs) * 100}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Fat
              </Typography>
              <Typography variant="h4">
                {totalFat}g / {state.dailyGoal.fat}g
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(totalFat / state.dailyGoal.fat) * 100}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Today's Meals
      </Typography>
      <AnimatePresence>
        {state.meals.map((meal) => (
          <MotionCard
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            sx={{ mb: 2 }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{meal.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(meal.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">{meal.calories} cal</Typography>
                  <Typography variant="body2" color="text.secondary">
                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => dispatch({ type: 'REMOVE_MEAL', payload: meal.id })}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </MotionCard>
        ))}
      </AnimatePresence>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Meal Name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Meal Type"
              value={newMeal.type}
              onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value as Meal['type'] })}
              fullWidth
            >
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="lunch">Lunch</MenuItem>
              <MenuItem value="dinner">Dinner</MenuItem>
              <MenuItem value="snack">Snack</MenuItem>
            </TextField>
            <TextField
              label="Calories"
              type="number"
              value={newMeal.calories}
              onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Protein (g)"
              type="number"
              value={newMeal.protein}
              onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Carbs (g)"
              type="number"
              value={newMeal.carbs}
              onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Fat (g)"
              type="number"
              value={newMeal.fat}
              onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">
            Add Meal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 