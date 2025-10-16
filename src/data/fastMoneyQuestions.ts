import { FastMoneyQuestion } from '../types/fastMoney';

export const fastMoneyQuestions: FastMoneyQuestion[] = [
  {
    id: 'fm1',
    question: 'Name a popular beer brand',
    answers: [
      { text: 'Budweiser', points: 45 },
      { text: 'Coors', points: 20 },
      { text: 'Miller', points: 15 },
      { text: 'Corona', points: 10 },
      { text: 'Heineken', points: 5 },
    ],
  },
  {
    id: 'fm2',
    question: 'Name something you order at a bar',
    answers: [
      { text: 'Beer', points: 40 },
      { text: 'Cocktail', points: 25 },
      { text: 'Shot', points: 15 },
      { text: 'Wine', points: 10 },
      { text: 'Water', points: 5 },
    ],
  },
  {
    id: 'fm3',
    question: 'Name a popular bar game',
    answers: [
      { text: 'Pool', points: 50 },
      { text: 'Darts', points: 30 },
      { text: 'Trivia', points: 10 },
      { text: 'Cards', points: 5 },
      { text: 'Shuffleboard', points: 3 },
    ],
  },
  {
    id: 'fm4',
    question: 'Name a reason to go to a bar',
    answers: [
      { text: 'Socialize', points: 35 },
      { text: 'Watch Sports', points: 30 },
      { text: 'Drink', points: 20 },
      { text: 'Meet People', points: 10 },
      { text: 'Celebrate', points: 5 },
    ],
  },
  {
    id: 'fm5',
    question: 'Name a popular cocktail',
    answers: [
      { text: 'Margarita', points: 40 },
      { text: 'Martini', points: 25 },
      { text: 'Mojito', points: 15 },
      { text: 'Old Fashioned', points: 10 },
      { text: 'Cosmopolitan', points: 5 },
    ],
  },
];
