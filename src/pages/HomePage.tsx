import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { wayvMembers } from '../data/members';
import BackgroundSettings from '../components/BackgroundSettings';
import TimerSettings from '../components/TimerSettings';
import { Heart, Settings, User, Languages } from 'lucide-react';
import { toast } from 'sonner';
import GlassBackground from '../components/GlassBackground';
import LottieBadge from '../components/LottieBadge';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    preferences, 
    setPreferences, 
    currentMemberId, 
    setCurrentMemberId 
  } = useAppStore();
  
  const [selectedMember, setSelectedMember] = useState<string | null>(currentMemberId);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [titleDisplay, setTitleDisplay] = useState('');

  const currentMember = selectedMember ? wayvMembers.find(m => m.id === selectedMember) : null;



  const selectMember = (memberId: string) => {
    // Reset timer when switching members
    window.dispatchEvent(new Event('resetTimer'));
    
    setSelectedMember(memberId);
    setCurrentMemberId(memberId);
    setShowMemberSelector(false);
    toast.success(`已选择 ${wayvMembers.find(m => m.id === memberId)?.name} 陪伴你学习！`, {
      icon: '🎉',
      duration: 3000,
    });
    navigate(`/study/${memberId}`);
  };

  



  useEffect(() => {
    // Load saved background settings
    const savedBgSettings = localStorage.getItem('wayvBackgroundSettings');
    if (savedBgSettings) {
      const settings = JSON.parse(savedBgSettings);
      if (settings.blur) {
        document.documentElement.style.setProperty('--bg-blur', `${settings.blur}px`);
      }
      if (settings.image) {
        document.documentElement.style.setProperty('--bg-image', `url(${settings.image})`);
      }
    }
  }, []);

  useEffect(() => {
    const full = 'Study With WayV';
    let index = full.length;
    let deleting = true;
    let timeoutId: number | undefined;

    const step = () => {
      if (deleting) {
        index = Math.max(0, index - 1);
        setTitleDisplay(full.slice(0, index));
        if (index === 0) {
          deleting = false;
          timeoutId = window.setTimeout(step, 600);
          return;
        }
        timeoutId = window.setTimeout(step, 60);
      } else {
        index = Math.min(full.length, index + 1);
        setTitleDisplay(full.slice(0, index));
        if (index === full.length) {
          deleting = true;
          timeoutId = window.setTimeout(step, 1200);
          return;
        }
        timeoutId = window.setTimeout(step, 100);
      }
    };

    step();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'var(--bg-image, none)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(var(--bg-blur, 0px))',
          opacity: 'var(--bg-opacity, 0.1)',
        }}
      />
      <GlassBackground />
      {/* Content Layer */}
      <div className="relative z-10">
      {/* Header */}
      <header className="flex justify-between items-center p-6 animate-slide-up">
        <div className="relative flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 24 24" className="w-8 h-8 animate-pulse">
            <defs>
              <linearGradient id="heartGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00FF87" />
              </linearGradient>
            </defs>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="none" stroke="url(#heartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[52vw] h-16 bg-white/10 blur-xl rounded-2xl -z-10" />
          <h1 className="text-5xl md:text-6xl font-bold font-display tracking-wide bg-gradient-to-r from-white to-wayv-green-dark bg-clip-text text-transparent drop-shadow-2xl text-glow-strong mega-drop-shadow">
            {titleDisplay}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <LottieBadge />
          </div>
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
            className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-wayv-green/10"
            title={t('language') as string}
          >
            <Languages className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-wayv-green/10"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-4 text-glow drop-shadow-xl">
          {t('welcome_title')}
        </h2>
        <p className="text-slate-300 text-xl md:text-2xl text-glow drop-shadow-lg">
          {t('welcome_subtitle')}
        </p>
      </div>

      {/* Member Selection */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white text-glow drop-shadow-lg">{t('select_member_title')}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10 animate-slide-up">
          {wayvMembers.map((member, index) => (
              <div
                key={member.id}
                className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedMember === member.id 
                    ? `border-${member.color} shadow-${member.color}/20` 
                    : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                } animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => selectMember(member.id)}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  const x = e.clientX - r.left;
                  const y = e.clientY - r.top;
                  const rx = -(y / r.height - 0.5) * 6;
                  const ry = (x / r.width - 0.5) * 6;
                  el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(600px) scale(1)';
                }}
              >
                <div className="text-center">
                  <div className={`w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-${member.color} shadow-xl`}>
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center hidden" style={{ background: `linear-gradient(135deg, var(--${member.color}) 0%, var(--${member.color}-dark) 100%)` }}>
                      <span className="text-2xl font-bold text-white">{member.nameEn[0]}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-2 text-lg">{t(`member_${member.id}`)}</h4>
                  <p className="text-sm text-slate-400">{t(`member_personality_${member.id}`)}</p>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Main Content Area: 首页仅作为选择入口，不展示专注/统计/音乐面板 */}

      {/* 作者的话 */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="glass-card rounded-3xl shadow-2xl p-10">
          <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-6 text-glow drop-shadow-lg">{t('author_note_title')}</h3>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xl text-glow drop-shadow">
            {t('author_note_content')}
          </p>
          <div className="mt-6 text-right text-slate-700 dark:text-slate-300 font-semibold text-lg text-glow drop-shadow">—— 洒洒菌</div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="max-w-4xl mx-auto px-6 mt-10">
        <div className="glass-card rounded-3xl shadow-2xl p-10">
          <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-4 text-glow drop-shadow-lg">{t('donate_title')}</h3>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-lg text-glow drop-shadow mb-6">
            {t('donate_content')}
          </p>
          <div className="flex items-center justify-center">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-xl">
              <img 
                src="images/Wechat.jpg" 
                alt="Wechat QR" 
                className="w-56 h-56 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-20 pb-10 text-slate-400">
        <p className="text-base md:text-lg">{t('footer_copyright')}</p>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{t('settings_title')}</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Background Settings */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">背景设置</h4>
                <BackgroundSettings />
              </div>
              
              {/* Timer Settings */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">计时器设置</h4>
                <TimerSettings />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
