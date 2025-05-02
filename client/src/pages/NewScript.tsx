import React from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Script } from '@shared/schema';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const NewScript: React.FC = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const createScriptMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/scripts', data);
      return response.json() as Promise<Script>;
    },
    onSuccess: (data) => {
      toast({
        title: 'Script created successfully',
        description: `"${data.title}" is ready for editing.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      navigate(`/scripts/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create script',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    createScriptMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/scripts')}
        >
          Back to Scripts
        </Button>
        <h1 className="text-3xl font-bold text-primary">Create New Script</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Script Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter script title..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter script description..." 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/scripts')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createScriptMutation.isPending}
            >
              {createScriptMutation.isPending ? 'Creating...' : 'Create Script'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewScript;