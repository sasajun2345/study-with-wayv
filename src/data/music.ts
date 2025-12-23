import { MusicTrack } from '../types';

export const wayvSongs: MusicTrack[] = [
  {
    id: '1',
    title: 'Kick Back',
    artist: 'WayV',
    album: 'Kick Back',
    albumCover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=WayV%20Kick%20Back%20album%20cover%2C%20modern%20K-pop%20album%20design%2C%20neon%20green%20accents%2C%20sleek%20and%20futuristic%20style&image_size=square',
    duration: 210,
    memberId: 'all'
  },
  {
    id: '2',
    title: 'Love Talk',
    artist: 'WayV',
    album: 'Take Over The Moon',
    albumCover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=WayV%20Love%20Talk%20album%20cover%2C%20romantic%20K-pop%20album%20design%2C%20soft%20colors%2C%20emotional%20and%20dreamy%20atmosphere&image_size=square',
    duration: 195,
    memberId: 'all'
  },
  {
    id: '3',
    title: 'Turn Back Time',
    artist: 'WayV',
    album: 'Awaken The World',
    albumCover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=WayV%20Turn%20Back%20Time%20album%20cover%2C%20intense%20K-pop%20album%20design%2C%20dynamic%20and%20powerful%20visual%2C%20dark%20and%20mysterious%20atmosphere&image_size=square',
    duration: 220,
    memberId: 'all'
  },
  {
    id: '4',
    title: 'Phantom',
    artist: 'WayV',
    album: 'Phantom',
    albumCover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=WayV%20Phantom%20album%20cover%2C%20mysterious%20K-pop%20album%20design%2C%20dark%20and%20haunting%20atmosphere%2C%20elegant%20and%20sophisticated%20style&image_size=square',
    duration: 205,
    memberId: 'all'
  },
  {
    id: '5',
    title: 'Nectar',
    artist: 'WayV',
    album: 'Nectar',
    albumCover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=WayV%20Nectar%20album%20cover%2C%20sweet%20and%20refreshing%20K-pop%20album%20design%2C%20golden%20and%20honey%20colors%2C%20warm%20and%20inviting%20atmosphere&image_size=square',
    duration: 198,
    memberId: 'all'
  }
];

export const getDailyRecommendations = (): MusicTrack[] => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const shuffled = [...wayvSongs].sort((a, b) => {
    const aScore = (seed + a.id.charCodeAt(0)) % 100;
    const bScore = (seed + b.id.charCodeAt(0)) % 100;
    return aScore - bScore;
  });
  
  return shuffled.slice(0, 3);
};