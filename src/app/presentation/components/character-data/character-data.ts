import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { FAINT_MEMORY_CONTRIBUTION, ACTION_COSTS } from '@app/common/constants';
import { EpiphanyTargetCard, CardInstance } from '@app/domain/models';
import { Czn, CharacterOption } from '@app/domain/services/czn';
import {
  CalculatedCharacterState,
  FaintMemoryState,
} from '@app/domain/services/faint-memory-state';

@Component({
  selector: 'app-character-data',
  standalone: true,
  imports: [FormsModule],
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

  convertingCardIndex = signal<number | null>(null);
  convertProgress = signal(0);

  private convertTimeout: any;
  private convertInterval: any;

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

  startConverting(index: number) {
    this.convertingCardIndex.set(index);
    this.convertProgress.set(0);

    const duration = 500;
    const intervalTime = 100;
    const increment = (intervalTime / duration) * 100;

    this.convertInterval = setInterval(() => {
      const current = this.convertProgress();
      if (current >= 100) {
        this.completeConversion(index);
      } else {
        this.convertProgress.set(current + increment);
      }
    }, intervalTime);

    this.convertTimeout = setTimeout(() => {
      this.completeConversion(index);
    }, duration);
  }

  cancelConverting() {
    clearTimeout(this.convertTimeout);
    clearInterval(this.convertInterval);
    this.convertingCardIndex.set(null);
    this.convertProgress.set(0);
  }

  completeConversion(index: number) {
    this.cancelConverting();
    this.convertCard(index);
  }
}
