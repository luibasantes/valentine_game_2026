export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export function getTriviaQuestions(lang: 'en' | 'es'): TriviaQuestion[] {
  if (lang === 'es') {
    return [
      {
        question: '¿Cuándo es nuestro aniversario?',
        options: ['14 de febrero', '15 de diciembre', '1 de enero', '25 de noviembre'],
        correctIndex: 1,
      },
      {
        question: '¿Dónde se conocieron Luigi y Alix?',
        options: ['Una cafetería', 'En línea', 'La universidad', 'Por amigos'],
        correctIndex: 2,
      },
      {
        question: '¿Cuál es la comida favorita de Alix?',
        options: ['Pizza', 'Sushi', 'Papas fritas con tocino', 'Pasta'],
        correctIndex: 2,
      },
    ];
  }
  return [
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
}

export interface MemoryCard {
  id: number;
  emoji: string;
  label: string;
}

export function getMemoryCards(lang: 'en' | 'es'): MemoryCard[] {
  if (lang === 'es') {
    return [
      { id: 1, emoji: '🥔', label: 'Papas Fritas' },
      { id: 2, emoji: '📺', label: 'Friends' },
      { id: 3, emoji: '🎵', label: 'Ophelia' },
      { id: 4, emoji: '📅', label: '15 Dic' },
      { id: 5, emoji: '💕', label: 'Luigi + Alix' },
      { id: 6, emoji: '🏠', label: 'Nuestro depa' },
    ];
  }
  return [
    { id: 1, emoji: '🥔', label: 'Fried Potatoes' },
    { id: 2, emoji: '📺', label: 'Friends' },
    { id: 3, emoji: '🎵', label: 'Ophelia' },
    { id: 4, emoji: '📅', label: 'Dec 15' },
    { id: 5, emoji: '💕', label: 'Luigi + Alix' },
    { id: 6, emoji: '🏠', label: 'Our apartment' },
  ];
}

export interface SortingScenario {
  text: string;
  answer: 'angry' | 'sleeping';
}

export function getSortingScenarios(lang: 'en' | 'es'): SortingScenario[] {
  if (lang === 'es') {
    return [
      { text: 'Es lunes por la mañana', answer: 'sleeping' },
      { text: 'Alguien se comió la última papa frita', answer: 'angry' },
      { text: 'Netflix sigue preguntando "¿Sigues viendo?"', answer: 'sleeping' },
      { text: 'Luigi olvidó responder un mensaje', answer: 'angry' },
      { text: 'Después de un gran almuerzo', answer: 'sleeping' },
      { text: 'Alguien hizo spoiler del final de Friends', answer: 'angry' },
      { text: 'Domingo por la tarde en el sofá', answer: 'sleeping' },
      { text: 'El auto de adelante va muy lento', answer: 'angry' },
      { text: 'Día lluvioso, cobija calientita', answer: 'sleeping' },
      { text: 'Luigi dijo "tenemos que hablar"', answer: 'angry' },
    ];
  }
  return [
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
}
