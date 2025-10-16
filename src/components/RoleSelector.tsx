import React, { useState } from 'react';
import { Card } from './ui/card';
import { HostSetup } from './HostSetup';

interface RoleSelectorProps {
  onSelectRole: (role: 'host' | 'player', sessionId?: string, sessionCode?: string, team1Code?: string, team2Code?: string) => void;
}


export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<'host' | null>(null);

  const handleHostSessionCreated = (sessionId: string, sessionCode: string, team1Code: string, team2Code: string) => {
    console.log('RoleSelector: Session created', { sessionId, sessionCode, team1Code, team2Code });
    onSelectRole('host', sessionId, sessionCode, team1Code, team2Code);
  };


  if (selectedRole === 'host') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-black to-red-900 p-4">
        <div className="max-w-md w-full">
          <button onClick={() => setSelectedRole(null)} className="text-white mb-4 hover:text-yellow-400">← Back</button>
          <HostSetup onSessionCreated={handleHostSessionCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 p-4">
      <div className="max-w-2xl w-full">
        <Card onClick={() => setSelectedRole('host')} className="p-12 bg-gradient-to-br from-red-900 to-black border-4 border-yellow-400 cursor-pointer hover:scale-105 transition-transform">
          <div className="text-center">
            <div className="text-8xl mb-6">🎮</div>
            <h2 className="text-4xl font-black text-yellow-400 mb-4">START AS HOST</h2>
            <p className="text-white text-lg mb-2">Control the game, see answers, manage questions</p>
            <p className="text-yellow-200 text-sm">The contestant view will open in a separate window</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
