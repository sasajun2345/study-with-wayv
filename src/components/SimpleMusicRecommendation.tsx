import { useState, useEffect } from 'react';
import { WayVMember } from '../types';
import { Music } from 'lucide-react';
import { getDailyRecommendations, getSongLibrary } from '../config/musicPlaylist';

interface SimpleMusicRecommendationProps {
  member: WayVMember;
}

export default function SimpleMusicRecommendation({ member }: SimpleMusicRecommendationProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<string>('');

  useEffect(() => {
    // Get daily recommendations from configuration
    const dailyRecommendations = getDailyRecommendations();
    setRecommendations(dailyRecommendations);
    setCurrentSong(dailyRecommendations[0] || '');
  }, []);

  const getRandomSong = () => {
    const songLibrary = getSongLibrary();
    const randomIndex = Math.floor(Math.random() * songLibrary.length);
    const newSong = songLibrary[randomIndex];
    setCurrentSong(newSong);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Current Song Display */}
      <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br from-${member.color} to-${member.color}-dark rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <Music className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-display font-semibold text-white dark:text-white mb-4 text-glow">
            {member.name} 为你推荐
          </h2>
          
          <div className="glass-card rounded-2xl p-6 mb-6">
            <p className="text-lg font-semibold text-white dark:text-white mb-2 text-glow">
              正在播放
            </p>
            <p className={`text-xl font-bold text-white dark:text-white text-glow drop-shadow`}>
              {currentSong}
            </p>
          </div>
          
          <button
            onClick={getRandomSong}
            className={`px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-${member.color} to-${member.color}-dark hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            换一首歌
          </button>
        </div>
      </div>

      {/* Daily Recommendations */}
      <div className="glass-card rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify_between mb-6">
          <h3 className="text-2xl font-display font-semibold text-white dark:text-white text-glow">
            今日推荐歌单
          </h3>
          <div className={`text-sm text-${member.color} font-medium`}>
            {member.name} 精选
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((song, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                currentSong === song ? `ring-2 ring-${member.color}` : ''
              }`}
              onClick={() => setCurrentSong(song)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${member.color}/20 to-${member.color}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Music className={`w-6 h-6 text-${member.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white dark:text-white truncate text-glow">
                    {song.split(' - ')[0]}
                  </h4>
                  <p className="text-sm text-slate-200 dark:text-slate-300 truncate">
                    {song.split(' - ')[1] || 'WayV'}
                  </p>
                </div>
                {currentSong === song && (
                  <div className={`w-2 h-2 rounded-full bg-${member.color} animate-pulse`} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Member Message */}
        <div className="mt-8 text-center">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className={`w-3 h-3 rounded-full bg-${member.color}`} />
              <span className="text-sm font-medium text-white dark:text-white text-glow">
                {member.name} 对你说
              </span>
            </div>
            <p className="text-white dark:text-white text-glow drop-shadow">
              {currentSong.includes('Love Talk') 
                ? "这首歌很适合学习时听哦~"
                : currentSong.includes('Kick Back') 
                ? "节奏感很强，让你保持专注！"
                : currentSong.includes('Phantom') 
                ? "神秘的氛围，激发你的灵感~"
                : "希望这首歌能陪伴你度过美好的学习时光！"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
