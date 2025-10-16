import { useState, useEffect } from 'react';
import { FastMoneyState, FastMoneyQuestion, FastMoneyResponse } from '../types/fastMoney';

export const useFastMoney = (questions: FastMoneyQuestion[]) => {
  const [fastMoneyState, setFastMoneyState] = useState<FastMoneyState>({
    questions: questions.slice(0, 5),
    player1: null,
    player2: null,
    currentPlayer: 1,
    currentQuestionIndex: 0,
    timeRemaining: 45,
    phase: 'setup',
    targetScore: 200,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (fastMoneyState.phase === 'playing' && fastMoneyState.timeRemaining > 0) {
      timer = setTimeout(() => {
        setFastMoneyState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (fastMoneyState.phase === 'playing' && fastMoneyState.timeRemaining === 0) {
      setFastMoneyState(prev => ({ ...prev, phase: 'revealing' }));
    }
    return () => clearTimeout(timer);
  }, [fastMoneyState.phase, fastMoneyState.timeRemaining]);

  const startPlayer = (playerName: string) => {
    const timeLimit = fastMoneyState.currentPlayer === 1 ? 45 : 60;
    setFastMoneyState(prev => ({
      ...prev,
      [`player${prev.currentPlayer}`]: {
        name: playerName,
        responses: [],
        totalPoints: 0,
      },
      timeRemaining: timeLimit,
      phase: 'playing',
      currentQuestionIndex: 0,
    }));
  };
  const submitAnswer = (questionIndex: number, answer: string, manualPoints?: number) => {
    const currentQuestion = fastMoneyState.questions[questionIndex];
    const matchedAnswer = currentQuestion.answers.find(
      a => a.text.toLowerCase().trim() === answer.toLowerCase().trim()
    );
    
    const points = manualPoints !== undefined && manualPoints >= 0 
      ? manualPoints 
      : (matchedAnswer ? matchedAnswer.points : 0);
    
    const response: FastMoneyResponse = {
      questionId: currentQuestion.id,
      answer: answer,
      points: points,
      revealed: true, // Auto-reveal answer text immediately
      pointsRevealed: false, // Keep points hidden until host reveals
    };

    setFastMoneyState(prev => {
      const player = prev[`player${prev.currentPlayer}` as 'player1' | 'player2'];
      if (!player) return prev;

      const existingIndex = player.responses.findIndex(r => r.questionId === currentQuestion.id);
      let updatedResponses;
      
      if (existingIndex >= 0) {
        updatedResponses = [...player.responses];
        updatedResponses[existingIndex] = response;
      } else {
        updatedResponses = [...player.responses, response];
      }

      return {
        ...prev,
        [`player${prev.currentPlayer}`]: {
          ...player,
          responses: updatedResponses,
        },
      };
    });
  };



  const endPlayerTurn = () => {
    setFastMoneyState(prev => ({ ...prev, phase: 'revealing' }));
  };

  const revealPoints = (questionIndex: number) => {
    setFastMoneyState(prev => {
      const player = prev[`player${prev.currentPlayer}` as 'player1' | 'player2'];
      if (!player) return prev;

      const updatedResponses = player.responses.map((r, idx) => 
        idx === questionIndex ? { ...r, pointsRevealed: true } : r
      );

      const totalPoints = updatedResponses
        .filter(r => r.pointsRevealed)
        .reduce((sum, r) => sum + r.points, 0);

      return {
        ...prev,
        [`player${prev.currentPlayer}`]: {
          ...player,
          responses: updatedResponses,
          totalPoints,
        },
      };
    });
  };


  const revealBestAnswer = (questionIndex: number) => {
    setFastMoneyState(prev => {
      const player = prev[`player${prev.currentPlayer}` as 'player1' | 'player2'];
      if (!player) return prev;

      const updatedResponses = player.responses.map((r, idx) => 
        idx === questionIndex ? { ...r, bestAnswerRevealed: true } : r
      );

      return {
        ...prev,
        [`player${prev.currentPlayer}`]: {
          ...player,
          responses: updatedResponses,
        },
      };
    });
  };

  const adjustPoints = (questionIndex: number, points: number) => {
    setFastMoneyState(prev => {
      const player = prev[`player${prev.currentPlayer}` as 'player1' | 'player2'];
      if (!player) return prev;

      const updatedResponses = player.responses.map((r, idx) => 
        idx === questionIndex ? { ...r, points } : r
      );

      const totalPoints = updatedResponses
        .filter(r => r.revealed)
        .reduce((sum, r) => sum + r.points, 0);

      return {
        ...prev,
        [`player${prev.currentPlayer}`]: {
          ...player,
          responses: updatedResponses,
          totalPoints,
        },
      };
    });
  };


  const nextPlayer = () => {
    setFastMoneyState(prev => ({
      ...prev,
      currentPlayer: 2,
      currentQuestionIndex: 0,
      phase: 'setup',
    }));
  };

  const endRound = () => {
    setFastMoneyState(prev => ({ ...prev, phase: 'complete' }));
  };

  const resetFastMoney = () => {
    setFastMoneyState({
      questions: questions.slice(0, 5),
      player1: null,
      player2: null,
      currentPlayer: 1,
      currentQuestionIndex: 0,
      timeRemaining: 45,
      phase: 'setup',
      targetScore: 200,
    });
  };

  return {
    fastMoneyState,
    startPlayer,
    submitAnswer,
    endPlayerTurn,
    revealPoints,
    revealBestAnswer,
    adjustPoints,
    nextPlayer,
    endRound,
    resetFastMoney,
  };
};