import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { wayvMembers } from '../data/members';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingTimer() {
  const { 
    isTimerRunning, 
    timeLeft, 
    isBreakTime, 
    timerMemberId, 
    setTimerState 
  } = useAppStore();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Determine if we should show the floating timer
  // Show if:
  // 1. Timer is running OR (timeLeft > 0 and it's not the default state)
  // 2. We are NOT on the study page of the active member
  useEffect(() => {
    const isStudyPage = location.pathname.startsWith('/study/');
    const currentPathMemberId = isStudyPage ? location.pathname.split('/').pop() : null;
    
    // If we are on the study page of the member who owns the timer, hide the floating timer
    if (timerMemberId && currentPathMemberId === timerMemberId) {
      setIsVisible(false);
    } else {
      // Otherwise show it if timer is active/running
      setIsVisible(isTimerRunning || (timeLeft > 0 && timeLeft < 25 * 60)); // Simple check, refine as needed
    }
  }, [location, timerMemberId, isTimerRunning, timeLeft]);

  const member = wayvMembers.find(m => m.id === timerMemberId);

  if (!member || !isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().length === 1 ? '0' + mins : mins}:${secs.toString().length === 1 ? '0' + secs : secs}`;
  };

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimerState({ isTimerRunning: !isTimerRunning });
  };

  const closeTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Check if timer is running and ask for confirmation
    if (isTimerRunning) {
      const ok = window.confirm('关闭悬浮窗将停止当前的专注计时，确定要停止吗？');
      if (!ok) return;
      setTimerState({ isTimerRunning: false, timeLeft: 25 * 60, isBreakTime: false, timerMemberId: null });
    } else {
      // If paused or just showing, just close/reset
      setTimerState({ isTimerRunning: false, timerMemberId: null });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if we are NOT dragging
    if (!isDragging && timerMemberId) {
      navigate(`/study/${timerMemberId}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 100)} // Small delay to prevent click firing immediately after drag
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-24 right-6 z-50 cursor-move"
          onClick={handleClick}
        >
          <div className="bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center space-x-4 min-w-[200px] relative group">
            {/* Close Button - appears on hover */}
            <button 
              onMouseDown={closeTimer}
              onClick={closeTimer}
              className="absolute -top-2 -left-2 bg-slate-700 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
            >
              <X size={14} />
            </button>

            <div className="relative">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20" 
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            </div>
            
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-1">
                {isBreakTime ? '休息中' : '专注中'} · {member.name}
              </div>
              <div className={`text-xl font-mono font-bold ${isBreakTime ? 'text-blue-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <button 
              onClick={toggleTimer}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
