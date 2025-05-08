import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Grid,
  TextField,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  WaterDrop as WaterIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface WaterEntry {
  amount: number;
  timestamp: Date;
}

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default function WaterTracker() {
  const theme = useTheme();
  const [goal] = useState(2000); // ml
  const [entries, setEntries] = useState<WaterEntry[]>([
    { amount: 250, timestamp: new Date(2024, 2, 15, 8, 30) },
    { amount: 300, timestamp: new Date(2024, 2, 15, 10, 15) },
    { amount: 250, timestamp: new Date(2024, 2, 15, 12, 45) },
  ]);
  const [customAmount, setCustomAmount] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const totalIntake = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const progress = (totalIntake / goal) * 100;

  const addWater = (amount: number) => {
    if (totalIntake + amount > goal) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    setEntries([...entries, { amount, timestamp: new Date() }]);
  };

  const removeLastEntry = () => {
    setEntries(entries.slice(0, -1));
  };

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      addWater(amount);
      setCustomAmount('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Water Tracker
      </Typography>

      {showAlert && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You've exceeded your daily water goal!
        </Alert>
      )}

      {/* Progress Card */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WaterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6">Today's Progress</Typography>
          </Box>
          <Typography variant="h4" gutterBottom>
            {totalIntake} / {goal} ml
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: `${theme.palette.primary.main}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        </CardContent>
      </MotionCard>

      {/* Quick Add Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addWater(250)}
            sx={{ height: '100%' }}
          >
            +250ml
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addWater(500)}
            sx={{ height: '100%' }}
          >
            +500ml
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RemoveIcon />}
            onClick={removeLastEntry}
            sx={{ height: '100%' }}
          >
            Remove Last
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Custom Amount (ml)"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleCustomAmount}
              disabled={!customAmount}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* History */}
      <Typography variant="h5" gutterBottom>
        Today's History
      </Typography>
      <Grid container spacing={2}>
        {entries.map((entry, index) => (
          <Grid item xs={12} key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6">{entry.amount}ml</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(entry.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 