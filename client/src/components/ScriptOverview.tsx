import React from 'react';

interface DialogueProps {
  id: number;
  speaker: string;
  audio: string;
}

interface ScriptOverviewProps {
  dialogueData: DialogueProps[];
  currentIndex: number;
}

const ScriptOverview: React.FC<ScriptOverviewProps> = ({ dialogueData, currentIndex }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h2 className="text-xl font-medium mb-4 text-neutral-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Script Overview
      </h2>
      
      <div className="space-y-3">
        {dialogueData.map((line, index) => (
          <div 
            key={line.id}
            className={`flex items-center p-2 rounded-md ${index === currentIndex ? 'bg-neutral-100' : ''}`}
          >
            <div 
              className={`w-8 h-8 rounded-full ${index === currentIndex ? 'bg-primary/10 text-primary' : 'bg-neutral-200 text-neutral-600'} flex items-center justify-center mr-3`}
            >
              {index + 1}
            </div>
            <div className="flex-grow">
              <div className="text-sm font-medium">{line.speaker}</div>
            </div>
            <div className="text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.06-5.54m-2.82-5.54a9 9 0 0112.728 0" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptOverview;
