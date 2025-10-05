export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'farming' | 'business' | 'sustainability' | 'exploration';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
  requirement: {
    type: string;
    target: number;
    current: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
};

export type PlayerStats = {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  money: number;
  sustainabilityPoints: number;
  cropsPlanted: number;
  cropsHarvested: number;
  waterSaved: number;
  co2Reduced: number;
  daysPlayed: number;
  perfectHarvests: number;
  marketTransactions: number;
  totalEarnings: number;
  plaguesDefeated: number;
  droughtsWeathered: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};