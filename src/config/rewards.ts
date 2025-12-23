// Reward images configuration using public/cards directory
// Vite serves images from /public at root, so use '/cards/filename.jpg'

export const rewardImages: Record<string, string[]> = {
  kun: [
    'cards/KUN_Bigbands.jpg',
    'cards/KUN_Frequency.jpg',
    'cards/KUN_GoHigher.jpg',
    'cards/KUN_OnMyYouth.jpg',
    'cards/KUN_SheAWolf.jpg',
    'cards/KUN_白色定格.jpg',
  ],
  ten: [
    'cards/TEN_Bigbands.jpg',
    'cards/TEN_Frequency.jpg',
    'cards/TEN_GoHigher.jpg',
    'cards/TEN_OnMyYouth.jpg',
    'cards/TEN_SheAWolf.jpg',
    'cards/TEN_白色定格.jpg',
  ],
  xiaojun: [
    'cards/XIAOJUN_Bigbands.jpg',
    'cards/XIAOJUN_Frequency.jpg',
    'cards/XIAOJUN_GoHigher.jpg',
    'cards/XIAOJUN_OnMyYouth.jpg',
    'cards/XIAOJUN_SheAWolf.jpg',
    'cards/XIAOJUN_白色定格.jpg',
  ],
  hendery: [
    'cards/HENDERY_Bigbands.jpg',
    'cards/HENDERY_Frequency.jpg',
    'cards/HENDERY_GoHigher.jpg',
    'cards/HENDERY_OnMyYouth.jpg',
    'cards/HENDERY_SheAWolf.jpg',
    'cards/HENDERY_白色定格.jpg',
  ],
  yangyang: [
    'cards/YANGYANG_Bigbands.jpg',
    'cards/YANGYANG_Frequency.jpg',
    'cards/YANGYANG_GoHigher.jpg',
    'cards/YANGYANG_OnMyYouth.jpg',
    'cards/YANGYANG_SheAWolf.jpg',
    'cards/YANGYANG_白色定格.jpg',
  ],
};

export const getRandomReward = (memberId: string): string | null => {
  const imgs = rewardImages[memberId];
  if (!imgs || imgs.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * imgs.length);
  return imgs[randomIndex];
};
