export interface TIER_SAVE_DATA {
  name: string;
  points: number;
  tier: number;
}

const TIER_BASE_VALUE = 30;

export const TIERS_SAVE_DATA: (tier: number) => number = (tier: number) =>
  tier < 1 ? 30 : 10 * (tier - 1) + TIER_BASE_VALUE;

// Regla: CARTAS NEUTRALES: +20, MONSTRUO: +80, PROHIBIDAS: +20
export const FAINT_MEMORY_CONTRIBUTION = {
  NEUTRAL: 20,
  FORBIDDEN: 20,
  MONSTER: 80,
  BASIC: 0,
  UNIQUE: 0,
};

export const EPIPHANY_MODIFIERS = {
  REGULAR_BONUS: 10, // Bono de 10, aplicado solo si la carta no es una de las iniciales
  DIVINE_BONUS: 20, // Bono siempre aplicado por log
};

// Este mapa define el patrón de costo/puntos (0, 10, 30, 50, 70) para acciones de costo.
export const ACTION_COST_MAP = {
  ONE: 0,
  TWO: 10,
  THREE: 30,
  FOUR: 50,
  FIVE: 70,
};

export const REMOVAL_POINT_MAP = {
  ONE: 0,
  TWO: -10,
  THREE: -30,
  FOUR: -50,
  FIVE: -70,
};

export const ACTION_COSTS = {
  REMOVE_CARDS_PROGRESSION: REMOVAL_POINT_MAP,
  REMOVE_CHARACTER_CARD_BONUS: 20,
  DUPLICATE_CARDS_PROGRESSION: ACTION_COST_MAP,
  CONVERT_CARD: 10,
  NIGHTMARE_CAP_BONUS: 10,
};
