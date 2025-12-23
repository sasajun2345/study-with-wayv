import { useAppStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { wayvMembers } from '../data/members';
import { validateStudyData, createDailyArchive, saveDailyArchive, getArchiveSummary } from '../utils/dataValidation';

export default function StudyStats() {
  const { stats, sessions } = useAppStore();
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [archiveSummary, setArchiveSummary] = useState<any[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    // Validate study data
    const validation = validateStudyData(stats.daily, sessions);
    setValidationResult(validation);

    // Create daily archive for today if there is data
    const today = new Date();
    const todayStr = today.toDateString();
    if (stats.daily[todayStr] && stats.daily[todayStr] > 0) {
      const todayArchive = createDailyArchive(today, stats.daily, sessions);
      saveDailyArchive(todayArchive);
    }

    // Load archive summary
    const archives = getArchiveSummary();
    setArchiveSummary(archives.slice(0, 7)); // Show last 7 days

    // Prepare daily data for the last 7 days
    const last7Days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const seconds = stats.daily[dateStr] || 0;
      const hoursVal = Math.round((seconds / 3600) * 10) / 10;
      last7Days.push({
        name: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
        hours: hoursVal,
        fullDate: dateStr,
      });
    }
    setDailyData(last7Days);

    // Prepare weekly data for the last 4 weeks
    const last4Weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekStr = weekStart.toDateString();
      const seconds = stats.weekly[weekStr] || 0;
      const hours = seconds / 3600; // Convert seconds to hours
      
      last4Weeks.push({
        name: `第${4-i}周`,
        hours: Math.round(hours * 10) / 10,
        weekStart: weekStr,
      });
    }
    setWeeklyData(last4Weeks);
  }, [stats, sessions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${remainingMinutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const totalHours = Math.round((stats.total / 3600) * 10) / 10;
  const nonZeroDays = Object.keys(stats.daily).filter((d) => (stats.daily[d] || 0) > 0).length;
  const avgDaily = nonZeroDays > 0 ? Math.round(((stats.total / 3600) / nonZeroDays) * 10) / 10 : 0;

  // Helper function to get member color
  const getMemberColor = (colorClass: string): string => {
    const colorMap: Record<string, string> = {
      'member-kun': '#FF6B6B',
      'member-ten': '#4ECDC4', 
      'member-xiaojun': '#FFE66D',
      'member-hendery': '#00FF87',
      'member-yangyang': '#A8E6CF'
    };
    return colorMap[colorClass] || '#94a3b8';
  };

  // Custom label function for pie chart
  const renderCustomLabel = (entry: any) => {
    if (entry.percentage < 10) return null; // Don't show label for very small slices
    return `${entry.name} ${entry.percentage}%`;
  };

  const memberStats = sessions.reduce((acc, session) => {
    acc[session.memberId] = (acc[session.memberId] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(memberStats).map((memberId: string) => {
    const seconds = memberStats[memberId];
    const hours = seconds / 3600; // Convert seconds to hours
    const member = wayvMembers.find(m => m.id === memberId);
    const totalHours = Object.keys(memberStats).reduce((sum: number, key: string) => {
      return sum + (memberStats[key] / 3600);
    }, 0);
    const percentage = totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0;
    
    return {
      name: member?.name || memberId,
      value: Math.round(hours * 10) / 10,
      hours: hours,
      percentage: percentage,
      color: member ? getMemberColor(member.color) : '#94a3b8'
    };
  });

  const COLORS = ['#00FF87', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white dark:text-white">总学习时长</p>
              <p className="text-2xl font-bold text-white dark:text-white text-glow">{totalHours}小时</p>
            </div>
            <Clock className="w-8 h-8 text-wayv-green" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white dark:text-white">连续天数</p>
              <p className="text-2xl font-bold text-white dark:text-white text-glow">{stats.streak}天</p>
            </div>
            <Calendar className="w-8 h-8 text-wayv-green" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white dark:text-white">日均学习</p>
              <p className="text-2xl font-bold text-white dark:text-white text-glow">{avgDaily}小时</p>
            </div>
            <TrendingUp className="w-8 h-8 text-wayv-green" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white dark:text-white">学习次数</p>
              <p className="text-2xl font-bold text-white dark:text-white text-glow">{sessions.length}次</p>
            </div>
            <Award className="w-8 h-8 text-wayv-green" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Chart */}
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-display font-semibold text-white dark:text-white mb-6 text-glow">最近7天学习时长</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}小时`, '学习时长']}
              />
              <Bar dataKey="hours" fill="#00FF87" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Member Distribution */}
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-display font-semibold text-white dark:text-white mb-6 text-glow">成员陪伴时长分布</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name, props) => [
                        `${value}小时 (${props.payload.percentage}%)`, 
                        props.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-shrink-0 lg:ml-6 mt-4 lg:mt-0">
                <div className="space-y-3">
                  {pieData.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {entry.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {entry.value}小时 ({entry.percentage}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p>还没有学习记录哦~</p>
                <p className="text-sm">快去和喜欢的成员一起学习吧！</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="glass-card rounded-2xl p-6 shadow-2xl">
        <h3 className="text-2xl font-display font-semibold text-white dark:text-white mb-6 text-glow">最近4周学习时长</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value}小时`, '学习时长']}
            />
            <Bar dataKey="hours" fill="#00FF87" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
