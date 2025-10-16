import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { AuthModal } from './AuthModal';

interface HostSetupProps {
  onSessionCreated: (sessionId: string, sessionCode: string, team1Code: string, team2Code: string) => void;
}

export const HostSetup: React.FC<HostSetupProps> = ({ onSessionCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [team1Name, setTeam1Name] = useState('Team 1');
  const [team2Name, setTeam2Name] = useState('Team 2');
  const { user } = useAuth();

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createSession = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionCode = generateCode();

      const { data, error: insertError } = await supabase
        .from('game_sessions')
        .insert({
          host_id: user.id,
          session_code: sessionCode,
          is_active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { data: code1Data } = await supabase.rpc('generate_team_code');
      const { data: code2Data } = await supabase.rpc('generate_team_code');

      await supabase.from('teams').insert([
        {
          session_id: data.id,
          team_name: team1Name,
          team_number: 1,
          team_invite_code: code1Data
        },
        {
          session_id: data.id,
          team_name: team2Name,
          team_number: 2,
          team_invite_code: code2Data
        }
      ]);

      onSessionCreated(data.id, sessionCode, code1Data, code2Data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-8 bg-gradient-to-br from-red-900 to-black border-4 border-yellow-400">
        <h2 className="text-3xl font-black text-yellow-400 mb-4">Create Game Session</h2>
        <p className="text-white mb-6">
          {user 
            ? "Set up team names and create your game session."
            : "Sign in to create and host a game session."
          }
        </p>
        {user && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-yellow-400 font-bold mb-2 block">Team 1 Name</label>
              <Input value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} className="bg-black/50 text-white border-yellow-400" />
            </div>
            <div>
              <label className="text-yellow-400 font-bold mb-2 block">Team 2 Name</label>
              <Input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} className="bg-black/50 text-white border-yellow-400" />
            </div>
          </div>
        )}
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        <Button 
          onClick={createSession} 
          disabled={loading} 
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-xl"
        >
          {loading ? 'Creating...' : user ? '🎮 Create Game Session' : '🔐 Sign In to Host'}
        </Button>
      </Card>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};
