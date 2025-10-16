export interface Answer {
  id: number;
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
  category?: string;
}

export interface QuestionSet {
  name: string;
  questions: Question[];
  createdAt: string;
}


export interface Team {
  name: string;
  score: number;
  color: string;
}

export interface GameState {
  currentQuestion: Question | null;
  team1: Team;
  team2: Team;
  strikes: number;
  round: 'face-off' | 'main' | 'fast-money';
  activeTeam: 1 | 2 | null;
}

export interface BarLogo {
  url: string;
  name: string;
}
