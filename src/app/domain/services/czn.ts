import { Injectable, signal } from '@angular/core';

export interface CharacterOption {
  name: string;
  slug: string;
  imageUrl: string;
}

export type CharacterName = (typeof CHARACTERS)[number]['name'];

const URL = 'https://image.chaoszeronightmare.org/images';
const CHARACTERS: CharacterOption[] = [
  { name: 'Amir', slug: 'amir', imageUrl: `${URL}/amir.webp` },
  { name: 'Beryl', slug: 'beryl', imageUrl: `${URL}/beryl.webp` },
  { name: 'Cassius', slug: 'cassius', imageUrl: `${URL}/cassius.webp` },
  // { name: 'Chizuru', slug: 'chizuru', imageUrl: `${URL}/chizuru.webp` },
  { name: 'Haru', slug: 'haru', imageUrl: `${URL}/haru.webp` },
  { name: 'Hugo', slug: 'hugo', imageUrl: `${URL}/hugo.webp` },
  { name: 'Kayron', slug: 'kayron', imageUrl: `${URL}/kayron.webp` },
  { name: 'Khalipe', slug: 'khalipe', imageUrl: `${URL}/khalipe.webp` },
  { name: 'Lucas', slug: 'lucas', imageUrl: `${URL}/lucas.webp` },
  { name: 'Luke', slug: 'luke', imageUrl: `${URL}/luke.webp` },
  { name: 'Magna', slug: 'magna', imageUrl: `${URL}/magna.webp` },
  { name: 'Maribell', slug: 'maribell', imageUrl: `${URL}/maribell.webp` },
  { name: 'Mei Lin', slug: 'mei-lin', imageUrl: `${URL}/mei-lin.webp` },
  { name: 'Mika', slug: 'mika', imageUrl: `${URL}/mika.webp` },
  { name: 'Nia', slug: 'nia', imageUrl: `${URL}/nia.webp` },
  { name: 'Orlea', slug: 'orlea', imageUrl: `${URL}/orlea.webp` },
  { name: 'Owen', slug: 'owen', imageUrl: `${URL}/owen.webp` },
  { name: 'Rei', slug: 'rei', imageUrl: `${URL}/rei.webp` },
  { name: 'Renoa', slug: 'renoa', imageUrl: `${URL}/renoa.webp` },
  { name: 'Rin', slug: 'rin', imageUrl: `${URL}/rin.webp` },
  { name: 'Selena', slug: 'selena', imageUrl: `${URL}/selena.webp` },
  { name: 'Tressa', slug: 'tressa', imageUrl: `${URL}/tressa.webp` },
  { name: 'Veronica', slug: 'veronica', imageUrl: `${URL}/veronica.webp` },
  { name: 'Yuki', slug: 'yuki', imageUrl: `${URL}/yuki.webp` },
];

@Injectable({
  providedIn: 'root',
})
export class Czn {
  private availableCharacters = signal<CharacterOption[]>(CHARACTERS);
  characters = this.availableCharacters.asReadonly();

  getCharacterImgPath(slug: string) {
    return this.availableCharacters().find((c) => c.slug === slug)?.imageUrl || '';
  }

  getRandomCharacterName(): string {
    return this.availableCharacters()[Math.floor(Math.random() * this.availableCharacters().length)]
      .name;
  }
}
