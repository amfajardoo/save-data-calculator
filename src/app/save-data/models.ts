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
