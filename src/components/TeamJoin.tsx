import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface TeamJoinProps {
  onTeamJoined: (sessionId: string, teamNumber: 1 | 2, teamName: string, teamId: string, teamCode: string) => void;
}

export const TeamJoin: React.FC<TeamJoinProps> = ({ onTeamJoined }) => {
  const [playerName, setPlayerName] = useState('');
  const [teamInviteCode, setTeamInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const joinTeam = async () => {
    if (!teamInviteCode.trim() || !playerName.trim()) {
      setError('Please enter team code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*, game_sessions(*)')
        .eq('team_invite_code', teamInviteCode.toUpperCase())
        .single();

      if (teamError || !team) {
        setError('Invalid team invite code');
        setLoading(false);
        return;
      }

      if (!team.game_sessions?.is_active) {
        setError('This game session is not active');
        setLoading(false);
        return;
      }

      await supabase.from('players').insert({
        team_id: team.id,
        player_name: playerName
      });

      onTeamJoined(team.session_id, team.team_number, team.team_name, team.id, team.team_invite_code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-900 to-black border-4 border-blue-400">
      <h2 className="text-3xl font-black text-blue-400 mb-6">Join a Team</h2>
      <p className="text-white mb-6">Enter the team invite code provided by your host to join your team.</p>
      <div className="space-y-4">
        <div>
          <label className="text-white font-bold mb-2 block">Team Invite Code</label>
          <Input 
            value={teamInviteCode} 
            onChange={(e) => setTeamInviteCode(e.target.value)} 
            placeholder="6-digit team code" 
            maxLength={6}
            className="bg-black/50 text-white border-blue-400 text-center text-2xl font-bold"
          />
        </div>
        <div>
          <label className="text-white font-bold mb-2 block">Your Name</label>
          <Input 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)} 
            placeholder="Your name"
            className="bg-black/50 text-white border-blue-400"
          />
        </div>
        {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
        <Button 
          onClick={joinTeam} 
          disabled={loading} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 text-xl"
        >
          {loading ? 'Joining...' : '👥 Join Team'}
        </Button>
      </div>
    </Card>
  );
};
