import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import {
  TIERS_SAVE_DATA,
  ACTION_COSTS,
  FAINT_MEMORY_CONTRIBUTION,
  EPIPHANY_MODIFIERS,
} from '../save-data/constants';
import {
  CardType,
  CharacterState,
  HistoryEntry,
  GlobalRunState,
  CardInstance,
  EpiphanyTargetCard,
} from '../save-data/models';

// --- UTILITIES ---
let cardIdCounter = 0;
const generateCardId = (type: CardType): string => {
  cardIdCounter++;
  // Usamos 'NEUTRAL' para el ID base de 'NEUTRAL' y 'FORBIDDEN'
  const idType = type === 'FORBIDDEN' ? 'NEUTRAL' : type.charAt(0);
  return `${idType}_${cardIdCounter}`;
};

const INITIAL_CARDS: CardInstance[] = [
  {
    epiphanyLogs: [],
    id: generateCardId('BASIC'),
    type: 'BASIC',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('BASIC'),
    type: 'BASIC',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('BASIC'),
    type: 'BASIC',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('BASIC'),
    type: 'BASIC',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('UNIQUE'),
    type: 'UNIQUE',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('UNIQUE'),
    type: 'UNIQUE',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('UNIQUE'),
    type: 'UNIQUE',
    isConvertion: false,
  },
  {
    epiphanyLogs: [],
    id: generateCardId('UNIQUE'),
    type: 'UNIQUE',
    isConvertion: false,
  },
];

const INITIAL_CHARACTER_STATE: CharacterState = {
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

export interface CalculatedCharacterState extends CharacterState {
  score: number;
  history: HistoryEntry[];
}

// --- SERVICE ---

@Injectable({ providedIn: 'root' })
export class FaintMemoryState {
  // --- STATE SIGNALS ---
  // El estado de los modales (showModal) fue eliminado.
  protected readonly globalState = signal<GlobalRunState>({
    tier: 5,
    isNightmare: false,
  });

  protected readonly characters = signal<CharacterState[]>([
    { ...INITIAL_CHARACTER_STATE, id: 1, name: 'Personaje 1' },
  ]);

  // --- PUBLIC READ-ONLY SIGNALS (Para consumo por componentes) ---
  readonly globalState$ = this.globalState.asReadonly();
  readonly characters$ = this.characters.asReadonly();

  // --- COMPUTED STATE (Calculated Properties) ---

  readonly totalCap = computed(() => {
    const global = this.globalState();
    const currentTierCap = TIERS_SAVE_DATA(global.tier);

    let cap = currentTierCap;
    if (global.isNightmare) {
      cap += ACTION_COSTS.NIGHTMARE_CAP_BONUS;
    }
    return cap;
  });

  // El cálculo principal se mantiene en el servicio
  readonly calculatedCharacters = computed<CalculatedCharacterState[]>(() => {
    const global = this.globalState();
    return this.characters().map((char) => {
      // Clonar para asegurar que el cálculo sea puro
      const charClone = structuredClone(char);
      const { score, history } = this.calculateFaintMemory(charClone, global);
      return {
        ...charClone,
        score,
        history,
      } as CalculatedCharacterState;
    });
  });

  // --- PUBLIC UTILITY METHODS ---

  getEpiphanyStatus(card: CardInstance) {
    const hasRegular = card.epiphanyLogs.some((log) => log.type === 'REGULAR');
    const hasDivine = card.epiphanyLogs.some((log) => log.type === 'DIVINE');

    return {
      hasLogs: card.epiphanyLogs.length > 0,
      hasRegular,
      hasDivine,
      isRegularOnly: hasRegular && !hasDivine,
      isMixed: hasRegular && hasDivine,
      isDivineOnly: hasDivine && !hasRegular,
    };
  }

  // --- PUBLIC STATE MUTATION METHODS ---

  updateGlobalTier(tier: number): void {
    if (tier < 1) tier = 1;
    this.globalState.update((state) => ({ ...state, tier }));
  }

  updateGlobalNightmare(isNightmare: boolean): void {
    this.globalState.update((state) => ({ ...state, isNightmare }));
  }

  updateCharacter(id: number, key: keyof CharacterState, value: any): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar: CharacterState = structuredClone(char);

          if (key === 'additionalDuplicationCost') {
            updatedChar.additionalDuplicationCost = Math.max(0, value);
          } else if (key in updatedChar) {
            (updatedChar as any)[key] = value;
          }

          return updatedChar;
        }
        return char;
      }),
    );
  }

  addDeckCard(id: number, cardType: CardType): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const newCard: CardInstance = {
            id: generateCardId(cardType),
            type: cardType,
            epiphanyLogs: [],
            isConvertion: false,
          };
          const updatedChar: CharacterState = structuredClone(char);

          updatedChar.deck.push(newCard);

          return updatedChar;
        }
        return char;
      }),
    );
  }

  addInitialCards(id: number): void {
    this.characters.update((chars) => {
      return chars.map((char) => {
        if (char.id === id) {
          return {
            ...char,
            deck: [...char.deck, ...INITIAL_CARDS],
          };
        }
        return char;
      });
    });
  }

  removeDeckCard(id: number, cardId: string): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar: CharacterState = structuredClone(char);

          const cardIndex = updatedChar.deck.findIndex((card) => card.id === cardId);

          if (cardIndex !== -1) {
            const cardToRemove = updatedChar.deck[cardIndex];
            if (cardToRemove.type === 'BASIC' || cardToRemove.type === 'UNIQUE') {
              updatedChar.actionLogs.characterCardRemovals += 1;
            }

            updatedChar.deck.splice(cardIndex, 1);
            updatedChar.actionLogs.removals += 1;
          }

          return updatedChar;
        }
        return char;
      }),
    );
  }

  duplicateCard(id: number, cardId: string): void {
    this.characters.update(
      (chars) =>
        chars.map((char) => {
          if (char.id === id) {
            const updatedChar: CharacterState = structuredClone(char);

            const cardToDuplicate = updatedChar.deck.find((card) => card.id === cardId);

            if (cardToDuplicate) {
              const newCard: CardInstance = {
                ...cardToDuplicate,
                id: generateCardId(cardToDuplicate.type),
              };
              updatedChar.deck.push(newCard);

              updatedChar.actionLogs.duplications += 1;
            }

            return updatedChar;
          }

          return char;
        }) as CharacterState[],
    );
  }

  /**
   * Aplica la conversión de costo adicional de duplicación a puntos de Conversión.
   * @param id ID del personaje.
   */
  convertCard(id: number, cardIndex: number): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar: CharacterState = structuredClone(char);

          return {
            ...updatedChar,
            deck: updatedChar.deck.map((card, index) => {
              if (index === cardIndex) {
                const neutralCardInstance: CardInstance = {
                  epiphanyLogs: [],
                  id: generateCardId('NEUTRAL'),
                  type: 'NEUTRAL',
                  isConvertion: true,
                };

                return neutralCardInstance;
              }

              return card;
            }),
            actionLogs: {
              ...updatedChar.actionLogs,
              convertions: updatedChar.actionLogs.convertions + 1,
            },
          };
        }
        return char;
      }),
    );
  }

  /**
   * Añade un log de Epifanía a una carta específica.
   */
  addEpiphany(
    charId: number,
    cardId: string,
    type: 'REGULAR' | 'DIVINE',
    targetCard: EpiphanyTargetCard,
  ): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === charId) {
          const updatedChar: CharacterState = structuredClone(char);
          const cardToUpdate = updatedChar.deck.find((card) => card.id === cardId);

          if (cardToUpdate) {
            // Clonamos el array de logs para evitar mutación directa
            const currentLogs = [...cardToUpdate.epiphanyLogs];

            const exists = currentLogs.some(
              (log) => log.type === type && log.targetCard === targetCard,
            );

            if (!exists) {
              currentLogs.push({ type, targetCard });
              cardToUpdate.epiphanyLogs = currentLogs;
            }
          }
          return updatedChar;
        }
        return char;
      }),
    );
  }

  /**
   * Remueve un log de Epifanía por índice.
   */
  removeEpiphany(charId: number, cardId: string, index: number): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === charId) {
          const updatedChar: CharacterState = structuredClone(char);
          const cardToUpdate = updatedChar.deck.find((card) => card.id === cardId);

          if (cardToUpdate && index >= 0 && index < cardToUpdate.epiphanyLogs.length) {
            // Usamos splice en la copia para remover el elemento.
            cardToUpdate.epiphanyLogs.splice(index, 1);
          }

          return updatedChar;
        }
        return char;
      }),
    );
  }

  // --- Character List Mutation ---

  addCharacter(): void {
    const newId =
      this.characters().length > 0 ? Math.max(...this.characters().map((c) => c.id)) + 1 : 1;

    this.characters.update((chars) => [
      ...chars,
      {
        ...INITIAL_CHARACTER_STATE,
        id: newId,
        name: `Personaje ${newId}`,
      },
    ]);
  }

  removeCharacter(id: number): void {
    this.characters.update((chars) => chars.filter((char) => char.id !== id));
  }

  // --- CORE FM CALCULATION LOGIC (Private) ---

  private calculateFaintMemory(
    character: CharacterState,
    globalState: GlobalRunState,
  ): { score: number; history: HistoryEntry[] } {
    let currentScore = 0;
    const history: HistoryEntry[] = [];
    debugger;
    const addHistory = (type: HistoryEntry['type'], description: string, points: number) => {
      currentScore += points;
      history.push({
        type,
        description,
        points,
        cumulativeFaintMemory: currentScore,
      });
    };

    // ------------------------------------------------------------------
    // A. CÁLCULO DE CONTRIBUCIÓN BASE DEL INVENTARIO FINAL (Deck)
    // ------------------------------------------------------------------

    let deckContribution = 0;
    let divineEpiphaniesCount = 0;
    const regularEpiphaniesCount: Record<EpiphanyTargetCard, number> = {
      NEUTRAL_FORBIDDEN: 0,
      MONSTER: 0,
      BASIC: 0,
      UNIQUE: 0,
    };

    for (const card of character.deck) {
      const cardTypeKey = card.type as keyof typeof FAINT_MEMORY_CONTRIBUTION;
      deckContribution += card.isConvertion ? 0 : FAINT_MEMORY_CONTRIBUTION[cardTypeKey];

      for (const log of card.epiphanyLogs) {
        if (log.type === 'DIVINE') {
          divineEpiphaniesCount++;
        } else if (log.type === 'REGULAR') {
          if ((card.type === 'NEUTRAL' && !card.isConvertion) || card.type === 'FORBIDDEN') {
            regularEpiphaniesCount['NEUTRAL_FORBIDDEN']++;
          } else if (card.type === 'MONSTER') {
            regularEpiphaniesCount['MONSTER']++;
          }
        }
      }
    }

    if (deckContribution !== 0) {
      addHistory('DECK', `Contribución Base del Deck`, deckContribution);
    }

    // ------------------------------------------------------------------
    // B. CÁLCULO DE MODIFICADORES DE EPIFANÍA
    // ------------------------------------------------------------------

    if (divineEpiphaniesCount > 0) {
      const divineBonus = divineEpiphaniesCount * EPIPHANY_MODIFIERS.DIVINE_BONUS;
      addHistory('ACTION', `Epifanías Divinas (${divineEpiphaniesCount}x)`, divineBonus);
    }

    if (regularEpiphaniesCount['NEUTRAL_FORBIDDEN'] > 0) {
      const regularBonus =
        regularEpiphaniesCount['NEUTRAL_FORBIDDEN'] * EPIPHANY_MODIFIERS.REGULAR_BONUS;
      addHistory(
        'ACTION',
        `Epifanía Regular (Neutral/Prohibida) (${regularEpiphaniesCount['NEUTRAL_FORBIDDEN']}x)`,
        regularBonus,
      );
    }
    if (regularEpiphaniesCount['MONSTER'] > 0) {
      const regularBonus = regularEpiphaniesCount['MONSTER'] * EPIPHANY_MODIFIERS.REGULAR_BONUS;
      addHistory(
        'ACTION',
        `Epifanía Regular (Monstruo) (${regularEpiphaniesCount['MONSTER']}x)`,
        regularBonus,
      );
    }

    // ------------------------------------------------------------------
    // C. CÁLCULO DE ACCIONES (Costos/Puntos)
    // ------------------------------------------------------------------

    const actionKeys = Object.keys(ACTION_COSTS.REMOVE_CARDS_PROGRESSION);

    const getProgressionCost = (
      count: number,
      progressionMap: typeof ACTION_COSTS.REMOVE_CARDS_PROGRESSION,
    ): number => {
      // El índice se basa en la cuenta (1-indexed)
      const index = Math.min(count, actionKeys.length);
      const key = actionKeys[index - 1];
      return key ? progressionMap[key as keyof typeof progressionMap] : 0;
    };

    // 1. Removals Cost (Costo Progresivo)
    const removalCost = getProgressionCost(
      character.actionLogs.removals,
      ACTION_COSTS.REMOVE_CARDS_PROGRESSION,
    );

    if (character.actionLogs.removals > 0) {
      addHistory('ACTION', `Eliminación (${character.actionLogs.removals}x)`, -removalCost);
    }

    // 2. Character Card Removals Bonus
    if (character.actionLogs.characterCardRemovals > 0) {
      const charRemovalBonus =
        character.actionLogs.characterCardRemovals * ACTION_COSTS.REMOVE_CHARACTER_CARD_BONUS;
      addHistory(
        'ACTION',
        `Eliminación de Carta de Personaje (${character.actionLogs.characterCardRemovals}x)`,
        charRemovalBonus,
      );
    }

    // 3. Duplication Cost
    const duplicationCost = getProgressionCost(
      character.actionLogs.duplications,
      ACTION_COSTS.DUPLICATE_CARDS_PROGRESSION,
    );
    if (character.actionLogs.duplications > 0) {
      addHistory('ACTION', `Duplicación (${character.actionLogs.duplications}x)`, -duplicationCost);
    }

    // 4. Additional Duplication Cost (Manual Input) - COSTO
    if (character.additionalDuplicationCost > 0) {
      addHistory('ACTION', `Duplicación`, -Math.abs(character.additionalDuplicationCost));
    }

    // 5. Conversion Bonus - BONO
    if (character.actionLogs.convertions > 0) {
      const conversionTotalBonus = character.actionLogs.convertions * ACTION_COSTS.CONVERT_CARD;
      addHistory(
        'ACTION',
        `Conversión (${character.actionLogs.convertions}x)`,
        conversionTotalBonus,
      );
    }

    // ------------------------------------------------------------------
    // D. CÁLCULO Y APLICACIÓN DEL LÍMITE (CAP) GLOBAL
    // ------------------------------------------------------------------

    const currentTierCap = TIERS_SAVE_DATA(globalState.tier);

    let totalCap = currentTierCap;

    if (globalState.isNightmare) {
      totalCap += ACTION_COSTS.NIGHTMARE_CAP_BONUS;
    }

    const scoreBeforeCap = currentScore;
    const finalScore = Math.min(scoreBeforeCap, totalCap);

    if (scoreBeforeCap > totalCap) {
      const reduction = totalCap - scoreBeforeCap;
      addHistory('DECK', `❌ Límite (CAP) aplicado`, reduction);
    } else {
      addHistory('DECK', `Límite (CAP) Potencial: ${totalCap}`, 0);
    }

    // Filtra las entradas con 0 puntos, excepto si son el log de límite aplicado
    const filteredHistory = history.filter(
      (entry) => entry.points !== 0 || entry.description.includes('❌ Límite (CAP) aplicado'),
    );

    return { score: finalScore, history: filteredHistory };
  }
}
