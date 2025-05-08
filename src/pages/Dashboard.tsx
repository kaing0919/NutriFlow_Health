import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import {
  WaterDrop as WaterIcon,
  Restaurant as FoodIcon,
  SelfImprovement as MeditationIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

interface HealthMetric {
  title: string;
  current: number;
  goal: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      title: 'Water Intake',
      current: 1200,
      goal: 2000,
      unit: 'ml',
      icon: <WaterIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Calories',
      current: 1450,
      goal: 2000,
      unit: 'kcal',
      icon: <FoodIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Meditation',
      current: 15,
      goal: 30,
      unit: 'min',
      icon: <MeditationIcon />,
      color: theme.palette.success.main,
    },
  ]);

  const quickActions = [
    {
      title: 'Log Water',
      icon: <WaterIcon />,
      action: () => navigate('/water'),
      color: theme.palette.primary.main,
    },
    {
      title: 'Log Meal',
      icon: <FoodIcon />,
      action: () => navigate('/meals'),
      color: theme.palette.secondary.main,
    },
    {
      title: 'Start Meditation',
      icon: <MeditationIcon />,
      action: () => navigate('/meditation'),
      color: theme.palette.success.main,
    },
  ];

  const handleQuickAdd = (metricIndex: number) => {
    const newMetrics = [...metrics];
    const metric = newMetrics[metricIndex];
    
    switch (metric.title) {
      case 'Water Intake':
        metric.current = Math.min(metric.current + 250, metric.goal);
        break;
      case 'Calories':
        metric.current = Math.min(metric.current + 100, metric.goal);
        break;
      case 'Meditation':
        metric.current = Math.min(metric.current + 5, metric.goal);
        break;
    }
    
    setMetrics(newMetrics);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Health Dashboard
      </Typography>

      {/* Health Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={4} key={metric.title}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: `${metric.color}20`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Typography variant="h6">{metric.title}</Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {metric.current} / {metric.goal} {metric.unit}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(metric.current / metric.goal) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${metric.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                    },
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => handleQuickAdd(index)}
                    sx={{ color: metric.color }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={4} key={action.title}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <CardContent>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{
                    color: action.color,
                    borderColor: action.color,
                    '&:hover': {
                      borderColor: action.color,
                      backgroundColor: `${action.color}10`,
                    },
                  }}
                >
                  {action.title}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Weekly Progress */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Weekly Progress
        </Typography>
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6">Overall Health Score</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: `${theme.palette.success.main}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You're doing great! Keep up the good work.
            </Typography>
          </CardContent>
        </MotionCard>
      </Box>
    </Box>
  );
} 