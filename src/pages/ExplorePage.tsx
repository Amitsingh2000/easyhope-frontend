import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import CategoryFilter from '../components/CategoryFilter';
import { fetchProjects } from '../data/mockData';
import { Project } from '../types';

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
  
      // Ensure only approved projects are shown
      let filtered = data.filter(project => project.status === "approved");
  
      // Filter by category
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(project => project.category === selectedCategory);
      }
  
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          project =>
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query)
        );
      }
  
      // Sort projects
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'mostFunded':
          filtered.sort((a, b) => b.raisedAmount - a.raisedAmount);
          break;
        case 'leastFunded':
          filtered.sort((a, b) => a.raisedAmount - b.raisedAmount);
          break;
        case 'goalHighToLow':
          filtered.sort((a, b) => b.goalAmount - a.goalAmount);
          break;
        case 'goalLowToHigh':
          filtered.sort((a, b) => a.goalAmount - b.goalAmount);
          break;
        default:
          break;
      }
  
      setFilteredProjects(filtered);
    };
  
    loadProjects();
  }, [selectedCategory, searchQuery, sortBy]);
  
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Explore Projects</h1>
          <p className="text-gray-600 mt-2">Discover and support campaigns that need your help</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Filters & Projects Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <button 
                className="md:hidden w-full flex items-center justify-between mb-4 text-gray-700"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="font-medium">Filters</span>
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              
              <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <CategoryFilter 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={handleCategorySelect}
                  projects={filteredProjects} 
                />
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="mostFunded">Most Funded</option>
                    <option value="leastFunded">Least Funded</option>
                    <option value="goalHighToLow">Goal: High to Low</option>
                    <option value="goalLowToHigh">Goal: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Project Cards */}
          <div className="flex-grow">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria to find projects.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
