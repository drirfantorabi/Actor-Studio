import React, { useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';

interface DialogueProps {
  id: number;
  speaker: string;
  audio: string;
}

interface DialogueCardProps {
  currentDialogue: DialogueProps;
  currentIndex: number;
  totalLines: number;
  selectedRole: string;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
  onPlay: () => void;
  isCompleted: boolean;
  onRestart: () => void;
}

const DialogueCard: React.FC<DialogueCardProps> = ({
  currentDialogue,
  currentIndex,
  totalLines,
  selectedRole,
  isPlaying,
  setIsPlaying,
  onNext,
  onPlay,
  isCompleted,
  onRestart
}) => {
  const { play } = useAudio();
  const isUserTurn = currentDialogue && currentDialogue.speaker === selectedRole;

  useEffect(() => {
    if (isPlaying && currentDialogue && !isUserTurn) {
      play(currentDialogue.audio, () => {
        setIsPlaying(false);
        // Auto-advance if it's not the user's turn
        if (!isUserTurn) {
          onNext();
        }
      });
    }
  }, [isPlaying, currentDialogue, isUserTurn, play, setIsPlaying, onNext]);

  return (
    <div className="bg-white rounded-lg shadow-md flex-grow flex flex-col mb-6 overflow-hidden">
      {/* Current dialogue header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Now Speaking</h3>
          <p className="text-white/90 text-sm">Line {currentIndex + 1} of {totalLines}</p>
        </div>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="ml-2 font-medium">{currentDialogue?.speaker}</span>
        </div>
      </div>
      
      {/* Dialogue content area */}
      <div className="p-6 flex-grow flex flex-col items-center justify-center">
        {isCompleted ? (
          // Completed state
          <div className="w-full">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-success text-3xl h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <p className="text-center font-medium text-lg mb-2">
              Rehearsal Complete!
            </p>
            
            <p className="text-center text-neutral-600 mb-6">
              Great job practicing your lines
            </p>
            
            <div className="flex justify-center">
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-success hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
                onClick={onRestart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart Rehearsal
              </button>
            </div>
          </div>
        ) : isUserTurn ? (
          // User's turn
          <div className="w-full">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-secondary text-3xl h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            
            <p className="text-center font-medium text-lg mb-2">
              Your Turn!
            </p>
            
            <p className="text-center text-neutral-600 mb-6">
              Read your line aloud, then press Next
            </p>
          </div>
        ) : (
          // Computer's turn
          <div className="w-full">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-3xl h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            
            <p className="text-center text-neutral-600 mb-6">
              Listen to {currentDialogue?.speaker}'s line
            </p>
            
            {/* Audio visualizer (appears when audio is playing) */}
            {isPlaying && (
              <div className="w-full flex justify-center items-center h-12 mb-6 relative">
                <div className="audio-playing flex items-end justify-center space-x-1 h-8 w-32">
                  {/* Audio visualization bars */}
                  <div className="bg-primary h-3 w-1 rounded-full"></div>
                  <div className="bg-primary h-5 w-1 rounded-full"></div>
                  <div className="bg-primary h-8 w-1 rounded-full"></div>
                  <div className="bg-primary h-4 w-1 rounded-full"></div>
                  <div className="bg-primary h-6 w-1 rounded-full"></div>
                  <div className="bg-primary h-3 w-1 rounded-full"></div>
                  <div className="bg-primary h-7 w-1 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      {!isCompleted && (
        <div className="p-4 border-t border-neutral-200 flex justify-between">
          {/* Play button */}
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onPlay}
            disabled={isPlaying || isUserTurn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play
          </button>
          
          {/* Next button (conditionally shown) */}
          {isUserTurn && (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
              onClick={onNext}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DialogueCard;
