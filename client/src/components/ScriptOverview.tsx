import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';

interface DialogueProps {
  id: number;
  speaker: string;
  audio: string;
  content?: string;
}

interface ScriptOverviewProps {
  dialogueData: DialogueProps[];
  currentIndex: number;
}

const ScriptOverview: React.FC<ScriptOverviewProps> = ({ dialogueData, currentIndex }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Script Overview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {dialogueData.map((line, index) => (
          <div 
            key={line.id}
            className={`flex items-start p-2 rounded-md ${index === currentIndex ? 'bg-muted' : ''} ${index === currentIndex ? 'border-l-4 border-primary' : ''}`}
          >
            <div 
              className={`w-8 h-8 rounded-full ${index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center mr-3 shrink-0`}
            >
              {index + 1}
            </div>
            <div className="flex-grow">
              <div className="text-sm font-medium">{line.speaker}</div>
              {line.content && (
                <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {line.content}
                </div>
              )}
            </div>
            {line.audio && (
              <div className="text-muted-foreground shrink-0 ml-2">
                <Volume2 className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ScriptOverview;
