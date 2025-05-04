import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Character, Dialogue, Script } from '@shared/schema';
import CharacterForm from '../components/CharacterForm';
import DialogueForm from '../components/DialogueForm';
import EditDialogueForm from '../components/EditDialogueForm';
import { ArrowLeft, UserPlus, MessageCirclePlus, Play, Clock } from 'lucide-react';

const ScriptDetail: React.FC = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ id: string }>('/scripts/:id');
  const { toast } = useToast();
  
  const [isAddingCharacter, setIsAddingCharacter] = useState(false);
  const [isAddingDialogue, setIsAddingDialogue] = useState(false);
  const [editDialogueOpen, setEditDialogueOpen] = useState(false);
  const [selectedDialogue, setSelectedDialogue] = useState<Dialogue & { character: Character } | null>(null);
  
  const scriptId = params?.id ? parseInt(params.id) : undefined;
  
  const { data: script, isLoading, error } = useQuery<Script & { 
    characters: Character[], 
    dialogues: (Dialogue & { character: Character })[] 
  }>({ 
    queryKey: [`/api/scripts/${scriptId}`],
    enabled: !!scriptId
  });

  const addCharacterMutation = useMutation({
    mutationFn: async (data: { name: string, description?: string }) => {
      const response = await apiRequest('POST', `/api/scripts/${scriptId}/characters`, data);
      return response.json() as Promise<Character>;
    },
    onSuccess: () => {
      toast({
        title: 'Character added successfully',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/scripts/${scriptId}`] });
      setIsAddingCharacter(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to add character',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const addDialogueMutation = useMutation({
    mutationFn: async (data: { characterId: number, content: string, audioPath?: string }) => {
      const response = await apiRequest('POST', `/api/scripts/${scriptId}/dialogues`, data);
      return response.json() as Promise<Dialogue>;
    },
    onSuccess: () => {
      toast({
        title: 'Dialogue line added successfully',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/scripts/${scriptId}`] });
      setIsAddingDialogue(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to add dialogue',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleAddCharacter = (data: { name: string, description?: string }) => {
    addCharacterMutation.mutate(data);
  };

  const handleAddDialogue = (data: { characterId: number, content: string, audioPath?: string }) => {
    addDialogueMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-80" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Error loading script</h2>
        <p className="text-muted-foreground mb-6">{error?.message || 'Script not found'}</p>
        <Button onClick={() => navigate('/scripts')}>Back to Scripts</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/scripts')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Scripts
        </Button>
        <h1 className="text-3xl font-bold text-primary">{script.title}</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {script.description || 'No description available'}
      </p>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Script Details</h2>
        <Button 
          onClick={() => navigate(`/rehearse/${script.id}`)}
          className="gap-2"
        >
          <Play size={16} />
          Rehearse Script
        </Button>
      </div>
      
      <Tabs defaultValue="characters" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="dialogues">Dialogue Lines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="characters" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Characters</h3>
            <Button 
              onClick={() => setIsAddingCharacter(true)}
              className="gap-2"
              disabled={isAddingCharacter}
            >
              <UserPlus size={16} />
              Add Character
            </Button>
          </div>
          
          {isAddingCharacter && (
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Add New Character</CardTitle>
              </CardHeader>
              <CardContent>
                <CharacterForm 
                  onSubmit={handleAddCharacter} 
                  isLoading={addCharacterMutation.isPending}
                  onCancel={() => setIsAddingCharacter(false)} 
                />
              </CardContent>
            </Card>
          )}
          
          {script.characters.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground mb-4">No characters added yet.</p>
              <Button 
                onClick={() => setIsAddingCharacter(true)}
                disabled={isAddingCharacter}
              >
                Add Your First Character
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {script.characters.map((character) => (
                <Card key={character.id}>
                  <CardHeader>
                    <CardTitle>{character.name}</CardTitle>
                    <CardDescription>
                      {character.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      {script.dialogues.filter(d => d.characterId === character.id).length} dialogue lines
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dialogues" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Dialogue Lines</h3>
            <Button 
              onClick={() => setIsAddingDialogue(true)}
              className="gap-2"
              disabled={isAddingDialogue || script.characters.length === 0}
            >
              <MessageCirclePlus size={16} />
              Add Dialogue
            </Button>
          </div>
          
          {script.characters.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground mb-4">Please add characters before adding dialogue lines.</p>
              <Button 
                onClick={() => {
                  setIsAddingCharacter(true);
                  document.querySelector('[data-value="characters"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  );
                }}
                disabled={isAddingCharacter}
              >
                Add Characters First
              </Button>
            </div>
          )}
          
          {isAddingDialogue && script.characters.length > 0 && (
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Add New Dialogue Line</CardTitle>
              </CardHeader>
              <CardContent>
                <DialogueForm 
                  characters={script.characters}
                  onSubmit={handleAddDialogue} 
                  isLoading={addDialogueMutation.isPending}
                  onCancel={() => setIsAddingDialogue(false)} 
                />
              </CardContent>
            </Card>
          )}
          
          {script.characters.length > 0 && script.dialogues.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground mb-4">No dialogue lines added yet.</p>
              <Button 
                onClick={() => setIsAddingDialogue(true)}
                disabled={isAddingDialogue}
              >
                Add Your First Dialogue Line
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {script.dialogues.map((dialogue, index) => (
                <Card key={dialogue.id} className={index % 2 === 0 ? 'border-l-4 border-l-primary' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                            {dialogue.lineNumber}
                          </span>
                          <span>{dialogue.character.name}</span>
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-3">
                        {dialogue.audioPath && (
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Clock size={12} />
                            <span>Has Audio</span>
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2"
                          onClick={() => {
                            setSelectedDialogue(dialogue);
                            setEditDialogueOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-md leading-relaxed">{dialogue.content}</p>
                    {dialogue.audioPath && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Audio: {dialogue.audioPath}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialogue Dialog */}
      {selectedDialogue && (
        <EditDialogueForm
          dialogue={selectedDialogue}
          open={editDialogueOpen}
          onOpenChange={setEditDialogueOpen}
        />
      )}
    </div>
  );
};

export default ScriptDetail;