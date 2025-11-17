import { Injectable } from '@angular/core';
import { CardInstance, CardType } from '../models';

type CreateCardOptions = Partial<Omit<CardInstance, 'id' | 'type' | 'name'>>;

@Injectable({ providedIn: 'root' })
export class CardFactory {
  private cardIdCounter = 0;

  createCard(type: CardType, name: string, options: CreateCardOptions = {}): CardInstance {
    return {
      type,
      name,
      id: this.generateCardId(type),
      epiphanyLogs: [],
      isConvertion: false,
      isDuplicate: false,
      imgUrl: '',
      ...options,
    };
  }

  createCardsBatch(count: number, type: CardType, baseName: string): CardInstance[] {
    return Array.from({ length: count }, (_, i) => this.createCard(type, `${baseName} ${i + 1}`));
  }

  private generateCardId(type: CardType): string {
    this.cardIdCounter++;
    const idType = type === 'FORBIDDEN' ? 'NEUTRAL' : type.charAt(0);
    return `${idType}_${this.cardIdCounter}`;
  }
}
