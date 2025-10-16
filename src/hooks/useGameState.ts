import { useState } from 'react';
import { GameState, Question } from '../types/game';

export const useGameState = (initialQuestions: Question[]) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    team1: { name: 'Team 1', score: 0, color: 'from-red-600 to-red-800' },
    team2: { name: 'Team 2', score: 0, color: 'from-blue-600 to-blue-800' },
    strikes: 0,
    round: 'face-off',
    activeTeam: null,
  });

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const selectQuestion = (question: Question) => {
    setGameState((prev) => ({
      ...prev,
      currentQuestion: { ...question, answers: question.answers.map(a => ({ ...a, revealed: false })) },
      strikes: 0,
    }));
  };

  const revealAnswer = (answerId: number) => {
    setGameState((prev) => {
      if (!prev.currentQuestion) return prev;
      return {
        ...prev,
        currentQuestion: {
          ...prev.currentQuestion,
          answers: prev.currentQuestion.answers.map((a) =>
            a.id === answerId ? { ...a, revealed: true } : a
          ),
        },
      };
    });
  };

  const addStrike = () => {
    setGameState((prev) => ({
      ...prev,
      strikes: Math.min(prev.strikes + 1, 3),
    }));
  };

  const resetStrikes = () => {
    setGameState((prev) => ({ ...prev, strikes: 0 }));
  };

  const awardPoints = (team: 1 | 2) => {
    if (!gameState.currentQuestion) return;
    const totalPoints = gameState.currentQuestion.answers
      .filter((a) => a.revealed)
      .reduce((sum, a) => sum + a.points, 0);

    setGameState((prev) => ({
      ...prev,
      [`team${team}`]: {
        ...prev[`team${team}` as 'team1' | 'team2'],
        score: prev[`team${team}` as 'team1' | 'team2'].score + totalPoints,
      },
    }));
  };

  const setActiveTeam = (team: 1 | 2 | null) => {
    setGameState((prev) => ({ ...prev, activeTeam: team }));
  };

  const resetGame = () => {
    setGameState({
      currentQuestion: null,
      team1: { name: 'Team 1', score: 0, color: 'from-red-600 to-red-800' },
      team2: { name: 'Team 2', score: 0, color: 'from-blue-600 to-blue-800' },
      strikes: 0,
      round: 'face-off',
      activeTeam: null,
    });
  };

  const addQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const bulkAddQuestions = (newQuestions: Question[]) => {
    setQuestions((prev) => [...prev, ...newQuestions]);
  };

  const updateTeamNames = (team1Name?: string, team2Name?: string) => {
    setGameState((prev) => ({
      ...prev,
      team1: team1Name ? { ...prev.team1, name: team1Name } : prev.team1,
      team2: team2Name ? { ...prev.team2, name: team2Name } : prev.team2,
    }));
  };



  return {
    gameState,
    questions,
    selectQuestion,
    revealAnswer,
    addStrike,
    resetStrikes,
    awardPoints,
    setActiveTeam,
    resetGame,
    addQuestion,
    bulkAddQuestions,
    updateTeamNames,
  };

};
