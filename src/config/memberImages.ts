// 成员图片配置文件
// 您可以在这里自由配置成员的头像和横幅图片路径

export interface MemberImages {
  avatar: string;
  banner: string;
}

export interface MemberImageConfig {
  [key: string]: MemberImages;
}

// 默认图片配置 - 您可以修改这些路径指向您的本地图片
export const defaultMemberImages: MemberImageConfig = {
  hendery: {
    avatar: 'images/hendery-avatar.jpg',
    banner: 'images/hendery-banner.jpg'
  },
  kun: {
    avatar: 'images/kun-avatar.jpg',
    banner: 'images/kun-banner.jpg'
  },
  ten: {
    avatar: 'images/ten-avatar.jpg',
    banner: 'images/ten-banner.jpg'
  },
  xiaojun: {
    avatar: 'images/xiaojun-avatar.jpg',
    banner: 'images/xiaojun-banner.jpg'
  },
  yangyang: {
    avatar: 'images/yangyang-avatar.jpg',
    banner: 'images/yangyang-banner.jpg'
  }
};

// 从本地存储加载保存的配置
export function loadSavedConfigurations(): MemberImageConfig {
  try {
    const saved = localStorage.getItem('wayvImageConfigs');
    if (saved) {
      const savedConfigs = JSON.parse(saved);
      // 合并保存的配置和默认配置
      return { ...defaultMemberImages, ...savedConfigs };
    }
  } catch (error) {
    console.error('加载保存的图片配置失败:', error);
  }
  return { ...defaultMemberImages };
}

// 获取成员图片的函数（包含本地存储的配置）
export function getMemberImages(memberId: string): MemberImages {
  const configs = loadSavedConfigurations();
  return configs[memberId] || {
    avatar: '/images/default-avatar.jpg',
    banner: '/images/default-banner.jpg'
  };
}

// 更新成员图片的函数
export function updateMemberImages(memberId: string, images: MemberImages): void {
  try {
    // 保存到本地存储
    const savedConfigs = loadSavedConfigurations();
    savedConfigs[memberId] = images;
    localStorage.setItem('wayvImageConfigs', JSON.stringify(savedConfigs));
    
    // 更新默认配置（运行时）
    defaultMemberImages[memberId] = images;
  } catch (error) {
    console.error('保存图片配置失败:', error);
    throw error;
  }
}

// 重置为默认配置
export function resetToDefault(memberId?: string): void {
  if (memberId) {
    // 重置单个成员
    const savedConfigs = loadSavedConfigurations();
    delete savedConfigs[memberId];
    localStorage.setItem('wayvImageConfigs', JSON.stringify(savedConfigs));
  } else {
    // 重置所有配置
    localStorage.removeItem('wayvImageConfigs');
  }
}