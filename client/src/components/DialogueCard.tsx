import React, { useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, RefreshCw, Mic } from 'lucide-react';

interface DialogueProps {
  id: number;
  speaker: string;
  audio: string;
  content?: string;
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
    <Card className="flex-grow flex flex-col mb-6 overflow-hidden">
      {/* Current dialogue header */}
      <CardHeader className="bg-primary text-white py-4 px-6 flex-row justify-between items-center space-y-0">
        <div>
          <h3 className="text-lg font-medium">Now Speaking</h3>
          <p className="text-white/90 text-sm">Line {currentIndex + 1} of {totalLines}</p>
        </div>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <div className="h-6 w-6 text-white">
              {/* User icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <span className="ml-2 font-medium">{currentDialogue?.speaker}</span>
        </div>
      </CardHeader>
      
      {/* Dialogue content area */}
      <CardContent className="p-6 flex-grow flex flex-col items-center justify-center">
        {isCompleted ? (
          // Completed state
          <div className="w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-medium mb-2">
              Rehearsal Complete!
            </h3>
            
            <p className="text-muted-foreground mb-6">
              Great job practicing your lines
            </p>
            
            <Button onClick={onRestart} className="gap-2">
              <RefreshCw size={16} />
              Restart Rehearsal
            </Button>
          </div>
        ) : isUserTurn ? (
          // User's turn
          <div className="w-full">
            {/* Display content if available */}
            {currentDialogue?.content && (
              <div className="mb-6 text-center p-4 border border-dashed rounded-md bg-secondary/5 border-secondary/20">
                <p className="font-medium text-lg leading-relaxed">{currentDialogue.content}</p>
              </div>
            )}
          
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Mic className="h-8 w-8" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium mb-2">
                Your Turn!
              </h3>
              
              <p className="text-muted-foreground mb-4">
                Read your line aloud, then press Next
              </p>
            </div>
          </div>
        ) : (
          // Computer's turn
          <div className="w-full">
            {/* Display content if available */}
            {currentDialogue?.content && (
              <div className="mb-6 text-center p-4 border rounded-md bg-primary/5 border-primary/20">
                <p className="font-medium text-lg leading-relaxed">{currentDialogue.content}</p>
              </div>
            )}
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Listen to {currentDialogue?.speaker}'s line
              </p>
              
              {/* Audio visualizer (appears when audio is playing) */}
              {isPlaying && (
                <div className="flex justify-center items-center h-12 mb-2">
                  <div className="audio-playing flex items-end justify-center space-x-1 h-8 w-32">
                    {[3, 5, 8, 4, 6, 3, 7].map((height, i) => (
                      <div 
                        key={i} 
                        className="bg-primary w-1 rounded-full animate-pulse"
                        style={{ height: `${height * 4}px` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Action buttons */}
      {!isCompleted && (
        <CardFooter className="flex justify-between border-t p-4">
          {/* Play button */}
          <Button
            variant="default"
            onClick={onPlay}
            disabled={isPlaying || isUserTurn}
            className="gap-2"
          >
            <Play size={16} />
            Play Audio
          </Button>
          
          {/* Next button (conditionally shown) */}
          {isUserTurn && (
            <Button
              variant="secondary"
              onClick={onNext}
              className="gap-2"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default DialogueCard;
