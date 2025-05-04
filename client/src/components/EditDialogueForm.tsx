import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Dialogue } from '@shared/schema';

const formSchema = z.object({
  content: z.string().min(1, { message: 'Dialogue content is required' }),
  audioPath: z.string().optional(),
  audioFile: z.any().optional() // For future file upload functionality
});

type FormValues = {
  content: string;
  audioPath?: string;
  audioFile?: File;
};

interface EditDialogueFormProps {
  dialogue: {
    id: number;
    content: string;
    audioPath?: string | null;
    characterId: number;
    scriptId: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditDialogueForm: React.FC<EditDialogueFormProps> = ({ 
  dialogue,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const [audioFileName, setAudioFileName] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: dialogue.content,
      audioPath: dialogue.audioPath || '',
    },
  });

  const updateDialogueMutation = useMutation({
    mutationFn: async (data: { content: string; audioPath?: string }) => {
      const response = await apiRequest(
        'PATCH', 
        `/api/dialogues/${dialogue.id}`, 
        data
      );
      return response.json() as Promise<Dialogue>;
    },
    onSuccess: () => {
      toast({
        title: 'Dialogue updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/scripts/${dialogue.scriptId}`] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update dialogue',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const uploadAudioMutation = useMutation({
    mutationFn: async (filename: string) => {
      const response = await apiRequest('POST', '/api/upload-audio', { filename });
      return response.json() as Promise<{ success: boolean; path: string }>;
    },
    onSuccess: (data) => {
      // Update the form with the new audio path
      form.setValue('audioPath', data.path);
      
      toast({
        title: 'Audio file created',
        description: 'The audio file path has been set',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create audio file',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleCreateAudio = () => {
    if (!audioFileName) {
      toast({
        title: 'Filename required',
        description: 'Please enter a filename for the audio file',
        variant: 'destructive'
      });
      return;
    }

    // Ensure the filename has .mp3 extension
    const filename = audioFileName.endsWith('.mp3') 
      ? audioFileName 
      : `${audioFileName}.mp3`;
    
    uploadAudioMutation.mutate(filename);
  };

  const onSubmit = (data: FormValues) => {
    updateDialogueMutation.mutate({
      content: data.content,
      audioPath: data.audioPath
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Dialogue Line</DialogTitle>
          <DialogDescription>
            Update the dialogue content and audio settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dialogue Line</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter dialogue content..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audioPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio File Path</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="/audio/filename.mp3" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Path to the audio file that will be played during rehearsal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-md p-4 bg-muted/10">
              <h4 className="text-sm font-medium mb-2">Create Audio File</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter filename (e.g., line1.mp3)"
                  value={audioFileName}
                  onChange={(e) => setAudioFileName(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={handleCreateAudio}
                  disabled={uploadAudioMutation.isPending}
                  size="sm"
                >
                  Create
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Creates an audio file placeholder. In a production app, you would upload a real audio recording.
              </p>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={updateDialogueMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateDialogueMutation.isPending}
              >
                {updateDialogueMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogueForm;