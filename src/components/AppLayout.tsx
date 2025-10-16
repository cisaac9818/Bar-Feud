import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { TeamScore } from './TeamScore';
import { StrikeDisplay } from './StrikeDisplay';
import { BuzzerButton } from './BuzzerButton';
import { HostControls } from './HostControls';
import { HostAnswerSheet } from './HostAnswerSheet';
import { QuestionManager } from './QuestionManager';
import { QuestionLibrary } from './QuestionLibrary';
import { VictoryScreen } from './VictoryScreen';
import { TeamNameEditor } from './TeamNameEditor';
import { FastMoneyBoard } from './FastMoneyBoard';
import { FastMoneyControls } from './FastMoneyControls';
import { HostFastMoneySheet } from './HostFastMoneySheet';
import { AuthModal } from './AuthModal';
import { RoleSelector } from './RoleSelector';
import { AudioEnablePrompt } from './AudioEnablePrompt';
import { UtilitiesModal } from './UtilitiesModal';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useGameState } from '../hooks/useGameState';
import { useFastMoney } from '../hooks/useFastMoney';
import { useGameStateSync } from '../hooks/useGameStateSync';
import { sampleQuestions, categories } from '../data/sampleQuestions';
import { fastMoneyQuestions as initialFastMoneyQuestions } from '../data/fastMoneyQuestions';
import { FastMoneyQuestion } from '../types/fastMoney';
import { triggerSoundEffect } from '../utils/sounds';
import { supabase } from '@/lib/supabase';




const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'player' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [team1Code, setTeam1Code] = useState<string>('');
  const [team2Code, setTeam2Code] = useState<string>('');
  const [team1Name, setTeam1Name] = useState<string>('Team 1');
  const [team2Name, setTeam2Name] = useState<string>('Team 2');

  // Check if this is contestant view from URL
  const urlParams = new URLSearchParams(window.location.search);
  const isContestantView = urlParams.get('view') === 'contestant';
  const contestantSessionId = urlParams.get('sessionId');




  // State for contestant view synced data
  const [syncedGameState, setSyncedGameState] = useState<any>(null);
  const [syncedFastMoneyState, setSyncedFastMoneyState] = useState<any>(null);
  const [syncedShowFastMoney, setSyncedShowFastMoney] = useState(false);
  const [syncedLogo, setSyncedLogo] = useState('https://d64gsuwffb70l.cloudfront.net/68ef9da9b4d1a124ccc08fde_1760534449907_2f6dd7ee.png');
  const [contestantError, setContestantError] = useState<string | null>(null);




  const { gameState, questions, selectQuestion, revealAnswer, addStrike, resetStrikes, awardPoints, setActiveTeam, resetGame, addQuestion, bulkAddQuestions, updateTeamNames } = useGameState(sampleQuestions);

  const [fastMoneyQuestionsState, setFastMoneyQuestionsState] = useState<FastMoneyQuestion[]>(initialFastMoneyQuestions);
  const { fastMoneyState, startPlayer, submitAnswer, endPlayerTurn, revealPoints, revealBestAnswer, adjustPoints, nextPlayer, endRound, resetFastMoney } = useFastMoney(fastMoneyQuestionsState);

  const handleAddFastMoneyQuestion = (question: FastMoneyQuestion) => {
    setFastMoneyQuestionsState(prev => [...prev, question]);
  };

  const handleDeleteFastMoneyQuestion = (id: string) => {
    setFastMoneyQuestionsState(prev => prev.filter(q => q.id !== id));
  };



  const [logo, setLogo] = useState('https://d64gsuwffb70l.cloudfront.net/68ef9da9b4d1a124ccc08fde_1760534449907_2f6dd7ee.png');
  const [showVictory, setShowVictory] = useState(false);
  const [winner, setWinner] = useState<typeof gameState.team1 | null>(null);
  const [showFastMoney, setShowFastMoney] = useState(false);
  const [showUtilities, setShowUtilities] = useState(false);
  const bgImage = 'https://d64gsuwffb70l.cloudfront.net/68ef9fbe21517e95a8a9e74c_1760534511279_66025f32.webp';



  // Sync hook for host to save state (include logo in gameState)
  const gameStateWithLogo = { ...gameState, logo };
  const { saveGameState } = useGameStateSync(
    sessionId,
    userRole === 'host',
    gameStateWithLogo,
    fastMoneyState,
    showFastMoney,
    undefined
  );


  // Sync hook for contestant to receive state
  useGameStateSync(
    contestantSessionId,
    false,
    null,
    null,
    false,
    (data) => {
      setSyncedGameState(data.game_state);
      setSyncedFastMoneyState(data.fast_money_state);
      setSyncedShowFastMoney(data.show_fast_money);
      if (data.game_state?.logo) setSyncedLogo(data.game_state.logo);
    }
  );

  // Host: Save initial state when session is created
  useEffect(() => {
    if (userRole === 'host' && sessionId) {
      saveGameState();
    }
  }, [sessionId, userRole, saveGameState]);



  // Host: Save state whenever it changes
  useEffect(() => {
    if (userRole === 'host' && sessionId) {
      saveGameState();
    }
  }, [gameState, fastMoneyState, showFastMoney, logo, saveGameState]);


  useEffect(() => {
    if (gameState.team1.score >= 300) {
      setWinner(gameState.team1);
      setShowVictory(true);
      triggerSoundEffect('victory');
    } else if (gameState.team2.score >= 300) {
      setWinner(gameState.team2);
      setShowVictory(true);
      triggerSoundEffect('victory');
    }
  }, [gameState.team1.score, gameState.team2.score]);

  const handleRevealAnswer = (id: number) => {
    revealAnswer(id);
    triggerSoundEffect('reveal');
  };
  const handleAddStrike = () => {
    addStrike();
    triggerSoundEffect('wrong');
  };

  const handleBuzz = (team: 1 | 2) => {
    setActiveTeam(team);
    triggerSoundEffect('buzzer');
  };
  const handleVictoryClose = () => {
    setShowVictory(false);
    setWinner(null);
    resetGame();
  };

  const handleRoleSelect = (role: 'host' | 'player', sid?: string, scode?: string, t1code?: string, t2code?: string) => {
    setUserRole(role);
    if (sid) setSessionId(sid);
    if (scode) setSessionCode(scode);
    if (t1code) setTeam1Code(t1code);
    if (t2code) setTeam2Code(t2code);
  };




  const openContestantView = () => {
    const contestantUrl = `${window.location.origin}${window.location.pathname}?view=contestant&sessionId=${sessionId}`;
    window.open(contestantUrl, '_blank', 'width=1920,height=1080');
  };



  // Fetch team names for display (removed - no longer needed for contestant view)



  // Sync team names from database
  useEffect(() => {
    if (!sessionId || userRole !== 'host') return;

    const fetchTeamNames = async () => {
      const { data: teams } = await supabase
        .from('teams')
        .select('team_number, team_name')
        .eq('session_id', sessionId);

      if (teams && teams.length > 0) {
        const team1 = teams.find(t => t.team_number === 1);
        const team2 = teams.find(t => t.team_number === 2);
        
        updateTeamNames(team1?.team_name, team2?.team_name);
      }
    };


    fetchTeamNames();

    // Subscribe to team changes
    const channel = supabase
      .channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `session_id=eq.${sessionId}` }, () => {
        fetchTeamNames();
      })
      .subscribe();


    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userRole]);


  // Skip role selector for contestant view
  if (isContestantView && syncedGameState) {
    const displayGameState = syncedGameState || gameState;
    const displayFastMoneyState = syncedFastMoneyState || fastMoneyState;
    const displayShowFastMoney = syncedShowFastMoney;
    const displayLogo = syncedLogo;

    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="min-h-screen bg-black/80 backdrop-blur-sm flex flex-col">
          <header className="bg-gradient-to-r from-red-700 via-black to-red-700 border-b-4 border-yellow-400 py-2 flex-shrink-0">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <img src={displayLogo} alt="Bar Feud" className="w-12 h-12 mr-4" />
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] uppercase tracking-wider">Bar Feud</h1>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {!displayShowFastMoney ? (
              <div className="h-full grid grid-cols-12 gap-4 p-4">
                <div className="col-span-3 flex items-center justify-center">
                  <TeamScore team={displayGameState.team1} isActive={displayGameState.activeTeam === 1} side="left" />
                </div>
                <div className="col-span-6 flex flex-col justify-center space-y-4">
                  <GameBoard question={displayGameState.currentQuestion} logo={displayLogo} />
                  <StrikeDisplay strikes={displayGameState.strikes} />
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <TeamScore team={displayGameState.team2} isActive={displayGameState.activeTeam === 2} side="right" />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                  <FastMoneyBoard 
                    questions={displayFastMoneyState.questions} 
                    responses={displayFastMoneyState.currentPlayer === 1 ? (displayFastMoneyState.player1?.responses || []) : (displayFastMoneyState.player2?.responses || [])} 
                    phase={displayFastMoneyState.phase} 
                    totalPoints={displayFastMoneyState.currentPlayer === 1 ? (displayFastMoneyState.player1?.totalPoints || 0) : (displayFastMoneyState.player2?.totalPoints || 0)} 
                    player1TotalPoints={displayFastMoneyState.player1?.totalPoints || 0} 
                    player2TotalPoints={displayFastMoneyState.player2?.totalPoints || 0} 
                    currentPlayer={displayFastMoneyState.currentPlayer} 
                    player1Responses={displayFastMoneyState.player1?.responses || []}
                    timeRemaining={displayFastMoneyState.timeRemaining}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  // Loading state for contestant view
  if (isContestantView && !syncedGameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <h1 className="text-4xl font-black text-yellow-400 mb-4">Loading Contestant View...</h1>
          <p className="text-white text-lg">Connecting to game session: {contestantSessionId}</p>
          <p className="text-gray-400 text-sm mt-4">Check browser console for detailed logs</p>
          {contestantError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-300">{contestantError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }




  // Show role selector if no role selected
  if (!isContestantView && userRole === null) {
    return <RoleSelector onSelectRole={handleRoleSelect} />;
  }





  return (
    <>
      <AudioEnablePrompt />
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImage})` }}>

      <div className="min-h-screen bg-black/80 backdrop-blur-sm">
        <header className="bg-gradient-to-r from-red-700 via-black to-red-700 border-b-8 border-yellow-400 py-6">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <img src={logo} alt="Bar Feud" className="w-24 h-24" />
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] uppercase tracking-wider">Bar Feud</h1>
            <div className="flex gap-2 items-center">
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-yellow-400 font-bold uppercase">{userRole}</span>
              </div>
              <Button onClick={() => setUserRole(null)} variant="outline" size="sm">Change Role</Button>
              {user ? (
                <>
                  <span className="text-white text-sm">{user.email}</span>
                  <Button onClick={() => signOut()} variant="outline" size="sm">Sign Out</Button>
                </>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} variant="outline" size="sm">Sign In</Button>
              )}
            </div>
          </div>
        </header>
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        <UtilitiesModal 
          open={showUtilities} 
          onOpenChange={setShowUtilities}
          logo={logo}
          onLogoChange={setLogo}
          questions={questions}
          onAddQuestion={addQuestion}
          onBulkAddQuestions={bulkAddQuestions}
          fastMoneyQuestions={fastMoneyQuestionsState}
          onAddFastMoneyQuestion={handleAddFastMoneyQuestion}
          onDeleteFastMoneyQuestion={handleDeleteFastMoneyQuestion}
        />

        <div className="container mx-auto px-4 py-8">
          {!showFastMoney ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <TeamScore team={gameState.team1} isActive={gameState.activeTeam === 1} side="left" />
                {userRole === 'host' && (
                  <div className="space-y-6">
                    <button onClick={openContestantView} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black py-4 px-6 rounded-lg text-xl uppercase tracking-wider shadow-lg transition">📺 Open Contestant View</button>
                    <button onClick={() => setShowUtilities(true)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black py-4 px-6 rounded-lg text-xl uppercase tracking-wider shadow-lg transition">⚙️ Utilities</button>
                    <HostAnswerSheet question={gameState.currentQuestion} onRevealAnswer={handleRevealAnswer} />
                    <HostControls onAddStrike={handleAddStrike} onResetStrikes={resetStrikes} onAwardPoints={awardPoints} onResetGame={resetGame} onNextRound={() => {}} currentRound={gameState.round} />
                    <TeamNameEditor team1Name={gameState.team1.name} team2Name={gameState.team2.name} onUpdate={(n1, n2) => console.log(n1, n2)} />
                    <button onClick={() => setShowFastMoney(true)} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-black py-4 px-6 rounded-lg text-xl uppercase tracking-wider shadow-lg transition">⚡ Start Fast Money</button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 space-y-8">
                <GameBoard question={gameState.currentQuestion} onRevealAnswer={userRole === 'host' ? handleRevealAnswer : undefined} logo={logo} />
                <StrikeDisplay strikes={gameState.strikes} />
                {userRole === 'host' && <QuestionLibrary questions={questions} onSelectQuestion={selectQuestion} categories={categories} />}
              </div>
              <div className="lg:col-span-3 space-y-6">
                <TeamScore team={gameState.team2} isActive={gameState.activeTeam === 2} side="right" />
              </div>
            </div>


          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {userRole === 'host' && (
                  <>
                    <HostFastMoneySheet questions={fastMoneyState.questions} />
                    <FastMoneyControls currentPlayer={fastMoneyState.currentPlayer} questions={fastMoneyState.questions} timeRemaining={fastMoneyState.timeRemaining} phase={fastMoneyState.phase} player1={fastMoneyState.player1} player2={fastMoneyState.player2} onStartPlayer={startPlayer} onSubmitAnswer={submitAnswer} onEndPlayerTurn={endPlayerTurn} onRevealPoints={revealPoints} onRevealBestAnswer={revealBestAnswer} onAdjustPoints={adjustPoints} onNextPlayer={nextPlayer} onEndRound={() => { endRound(); setShowFastMoney(false); resetFastMoney(); }} />
                  </>
                )}
                <button onClick={() => { setShowFastMoney(false); resetFastMoney(); }} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition">Exit Fast Money</button>
              </div>
              <div className="lg:col-span-6 space-y-8">
                <FastMoneyBoard questions={fastMoneyState.questions} responses={fastMoneyState.currentPlayer === 1 ? (fastMoneyState.player1?.responses || []) : (fastMoneyState.player2?.responses || [])} phase={fastMoneyState.phase} totalPoints={fastMoneyState.currentPlayer === 1 ? (fastMoneyState.player1?.totalPoints || 0) : (fastMoneyState.player2?.totalPoints || 0)} player1TotalPoints={fastMoneyState.player1?.totalPoints || 0} player2TotalPoints={fastMoneyState.player2?.totalPoints || 0} currentPlayer={fastMoneyState.currentPlayer} player1Responses={fastMoneyState.player1?.responses || []} />
              </div>
              <div className="lg:col-span-3 space-y-6">
                {fastMoneyState.player1 && (
                  <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-6 shadow-2xl border-4 border-green-500">
                    <h3 className="text-2xl font-black text-yellow-400 mb-2">Player 1</h3>
                    <div className="text-white text-xl">{fastMoneyState.player1.name}</div>
                    <div className="text-3xl font-black text-green-400 mt-2">{fastMoneyState.player1.totalPoints} pts</div>
                  </div>
                )}
                {fastMoneyState.player2 && (
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 shadow-2xl border-4 border-blue-500">
                    <h3 className="text-2xl font-black text-yellow-400 mb-2">Player 2</h3>
                    <div className="text-white text-xl">{fastMoneyState.player2.name}</div>
                    <div className="text-3xl font-black text-blue-400 mt-2">{fastMoneyState.player2.totalPoints} pts</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {showVictory && winner && <VictoryScreen winner={winner} onClose={handleVictoryClose} logo={logo} />}
      </div>
    </div>
    </>
  );
};

export default AppLayout;
