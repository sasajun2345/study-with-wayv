import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { wayvMembers } from '../data/members';
import { useState } from 'react';
import { Heart, Settings, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MemberSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { preferences, setPreferences, setCurrentMemberId } = useAppStore();
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const handleMemberSelect = (memberId: string) => {
    setCurrentMemberId(memberId);
    setPreferences({ selectedMemberId: memberId });
    navigate(`/study/${memberId}`);
  };

  const toggleTheme = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 animate-slide-up">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-wayv-green animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-wayv-green to-wayv-green-dark bg-clip-text text-transparent">
            Study With WayV
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-wayv-green/10">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">
          {t('select_member_title')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg">
          {t('welcome_subtitle')}
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {wayvMembers.map((member, index) => (
          <div
            key={member.id}
            className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 animate-slide-up ${
              hoveredMember === member.id ? 'animate-glow' : ''
            }`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            onClick={() => handleMemberSelect(member.id)}
            onMouseEnter={() => setHoveredMember(member.id)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-${member.color}/30 hover:border-${member.color}/60`}>
              {/* Member Avatar */}
              <div className="relative mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white/30 shadow-lg"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className={`bg-${member.color} text-white px-3 py-1 rounded-full text-sm font-medium shadow-md`}>
                    {member.nameEn}
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t(`member_${member.id}`)}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">{t(`member_personality_${member.id}`)}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {member.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: `linear-gradient(135deg, color-mix(in oklab, var(--${member.color}) 10%, transparent), color-mix(in oklab, var(--${member.color}) 5%, transparent))` }}>
                <div className="text-white font-semibold text-lg">
                  {t('start_study')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-slate-400">
        <p>{t('footer_copyright')}</p>
      </footer>
    </div>
  );
}
