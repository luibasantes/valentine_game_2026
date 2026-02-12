export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    question: 'When is our anniversary?',
    options: ['February 14', 'December 15', 'January 1', 'November 25'],
    correctIndex: 1,
  },
  {
    question: 'Where did Luigi and Alix meet?',
    options: ['A coffee shop', 'Online', 'University', 'Through friends'],
    correctIndex: 2,
  },
  {
    question: "What is Alix's favorite food?",
    options: ['Pizza', 'Sushi', 'Fried potatoes with bacon', 'Pasta'],
    correctIndex: 2,
  },
];

export interface MemoryCard {
  id: number;
  emoji: string;
  label: string;
}

export const memoryCards: MemoryCard[] = [
  { id: 1, emoji: '🥔', label: 'Fried Potatoes' },
  { id: 2, emoji: '📺', label: 'Friends' },
  { id: 3, emoji: '🎵', label: 'Ophelia' },
  { id: 4, emoji: '📅', label: 'Dec 15' },
  { id: 5, emoji: '💕', label: 'Luigi + Alix' },
  { id: 6, emoji: '🏠', label: 'Our apartment' },
];

export interface SortingScenario {
  text: string;
  answer: 'angry' | 'sleeping';
}

export const sortingScenarios: SortingScenario[] = [
  { text: "It's Monday morning", answer: 'sleeping' },
  { text: 'Someone ate the last fried potato', answer: 'angry' },
  { text: "Netflix is still asking 'Are you still watching?'", answer: 'sleeping' },
  { text: 'Luigi forgot to reply to a text', answer: 'angry' },
  { text: 'After a big lunch', answer: 'sleeping' },
  { text: 'Someone spoiled the Friends finale', answer: 'angry' },
  { text: 'Sunday afternoon on the couch', answer: 'sleeping' },
  { text: 'The car in front is driving too slow', answer: 'angry' },
  { text: 'Rainy day, warm blanket', answer: 'sleeping' },
  { text: "Luigi said 'we need to talk'", answer: 'angry' },
];
