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
  styleUrl: './save-data.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SaveData {
  private readonly stateService = inject(FaintMemoryState);
  private readonly modalService = inject(Modal);
  private readonly cdkDialog = inject(Dialog);

  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;
  protected readonly EPIPHANY_MODIFIERS = EPIPHANY_MODIFIERS;
  protected readonly ACTION_COSTS = ACTION_COSTS;

  protected readonly globalState = this.stateService.globalState$;
  protected readonly totalCap = this.stateService.totalCap;
  protected readonly calculatedCharacters = this.stateService.calculatedCharacters;

  protected updateGlobalTier = (tier: number) => this.stateService.updateGlobalTier(tier);
  protected updateGlobalNightmare = (isNightmare: boolean) =>
    this.stateService.updateGlobalNightmare(isNightmare);
  protected addCharacter = () => this.stateService.addCharacter();

  openAddCardModal(characterId: number): void {
    this.modalService.open<boolean, { characterId: number }>(AddCardModal, {
      data: { characterId },
    });
  }

  openEpiphanyModal(characterId: number, cardId: string, target: EpiphanyTargetCard): void {
    const modalData: EpiphanyModalData = { characterId, cardId, target };

    this.modalService.open<boolean, EpiphanyModalData>(EpiphanyModal, {
      data: modalData,
    });
  }
}
