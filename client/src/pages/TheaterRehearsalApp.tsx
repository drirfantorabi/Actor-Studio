import React, { useState } from 'react';
import RoleSelection from '../components/RoleSelection';
import ScriptProgress from '../components/ScriptProgress';
import DialogueCard from '../components/DialogueCard';
import ScriptOverview from '../components/ScriptOverview';
import { dialogueData } from '../lib/data';

const TheaterRehearsalApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState('Ali');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (currentIndex < dialogueData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setIsPlaying(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePlay = () => {
    const current = dialogueData[currentIndex];
    if (!current) return;

    if (current.speaker === selectedRole) {
      // It's the user's turn
      return; // Just show the user turn UI
    } else {
      // Computer's turn - play audio
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col min-h-screen">
      {/* App Header */}
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-primary text-center">Theater Rehearsal Tool</h1>
        <p className="text-neutral-600 text-center mt-2">Practice your lines with automated scene partners</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <RoleSelection selectedRole={selectedRole} onRoleChange={handleRoleChange} />
        
        <ScriptProgress 
          currentIndex={currentIndex} 
          totalLines={dialogueData.length} 
        />
        
        <DialogueCard 
          currentDialogue={dialogueData[currentIndex]} 
          currentIndex={currentIndex}
          totalLines={dialogueData.length}
          selectedRole={selectedRole}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={handleNext}
          onPlay={handlePlay}
          isCompleted={isCompleted}
          onRestart={handleRestart}
        />
        
        <ScriptOverview 
          dialogueData={dialogueData} 
          currentIndex={currentIndex}
        />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-neutral-500 text-sm">
        <p>Theater Rehearsal Tool &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default TheaterRehearsalApp;
