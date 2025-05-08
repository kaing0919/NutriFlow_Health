import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  useTheme,
  Slider,
  Stack,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  VolumeUp as VolumeIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'breathing' | 'mindfulness' | 'sleep' | 'stress';
  audioUrl?: string;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const sessions: MeditationSession[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'A calming session focusing on deep breathing techniques.',
    duration: 300, // 5 minutes
    category: 'breathing',
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'Progressive relaxation through body awareness.',
    duration: 600, // 10 minutes
    category: 'mindfulness',
  },
  {
    id: '3',
    title: 'Sleep Meditation',
    description: 'Gentle guidance to help you fall asleep.',
    duration: 900, // 15 minutes
    category: 'sleep',
  },
  {
    id: '4',
    title: 'Stress Relief',
    description: 'Quick stress reduction techniques.',
    duration: 300, // 5 minutes
    category: 'stress',
  },
];

export default function Meditation() {
  const theme = useTheme();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining]);

  const handleStartSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResume = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeRemaining(selectedSession?.duration || 0);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Meditation
      </Typography>

      {/* Active Session */}
      {selectedSession && (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: 4 }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {selectedSession.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {selectedSession.description}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" align="center" gutterBottom>
                {formatTime(timeRemaining)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(timeRemaining / selectedSession.duration) * 100}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {isPlaying ? (
                  <IconButton
                    size="large"
                    color="primary"
                    onClick={handlePause}
                  >
                    <PauseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    size="large"
                    color="primary"
                    onClick={handleResume}
                  >
                    <PlayIcon />
                  </IconButton>
                )}
                <IconButton
                  size="large"
                  color="error"
                  onClick={handleStop}
                >
                  <StopIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <VolumeIcon />
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>
          </CardContent>
        </MotionCard>
      )}

      {/* Available Sessions */}
      <Typography variant="h5" gutterBottom>
        Guided Sessions
      </Typography>
      <Grid container spacing={3}>
        {sessions.map((session) => (
          <Grid item xs={12} sm={6} md={3} key={session.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s',
                },
              }}
              onClick={() => handleStartSession(session)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(session.duration)}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {session.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  startIcon={<PlayIcon />}
                >
                  Start Session
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 