import React from 'react';

interface ScriptProgressProps {
  currentIndex: number;
  totalLines: number;
}

const ScriptProgress: React.FC<ScriptProgressProps> = ({ currentIndex, totalLines }) => {
  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / totalLines) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-neutral-800">Script Progress</h2>
        <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm font-medium text-neutral-600">
          {currentIndex + 1}
        </span>
      </div>
      
      <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-neutral-500">
        <span>Beginning</span>
        <span>End</span>
      </div>
    </div>
  );
};

export default ScriptProgress;
