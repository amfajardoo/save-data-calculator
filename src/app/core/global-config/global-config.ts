// global-config.component.ts
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
  // Inputs usando la nueva API
  globalState = input.required<GlobalRunState>();
  totalCap = input.required<number>();

  // Outputs usando la nueva API
  updateTier = input.required<(tier: number) => void>();
  updateNightmare = input.required<(isNightmare: boolean) => void>();

  // Handlers para que el template se enlace
  onTierChange(tier: number): void {
    this.updateTier()(tier);
  }

  onNightmareChange(isNightmare: boolean): void {
    this.updateNightmare()(isNightmare);
  }
}
