import { useState, useEffect } from 'react';
import { WayVMember, MusicTrack } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { getDailyRecommendations } from '../data/music';
import { toast } from 'sonner';

interface MusicPlayerProps {
  member: WayVMember;
}

export default function MusicPlayer({ member }: MusicPlayerProps) {
  const { currentTrack, isPlaying, volume, setCurrentTrack, setIsPlaying, setVolume } = useAppStore();
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const dailyRecs = getDailyRecommendations();
    setRecommendations(dailyRecs);
    if (dailyRecs.length > 0 && !currentTrack) {
      setCurrentTrack(dailyRecs[0]);
    }
  }, []);

  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? '音乐已暂停' : '开始播放音乐', {
      icon: isPlaying ? '⏸️' : '▶️',
      duration: 2000,
    });
  };

  const handleNext = () => {
    if (recommendations.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % recommendations.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(recommendations[nextIndex]);
    
    toast.success(`下一首: ${recommendations[nextIndex].title}`, {
      icon: '⏭️',
      duration: 2000,
    });
  };

  const handlePrevious = () => {
    if (recommendations.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? recommendations.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(recommendations[prevIndex]);
    
    toast.success(`上一首: ${recommendations[prevIndex].title}`, {
      icon: '⏮️',
      duration: 2000,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().length === 1 ? '0' + secs : secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Current Playing */}
      {currentTrack && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Album Cover */}
            <div className="relative group">
              <img
                src={currentTrack.albumCover}
                alt={currentTrack.album}
                className="w-48 h-48 rounded-2xl shadow-2xl object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br from-${member.color}/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>

            {/* Track Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                {currentTrack.title}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-1">
                {currentTrack.artist}
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
                {currentTrack.album}
              </p>

              {/* Player Controls */}
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                <button
                  onClick={handlePrevious}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110"
                >
                  <SkipBack className="w-6 h-6 text-slate-700 dark:text-white" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className={`p-4 rounded-full bg-gradient-to-r from-${member.color} to-${member.color}-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </button>
                
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110"
                >
                  <SkipForward className="w-6 h-6 text-slate-700 dark:text-white" />
                </button>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-300">
                <span>0:00</span>
                <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full">
                  <div className={`h-full bg-${member.color} rounded-full`} style={{ width: '35%' }} />
                </div>
                <span>{formatDuration(currentTrack.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Recommendations */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            今日推荐
          </h3>
          <div className={`text-sm text-${member.color} font-medium`}>
            {member.name} 为你精选
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((track, index) => (
            <div
              key={track.id}
              className={`bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentTrack?.id === track.id ? `ring-2 ring-${member.color}` : ''
              }`}
              onClick={() => {
                setCurrentTrack(track);
                setCurrentIndex(index);
                toast.success(`正在播放: ${track.title}`, {
                  icon: '🎵',
                  duration: 2000,
                });
              }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={track.albumCover}
                  alt={track.album}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 dark:text-white truncate">
                    {track.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                    {track.artist}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(track.duration)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`已收藏 ${track.title}`, {
                      icon: '❤️',
                      duration: 2000,
                    });
                  }}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}