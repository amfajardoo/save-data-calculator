export const INITIAL_CHARACTER_STATE: CharacterState = {
  id: 1,
  name: 'Nuevo Personaje',
  deck: [],
  additionalDuplicationCost: 0,
  actionLogs: {
    removals: 0,
    duplications: 0,
    convertions: 0,
    characterCardRemovals: 0,
  },
};

export type CardType = 'NEUTRAL' | 'FORBIDDEN' | 'MONSTER' | 'BASIC' | 'UNIQUE';

export interface CardInstance {
  id: string;
  type: CardType;
  name: string;
  epiphanyLogs: EpiphanyLog[];
  isConvertion: boolean;
  isDuplicate: boolean;
}

export type CharacterDeck = CardInstance[];

export type EpiphanyTargetCard = 'BASIC' | 'UNIQUE' | 'NEUTRAL_FORBIDDEN' | 'MONSTER';

export interface GlobalRunState {
  tier: number;
  isNightmare: boolean;
}

export interface HistoryEntry {
  type: 'DECK' | 'ACTION';
  description: string;
  points: number;
  cumulativeFaintMemory: number;
}

export interface EpiphanyLog {
  type: 'REGULAR' | 'DIVINE';
  targetCard: EpiphanyTargetCard;
}

export interface CharacterState {
  id: number;
  name: string;
  deck: CharacterDeck;
  additionalDuplicationCost: number;
  actionLogs: {
    removals: number;
    duplications: number;
    convertions: number;
    characterCardRemovals: number;
  };
}

export interface ModalState {
  addCard: number | null;
  epiphany: number | null;
  cardId: string | null;
  epiphanyTarget: EpiphanyTargetCard | null;
}
