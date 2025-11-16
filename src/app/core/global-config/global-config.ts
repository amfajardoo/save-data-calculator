import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalRunState } from '../../save-data/models';

@Component({
  selector: 'app-global-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-config.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalConfigComponent {
  globalState = input.required<GlobalRunState>();
  totalCap = input.required<number>();

  updateTier = input.required<(tier: number) => void>();
  updateNightmare = input.required<(isNightmare: boolean) => void>();

  onTierChange(tier: number): void {
    this.updateTier()(tier);
  }

  onNightmareChange(isNightmare: boolean): void {
    this.updateNightmare()(isNightmare);
  }
}
