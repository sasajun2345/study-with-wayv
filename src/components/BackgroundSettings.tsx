import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sliders } from 'lucide-react';
import { toast } from 'sonner';

export default function BackgroundSettings() {
  const [bgImage, setBgImage] = useState<string>('');
  const [bgBlur, setBgBlur] = useState<number>(0);
  const [bgOpacity, setBgOpacity] = useState<number>(0.1);

  useEffect(() => {
    // Load saved background settings
    const savedSettings = localStorage.getItem('wayvBackgroundSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setBgImage(settings.image || '');
      setBgBlur(settings.blur || 0);
      setBgOpacity(settings.opacity || 0.1);
      applySettings(settings.image || '', settings.blur || 0, settings.opacity || 0.1);
    }
  }, []);

  const applySettings = (image: string, blur: number, opacity: number) => {
    // Apply background image
    if (image) {
      document.documentElement.style.setProperty('--bg-image', `url(${image})`);
      document.documentElement.style.setProperty('--bg-opacity', opacity.toString());
    } else {
      document.documentElement.style.setProperty('--bg-image', 'none');
    }
    
    // Apply blur
    document.documentElement.style.setProperty('--bg-blur', `${blur}px`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setBgImage(imageUrl);
        applySettings(imageUrl, bgBlur, bgOpacity);
        toast.success('背景图片已上传');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setBgImage(url);
    applySettings(url, bgBlur, bgOpacity);
    if (url) {
      toast.success('背景图片已更新');
    }
  };

  const handleBlurChange = (blur: number) => {
    setBgBlur(blur);
    applySettings(bgImage, blur, bgOpacity);
  };

  const handleOpacityChange = (opacity: number) => {
    setBgOpacity(opacity);
    applySettings(bgImage, bgBlur, opacity);
  };

  const saveSettings = () => {
    const settings = {
      image: bgImage,
      blur: bgBlur,
      opacity: bgOpacity
    };
    localStorage.setItem('wayvBackgroundSettings', JSON.stringify(settings));
    toast.success('背景设置已保存');
  };

  const resetSettings = () => {
    setBgImage('');
    setBgBlur(0);
    setBgOpacity(0.1);
    applySettings('', 0, 0.1);
    localStorage.removeItem('wayvBackgroundSettings');
    toast.success('背景设置已重置');
  };

  return (
    <div className="space-y-4">
      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          背景图片
        </label>
        <div className="space-y-2">
          <input
            type="url"
            value={bgImage}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="输入图片URL (可选)"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-wayv-green focus:border-transparent"
          />
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="bg-image-upload"
            />
            <label
              htmlFor="bg-image-upload"
              className="flex items-center space-x-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">上传图片</span>
            </label>
          </div>
        </div>
      </div>

      {/* Blur Effect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          模糊效果: {bgBlur}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={bgBlur}
          onChange={(e) => handleBlurChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          透明度: {Math.round(bgOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={bgOpacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Preview */}
      {bgImage && (
        <div className="border border-slate-300 dark:border-slate-600 rounded-lg p-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">预览</div>
          <div 
            className="w-full h-20 rounded bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${bgImage})`,
              filter: `blur(${bgBlur}px)`,
              opacity: bgOpacity
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={saveSettings}
          className="flex-1 px-4 py-2 bg-wayv-green text-white rounded-lg hover:bg-wayv-green-dark transition-colors"
        >
          保存设置
        </button>
        <button
          onClick={resetSettings}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
}