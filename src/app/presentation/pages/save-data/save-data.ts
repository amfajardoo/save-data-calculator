import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Dialog } from '@angular/cdk/dialog';
import { AddCardModal } from '@app/common/add-card-modal';
import { FAINT_MEMORY_CONTRIBUTION, EPIPHANY_MODIFIERS, ACTION_COSTS } from '@app/common/constants';
import { EpiphanyModalData, EpiphanyModal } from '@app/common/epiphany-modal';
import { Modal } from '@app/common/modal';
import { EpiphanyTargetCard } from '@app/domain/models';
import { FaintMemoryState } from '@app/domain/services/faint-memory-state';
import { CharacterDataComponent } from '@app/presentation/components/character-data/character-data';
import { GlobalConfigComponent } from '@app/presentation/components/global-config/global-config';
import { UndoButton } from '@app/presentation/components/undo-button/undo-button';
import { SelectCharacterModal } from '@app/common/select-character-modal';

@Component({
  selector: 'app-save-data',
  standalone: true,
  imports: [FormsModule, GlobalConfigComponent, CharacterDataComponent, UndoButton],
  templateUrl: './save-data.html',
  styleUrl: './save-data.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveData {
  private readonly stateService = inject(FaintMemoryState);
  private readonly modalService = inject(Modal);
  private readonly cdkDialog = inject(Dialog);

  protected readonly FAINT_MEMORY_CONTRIBUTION = FAINT_MEMORY_CONTRIBUTION;
  protected readonly EPIPHANY_MODIFIERS = EPIPHANY_MODIFIERS;
  protected readonly ACTION_COSTS = ACTION_COSTS;

  protected readonly globalState = this.stateService.globalState$;
  protected readonly totalCap = this.stateService.totalCap;
  protected readonly calculatedCharacters = this.stateService.calculatedCharacters;
  protected readonly canUndo = this.stateService.canUndo$;
  protected readonly lastAction = this.stateService.lastAction$;

  protected updateGlobalTier = (tier: number) => this.stateService.updateGlobalTier(tier);
  protected updateGlobalNightmare = (isNightmare: boolean) =>
    this.stateService.updateGlobalNightmare(isNightmare);
  protected undo = () => this.stateService.undo();

  openAddCardModal(characterId: number): void {
    this.modalService.open<boolean, { characterId: number }>(AddCardModal, {
      data: { characterId },
    });
  }

  openSelectCharacterModal(): void {
    this.modalService.open<boolean>(SelectCharacterModal);
  }

  openEpiphanyModal(characterId: number, cardId: string, target: EpiphanyTargetCard): void {
    const modalData: EpiphanyModalData = { characterId, cardId, target };
    this.modalService.open<boolean, EpiphanyModalData>(EpiphanyModal, {
      data: modalData,
    });
  }
}
