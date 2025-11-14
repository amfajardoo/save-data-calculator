// character-data.component.ts
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatedCharacterState, FaintMemoryState } from '../../faint-memory/faint-memory-state';
import { FAINT_MEMORY_CONTRIBUTION, ACTION_COSTS } from '../../save-data/constants';
import { EpiphanyTargetCard, CardInstance } from '../../save-data/models';

@Component({
  selector: 'app-character-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-data.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDataComponent {
  // Inputs usando la nueva API
  character = input.required<CalculatedCharacterState>();
  totalCap = input.required<number>();

  // Outputs/Callbacks para delegar la apertura de modales al componente padre
  openAddCardModal = input.required<() => void>();
  openEpiphanyModal = input.required<(cardId: string, targetCard: EpiphanyTargetCard) => void>();

  // Inyectar el servicio de estado para todas las mutaciones y utilidades
  private readonly stateService = inject(FaintMemoryState);

  // Constantes expuestas al template
  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;
  protected readonly ACTION_COSTS = ACTION_COSTS;

  addInitialCards() {
    this.stateService.addInitialCards(this.character().id);
  }

  // --- HANDLERS DE MUTACIÓN DEL ESTADO (Usan el servicio directamente) ---

  protected updateCharacter(key: keyof CalculatedCharacterState, value: any): void {
    // La conversión a `keyof CharacterState` es segura porque `CalculatedCharacterState`
    // extiende `CharacterState` y estos son campos mutables.
    this.stateService.updateCharacter(this.character().id, key as any, value);
  }

  protected removeCharacter(): void {
    this.stateService.removeCharacter(this.character().id);
  }

  protected removeDeckCard(cardId: string): void {
    this.stateService.removeDeckCard(this.character().id, cardId);
  }

  protected duplicateCard(cardId: string): void {
    this.stateService.duplicateCard(this.character().id, cardId);
  }

  protected convertCard(): void {
    // La lógica de conversión está encapsulada en el servicio
    this.stateService.convertCard(this.character().id);
  }

  // --- HANDLERS DE APERTURA DE MODAL (Usan los callbacks inyectados) ---

  protected handleOpenAddCardModal(): void {
    this.openAddCardModal()();
  }

  protected handleOpenEpiphanyModalForCard(cardId: string, targetCard: EpiphanyTargetCard): void {
    // Llama al callback inyectado con los argumentos necesarios
    this.openEpiphanyModal()(cardId, targetCard);
  }

  // --- MÉTODOS DE UTILIDAD (Del servicio) ---
  protected getEpiphanyStatus(card: CardInstance) {
    return this.stateService.getEpiphanyStatus(card);
  }
}
