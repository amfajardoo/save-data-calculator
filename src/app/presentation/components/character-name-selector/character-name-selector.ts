import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterOption } from '../../../domain/services/czn';

@Component({
  selector: 'app-character-name-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-name-selector.html',
  styleUrl: './character-name-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterNameSelector {
  readonly currentName = input.required<string>();
  readonly availableCharacters = input.required<CharacterOption[]>();
  readonly nameChange = output<string>();

  protected readonly isOpen = signal(false);
  protected readonly search = signal('');

  protected readonly filteredCharacters = computed(() => {
    const searchTerm = this.search().toLowerCase();
    return this.availableCharacters().filter((char) =>
      char.name.toLowerCase().includes(searchTerm),
    );
  });

  protected readonly currentCharacter = computed(() => {
    return this.availableCharacters().find((c) => c.name === this.currentName());
  });

  protected readonly currentImageUrl = computed(() => {
    return this.currentCharacter()?.imageUrl || '';
  });

  toggleOpen() {
    this.isOpen.update((open) => !open);
    this.search.set('');
  }

  handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  selectCharacter(character: CharacterOption) {
    this.nameChange.emit(character.name);
    this.isOpen.set(false);
    this.search.set('');
  }
}
