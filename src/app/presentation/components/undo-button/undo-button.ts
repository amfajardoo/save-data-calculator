import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';


@Component({
  selector: 'app-undo-button',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="onUndo.emit()"
      [disabled]="!canUndo()"
      class="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition shadow-lg font-medium text-white"
      [title]="
        canUndo() ? 'Deshacer última acción: ' + lastAction() : 'No hay acciones para deshacer'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 7v6h6"></path>
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
      </svg>
      <span class="hidden sm:inline">Deshacer última acción:</span>
      @if (lastAction() && canUndo()) {
        <span class="hidden md:inline text-sm opacity-80">({{ lastAction() }})</span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UndoButton {
  canUndo = input.required<boolean>();
  lastAction = input.required<string>();
  onUndo = output();
}
