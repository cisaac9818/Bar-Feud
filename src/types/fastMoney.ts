export interface FastMoneyAnswer {
  text: string;
  points: number;
}

export interface FastMoneyQuestion {
  id: string;
  question: string;
  answers: FastMoneyAnswer[];
}

export interface FastMoneyResponse {
  questionId: string;
  answer: string;
  points: number;
  revealed: boolean;
  pointsRevealed: boolean;
  bestAnswerRevealed?: boolean;
}



export interface FastMoneyPlayer {
  name: string;
  responses: FastMoneyResponse[];
  totalPoints: number;
}

export type FastMoneyPhase = 'setup' | 'playing' | 'revealing' | 'complete';

export interface FastMoneyState {
  questions: FastMoneyQuestion[];
  player1: FastMoneyPlayer | null;
  player2: FastMoneyPlayer | null;
  currentPlayer: 1 | 2;
  currentQuestionIndex: number;
  timeRemaining: number;
  phase: FastMoneyPhase;
  targetScore: 200;
}
