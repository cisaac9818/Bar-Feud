import React from 'react';
import { FastMoneyQuestion, FastMoneyResponse, FastMoneyPhase } from '../types/fastMoney';

interface FastMoneyBoardProps {
  questions: FastMoneyQuestion[];
  responses: FastMoneyResponse[];
  phase: FastMoneyPhase;
  totalPoints: number;
  player1TotalPoints?: number;
  player2TotalPoints?: number;
  currentPlayer: number;
  player1Responses?: FastMoneyResponse[];
  timeRemaining?: number;
}




export const FastMoneyBoard: React.FC<FastMoneyBoardProps> = ({
  questions,
  responses,
  phase,
  totalPoints,
  player1TotalPoints = 0,
  player2TotalPoints = 0,
  currentPlayer,
  player1Responses = [],
  timeRemaining,
}) => {


  const combinedTotal = player1TotalPoints + player2TotalPoints;

  return (

    <div className="space-y-3">


    <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-4 shadow-2xl border-3 border-yellow-400">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider">
          Fast Money {currentPlayer === 2 ? '- Player 2' : ''}
        </h2>
        {timeRemaining !== undefined && phase === 'playing' && (
          <div className={`text-4xl font-black ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
            {timeRemaining}s
          </div>
        )}
      </div>


      <div className="space-y-2">
        {questions.map((question, index) => {
          const response = responses[index];
          const showAnswer = response?.revealed;
          const showPoints = response?.pointsRevealed;
          const bestAnswer = question.answers.reduce((max, ans) => ans.points > max.points ? ans : max, question.answers[0]);
          
          return (
            <div
              key={question.id}
              className={`p-3 rounded-lg transition-all ${
                response?.pointsRevealed ? 'bg-green-400/20 border-2 border-green-400' : 'bg-black/30'
              }`}
            >
              <div className="text-white font-bold mb-1 text-base">
                {index + 1}. {question.question}
              </div>
              <div className="flex justify-between items-center">
                <div className={`text-xl font-black ${showAnswer ? 'text-yellow-400' : 'text-gray-600'}`}>
                  {showAnswer && response ? response.answer : '___________'}
                </div>
                {showPoints && (
                  <div className="text-2xl font-black text-green-400 animate-pulse">
                    {response.points}
                  </div>
                )}
              </div>
              
              {response?.bestAnswerRevealed && (
                <div className="mt-2 p-2 bg-green-600/30 border-2 border-green-400 rounded-lg">
                  <div className="text-xs text-green-300 font-bold mb-1">Most Popular Answer:</div>
                  <div className="text-base font-black text-green-200">
                    {bestAnswer.text}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>


      
      {phase === 'revealing' && (
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-yellow-400 rounded-lg">
            <div className="text-center text-2xl font-black text-black">
              CURRENT PLAYER: {totalPoints}
            </div>
          </div>
          {player1TotalPoints > 0 && player2TotalPoints > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg border-3 border-yellow-400 shadow-2xl">
              <div className="text-center space-y-1">
                <div className="text-white text-base font-bold">COMBINED TOTAL</div>
                <div className="text-4xl font-black text-yellow-300 animate-pulse">
                  {combinedTotal} POINTS
                </div>
                <div className="text-white text-xs font-semibold">
                  Player 1: {player1TotalPoints} + Player 2: {player2TotalPoints}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
    </div>
  );
};



