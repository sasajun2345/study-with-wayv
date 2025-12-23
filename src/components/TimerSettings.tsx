import { Bell, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { toast } from 'sonner';

export default function TimerSettings() {
  const { preferences, setPreferences } = useAppStore();

  const handleSave = () => {
    toast.success('声音设置已保存');
  };

  const handleReset = () => {
    setPreferences({
      soundEnabled: true,
      notificationsEnabled: true,
    });
    toast.success('设置已重置为默认值');
  };

  return (
    <div className="space-y-4">
      {/* Timer Info */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">番茄专注设置</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          专注时间：25分钟 | 休息时间：5分钟
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          采用经典的番茄工作法，帮助您保持高效专注
        </p>
      </div>

      {/* Sound Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>声音提醒</span>
          </div>
        </label>
        <button
          onClick={() => setPreferences({ soundEnabled: !preferences.soundEnabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            preferences.soundEnabled ? 'bg-wayv-green' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Notifications Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>桌面通知</span>
          </div>
        </label>
        <button
          onClick={() => setPreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            preferences.notificationsEnabled ? 'bg-wayv-green' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-wayv-green text-white rounded-lg hover:bg-wayv-green-dark transition-colors"
        >
          保存设置
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
}