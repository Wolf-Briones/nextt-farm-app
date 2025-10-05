"use client";

import { motion } from 'framer-motion';
import { Category } from '@/lib/types/rewards';

type CategoryFiltersProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
};

export const CategoryFilters = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all text-xs sm:text-sm ${
            selectedCategory === category.id 
              ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400' 
              : 'border-gray-600 text-gray-400 hover:border-gray-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="mr-1 sm:mr-2">{category.icon}</span>
          <span className="hidden sm:inline">{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};