export interface Translations {
  // Start Screen
  start: {
    title: string;
    subtitle: string;
    button: string;
    pinPrompt: string;
    pinError: string;
    footer: string;
  };

  // HUD zone names
  zones: string[];

  // Start screen zone names (subset)
  startZoneNames: string[];

  // Fail Screen
  fail: {
    defaultMessage: string;
    button: string;
  };

  // Dialog
  dialog: {
    clickToContinue: string;
  };

  // Prize Reveal
  prize: {
    title: string;
    message: string;
    signature: string;
    spaTitle: string;
    spaSubtitle: string;
    photoTitle: string;
    photoSubtitle: string;
    voucher: string;
    screenshot: string;
  };

  // Trivia Puzzle
  trivia: {
    questionOf: string;
    successTitle: string;
    successSubtitle: string;
    failMessage: string;
  };

  // Driving Puzzle
  driving: {
    title: string;
    subtitle: string;
    successMessage: string;
    failMessage: string;
    up: string;
    left: string;
    down: string;
    right: string;
  };

  // Memory Puzzle
  memory: {
    title: string;
    pairs: string;
    mismatches: string;
    successMessage: string;
    failMessage: string;
  };

  // Sorting Puzzle
  sorting: {
    prompt: string;
    score: string;
    needToPass: string;
    successMessage: string;
    failResultMessage: string;
    failMessage: string;
    angry: string;
    sleeping: string;
  };

  // Player Controller
  player: {
    completed: string;
    completePrevious: string;
    triggerLabels: string[];
  };

  // Zones
  zoneLabels: {
    welcomeSign: string;
    triggerLabels: string[];
    active: string;
  };

  // Settings
  settings: {
    title: string;
    language: string;
    restart: string;
  };
}

export const en: Translations = {
  start: {
    title: "Alix's Valentine Adventure",
    subtitle: 'An enchanted garden awaits',
    button: 'Start',
    pinPrompt: 'Enter our secret code',
    pinError: "That's not it... try again",
    footer: 'A gift from Luigi',
  },

  zones: [
    'Start',
    'University Garden',
    'Parking Lot',
    'Cozy Apartment',
    'Movie Theater',
    'Prize Gazebo',
  ],

  startZoneNames: [
    'University Garden',
    'Parking Lot',
    'Cozy Apartment',
    'Movie Theater',
  ],

  fail: {
    defaultMessage: 'Love is about trying again 💕',
    button: 'Try Again',
  },

  dialog: {
    clickToContinue: 'click to continue',
  },

  prize: {
    title: 'You Did It, Alix!',
    message:
      'From a mattress on the floor to building our world together,\nevery moment with you is my favorite adventure.\n\nHappy Valentine\'s Day, mi amor.',
    signature: '— Luigi',
    spaTitle: 'Full Day SPA',
    spaSubtitle: 'A complete day of relaxation — you deserve it',
    photoTitle: 'Photography Session',
    photoSubtitle: 'A professional photo session — capturing our moments',
    voucher: 'VOUCHER',
    screenshot: 'Screenshot this!',
  },

  trivia: {
    questionOf: 'Question {current} of {total}',
    successTitle: 'The heart gate opens!',
    successSubtitle: 'You know us so well...',
    failMessage: "That wasn't quite right... Try again with love!",
  },

  driving: {
    title: "Park Alix's Car! 🚗",
    subtitle: "Drive into the green spot — don't hit anything!",
    successMessage: 'Perfect parking! Luigi is impressed 😏',
    failMessage: 'You Crashed! Not again Alix 🤦‍♂️',
    up: 'Up',
    left: 'Left',
    down: 'Down',
    right: 'Right',
  },

  memory: {
    title: 'Match Our Memories',
    pairs: 'Pairs',
    mismatches: 'Mismatches',
    successMessage: 'This is where our story began',
    failMessage: 'Too many mismatches! Our memories are tricky...',
  },

  sorting: {
    prompt: 'Is Alix...',
    score: 'Score',
    needToPass: 'Need {n} to pass',
    successMessage: 'Luigi knows you too well',
    failResultMessage: 'Not quite...',
    failMessage: 'Alix is unpredictable... Try again!',
    angry: 'Angry',
    sleeping: 'Sleeping',
  },

  player: {
    completed: 'Completed!',
    completePrevious: 'Complete previous zone first',
    triggerLabels: [
      'Press E - Love Letter',
      'Press E - Get In!',
      'Press E - Play Memories',
      'Press E - Take a Seat',
    ],
  },

  zoneLabels: {
    welcomeSign: "Alix's Valentine Adventure",
    triggerLabels: [
      'Press E - Love Letter',
      'Press E - Get In!',
      'Press E - Play Memories',
      'Press E - Take a Seat',
    ],
    active: 'Active...',
  },

  settings: {
    title: 'Settings',
    language: 'Language',
    restart: 'Restart',
  },
};

export const es: Translations = {
  start: {
    title: 'La Aventura de San Valentín de Alix',
    subtitle: 'Un jardín encantado te espera',
    button: 'Comenzar',
    pinPrompt: 'Ingresa nuestro código secreto',
    pinError: 'Ese no es... intenta de nuevo',
    footer: 'Un regalo de Luigi',
  },

  zones: [
    'Inicio',
    'Jardín Universitario',
    'Estacionamiento',
    'Apartamento Acogedor',
    'Sala de Cine',
    'Glorieta del Premio',
  ],

  startZoneNames: [
    'Jardín Universitario',
    'Estacionamiento',
    'Apartamento Acogedor',
    'Sala de Cine',
  ],

  fail: {
    defaultMessage: 'El amor es intentar de nuevo 💕',
    button: 'Intentar de Nuevo',
  },

  dialog: {
    clickToContinue: 'clic para continuar',
  },

  prize: {
    title: '¡Lo Lograste, Alix!',
    message:
      'De un colchón en el piso a construir nuestro mundo juntos,\ncada momento contigo es mi aventura favorita.\n\nFeliz Día de San Valentín, mi amor.',
    signature: '— Luigi',
    spaTitle: 'Día Completo de SPA',
    spaSubtitle: 'Un día completo de relajación — te lo mereces',
    photoTitle: 'Sesión de Fotos',
    photoSubtitle: 'Una sesión de fotos profesional — capturando nuestros momentos',
    voucher: 'VALE',
    screenshot: '¡Toma captura de pantalla!',
  },

  trivia: {
    questionOf: 'Pregunta {current} de {total}',
    successTitle: '¡La puerta del corazón se abre!',
    successSubtitle: 'Nos conoces muy bien...',
    failMessage: 'No fue del todo correcto... ¡Intenta de nuevo con amor!',
  },

  driving: {
    title: '¡Estaciona el Auto de Alix! 🚗',
    subtitle: '¡Conduce al espacio verde — no choques con nada!',
    successMessage: '¡Estacionamiento perfecto! Luigi está impresionado 😏',
    failMessage: '¡Chocaste! Otra vez no, Alix 🤦‍♂️',
    up: 'Arriba',
    left: 'Izquierda',
    down: 'Abajo',
    right: 'Derecha',
  },

  memory: {
    title: 'Empareja Nuestros Recuerdos',
    pairs: 'Pares',
    mismatches: 'Errores',
    successMessage: 'Aquí es donde comenzó nuestra historia',
    failMessage: '¡Demasiados errores! Nuestros recuerdos son difíciles...',
  },

  sorting: {
    prompt: '¿Alix está...',
    score: 'Puntos',
    needToPass: 'Necesitas {n} para pasar',
    successMessage: 'Luigi te conoce demasiado bien',
    failResultMessage: 'No del todo...',
    failMessage: '¡Alix es impredecible... Intenta de nuevo!',
    angry: 'Enojada',
    sleeping: 'Dormida',
  },

  player: {
    completed: '¡Completado!',
    completePrevious: 'Completa la zona anterior primero',
    triggerLabels: [
      'Pulsa E - Carta de Amor',
      'Pulsa E - ¡Sube!',
      'Pulsa E - Jugar Recuerdos',
      'Pulsa E - Toma Asiento',
    ],
  },

  zoneLabels: {
    welcomeSign: 'La Aventura de San Valentín de Alix',
    triggerLabels: [
      'Pulsa E - Carta de Amor',
      'Pulsa E - ¡Sube!',
      'Pulsa E - Jugar Recuerdos',
      'Pulsa E - Toma Asiento',
    ],
    active: 'Activo...',
  },

  settings: {
    title: 'Ajustes',
    language: 'Idioma',
    restart: 'Reiniciar',
  },
};
