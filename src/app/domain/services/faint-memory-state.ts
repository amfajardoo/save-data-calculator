import { Injectable, inject, signal, computed } from '@angular/core';
import {
  CharacterState,
  HistoryEntry,
  GlobalRunState,
  CardInstance,
  CardType,
  EpiphanyTargetCard,
} from '../models';
import { CardFactory } from './card-factory';
import { Czn } from './czn';
import { FaintMemoryCalculator } from './faint-memory-calculator';
import { HistoryManager } from './history-manager';
import { INITIAL_CHARACTER_STATE } from '@common/constants';

export interface CalculatedCharacterState extends CharacterState {
  score: number;
  history: HistoryEntry[];
}

@Injectable({ providedIn: 'root' })
export class FaintMemoryState {
  private readonly czn = inject(Czn);
  private readonly cardFactory = inject(CardFactory);
  private readonly calculator = inject(FaintMemoryCalculator);
  private readonly historyManager = inject(HistoryManager);

  private readonly globalState = signal<GlobalRunState>({
    tier: 5,
    isNightmare: false,
  });

  private readonly characters = signal<CharacterState[]>([
    { ...INITIAL_CHARACTER_STATE, id: 1, name: this.czn.getRandomCharacterName() },
  ]);

  readonly globalState$ = this.globalState.asReadonly();
  readonly characters$ = this.characters.asReadonly();
  readonly canUndo$ = this.historyManager.canUndo.asReadonly();
  readonly lastAction$ = this.historyManager.lastAction.asReadonly();

  readonly totalCap = computed(() => this.calculator.calculateTotalCap(this.globalState()));

  readonly calculatedCharacters = computed<CalculatedCharacterState[]>(() => {
    const global = this.globalState();
    return this.characters().map((char) => {
      const charClone = structuredClone(char);
      const { score, history } = this.calculator.calculate(charClone, global);
      return { ...charClone, score, history };
    });
  });

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

  updateGlobalTier(tier: number): void {
    if (tier < 1) tier = 1;
    this.saveSnapshot('Cambio de Tier');
    this.globalState.update((state) => ({ ...state, tier }));
  }

  updateGlobalNightmare(isNightmare: boolean): void {
    this.saveSnapshot('Cambio de Nightmare');
    this.globalState.update((state) => ({ ...state, isNightmare }));
  }

  updateCharacter(id: number, key: keyof CharacterState, value: any): void {
    this.saveSnapshot(`Actualización de personaje: ${key}`);
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar = structuredClone(char);
          if (key in updatedChar) {
            (updatedChar as any)[key] = value;
          }
          return updatedChar;
        }
        return char;
      }),
    );
  }

  updateCardName(charId: number, cardId: string, name: string): void {
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === charId) {
          const updatedChar = structuredClone(char);
          const card = updatedChar.deck.find((c) => c.id === cardId);
          if (card) {
            card.name = name;
          }
          return updatedChar;
        }
        return char;
      }),
    );
  }

  addCharacter(): void {
    this.saveSnapshot('Añadir personaje');
    const newId =
      this.characters().length > 0 ? Math.max(...this.characters().map((c) => c.id)) + 1 : 1;

    this.characters.update((chars) => [
      ...chars,
      {
        ...INITIAL_CHARACTER_STATE,
        id: newId,
        name: this.czn.getRandomCharacterName(),
      },
    ]);
  }

  removeCharacter(id: number): void {
    this.saveSnapshot('Eliminar personaje');
    this.characters.update((chars) => chars.filter((char) => char.id !== id));
  }

  addDeckCard(id: number, cardType: CardType): void {
    this.saveSnapshot(`Añadir carta: ${cardType}`);
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const newCard = this.cardFactory.createCard(cardType, cardType);
          const updatedChar = structuredClone(char);
          updatedChar.deck.push(newCard);
          return updatedChar;
        }
        return char;
      }),
    );
  }

  addInitialCards(id: number): void {
    this.saveSnapshot('Añadir cartas iniciales');
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          return {
            ...char,
            deck: [...char.deck, ...this.cardFactory.createInitialDeck()],
          };
        }
        return char;
      }),
    );
  }

  removeDeckCard(id: number, cardId: string): void {
    this.saveSnapshot('Eliminar carta');
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar = structuredClone(char);
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
    this.saveSnapshot('Duplicar carta');
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar = structuredClone(char);
          const originalCard = updatedChar.deck.find((card) => card.id === cardId);

          if (originalCard) {
            const newCard = this.cardFactory.createCard(originalCard.type, originalCard.name, {
              isDuplicate: true,
              epiphanyLogs: originalCard.epiphanyLogs,
            });
            updatedChar.deck.push(newCard);
            updatedChar.actionLogs.duplications += 1;
          }

          return updatedChar;
        }
        return char;
      }),
    );
  }

  convertCard(id: number, cardIndex: number): void {
    this.saveSnapshot('Convertir carta');
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === id) {
          const updatedChar = structuredClone(char);

          updatedChar.deck = updatedChar.deck.map((card, index) => {
            if (index === cardIndex) {
              return this.cardFactory.createCard('NEUTRAL', 'NEUTRAL', {
                isConvertion: true,
              });
            }
            return card;
          });

          updatedChar.actionLogs.convertions += 1;
          return updatedChar;
        }
        return char;
      }),
    );
  }

  addEpiphany(
    charId: number,
    cardId: string,
    type: 'REGULAR' | 'DIVINE',
    targetCard: EpiphanyTargetCard,
  ): void {
    this.saveSnapshot(`Añadir epifanía: ${type}`);
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === charId) {
          const updatedChar = structuredClone(char);
          const cardToUpdate = updatedChar.deck.find((card) => card.id === cardId);

          if (cardToUpdate) {
            const exists = cardToUpdate.epiphanyLogs.some(
              (log) => log.type === type && log.targetCard === targetCard,
            );

            if (!exists) {
              cardToUpdate.epiphanyLogs.push({ type, targetCard });
            }
          }
          return updatedChar;
        }
        return char;
      }),
    );
  }

  removeEpiphany(charId: number, cardId: string, index: number): void {
    this.saveSnapshot('Eliminar epifanía');
    this.characters.update((chars) =>
      chars.map((char) => {
        if (char.id === charId) {
          const updatedChar = structuredClone(char);
          const cardToUpdate = updatedChar.deck.find((card) => card.id === cardId);

          if (cardToUpdate && index >= 0 && index < cardToUpdate.epiphanyLogs.length) {
            cardToUpdate.epiphanyLogs.splice(index, 1);
          }

          return updatedChar;
        }
        return char;
      }),
    );
  }

  undo(): void {
    const snapshot = this.historyManager.undo();
    if (snapshot) {
      this.characters.set(snapshot.characters);
      this.globalState.set(snapshot.globalState);
    }
  }

  clearHistory(): void {
    this.historyManager.clear();
  }

  private saveSnapshot(action: string): void {
    this.historyManager.saveSnapshot(this.characters(), this.globalState(), action);
  }
}
