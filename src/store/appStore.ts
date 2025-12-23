import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, StudySession, StudyStats, MusicTrack } from '../types';

interface AppState {
  // User preferences
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Current session
  currentMemberId: string | null;
  setCurrentMemberId: (memberId: string | null) => void;
  
  // Study timer
  isTimerRunning: boolean;
  timeLeft: number;
  isBreakTime: boolean;
  studyDuration: number;
  breakDuration: number;
  timerMemberId: string | null; // ID of the member the timer is active for
  setTimerState: (state: Partial<{ isTimerRunning: boolean; timeLeft: number; isBreakTime: boolean; studyDuration: number; breakDuration: number; timerMemberId: string | null }>) => void;
  
  // Timer persistence
  currentSessionStartTime: number | null; // timestamp for active session
  setCurrentSessionStartTime: (timestamp: number | null) => void;
  
  // Study sessions
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  
  // Study statistics
  stats: StudyStats;
  updateStats: (session: StudySession) => void;
  
  // Music
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default preferences
      preferences: {
        theme: 'dark',
        selectedMemberId: null,
        soundEnabled: true,
        notificationsEnabled: true,
      },
      setPreferences: (preferences) => 
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        })),
      
      // Current member
      currentMemberId: null,
      setCurrentMemberId: (memberId) => set({ currentMemberId: memberId }),
      
      // Timer state
      isTimerRunning: false,
      timeLeft: 25 * 60, // 25 minutes in seconds
      isBreakTime: false,
      studyDuration: 25,
      breakDuration: 5,
      timerMemberId: null,
      currentSessionStartTime: null,
      setTimerState: (state) => set((prev) => ({ ...prev, ...state })),
      setCurrentSessionStartTime: (timestamp) => set({ currentSessionStartTime: timestamp }),
      
      // Study sessions
      sessions: [],
      addSession: (session) => 
        set((state) => ({
          sessions: [...state.sessions, session]
        })),
      
      // Study statistics
      stats: {
        daily: {},
        weekly: {},
        total: 0,
        streak: 0,
      },
      updateStats: (session) => {
        const state = get();
        const today = new Date().toDateString();
        const weekStart = getWeekStart(new Date()).toDateString();
        
        const newDaily = { ...state.stats.daily };
        const newWeekly = { ...state.stats.weekly };
        
        newDaily[today] = (newDaily[today] || 0) + session.duration;
        newWeekly[weekStart] = (newWeekly[weekStart] || 0) + session.duration;
        
        set({
          stats: {
            daily: newDaily,
            weekly: newWeekly,
            total: state.stats.total + session.duration,
            streak: calculateStreak(state.stats.daily, today),
          }
        });
      },
      
      // Music
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'wayv-study-companion',
      partialize: (state) => ({
        preferences: state.preferences,
        sessions: state.sessions,
        stats: state.stats,
        currentMemberId: state.currentMemberId,
        isTimerRunning: state.isTimerRunning,
        timeLeft: state.timeLeft,
        isBreakTime: state.isBreakTime,
        studyDuration: state.studyDuration,
        breakDuration: state.breakDuration,
        timerMemberId: state.timerMemberId,
        currentSessionStartTime: state.currentSessionStartTime,
      }),
    }
  )
);

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function calculateStreak(daily: Record<string, number>, today: string): number {
  const dates = Object.keys(daily).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const todayDate = new Date(today);
  
  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const diffDays = Math.floor((todayDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}