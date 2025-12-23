import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { WayVMember, StudySession } from '../types';
import { Play, Pause, RotateCcw, Bell, Volume2, VolumeX, Settings, X } from 'lucide-react';
import { toast } from 'sonner';
import { playNotificationSound, playBreakSound, requestNotificationPermission, sendNotification } from '../utils/audio';
import { createParticles } from '../hooks/useAnimations';
import { useTranslation } from 'react-i18next';
import RewardModal from './RewardModal';
import { getRandomReward } from '../config/rewards';

interface TimerProps {
  member: WayVMember;
}

export default function Timer({ member }: TimerProps) {
  const { t } = useTranslation();
  const {
    preferences,
    setPreferences,
    isTimerRunning,
    timeLeft,
    isBreakTime,
    studyDuration,
    breakDuration,
    timerMemberId,
    setTimerState,
    currentSessionStartTime,
    setCurrentSessionStartTime,
    addSession,
    updateStats,
  } = useAppStore();

  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isBreakCompleted, setIsBreakCompleted] = useState(false);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [tempStudyDuration, setTempStudyDuration] = useState(25);
  const [tempBreakDuration, setTempBreakDuration] = useState(5);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<any>(null);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Use durations from store
  const POMODORO_DURATION = studyDuration * 60; 
  const BREAK_DURATION = breakDuration * 60; 

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission().then(setNotificationPermission);

    // Set initial timer state on first mount if not running
    if (!isTimerRunning && timeLeft === 0) {
      setTimerState({
        timeLeft: POMODORO_DURATION,
        isTimerRunning: false,
        isBreakTime: false,
        studyDuration: studyDuration,
        breakDuration: breakDuration,
        timerMemberId: member.id,
      });
    }

    // Listen for reset timer event
    const handleResetTimer = () => {
      // Logic handled in store or TimerManager mostly, but we can reset UI state if needed
      setCurrentSessionStartTime(null);
      setIsBreakCompleted(false);
      setTimerState({
        isTimerRunning: false,
        timeLeft: isBreakTime ? BREAK_DURATION : POMODORO_DURATION,
        isBreakTime: false,
        timerMemberId: member.id,
      });
    };

    window.addEventListener('resetTimer', handleResetTimer);
    
    return () => {
      window.removeEventListener('resetTimer', handleResetTimer);
    };
  }, [studyDuration, breakDuration, member.id]); 

  // Removed local interval logic - handled by TimerManager

  // Listen for reward event from TimerManager
  useEffect(() => {
    const handleReward = (e: CustomEvent) => {
      if (e.detail.memberId === member.id) {
        const newReward = getRandomReward(member.id);
        if (newReward) {
          setReward(newReward);
          setShowReward(true);
        }
        
        // Create particles
        const timerElement = document.querySelector('.timer-display');
        if (timerElement) {
          createParticles(timerElement as HTMLElement, member.color.replace('member-', ''));
        }
      }
    };

    window.addEventListener('timerCompleted' as any, handleReward as any);
    return () => {
      window.removeEventListener('timerCompleted' as any, handleReward as any);
    };
  }, [member.id, member.color]);

  const toggleTimer = () => {
    if (!isTimerRunning) {
      // If we are starting the timer, ensure we mark it as active for this member
      // This handles the case where we switch back from another page
      setTimerState({ 
        isTimerRunning: true,
        timerMemberId: member.id 
      });
      
      if (!isBreakTime) { // Only set start time for study sessions
        startTimeRef.current = new Date();
        setCurrentSessionStartTime(Date.now());
      }
    } else {
      setTimerState({ isTimerRunning: false });
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setCurrentSessionStartTime(null);
    setIsBreakCompleted(false);
    setTimerState({
      isTimerRunning: false,
      timeLeft: isBreakTime ? BREAK_DURATION : POMODORO_DURATION,
      isBreakTime: false,
      timerMemberId: member.id,
    });
  };

  const saveCustomSettings = () => {
    setTimerState({
      studyDuration: tempStudyDuration,
      breakDuration: tempBreakDuration,
      timeLeft: tempStudyDuration * 60,
      isTimerRunning: false,
      isBreakTime: false,
    });
    setShowCustomSettings(false);
    toast.success(t('custom_timer') + ' ' + t('saved'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().length === 1 ? '0' + mins : mins}:${secs.toString().length === 1 ? '0' + secs : secs}`;
  };

  const progress = isBreakTime 
    ? ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100
    : ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="rounded-3xl">
        {/* Timer Display */}
        <div className="text-center mb-8 relative">
          
          {/* Custom Settings Button */}
          <button 
            onClick={() => {
              setTempStudyDuration(studyDuration);
              setTempBreakDuration(breakDuration);
              setShowCustomSettings(true);
            }}
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
            title={t('custom_timer') as string}
          >
            <Settings size={20} />
          </button>

          <div className="relative timer-display mt-8">
            {/* Break Time Indicator */}
            {isBreakTime && (
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full mb-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{t('timer_break')}</span>
                </div>
              </div>
            )}
            
            {/* Timer Type Indicator */}
            {!isBreakTime && (
              <div className="mb-4">
                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-${member.color} to-${member.color}-dark text-white px-4 py-2 rounded-full`}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{t('timer_focus')}</span>
                </div>
              </div>
            )}
            
            <div className={`text-6xl font-mono font-bold mb-4 text-glow drop-shadow-2xl ${
              isBreakTime ? 'text-blue-500' : `text-${member.color}`
            }`}>
              {formatTime(timeLeft)}
            </div>
            
            <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isBreakTime 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : `bg-gradient-to-r from-${member.color} to-${member.color}-dark`
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-lg text-white dark:text-white text-glow drop-shadow">
              {isBreakTime ? t('timer_break') : t('timer_focus')}
            </div>
          </div>
        </div>

        {/* Custom Settings Modal */}
        {showCustomSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-80 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{t('custom_timer')}</h3>
                <button onClick={() => setShowCustomSettings(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('focus_duration')}</label>
                  <input 
                    type="number" 
                    value={tempStudyDuration} 
                    onChange={(e) => setTempStudyDuration(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">{t('break_duration')}</label>
                  <input 
                    type="number" 
                    value={tempBreakDuration} 
                    onChange={(e) => setTempBreakDuration(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    min="1"
                  />
                </div>
                <button 
                  onClick={saveCustomSettings}
                  className={`w-full py-2 rounded-lg bg-gradient-to-r from-${member.color} to-${member.color}-dark text-white font-bold`}
                >
                  {t('start')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            disabled={isBreakTime && !isBreakCompleted && !isTimerRunning}
            className={`px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
              isBreakTime && !isBreakCompleted && !isTimerRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r from-${member.color} to-${member.color}-dark`
            }`}
          >
            {isTimerRunning ? (
              <div className="flex items-center space-x-2">
                <Pause className="w-5 h-5" />
                <span>{t('pause')}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>{t('start')}</span>
              </div>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="px-6 py-4 rounded-full font-semibold text-slate-700 dark:text-white bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>{t('reset')}</span>
            </div>
          </button>
        </div>

        {/* Sound Settings */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-display font-semibold text-white dark:text-white mb-4 text-glow">{t('settings_title')}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <button
                  onClick={() => setPreferences({ soundEnabled: !preferences.soundEnabled })}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {preferences.soundEnabled ? (
                    <Volume2 className={`w-4 h-4 text-${member.color}`} />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <span>{t('sound_alert')}</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <button
                  onClick={() => setPreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Bell className={`w-4 h-4 ${preferences.notificationsEnabled ? `text-${member.color}` : 'text-slate-400'}`} />
                </button>
                <span>{t('desktop_notification')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Member Message */}
        <div className="text-center">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className={`w-3 h-3 rounded-full bg-${member.color}`} />
              <span className="text-sm font-medium text-white dark:text-white text-glow">
                {t('study_with', { name: member.name })}
              </span>
            </div>
            <p className="text-white dark:text-white text-glow drop-shadow">
              {isBreakTime 
                ? isBreakCompleted 
                  ? t('continue_study')
                  : t('take_break')
                : isTimerRunning 
                  ? "Fighting!"
                  : t('start_study')
              }
            </p>
          </div>
        </div>
      </div>

      <RewardModal 
        isOpen={showReward} 
        onClose={() => setShowReward(false)} 
        reward={reward} 
        member={member} 
      />
    </div>
  );
}
