import { useState } from 'react';
import { WayVMember } from '../types';
import { defaultMemberImages, updateMemberImages } from '../config/memberImages';
import { Upload, Image as ImageIcon, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ImageConfigPanelProps {
  member: WayVMember;
  onImagesUpdate: () => void;
}

export default function ImageConfigPanel({ member, onImagesUpdate }: ImageConfigPanelProps) {
  const [avatarUrl, setAvatarUrl] = useState(member.avatar);
  const [bannerUrl, setBannerUrl] = useState(member.banner);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleFileChange = (type: 'avatar' | 'banner', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        if (type === 'avatar') {
          setAvatarUrl(url);
          setAvatarFile(file);
        } else {
          setBannerUrl(url);
          setBannerFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (type: 'avatar' | 'banner', url: string) => {
    if (type === 'avatar') {
      setAvatarUrl(url);
      setAvatarFile(null);
    } else {
      setBannerUrl(url);
      setBannerFile(null);
    }
  };

  const saveChanges = () => {
    try {
      updateMemberImages(member.id, {
        avatar: avatarUrl,
        banner: bannerUrl
      });
      
      // Save to localStorage for persistence
      const savedConfigs = JSON.parse(localStorage.getItem('wayvImageConfigs') || '{}');
      savedConfigs[member.id] = {
        avatar: avatarUrl,
        banner: bannerUrl
      };
      localStorage.setItem('wayvImageConfigs', JSON.stringify(savedConfigs));
      
      toast.success(`${member.name} 的图片配置已保存！`);
      onImagesUpdate();
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  };

  const resetToDefault = () => {
    const defaultImages = defaultMemberImages[member.id];
    setAvatarUrl(defaultImages.avatar);
    setBannerUrl(defaultImages.banner);
    setAvatarFile(null);
    setBannerFile(null);
    
    // Remove from localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('wayvImageConfigs') || '{}');
    delete savedConfigs[member.id];
    localStorage.setItem('wayvImageConfigs', JSON.stringify(savedConfigs));
    
    toast.success(`已重置 ${member.name} 的默认图片`);
    onImagesUpdate();
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
          {member.name} 图片配置
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={saveChanges}
            className={`px-4 py-2 rounded-full font-medium text-white bg-gradient-to-r from-${member.color} to-${member.color}-dark hover:shadow-lg transition-all duration-300 flex items-center space-x-2`}
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={resetToDefault}
            className="px-4 py-2 rounded-full font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Avatar Configuration */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">头像配置</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                图片URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => handleUrlChange('avatar', e.target.value)}
                placeholder="输入头像图片URL"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-wayv-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                或上传文件
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('avatar', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-wayv-green file:text-white hover:file:bg-wayv-green-dark"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-600 shadow-lg">
              <img 
                src={avatarUrl} 
                alt={`${member.name} 头像`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjY0IiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUI5QjlCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7noJToqI3lj6/lj5Y8L3RleHQ+Cjwvc3ZnPgo=`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Configuration */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">横幅配置</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                图片URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => handleUrlChange('banner', e.target.value)}
                placeholder="输入横幅图片URL"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-wayv-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                或上传文件
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('banner', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-wayv-green file:text-white hover:file:bg-wayv-green-dark"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-24 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-lg">
              <img 
                src={bannerUrl} 
                alt={`${member.name} 横幅`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTkyIDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijk2IiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QjlCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7noJToqI3lj6/lj5Y8L3RleHQ+Cjwvc3ZnPgo=`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6">
        <h5 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">配置说明</h5>
        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
          <p>• 支持 JPG、PNG、GIF 等常见图片格式</p>
          <p>• 头像建议尺寸：200x200 像素（正方形）</p>
          <p>• 横幅建议尺寸：400x200 像素（长方形）</p>
          <p>• 可以直接输入网络图片URL，或上传本地图片文件</p>
          <p>• 配置会自动保存到浏览器本地存储</p>
        </div>
      </div>
    </div>
  );
}