import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatedCharacterState, FaintMemoryState } from '../../faint-memory/faint-memory-state';
import { FAINT_MEMORY_CONTRIBUTION, ACTION_COSTS } from '../../save-data/constants';
import { EpiphanyTargetCard, CardInstance } from '../../save-data/models';
import { CharacterNameSelector } from '../character-name-selector/character-name-selector';
import { CharacterOption, Czn } from '../czn/czn';

@Component({
  selector: 'app-character-data',
  standalone: true,
  imports: [CommonModule, FormsModule, CharacterNameSelector],
  templateUrl: './character-data.html',
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
