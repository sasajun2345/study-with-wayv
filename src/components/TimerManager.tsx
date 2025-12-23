import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { StudySession } from '../types';
import { toast } from 'sonner';
import { playNotificationSound, playBreakSound, sendNotification } from '../utils/audio';
import { getRandomReward } from '../config/rewards';
import { wayvMembers } from '../data/members';
import { useTranslation } from 'react-i18next';

export default function TimerManager() {
  const { t } = useTranslation();
  const {
    isTimerRunning,
    timeLeft,
    isBreakTime,
    timerMemberId,
    setTimerState,
    addSession,
    updateStats,
    preferences,
    studyDuration,
    breakDuration
  } = useAppStore();

  const intervalRef = useRef<number | null>(null);

  // Helper to handle completion (moved from Timer.tsx)
  const handleTimerComplete = () => {
    const member = wayvMembers.find(m => m.id === timerMemberId);
    if (!member) return;

    if (!isBreakTime) {
      // Study session completed
      const session: StudySession = {
        id: Date.now().toString(),
        memberId: member.id,
        startTime: new Date(Date.now() - studyDuration * 60 * 1000), // Approximate start time
        endTime: new Date(),
        duration: studyDuration * 60,
        type: 'pomodoro',
      };

      addSession(session);
      updateStats(session);

      // Trigger Reward (We might need to move reward state to global or handle it via events/toast)
      // For now, we will rely on the Timer component to listen to state changes or use a global event
      // But wait, Timer component might be unmounted.
      // So we should dispatch a global event or set a "pending reward" in store?
      // Let's use a CustomEvent for the RewardModal if it's mounted, or just Toast if not.
      
      // Dispatch event for RewardModal (if mounted anywhere)
      window.dispatchEvent(new CustomEvent('timerCompleted', { detail: { memberId: member.id } }));

      // Play notification sound
      if (preferences.soundEnabled) {
        playNotificationSound();
      }

      // Send browser notification
      if (preferences.notificationsEnabled) {
        sendNotification(
          t('focus_completed'),
          t('take_break'),
          member.avatar
        );
      }

      toast.success(t('take_break'), {
        icon: '🎉',
        duration: 5000,
      });

      // Start break time
      setTimerState({
        isTimerRunning: true, // Auto-start break? Or pause? Usually auto-start or pause. 
                              // User requirement: "time reset" implies maybe stop? 
                              // But usually Pomodoro auto-transitions or waits.
                              // Let's auto-start break as per previous logic
        timeLeft: breakDuration * 60,
        isBreakTime: true,
      });
    } else {
      // Break time completed
      
      // Play break sound
      if (preferences.soundEnabled) {
        playBreakSound();
      }

      // Send browser notification
      if (preferences.notificationsEnabled) {
        sendNotification(
          t('break_completed'),
          t('continue_study'),
          member.avatar
        );
      }

      toast.success(t('continue_study'), {
        icon: '💪',
        duration: 5000,
      });

      // Reset for next study session (Pause at start of focus)
      setTimerState({
        isTimerRunning: false,
        timeLeft: studyDuration * 60,
        isBreakTime: false,
      });
    }
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimerState({ timeLeft: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, timeLeft, studyDuration, breakDuration, isBreakTime, timerMemberId]); // Dependencies for effect

  return null; // This component does not render anything
}
