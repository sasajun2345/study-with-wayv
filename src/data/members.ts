import { WayVMember } from '../types';
import { getMemberImages } from '../config/memberImages';

// 创建成员数据，使用可配置的图片系统
export const createWayvMembers = (): WayVMember[] => [
  {
    id: 'kun',
    name: '钱锟',
    nameEn: 'Kun',
    color: 'member-kun',
    avatar: getMemberImages('kun').avatar,
    banner: getMemberImages('kun').banner,
    description: '温柔可靠的队长，用温暖的陪伴守护你的学习时光',
    personality: '温柔、可靠、有责任感'
  },
  {
    id: 'ten',
    name: '李永钦',
    nameEn: 'Ten',
    color: 'member-ten',
    avatar: getMemberImages('ten').avatar,
    banner: getMemberImages('ten').banner,
    description: '充满魅力的艺术精灵，用创意和活力激发你的学习灵感',
    personality: '魅力、艺术、活力'
  },
  {
    id: 'xiaojun',
    name: '肖俊',
    nameEn: 'Xiaojun',
    color: 'member-xiaojun',
    avatar: getMemberImages('xiaojun').avatar,
    banner: getMemberImages('xiaojun').banner,
    description: '温柔的歌手，用音乐的力量陪伴你度过每个学习时刻',
    personality: '温柔、音乐、感性'
  },
  {
    id: 'hendery',
    name: '黄冠亨',
    nameEn: 'Hendery',
    color: 'member-hendery',
    avatar: getMemberImages('hendery').avatar,
    banner: getMemberImages('hendery').banner,
    description: '阳光活力的开心果，用幽默和快乐驱散学习的疲惫',
    personality: '阳光、幽默、活力'
  },
  {
    id: 'yangyang',
    name: '刘扬扬',
    nameEn: 'Yangyang',
    color: 'member-yangyang',
    avatar: getMemberImages('yangyang').avatar,
    banner: getMemberImages('yangyang').banner,
    description: '青春洋溢的小太阳，用朝气和活力点亮你的学习之路',
    personality: '青春、活力、可爱'
  }
];

// 导出成员数据（使用最新的图片配置）
export const wayvMembers = createWayvMembers();