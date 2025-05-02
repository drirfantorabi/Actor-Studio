import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import RoleSelection from '../components/RoleSelection';
import ScriptProgress from '../components/ScriptProgress';
import DialogueCard from '../components/DialogueCard';
import ScriptOverview from '../components/ScriptOverview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Script, Character, Dialogue } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface DialogueWithCharacter extends Dialogue {
  character: Character;
}

// Transform database dialogue data to the format expected by components
const transformDialogueData = (dialogues: DialogueWithCharacter[]) => {
  return dialogues.map(dialogue => ({
    id: dialogue.id,
    speaker: dialogue.character.name,
    audio: dialogue.audioPath || '',
    content: dialogue.content
  }));
};

const ScriptRehearsalPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ id: string }>('/rehearse/:id');
  
  const scriptId = params?.id ? parseInt(params.id) : undefined;
  
  const { data: scriptData, isLoading, error } = useQuery<Script & { 
    characters: Character[], 
    dialogues: DialogueWithCharacter[]
  }>({ 
    queryKey: [`/api/scripts/${scriptId}`],
    enabled: !!scriptId
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [dialogueData, setDialogueData] = useState<{ id: number, speaker: string, audio: string, content: string }[]>([]);

  useEffect(() => {
    if (scriptData) {
      const roles = scriptData.characters.map(character => character.name);
      setAvailableRoles(roles);
      setSelectedRole(roles[0] || '');
      
      const transformedDialogues = transformDialogueData(scriptData.dialogues);
      setDialogueData(transformedDialogues);
    }
  }, [scriptData]);

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

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 flex flex-col min-h-screen">
        <header className="mb-6 pt-4">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-4 w-full mx-auto" />
        </header>
        <main className="flex-grow flex flex-col">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    );
  }

  if (error || !scriptData) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Error loading script</h2>
        <p className="text-muted-foreground mb-6">{error?.message || 'Script not found'}</p>
        <Button onClick={() => navigate('/scripts')}>Back to Scripts</Button>
      </div>
    );
  }

  if (dialogueData.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">This script has no dialogue lines</h2>
        <p className="text-muted-foreground mb-6">Add dialogue lines before rehearsing</p>
        <Button onClick={() => navigate(`/scripts/${scriptId}`)}>Edit Script</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col min-h-screen">
      {/* App Header */}
      <header className="mb-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/scripts')}
            className="gap-1"
          >
            <ArrowLeft size={16} />
            Back to Scripts
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-primary text-center">{scriptData.title}</h1>
        <p className="text-neutral-600 text-center mt-2">
          {scriptData.description || 'Practice your lines with automated scene partners'}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {availableRoles.length > 0 && (
          <RoleSelection 
            selectedRole={selectedRole} 
            onRoleChange={handleRoleChange}
            availableRoles={availableRoles}
          />
        )}
        
        <ScriptProgress 
          currentIndex={currentIndex} 
          totalLines={dialogueData.length} 
        />
        
        {dialogueData[currentIndex] && (
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
        )}
        
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

export default ScriptRehearsalPage;