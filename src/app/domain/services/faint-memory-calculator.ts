import { Injectable } from '@angular/core';
import {
  TIERS_SAVE_DATA,
  ACTION_COSTS,
  FAINT_MEMORY_CONTRIBUTION,
  EPIPHANY_MODIFIERS,
} from '@app/common/constants';
import { HistoryEntry, CharacterState, GlobalRunState, EpiphanyTargetCard } from '../models';

export interface CalculationResult {
  score: number;
  history: HistoryEntry[];
}

@Injectable({ providedIn: 'root' })
export class FaintMemoryCalculator {
  calculate(character: CharacterState, globalState: GlobalRunState): CalculationResult {
    let currentScore = 0;
    const history: HistoryEntry[] = [];

    const addHistory = (type: HistoryEntry['type'], description: string, points: number) => {
      currentScore += points;
      history.push({
        type,
        description,
        points,
        cumulativeFaintMemory: currentScore,
      });
    };

    this.calculateDeckContribution(character, addHistory);
    this.calculateEpiphanyModifiers(character, addHistory);
    this.calculateActionCosts(character, addHistory);
    this.applyCap(globalState, currentScore, addHistory);

    const filteredHistory = this.filterHistory(history);

    return {
      score: Math.min(currentScore, this.calculateTotalCap(globalState)),
      history: filteredHistory,
    };
  }

  calculateTotalCap(globalState: GlobalRunState): number {
    const baseCap = TIERS_SAVE_DATA(globalState.tier);
    return globalState.isNightmare ? baseCap + ACTION_COSTS.NIGHTMARE_CAP_BONUS : baseCap;
  }

  private calculateDeckContribution(
    character: CharacterState,
    addHistory: (type: HistoryEntry['type'], desc: string, points: number) => void,
  ): void {
    let deckContribution = 0;

    for (const card of character.deck) {
      const cardTypeKey = card.type as keyof typeof FAINT_MEMORY_CONTRIBUTION;
      deckContribution += card.isConvertion ? 0 : FAINT_MEMORY_CONTRIBUTION[cardTypeKey];
    }

    if (deckContribution !== 0) {
      addHistory('DECK', 'Contribución Base del Deck', deckContribution);
    }
  }

  private calculateEpiphanyModifiers(
    character: CharacterState,
    addHistory: (type: HistoryEntry['type'], desc: string, points: number) => void,
  ): void {
    let divineCount = 0;
    const regularCounts: Record<EpiphanyTargetCard, number> = {
      NEUTRAL_FORBIDDEN: 0,
      MONSTER: 0,
      BASIC: 0,
      UNIQUE: 0,
    };

    for (const card of character.deck) {
      for (const log of card.epiphanyLogs) {
        if (log.type === 'DIVINE') {
          divineCount++;
        } else if (log.type === 'REGULAR') {
          if (card.type === 'NEUTRAL' || card.type === 'FORBIDDEN') {
            regularCounts['NEUTRAL_FORBIDDEN']++;
          } else if (card.type === 'MONSTER') {
            regularCounts['MONSTER']++;
          }
        }
      }
    }

    if (divineCount > 0) {
      const bonus = divineCount * EPIPHANY_MODIFIERS.DIVINE_BONUS;
      addHistory('ACTION', `Epifanías Divinas (${divineCount}x)`, bonus);
    }

    if (regularCounts['NEUTRAL_FORBIDDEN'] > 0) {
      const bonus = regularCounts['NEUTRAL_FORBIDDEN'] * EPIPHANY_MODIFIERS.REGULAR_BONUS;
      addHistory(
        'ACTION',
        `Epifanía Regular (Neutral/Prohibida) (${regularCounts['NEUTRAL_FORBIDDEN']}x)`,
        bonus,
      );
    }

    if (regularCounts['MONSTER'] > 0) {
      const bonus = regularCounts['MONSTER'] * EPIPHANY_MODIFIERS.REGULAR_BONUS;
      addHistory('ACTION', `Epifanía Regular (Monstruo) (${regularCounts['MONSTER']}x)`, bonus);
    }
  }

  private calculateActionCosts(
    character: CharacterState,
    addHistory: (type: HistoryEntry['type'], desc: string, points: number) => void,
  ): void {
    const { actionLogs } = character;

    if (actionLogs.removals > 0) {
      const cost = this.getProgressionCost(
        actionLogs.removals,
        ACTION_COSTS.REMOVE_CARDS_PROGRESSION,
      );
      addHistory('ACTION', `Eliminación (${actionLogs.removals}x)`, -cost);
    }

    if (actionLogs.characterCardRemovals > 0) {
      const bonus = actionLogs.characterCardRemovals * ACTION_COSTS.REMOVE_CHARACTER_CARD_BONUS;
      addHistory(
        'ACTION',
        `Eliminación de Carta de Personaje (${actionLogs.characterCardRemovals}x)`,
        bonus,
      );
    }

    if (actionLogs.duplications > 0) {
      const cost = this.getProgressionCost(
        actionLogs.duplications,
        ACTION_COSTS.DUPLICATE_CARDS_PROGRESSION,
      );
      addHistory('ACTION', `Duplicación (${actionLogs.duplications}x)`, cost);
    }

    if (actionLogs.convertions > 0) {
      const bonus = actionLogs.convertions * ACTION_COSTS.CONVERT_CARD;
      addHistory('ACTION', `Conversión (${actionLogs.convertions}x)`, bonus);
    }
  }

  private applyCap(
    globalState: GlobalRunState,
    currentScore: number,
    addHistory: (type: HistoryEntry['type'], desc: string, points: number) => void,
  ): void {
    const totalCap = this.calculateTotalCap(globalState);

    if (currentScore > totalCap) {
      const reduction = totalCap - currentScore;
      addHistory('DECK', '❌ Límite (CAP) aplicado', reduction);
    } else {
      addHistory('DECK', `Límite (CAP) Potencial: ${totalCap}`, 0);
    }
  }

  private getProgressionCost(count: number, progressionMap: Record<string, number>): number {
    const keys = Object.keys(progressionMap);
    const index = Math.min(count, keys.length);
    const key = keys[index - 1];
    return key ? progressionMap[key] : 0;
  }

  private filterHistory(history: HistoryEntry[]): HistoryEntry[] {
    return history.filter(
      (entry) => entry.points !== 0 || entry.description.includes('❌ Límite (CAP) aplicado'),
    );
  }
}
