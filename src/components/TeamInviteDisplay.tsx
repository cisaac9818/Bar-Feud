import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';

interface TeamInviteDisplayProps {
  teamCode: string;
  teamName: string;
}

export const TeamInviteDisplay: React.FC<TeamInviteDisplayProps> = ({ teamCode, teamName }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-900 to-emerald-900 border-4 border-green-400">
      <h3 className="text-xl font-black text-green-400 mb-2">Your Team</h3>
      <div className="text-white text-lg mb-4">{teamName}</div>
      <div className="bg-black/50 rounded-lg p-4 mb-3">
        <div className="text-gray-400 text-sm mb-1">Team Invite Code</div>
        <div className="text-4xl font-black text-green-400 tracking-widest text-center">
          {teamCode}
        </div>
      </div>
      <Button onClick={copyToClipboard} className="w-full bg-green-500 hover:bg-green-600" size="sm">
        {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Code</>}
      </Button>
      <p className="text-gray-300 text-xs mt-3 text-center">Share this code with teammates to join your team</p>
    </Card>
  );
};
