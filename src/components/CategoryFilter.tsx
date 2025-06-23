import React, { useEffect, useState } from 'react';
import { Project } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  projects: Project[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  projects
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  // Extract unique categories from projects and update state
  useEffect(() => {
    if (projects.length > 0) {
      const uniqueCategories = Array.from(new Set(projects.map(project => project.category)))
        .filter(category => category) // Remove empty categories if any
        .sort(); // Sort categories alphabetically
      setCategories(['All', ...uniqueCategories]); // Ensure "All" is always first
    } else {
      setCategories(['All']); // Default to "All" when no projects exist
    }
  }, [projects]);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
