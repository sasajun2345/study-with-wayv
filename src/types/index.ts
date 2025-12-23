export interface WayVMember {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  avatar: string;
  banner: string;
  description: string;
  personality: string;
}

export interface StudySession {
  id: string;
  memberId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: 'pomodoro';
}

export interface StudyStats {
  daily: {
    [date: string]: number;
  };
  weekly: {
    [week: string]: number;
  };
  total: number;
  streak: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  lyrics?: string;
  duration: number;
  memberId: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  selectedMemberId: string | null;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}