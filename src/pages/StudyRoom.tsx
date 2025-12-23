import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { wayvMembers } from '../data/members';
import Timer from '../components/Timer';
import SimpleMusicRecommendation from '../components/SimpleMusicRecommendation';
import StudyStats from '../components/StudyStats';
import { ArrowLeft, Settings, Clock, BarChart3, Music } from 'lucide-react';
import GlassBackground from '../components/GlassBackground';
import LottieBadge from '../components/LottieBadge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function StudyRoom() {
  const { t } = useTranslation();
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { currentMemberId, preferences, setPreferences, setCurrentMemberId } = useAppStore();
  
  const member = wayvMembers.find(m => m.id === memberId);
  const [activeTab, setActiveTab] = useState<'timer' | 'stats' | 'music'>('timer');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!member) {
      toast.error('成员不存在');
      navigate('/');
      return;
    }

    // Only reset timer if the active timer member is different from current member
    if (currentMemberId !== memberId) {
      setCurrentMemberId(memberId || null);
      // We only reset if we are actually switching context to a new member
      // If we are just navigating back to the same member, we don't reset
      // However, if the previous timer was for another member, we should reset.
      // We can check timerMemberId from store, but we don't have it here.
      // Let's rely on the store's timerMemberId vs currentMemberId check in Timer component or TimerManager.
      
      // Actually, we should dispatch reset ONLY if we want to force a reset.
      // If we want to persist, we shouldn't dispatch reset here unless necessary.
      // But `currentMemberId` in store is updated. 
      // Let's modify this to NOT dispatch reset automatically, but let the user or store handle it.
      // OR better: check if we are already running a timer for THIS member.
    }
    
    // We will let the Timer component decide whether to reset based on if it's a new session or continuation.
    // So we remove the automatic dispatch here, or make it conditional.
    // But to be safe and fix the user issue "time reset when returning", we should NOT reset if it's the same member.
    // Since we set `setCurrentMemberId` above, let's look at `currentMemberId` BEFORE setting it?
    // React state updates are batched/async, but here we are using the value from the hook.
    
    // Better approach:
    // If the global timer is running for THIS member, don't reset.
    // If the global timer is running for ANOTHER member, maybe reset? Or let the user decide?
    // The user said: "If I switch ... to another character ... floating window shows ... But if I click start in another character ... time recalculates."
    // This implies that just *visiting* another character page shouldn't necessarily kill the previous timer unless they start a new one.
    // However, the current logic in Timer.tsx (which I just refactored) handles initialization.
    
    // Let's remove the explicit reset event here and let Timer/TimerManager handle state.
    if (currentMemberId !== memberId) {
      setCurrentMemberId(memberId || null);
    }

    // Check if the running timer belongs to another member
    // If so, we should reset it because the user switched context to a new member
    const { timerMemberId, isTimerRunning, setTimerState } = useAppStore.getState();
    if (isTimerRunning && timerMemberId && timerMemberId !== memberId) {
      // Stop the previous timer and reset for the new member
      setTimerState({
        isTimerRunning: false,
        timeLeft: 25 * 60, // Reset to default or store preference? 
                           // Ideally use studyDuration from store, but here we just stop it.
                           // Timer component will initialize with correct duration on mount.
        isBreakTime: false,
        timerMemberId: memberId // Set new member as timer owner
      });
      // Also dispatch reset event to be safe for UI updates
      window.dispatchEvent(new CustomEvent('resetTimer'));
    }

    toast.success(`欢迎 ${member.name} 陪伴你学习！`, {
      icon: '🎉',
      duration: 3000,
    });
  }, [member, memberId]); // Remove currentMemberId and navigate from dependencies to prevent unnecessary re-renders

  if (!member) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${member.color}/20 to-${member.color}/10 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden`}>
      <GlassBackground />
      {/* Header */}
      <header className="flex justify-between items-center p-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-white" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xl"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white text-glow">
                {t(`member_${member.id}`)}
              </h1>
              <p className="text-base md:text-lg text-slate-900 dark:text-white text-glow drop-shadow">
                {t(`member_personality_${member.id}`)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <LottieBadge />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
          {[
            { key: 'timer', label: t('timer_focus'), icon: Clock },
            { key: 'stats', label: t('study_stats'), icon: BarChart3 },
            { key: 'music', label: t('music_recommendation'), icon: Music },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-7 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === key
                  ? `bg-${member.color} text-white shadow-xl drop-shadow-lg`
                  : 'text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white text-glow'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-lg">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        {activeTab === 'timer' && (
          <div className="glass-card rounded-3xl shadow-2xl p-10">
            <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-6 text-glow">{t('study_with', { name: member.name })}</h3>
            <Timer member={member} />
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="glass-card rounded-3xl shadow-2xl p-10 mt-10">
            <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-6 text-glow">{t('study_stats')}</h3>
            <StudyStats />
          </div>
        )}
        {activeTab === 'music' && (
          <div className="glass-card rounded-3xl shadow-2xl p-10 mt-10">
            <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-6 text-glow">{t('music_recommendation_title', { name: member.name })}</h3>
            <SimpleMusicRecommendation member={member} />
          </div>
        )}
      </div>

    </div>
  );
}
