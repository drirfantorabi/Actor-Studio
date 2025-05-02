import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Character } from '@shared/schema';

const formSchema = z.object({
  characterId: z.string().min(1, { message: 'Please select a character' }),
  content: z.string().min(1, { message: 'Dialogue content is required' }),
  audioPath: z.string().optional(),
});

type FormValues = {
  characterId: string;
  content: string;
  audioPath?: string;
};

type SubmitValues = {
  characterId: number;
  content: string;
  audioPath?: string;
};

interface DialogueFormProps {
  characters: Character[];
  onSubmit: (data: SubmitValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DialogueForm: React.FC<DialogueFormProps> = ({ 
  characters, 
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      characterId: '',
      content: '',
      audioPath: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      characterId: parseInt(data.characterId),
      content: data.content,
      audioPath: data.audioPath || undefined
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="characterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speaker</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {characters.map(character => (
                    <SelectItem key={character.id} value={character.id.toString()}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dialogue Line</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter dialogue content..." 
                  rows={3}
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
              <FormLabel>Audio File Path (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="/audio/filename.mp3" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank if you don't have an audio file for this line yet.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Dialogue Line'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DialogueForm;