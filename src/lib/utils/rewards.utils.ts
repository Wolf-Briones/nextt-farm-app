export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'border-gray-500 bg-gray-800/50';
    case 'rare':
      return 'border-blue-500 bg-blue-800/20';
    case 'epic':
      return 'border-purple-500 bg-purple-800/20';
    case 'legendary':
      return 'border-yellow-500 bg-yellow-800/20';
    default:
      return 'border-gray-500 bg-gray-800/50';
  }
};

export const getRarityBadgeColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-600 text-gray-200';
    case 'rare':
      return 'bg-blue-600 text-blue-200';
    case 'epic':
      return 'bg-purple-600 text-purple-200';
    case 'legendary':
      return 'bg-yellow-600 text-yellow-200';
    default:
      return 'bg-gray-600 text-gray-200';
  }
};

export const getRarityBarColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'farming':
      return '🌾';
    case 'business':
      return '💼';
    case 'sustainability':
      return '♻️';
    case 'exploration':
      return '🔍';
    default:
      return '⭐';
  }
};