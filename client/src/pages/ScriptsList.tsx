import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Script } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const ScriptsList: React.FC = () => {
  const [location, navigate] = useLocation();
  
  const { data: scripts, isLoading, error } = useQuery<Script[]>({ 
    queryKey: ['/api/scripts'],
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Scripts Library</h1>
          <p className="text-muted-foreground mt-1">Choose a script to rehearse or create a new one</p>
        </div>
        <Button onClick={() => navigate('/scripts/new')} className="gap-2">
          <Plus size={16} />
          <span>New Script</span>
        </Button>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-red-500">Failed to load scripts. Please try again.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/scripts'] })}
          >
            Retry
          </Button>
        </div>
      ) : scripts?.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/10">
          <h3 className="text-xl font-medium mb-2">No scripts available</h3>
          <p className="text-muted-foreground mb-6">Start by creating your first script.</p>
          <Button onClick={() => navigate('/scripts/new')}>Create Script</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scripts?.map((script) => (
            <Card key={script.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{script.title}</CardTitle>
                <CardDescription>
                  {script.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(script.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate(`/rehearse/${script.id}`)}
                >
                  Rehearse
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/scripts/${script.id}`)}
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptsList;