// 数据验证和归档工具

export interface DailyArchive {
  date: string;
  totalSeconds: number;
  sessions: number;
  members: Record<string, number>; // memberId -> seconds
  timestamp: number;
  isValid: boolean;
}

/**
 * 验证学习数据的数学准确性
 */
export function validateStudyData(
  dailyStats: Record<string, number>,
  sessions: Array<{ duration: number; memberId: string; startTime: Date }>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 按日期分组会话
  const sessionsByDate: Record<string, typeof sessions> = {};
  sessions.forEach(session => {
    const dateStr = new Date(session.startTime).toDateString();
    if (!sessionsByDate[dateStr]) {
      sessionsByDate[dateStr] = [];
    }
    sessionsByDate[dateStr].push(session);
  });

  // 验证每日数据
  Object.keys(dailyStats).forEach(dateStr => {
    const recordedSeconds = dailyStats[dateStr];
    const actualSessions = sessionsByDate[dateStr] || [];
    const actualSeconds = actualSessions.reduce((sum, session) => sum + session.duration, 0);
    
    // 允许1秒的误差（四舍五入导致）
    if (Math.abs(recordedSeconds - actualSeconds) > 1) {
      errors.push(`${dateStr}: 记录时间 ${recordedSeconds}秒 与实际会话时间 ${actualSeconds}秒 不匹配`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 创建每日数据归档
 */
export function createDailyArchive(
  date: Date,
  dailyStats: Record<string, number>,
  sessions: Array<{ duration: number; memberId: string; startTime: Date }>
): DailyArchive {
  const dateStr = date.toDateString();
  const daySessions = sessions.filter(session => 
    new Date(session.startTime).toDateString() === dateStr
  );

  // 计算成员分布
  const memberDistribution: Record<string, number> = {};
  daySessions.forEach(session => {
    memberDistribution[session.memberId] = (memberDistribution[session.memberId] || 0) + session.duration;
  });

  const totalSeconds = dailyStats[dateStr] || 0;
  const validation = validateStudyData({ [dateStr]: totalSeconds }, daySessions);

  return {
    date: dateStr,
    totalSeconds,
    sessions: daySessions.length,
    members: memberDistribution,
    timestamp: Date.now(),
    isValid: validation.isValid
  };
}

/**
 * 归档历史数据
 */
export function archiveHistoricalData(
  stats: { daily: Record<string, number>; weekly: Record<string, number> },
  sessions: Array<{ duration: number; memberId: string; startTime: Date }>
): DailyArchive[] {
  const archives: DailyArchive[] = [];
  const today = new Date();
  
  // 归档最近30天的数据
  for (let i = 0; i < 30; i++) {
    const archiveDate = new Date(today);
    archiveDate.setDate(archiveDate.getDate() - i);
    
    const dateStr = archiveDate.toDateString();
    if (stats.daily[dateStr] !== undefined) {
      const archive = createDailyArchive(archiveDate, stats.daily, sessions);
      archives.push(archive);
    }
  }

  return archives;
}

/**
 * 保存归档到本地存储
 */
export function saveDailyArchive(archive: DailyArchive): void {
  try {
    const key = `wayv_daily_archive_${archive.date}`;
    localStorage.setItem(key, JSON.stringify(archive));
  } catch (error) {
    console.error('保存每日归档失败:', error);
  }
}

/**
 * 从本地存储加载归档
 */
export function loadDailyArchive(date: string): DailyArchive | null {
  try {
    const key = `wayv_daily_archive_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('加载每日归档失败:', error);
    return null;
  }
}

/**
 * 清理过期归档（保留最近90天）
 */
export function cleanupOldArchives(): void {
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - 90);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('wayv_daily_archive_')) {
      const archiveDate = key.replace('wayv_daily_archive_', '');
      const archiveDateObj = new Date(archiveDate);
      
      if (archiveDateObj < cutoffDate) {
        localStorage.removeItem(key);
      }
    }
  }
}

/**
 * 获取所有归档数据摘要
 */
export function getArchiveSummary(): Array<{ date: string; totalHours: number; sessions: number; isValid: boolean }> {
  const archives: Array<{ date: string; totalHours: number; sessions: number; isValid: boolean }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('wayv_daily_archive_')) {
      const archive = loadDailyArchive(key.replace('wayv_daily_archive_', ''));
      if (archive) {
        archives.push({
          date: archive.date,
          totalHours: Math.round(archive.totalSeconds / 3600 * 10) / 10,
          sessions: archive.sessions,
          isValid: archive.isValid
        });
      }
    }
  }
  
  return archives.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}