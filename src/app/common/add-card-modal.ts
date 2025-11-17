import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CardType } from '@app/domain/models';
import { FaintMemoryState } from '@app/domain/services/faint-memory-state';
import { FAINT_MEMORY_CONTRIBUTION } from './constants';

export type AddCardModalData = { characterId: number };

@Component({
  selector: 'app-add-card-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-purple-500 shadow-2xl">
      <h3 class="text-xl font-bold mb-5 text-purple-400 text-center">Elige el tipo de Carta</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          (click)="addCard('NEUTRAL')"
          class="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-400 hover:bg-gray-600 transition shadow-lg border border-white"
        >
          <span class="text-3xl">🎴</span>
          <div class="font-bold text-sm mt-1">Neutral / Prohibida</div>
          <div class="text-xs text-gray-900 mt-1">+{{ FAINT_MEMORY_CONTRIBUTION.NEUTRAL }} FM</div>
        </button>
        <button
          (click)="addCard('MONSTER')"
          class="flex flex-col items-center justify-center p-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 transition shadow-lg border border-white"
        >
          <span class="text-3xl">🐉</span>
          <div class="font-bold text-sm mt-1">Monstruo</div>
          <div class="text-xs text-gray-900 mt-1">+{{ FAINT_MEMORY_CONTRIBUTION.MONSTER }} FM</div>
        </button>
      </div>
      <button
        (click)="close()"
        class="mt-6 w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition font-medium"
      >
        Cancelar
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardModal {
  private readonly stateService = inject(FaintMemoryState);
  private readonly characterId = inject<AddCardModalData>(DIALOG_DATA).characterId;
  private readonly dialogRef = inject(DialogRef<boolean>);

  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;

  addCard(cardType: CardType): void {
    this.stateService.addDeckCard(this.characterId, cardType);
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
