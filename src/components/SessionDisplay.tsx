import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

interface SessionDisplayProps {
  sessionCode: string;
  team1Code: string;
  team2Code: string;
  team1Name: string;
  team2Name: string;
}

export const SessionDisplay: React.FC<SessionDisplayProps> = ({ 
  sessionCode, 
  team1Code, 
  team2Code,
  team1Name,
  team2Name
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-yellow-900 to-orange-900 border-4 border-yellow-400">
        <h3 className="text-xl font-black text-yellow-400 mb-2">Game Session Code</h3>
        <div className="text-5xl font-black text-white text-center py-4 bg-black/50 rounded-lg tracking-widest">
          {sessionCode}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-red-900 to-red-700 border-4 border-red-400">
          <h3 className="text-lg font-black text-red-200 mb-2">{team1Name} Invite Code</h3>
          <div className="text-4xl font-black text-white text-center py-3 bg-black/50 rounded-lg tracking-widest mb-3">
            {team1Code}
          </div>
          <Button 
            onClick={() => copyToClipboard(team1Code)} 
            className="w-full bg-red-500 hover:bg-red-600"
            size="sm"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy Code
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-900 to-blue-700 border-4 border-blue-400">
          <h3 className="text-lg font-black text-blue-200 mb-2">{team2Name} Invite Code</h3>
          <div className="text-4xl font-black text-white text-center py-3 bg-black/50 rounded-lg tracking-widest mb-3">
            {team2Code}
          </div>
          <Button 
            onClick={() => copyToClipboard(team2Code)} 
            className="w-full bg-blue-500 hover:bg-blue-600"
            size="sm"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy Code
          </Button>
        </Card>
      </div>
    </div>
  );
};
