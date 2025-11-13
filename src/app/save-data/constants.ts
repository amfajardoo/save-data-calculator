// constants.ts
// ----------------------------------------------------
// 1. Interfaz y Generación de Tiers
// ----------------------------------------------------

export interface TIER_SAVE_DATA {
  name: string;
  points: number;
  tier: number;
}

const TIER_BASE_VALUE = 30;
const NUMBER_OF_TIERS = 13;
const tierNumbers = Array.from({ length: NUMBER_OF_TIERS }, (_, i) => i + 1);

// Datos de Tiers (se calcula el 'points' directamente)
export const TIERS_SAVE_DATA: TIER_SAVE_DATA[] = tierNumbers.map((t, index) => ({
  name: `TIER ${t}`,
  tier: t,
  points: 10 * index + TIER_BASE_VALUE,
}));

// ----------------------------------------------------
// 2. CONTRIBUCIÓN DE PUNTOS AL FAINT MEMORY (Inventario Final)
// ----------------------------------------------------

// Regla: CARTAS NEUTRALES: +20, MONSTRUO: +80, PROHIBIDAS: +20
export const FAINT_MEMORY_CONTRIBUTION = {
  // Puntos base por tipo de carta restante
  NEUTRAL: 20,
  FORBIDDEN: 20,
  MONSTER: 80,
  BASIC: 0,
  UNIQUE: 0,
};

// ----------------------------------------------------
// 3. MODIFICADORES DE EPIFANÍA
// ----------------------------------------------------

export const EPIPHANY_MODIFIERS = {
  REGULAR_BONUS: 10, // Bono de 10, aplicado solo si la carta existe
  DIVINE_BONUS: 20, // Bono siempre aplicado por log
};

// ----------------------------------------------------
// 4. COSTOS Y BONIFICACIONES DE ACCIÓN
// ----------------------------------------------------

// Este mapa define el patrón de costo/puntos (0, 10, 30, 50, 70) para remoción y duplicación
export const ACTION_POINT_MAP = {
  ONE: 0,
  TWO: 10,
  THREE: 30,
  FOUR: 50,
  FIVE: 70,
};

export const ACTION_COSTS = {
  // Puntos por ELIMINACIÓN (Progresión: 0, 10, 30, 50, 70)
  REMOVE_CARDS_PROGRESSION: ACTION_POINT_MAP,

  // Bonificación por ELIMINACIÓN de Carta de Personaje (Básica/Única)
  REMOVE_CHARACTER_CARD_BONUS: 20, // +20 adicional por cada carta de personaje eliminada

  // Puntos por DUPLICACIÓN (Progresión: 0, 10, 30, 50, 70)
  DUPLICATE_CARDS_PROGRESSION: ACTION_POINT_MAP,

  // Puntos por CONVERSIÓN (El valor unitario que se multiplica por la cantidad del input)
  CONVERT_CARD: 10,

  // Bonificación por Nightmare CAP
  NIGHTMARE_CAP_BONUS: 10,
};
