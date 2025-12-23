// 音乐播放列表配置文件
// 开发者可以在这里自由配置今日推荐歌单的曲库

export interface SongConfig {
  title: string;
  artist: string;
  album?: string;
}

export interface MusicPlaylistConfig {
  songs: SongConfig[];
  dailyRecommendationCount: number;
  enableRandomSelection: boolean;
}

// 默认WayV歌曲播放列表 - 开发者可以自由修改这个列表
export const defaultMusicPlaylist: MusicPlaylistConfig = {
  songs: [
    { title: "Kick Back", artist: "WayV" },
    { title: "Love Talk", artist: "WayV" },
    { title: "Turn Back Time", artist: "WayV" },
    { title: "Phantom", artist: "WayV" },
    { title: "Nectar", artist: "WayV" },
    { title: "Take Off", artist: "WayV" },
    { title: "Regular", artist: "WayV" },
    { title: "Come Back", artist: "WayV" },
    { title: "Action Figure", artist: "WayV" },
    { title: "Bad Alive", artist: "WayV" },
    { title: "Unbreakable", artist: "WayV" },
    { title: "After Midnight", artist: "WayV" },
    { title: "Miracle", artist: "WayV" },
    { title: "Go Higher", artist: "WayV" },
    { title: "Deep Ocean", artist: "WayV" },
    { title: "Moonwalk", artist: "WayV" },
    { title: "Your Song", artist: "WayV" },
    { title: "King of Hearts", artist: "WayV" },
    { title: "Face to Face", artist: "WayV" },
    { title: "Say It", artist: "WayV" }
  ],
  dailyRecommendationCount: 5,
  enableRandomSelection: true
};

// 从本地存储加载保存的音乐配置
export function loadSavedMusicConfig(): MusicPlaylistConfig {
  try {
    const saved = localStorage.getItem('wayvMusicPlaylistConfig');
    if (saved) {
      const savedConfig = JSON.parse(saved);
      return { ...defaultMusicPlaylist, ...savedConfig };
    }
  } catch (error) {
    console.error('加载保存的音乐配置失败:', error);
  }
  return { ...defaultMusicPlaylist };
}

// 获取完整的歌曲列表（用于显示和选择）
export function getSongLibrary(): string[] {
  const config = loadSavedMusicConfig();
  return config.songs.map(song => `${song.title} - ${song.artist}`);
}

// 获取每日推荐歌曲
export function getDailyRecommendations(): string[] {
  const config = loadSavedMusicConfig();
  const songLibrary = getSongLibrary();
  
  // 基于日期生成种子，确保每天推荐相同
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 洗牌算法
  const shuffled = [...songLibrary].sort((a, b) => {
    const aScore = (seed + a.charCodeAt(0)) % 100;
    const bScore = (seed + b.charCodeAt(0)) % 100;
    return aScore - bScore;
  });
  
  return shuffled.slice(0, config.dailyRecommendationCount);
}

// 更新音乐播放列表配置
export function updateMusicPlaylistConfig(newConfig: Partial<MusicPlaylistConfig>): void {
  try {
    const currentConfig = loadSavedMusicConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    localStorage.setItem('wayvMusicPlaylistConfig', JSON.stringify(updatedConfig));
  } catch (error) {
    console.error('保存音乐配置失败:', error);
    throw error;
  }
}

// 重置为默认配置
export function resetMusicPlaylistToDefault(): void {
  localStorage.removeItem('wayvMusicPlaylistConfig');
}

// 添加新歌曲到播放列表
export function addSongToPlaylist(song: SongConfig): void {
  const config = loadSavedMusicConfig();
  config.songs.push(song);
  updateMusicPlaylistConfig({ songs: config.songs });
}

// 从播放列表移除歌曲
export function removeSongFromPlaylist(songTitle: string, artist: string): void {
  const config = loadSavedMusicConfig();
  config.songs = config.songs.filter(song => 
    !(song.title === songTitle && song.artist === artist)
  );
  updateMusicPlaylistConfig({ songs: config.songs });
}