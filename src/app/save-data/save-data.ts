import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FAINT_MEMORY_CONTRIBUTION, EPIPHANY_MODIFIERS, ACTION_COSTS } from './constants';
import { EpiphanyTargetCard } from './models';
import { Dialog } from '@angular/cdk/dialog';
import { AddCardModal } from '../common/add-card';
import { EpiphanyModal, EpiphanyModalData } from '../common/epiphany';
import { Modal } from '../common/modal';
import { CharacterDataComponent } from '../core/character-data/character-data';
import { GlobalConfigComponent } from '../core/global-config/global-config';
import { FaintMemoryState } from '../faint-memory/faint-memory-state';

@Component({
  selector: 'app-save-data',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalConfigComponent, CharacterDataComponent],
  templateUrl: './save-data.html',
  styleUrl: './save-data.css', // Asegúrate de que este archivo contenga los estilos CDK
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SaveData {
  // Inyectar servicios para gestión de estado y modales
  private readonly stateService = inject(FaintMemoryState);
  private readonly modalService = inject(Modal);
  // Inyectar Dialog del CDK para asegurar que el ambiente está configurado
  private readonly cdkDialog = inject(Dialog);

  // --- CONSTANTES AVAILABLE IN TEMPLATE ---
  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;
  protected readonly EPIPHANY_MODIFIERS = EPIPHANY_MODIFIERS;
  protected readonly ACTION_COSTS = ACTION_COSTS;

  // --- STATE SIGNALS (ReadOnly) ---
  protected readonly globalState = this.stateService.globalState$;
  protected readonly totalCap = this.stateService.totalCap;
  protected readonly calculatedCharacters = this.stateService.calculatedCharacters;

  // --- SERVICE METHODS ---
  protected updateGlobalTier = (tier: number) => this.stateService.updateGlobalTier(tier);
  protected updateGlobalNightmare = (isNightmare: boolean) =>
    this.stateService.updateGlobalNightmare(isNightmare);
  protected addCharacter = () => this.stateService.addCharacter();

  // --- MÉTODOS DE MODAL (Usando el nuevo ModalService) ---

  openAddCardModal(characterId: number): void {
    // Abrir el modal de añadir carta, pasando el ID del personaje como data
    this.modalService.open<boolean, { characterId: number }>(AddCardModal, {
      data: { characterId },
    });
  }

  openEpiphanyModal(characterId: number, cardId: string, target: EpiphanyTargetCard): void {
    const modalData: EpiphanyModalData = { characterId, cardId, target };
    // Abrir el modal de epifanía, pasando todos los datos necesarios
    this.modalService.open<boolean, EpiphanyModalData>(EpiphanyModal, {
      data: modalData,
    });
  }
}
