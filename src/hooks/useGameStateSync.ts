import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useGameStateSync = (
  sessionId: string | null,
  isHost: boolean,
  gameState: any,
  fastMoneyState: any,
  showFastMoney: boolean,
  onStateUpdate?: (state: any) => void
) => {
  // Host: Save game state to database
  const saveGameState = useCallback(async () => {
    if (!sessionId || !isHost) return;

    const stateData = {
      session_code: sessionId,
      game_state: gameState,
      fast_money_state: fastMoneyState,
      show_fast_money: showFastMoney,
      logo: gameState?.logo,
      updated_at: new Date().toISOString()
    };

    console.log('Host: Saving game state:', stateData);

    const { data, error } = await supabase
      .from('game_sessions')
      .upsert(stateData, { onConflict: 'session_code' });


    if (error) {
      console.error('Host: Error saving game state:', error);
    } else {
      console.log('Host: Game state saved successfully:', data);
    }
  }, [sessionId, isHost, gameState, fastMoneyState, showFastMoney]);


  // Contestant: Subscribe to game state changes
  useEffect(() => {
    if (!sessionId || isHost) return;

    console.log('Contestant: Fetching game state for session:', sessionId);

    const fetchInitialState = async () => {
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('session_code', sessionId)
          .single();

        console.log('Contestant: Fetch result:', { data, error });

        if (error) {
          console.error('Contestant: Error fetching game state:', error);
          return;
        }

        if (data && onStateUpdate) {
          console.log('Contestant: Updating state with data:', data);
          onStateUpdate(data);
        } else {
          console.log('Contestant: No data found for session');
        }
      } catch (err) {
        console.error('Contestant: Exception fetching game state:', err);
      }
    };

    fetchInitialState();

    const channel = supabase
      .channel(`game-state-${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_sessions',
        filter: `session_code=eq.${sessionId}`
      }, (payload) => {
        console.log('Contestant: Received realtime update:', payload);
        if (payload.new && onStateUpdate) {
          onStateUpdate(payload.new);
        }
      })
      .subscribe((status) => {
        console.log('Contestant: Subscription status:', status);
      });


    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, isHost, onStateUpdate]);


  return { saveGameState };
};
