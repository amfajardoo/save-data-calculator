import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { computed } from '@angular/core';
import { FaintMemoryState } from '../faint-memory/faint-memory-state';
import { EPIPHANY_MODIFIERS } from '../save-data/constants';
import { EpiphanyTargetCard, CardInstance } from '../save-data/models';

export type EpiphanyModalData = {
  characterId: number;
  cardId: string;
  target: EpiphanyTargetCard;
};

@Component({
  selector: 'app-epiphany-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-yellow-500 shadow-2xl">
      <h3 class="text-xl font-bold mb-5 text-yellow-400 text-center">
        Aplicar Epifanía
        <span class="block text-base text-gray-300 font-normal mt-1">
          Objetivo: {{ displayTarget() }}
        </span>
      </h3>
      <form #epiphanyForm="ngForm" (ngSubmit)="addEpiphany()">
        <div class="space-y-4">
          <label class="block">
            <span class="text-sm text-gray-300">Tipo</span>
            <select
              [(ngModel)]="selectedType"
              name="type"
              required
              class="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:border-yellow-500 outline-none text-white"
            >
              <option value="REGULAR">
                ✨ Regular (+{{ EPIPHANY_MODIFIERS.REGULAR_BONUS }} FM si aplica)
              </option>
              <option value="DIVINE">👑 Divina (+{{ EPIPHANY_MODIFIERS.DIVINE_BONUS }} FM)</option>
            </select>
          </label>
        </div>

        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            (click)="close()"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-medium"
          >
            Cerrar
          </button>
          <button
            type="submit"
            [disabled]="epiphanyForm.invalid"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition disabled:opacity-50 font-medium"
          >
            Aplicar Epifanía
          </button>
        </div>
      </form>

      @if (currentCard()) {
        <div class="mt-4 pt-4 border-t border-gray-700">
          <h4 class="text-sm font-semibold mb-2 text-red-400">Quitar Epifanías de esta carta</h4>
          <div class="flex flex-wrap gap-2">
            @for (log of currentCard()!.epiphanyLogs; track $index) {
              <div
                class="flex items-center rounded-full px-3 py-1 text-xs shadow-md"
                [class.bg-yellow-800]="log.type === 'REGULAR'"
                [class.bg-red-800]="log.type === 'DIVINE'"
              >
                <span class="font-medium mr-1 text-white">
                  {{ log.type === 'REGULAR' ? '✨ Regular' : '👑 Divina' }}
                </span>
                <button
                  (click)="removeEpiphany($index)"
                  class="ml-2 text-red-300 hover:text-red-100"
                >
                  ×
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpiphanyModal {
  private readonly stateService = inject(FaintMemoryState);
  private readonly dialogRef = inject(DialogRef<boolean>);
  protected readonly EPIPHANY_MODIFIERS = EPIPHANY_MODIFIERS;

  private readonly modalData = inject<EpiphanyModalData>(DIALOG_DATA);
  protected selectedType: 'REGULAR' | 'DIVINE' = 'REGULAR';

  protected readonly currentCard = computed<CardInstance | undefined>(() => {
    const char = this.stateService.characters$().find((c) => c.id === this.modalData.characterId);
    return char?.deck.find((card) => card.id === this.modalData.cardId);
  });

  protected displayTarget = computed(() => {
    const target = this.modalData.target;
    return target === 'MONSTER'
      ? 'Monstruo 🐉'
      : target === 'NEUTRAL_FORBIDDEN'
        ? 'Neutral/Prohibida 🎴'
        : 'Error de Objetivo';
  });

  addEpiphany(): void {
    if (!this.currentCard()) return;

    this.stateService.addEpiphany(
      this.modalData.characterId,
      this.modalData.cardId,
      this.selectedType,
      this.modalData.target,
    );
  }

  removeEpiphany(logIndex: number): void {
    if (!this.currentCard()) return;

    this.stateService.removeEpiphany(this.modalData.characterId, this.modalData.cardId, logIndex);
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
