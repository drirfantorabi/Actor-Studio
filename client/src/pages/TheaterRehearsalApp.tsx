import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, File, Plus } from 'lucide-react';
import { Script } from '@shared/schema';

const TheaterRehearsalApp: React.FC = () => {
  const [, navigate] = useLocation();
  
  const { data: scripts, isLoading } = useQuery<Script[]>({ 
    queryKey: ['/api/scripts'],
  });

  useEffect(() => {
    // Ensure audio files exist on initial load
    fetch('/api/ensure-audio-files', {
      method: 'POST',
    }).catch(err => {
      console.error('Failed to ensure audio files:', err);
    });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Welcome Section */}
      <div className="text-center mb-12 mt-4">
        <h1 className="text-4xl font-bold text-primary mb-4">Theater Rehearsal Tool</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Practice your lines with automated scene partners and prepare for your next performance
        </p>
      </div>

      {/* Quick start buttons */}
      <div className="grid gap-4 md:grid-cols-2 mb-12">
        <Button 
          size="lg" 
          className="h-auto py-6 gap-3"
          onClick={() => navigate('/scripts')}
        >
          <BookOpen className="h-6 w-6" />
          <div className="text-left">
            <div className="font-bold">Browse Scripts</div>
            <div className="text-sm opacity-90">Choose from available scripts</div>
          </div>
          <ArrowRight className="ml-auto" />
        </Button>
        
        <Button 
          size="lg" 
          className="h-auto py-6 gap-3" 
          variant="outline"
          onClick={() => navigate('/scripts/new')}
        >
          <Plus className="h-6 w-6" />
          <div className="text-left">
            <div className="font-bold">Create New Script</div>
            <div className="text-sm opacity-90">Add your own script to rehearse</div>
          </div>
          <ArrowRight className="ml-auto" />
        </Button>
      </div>

      {/* Recent Scripts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Recent Scripts</h2>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded-md mb-2" />
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded-md" />
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-muted rounded-md w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : scripts && scripts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scripts.slice(0, 3).map(script => (
              <Card key={script.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{script.title}</CardTitle>
                  <CardDescription>
                    {script.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(script.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(`/rehearse/${script.id}`)}
                  >
                    Start Rehearsal
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 p-6 text-center bg-muted/5">
            <div className="flex justify-center mb-4">
              <File className="h-12 w-12 text-muted-foreground opacity-60" />
            </div>
            <h3 className="text-xl font-medium mb-2">No scripts available</h3>
            <p className="text-muted-foreground mb-4">
              Create your first script to start rehearsing
            </p>
            <Button onClick={() => navigate('/scripts/new')}>
              Create Script
            </Button>
          </Card>
        )}
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Choose a Script</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select from available scripts or create your own custom script with multiple characters
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Select Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Decide which character you want to play in the scene
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Practice Your Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interact with automated scene partners who will read their lines, giving you cues
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TheaterRehearsalApp;
