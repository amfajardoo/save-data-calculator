import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CharacterOption, Czn } from '@app/domain/services/czn';
import { FaintMemoryState } from '@app/domain/services/faint-memory-state';

@Component({
  selector: 'app-select-character-modal',
  template: `
    <div
      class="bg-gray-900 rounded-2xl p-6 md:p-8 max-w-4xl w-full border border-yellow-600 shadow-2xl backdrop-blur-sm"
    >
      <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        @if (characters$().length === 0) {
          <div class="text-center py-10 text-gray-500">
            Cargando personajes... <span class="animate-pulse">⏳</span>
          </div>
        }

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
          @for (character of characters$(); track character.name) {
            <button
              (click)="selectCharacter(character)"
              class="group relative block p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-yellow-500/30 hover:shadow-xl"
            >
              <div
                class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition duration-300 group-hover:bg-gray-700/80"
              >
                <div class="aspect-square bg-gray-900/50 flex items-center justify-center p-3">
                  <img
                    [src]="character.portraitUrl"
                    [alt]="character.name"
                    class="w-full h-full object-cover rounded-md transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div class="p-3 text-center">
                  <h3 class="text-lg font-semibold text-white truncate">
                    {{ character.name }}
                  </h3>

                  <p class="text-xs text-yellow-500 mt-1">
                    {{ character.uniqueCards.length }} Cartas Únicas
                  </p>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"
              ></div>
            </button>
          } @empty {
            <div class="col-span-full text-center py-10 text-gray-500">
              No se encontraron personajes disponibles.
            </div>
          }
        </div>
      </div>

      <hr class="border-yellow-900 mt-6 mb-4" />

      <footer class="text-right">
        <button
          (click)="close()"
          class="px-6 py-2 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCharacterModal {
  private readonly czn = inject(Czn);
  private readonly state = inject(FaintMemoryState);
  private readonly dialogRef = inject(DialogRef<boolean>);

  readonly characters$ = this.czn.characters;

  selectCharacter(character: CharacterOption) {
    this.state.addCharacter(character);
    this.close();
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
