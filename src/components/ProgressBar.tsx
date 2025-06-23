import React from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal, className = '' }) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium">₹{current.toLocaleString()} raised</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-right text-sm text-gray-600">
        of ₹{goal.toLocaleString()} goal
      </div>
    </div>
  );
};

export default ProgressBar;