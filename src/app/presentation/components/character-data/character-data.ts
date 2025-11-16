import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FAINT_MEMORY_CONTRIBUTION, ACTION_COSTS } from '@app/common/constants';
import { EpiphanyTargetCard, CardInstance } from '@app/domain/models';
import { Czn, CharacterOption } from '@app/domain/services/czn';
import {
  CalculatedCharacterState,
  FaintMemoryState,
} from '@app/domain/services/faint-memory-state';
import { CharacterNameSelector } from '../character-name-selector/character-name-selector';

@Component({
  selector: 'app-character-data',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterNameSelector],
  templateUrl: './character-data.html',
  styleUrl: './character-data.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDataComponent {
  character = input.required<CalculatedCharacterState>();
  totalCap = input.required<number>();

  openAddCardModal = input.required<() => void>();
  openEpiphanyModal = input.required<(cardId: string, targetCard: EpiphanyTargetCard) => void>();

  private readonly faintMemoryState = inject(FaintMemoryState);
  private readonly czn = inject(Czn);

  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;
  protected readonly ACTION_COSTS = ACTION_COSTS;
  protected readonly allAvailableCharacters: CharacterOption[] = this.czn.characters();

  addInitialCards() {
    this.faintMemoryState.addInitialCards(this.character().id);
  }

  protected updateCharacter(key: keyof CalculatedCharacterState, value: any): void {
    this.faintMemoryState.updateCharacter(this.character().id, key as any, value);
  }

  protected updateCardName(cardId: string, name: string): void {
    this.faintMemoryState.updateCardName(this.character().id, cardId, name);
  }

  protected removeCharacter(): void {
    this.faintMemoryState.removeCharacter(this.character().id);
  }

  protected removeDeckCard(cardId: string): void {
    this.faintMemoryState.removeDeckCard(this.character().id, cardId);
  }

  protected duplicateCard(cardId: string): void {
    this.faintMemoryState.duplicateCard(this.character().id, cardId);
  }

  protected convertCard(index: number): void {
    this.faintMemoryState.convertCard(this.character().id, index);
  }

  protected handleOpenAddCardModal(): void {
    this.openAddCardModal()();
  }

  protected handleOpenEpiphanyModalForCard(cardId: string, targetCard: EpiphanyTargetCard): void {
    this.openEpiphanyModal()(cardId, targetCard);
  }

  protected getEpiphanyStatus(card: CardInstance) {
    return this.faintMemoryState.getEpiphanyStatus(card);
  }
}
