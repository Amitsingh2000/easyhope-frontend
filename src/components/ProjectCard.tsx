import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const percentFunded = Math.min(Math.round((project.raisedAmount / project.goalAmount) * 100), 100);
  const isFullyFunded = percentFunded === 100; // ✅ Check if 100% funded

  const creatorImageUrl = project.creatorImage ? `http://localhost:8080${project.creatorImage}` : '/default-profile.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Project Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={project.images || '/default-image.jpg'} 
          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Project Details */}
      <div className="p-5">
        {/* Category & Status Badges */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {project.category}
          </span>
          <span
  className={`px-3 py-1 text-xs font-semibold rounded-full ${
    project.status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : isFullyFunded
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800"
  }`}
>
  {project.status === "pending"
    ? "Pending"
    : isFullyFunded
    ? "Closed"
    : "Active"}
</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 truncate">{project.title}</h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${percentFunded}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className="font-semibold">₹{project.raisedAmount.toLocaleString()}</span>
            <span>{percentFunded}% of ₹{project.goalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Creator Info & Buttons */}
        <div className="flex items-center justify-between">
          {/* Creator Info */}
          <div className="flex items-center space-x-2">
            {project.creatorImage ? (
              <img 
                src={creatorImageUrl} 
                alt={project.creatorName} 
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            )}
            <span className="text-xs text-gray-600">by {project.creatorName}</span>
          </div>

          {/* View Details Button (Always Enabled) */}
          <Link 
            to={`/project/${project.id}`}
            className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-300"
          >
            View Details
          </Link>
        </div>

        {/* Donate Button (Disabled if Fully Funded) */}
        <Link
  to={`/project/${project.id}`} // ✅ Link to the project details page
  className={`block text-center w-full mt-3 py-2 px-4 text-white font-medium rounded-md transition-all duration-300 ${
    isFullyFunded ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  }`}
  style={{ pointerEvents: isFullyFunded ? "none" : "auto" }} // ✅ Disable click if fully funded
>
  {isFullyFunded ? "Fully Funded" : "Donate Now"}
</Link>
      </div>
    </div>
  );
};

export default ProjectCard;
