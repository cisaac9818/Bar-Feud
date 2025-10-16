import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FastMoneyQuestion, FastMoneyPhase, FastMoneyPlayer } from '../types/fastMoney';
import { sounds } from '../utils/sounds';

interface FastMoneyControlsProps {
  currentPlayer: 1 | 2;
  questions: FastMoneyQuestion[];
  timeRemaining: number;
  phase: FastMoneyPhase;
  player1: FastMoneyPlayer | null;
  player2: FastMoneyPlayer | null;
  onStartPlayer: (playerName: string) => void;
  onSubmitAnswer: (questionIndex: number, answer: string, manualPoints?: number) => void;

  onEndPlayerTurn: () => void;
  onRevealPoints: (questionIndex: number) => void;

  onRevealBestAnswer: (questionIndex: number) => void;
  onAdjustPoints: (questionIndex: number, points: number) => void;
  onNextPlayer: () => void;
  onEndRound: () => void;
}



export const FastMoneyControls: React.FC<FastMoneyControlsProps> = ({
  currentPlayer,
  questions,
  timeRemaining,
  phase,
  player1,
  player2,
  onStartPlayer,
  onSubmitAnswer,
  onEndPlayerTurn,
  onRevealPoints,

  onRevealBestAnswer,
  onAdjustPoints,
  onNextPlayer,
  onEndRound,
}) => {

  const [playerName, setPlayerName] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [manualPoints, setManualPoints] = useState<string[]>(['', '', '', '', '']);

  const handleStart = () => {
    if (playerName.trim()) {
      onStartPlayer(playerName);
      setPlayerName('');
      setAnswers(['', '', '', '', '']);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    
    const manualPts = manualPoints[index] ? parseInt(manualPoints[index]) : undefined;
    onSubmitAnswer(index, value, manualPts);
  };


  const handleDuplicateBuzzer = () => {
    sounds.strike();
  };

  const handleManualPointChange = (index: number, value: string) => {
    const newManualPoints = [...manualPoints];
    newManualPoints[index] = value;
    setManualPoints(newManualPoints);
  };

  const handleApplyManualPoints = (index: number) => {
    const points = parseInt(manualPoints[index]);
    if (!isNaN(points) && points >= 0) {
      onAdjustPoints(index, points);
      const newManualPoints = [...manualPoints];
      newManualPoints[index] = '';
      setManualPoints(newManualPoints);
    }
  };

  const currentPlayerData = currentPlayer === 1 ? player1 : player2;
  const allAnswersEntered = currentPlayerData?.responses.length === 5;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 shadow-2xl border-4 border-purple-500">
      <h3 className="text-2xl font-black text-yellow-400 mb-4">
        Fast Money Host Controls - Player {currentPlayer}
      </h3>
      
      {phase === 'setup' && (
        <div className="space-y-3">
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={`Player ${currentPlayer} Name`}
            className="bg-black/50 text-white border-purple-400"
          />
          <Button onClick={handleStart} className="w-full bg-green-600 hover:bg-green-700">
            Start Player {currentPlayer}
          </Button>
        </div>
      )}
      
      {phase === 'playing' && (
        <div className="space-y-4">
          <div className="text-white text-2xl font-bold text-center bg-red-600 p-3 rounded-lg">
            Time: {timeRemaining}s
          </div>
          
          {currentPlayer === 2 && (
            <Button 
              onClick={handleDuplicateBuzzer}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xl py-6 animate-pulse"
            >
              🚨 DUPLICATE ANSWER BUZZER 🚨
            </Button>
          )}
          
          {currentPlayer === 2 && player1 && (
            <div className="bg-yellow-400/20 p-3 rounded-lg border-2 border-yellow-400">
              <div className="text-yellow-400 font-bold mb-2">Player 1's Answers:</div>
              {player1.responses.map((r, i) => (
                <div key={i} className="text-white text-sm">{i+1}. {r.answer}</div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-1">
                <label className="text-white text-sm font-bold">Q{index + 1}: {q.question}</label>
                <div className="flex gap-2">
                  <Input
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter player's answer"
                    className="bg-black/50 text-white border-purple-400 flex-1"
                  />
                  <Input
                    type="number"
                    value={manualPoints[index]}
                    onChange={(e) => handleManualPointChange(index, e.target.value)}
                    placeholder="Pts"
                    className="bg-black/50 text-white border-yellow-400 w-20"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>

          
          <Button 
            onClick={onEndPlayerTurn} 
            disabled={!allAnswersEntered}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            End Turn & Reveal Answers
          </Button>
        </div>
      )}
      
      {phase === 'revealing' && currentPlayerData && (
        <div className="space-y-3">
          <div className="text-white font-bold mb-2">Reveal Points for Each Answer:</div>
          {questions.map((q, index) => {
            const response = currentPlayerData.responses[index];
            const pointsRevealed = response?.pointsRevealed;
            const bestAnswerRevealed = response?.bestAnswerRevealed;
            const bestAnswer = q.answers.reduce((max, ans) => ans.points > max.points ? ans : max, q.answers[0]);
            
            return (
              <div key={q.id} className="space-y-2 bg-black/30 p-3 rounded-lg">
                <div className="text-white text-sm font-bold">
                  Q{index + 1}: {response?.answer || 'No answer'}
                </div>
                
                <Button
                  onClick={() => onRevealPoints(index)}
                  disabled={pointsRevealed}
                  className={`w-full ${pointsRevealed ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {pointsRevealed ? `✓ Points Revealed: ${response.points} pts` : `Reveal Points for Q${index + 1}`}
                </Button>
                
                {pointsRevealed && response.points === 0 && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={manualPoints[index]}
                      onChange={(e) => handleManualPointChange(index, e.target.value)}
                      placeholder="Manual pts"
                      className="bg-black/50 text-white border-yellow-400"
                      min="0"
                    />
                    <Button
                      onClick={() => handleApplyManualPoints(index)}
                      className="bg-yellow-600 hover:bg-yellow-700 whitespace-nowrap"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                
                {pointsRevealed && currentPlayer === 2 && (
                  <Button
                    onClick={() => onRevealBestAnswer(index)}
                    disabled={bestAnswerRevealed}
                    className={`w-full ${bestAnswerRevealed ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {bestAnswerRevealed 
                      ? `✓ Best: "${bestAnswer.text}" (${bestAnswer.points} pts)` 
                      : `Show Best Answer`}
                  </Button>
                )}
              </div>
            );
          })}


          
          <div className="pt-4 border-t-2 border-purple-400">
            {currentPlayer === 1 && (
              <Button onClick={onNextPlayer} className="w-full bg-green-600 hover:bg-green-700">
                Start Player 2
              </Button>
            )}
            {currentPlayer === 2 && (
              <Button onClick={onEndRound} className="w-full bg-red-600 hover:bg-red-700">
                End Fast Money
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
