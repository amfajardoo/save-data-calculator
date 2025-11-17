import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface CharacterOption {
  name: string;
  imageUrl: string;
  cardsImgUrl: string[];
  portraitUrl: string;
  baseCards: string[];
  uniqueCards: string[];
}

interface CHARACTER_META_RES {
  base: string[];
  epiphany: string[];
}

interface CHARACTER_META {
  base: string[];
  unique: string[];
}

export type CharacterName = (typeof CHARACTERS)[number]['name'];

const CHARACTER_IMG = 'https://image.chaoszeronightmare.org/images';
const CHARACTER_DECK_BASE = 'https://html-classic.itch.zone/html/15550094/public/cards';

const generateCardUrls = (characterName: string): string[] => {
  const urls: string[] = [];
  for (let i = 1; i <= 8; i++) {
    urls.push(`${CHARACTER_DECK_BASE}/${characterName}/Base${i}.png`);
  }
  return urls;
};

const generatePortraitUrl = (characterName: string): string => {
  return `${CHARACTER_DECK_BASE}/${characterName}/portrait.png`;
};

const CHARACTERS: CharacterOption[] = [
  {
    name: 'Amir',
    imageUrl: `${CHARACTER_IMG}/amir.webp`,
    cardsImgUrl: generateCardUrls('Amir'),
    portraitUrl: generatePortraitUrl('Amir'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Beryl',
    imageUrl: `${CHARACTER_IMG}/beryl.webp`,
    cardsImgUrl: generateCardUrls('Beryl'),
    portraitUrl: generatePortraitUrl('Beryl'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Cassius',
    imageUrl: `${CHARACTER_IMG}/cassius.webp`,
    cardsImgUrl: generateCardUrls('Cassius'),
    portraitUrl: generatePortraitUrl('Cassius'),
    baseCards: [],
    uniqueCards: [],
  },
  // { name: 'Chizuru', slug: 'chizuru', imageUrl: `${URL}/chizuru.webp` },
  {
    name: 'Haru',
    imageUrl: `${CHARACTER_IMG}/haru.webp`,
    cardsImgUrl: generateCardUrls('Haru'),
    portraitUrl: generatePortraitUrl('Haru'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Hugo',
    imageUrl: `${CHARACTER_IMG}/hugo.webp`,
    cardsImgUrl: generateCardUrls('Hugo'),
    portraitUrl: generatePortraitUrl('Hugo'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Kayron',
    imageUrl: `${CHARACTER_IMG}/kayron.webp`,
    cardsImgUrl: generateCardUrls('Kayron'),
    portraitUrl: generatePortraitUrl('Kayron'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Khalipe',
    imageUrl: `${CHARACTER_IMG}/khalipe.webp`,
    cardsImgUrl: generateCardUrls('Khalipe'),
    portraitUrl: generatePortraitUrl('Khalipe'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Lucas',
    imageUrl: `${CHARACTER_IMG}/lucas.webp`,
    cardsImgUrl: generateCardUrls('Lucas'),
    portraitUrl: generatePortraitUrl('Lucas'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Luke',
    imageUrl: `${CHARACTER_IMG}/luke.webp`,
    cardsImgUrl: generateCardUrls('Luke'),
    portraitUrl: generatePortraitUrl('Luke'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Magna',
    imageUrl: `${CHARACTER_IMG}/magna.webp`,
    cardsImgUrl: generateCardUrls('Magna'),
    portraitUrl: generatePortraitUrl('Magna'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Maribell',
    imageUrl: `${CHARACTER_IMG}/maribell.webp`,
    cardsImgUrl: generateCardUrls('Maribell'),
    portraitUrl: generatePortraitUrl('Maribell'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Mei Lin',
    imageUrl: `${CHARACTER_IMG}/mei-lin.webp`,
    cardsImgUrl: generateCardUrls('Mei Lin'),
    portraitUrl: generatePortraitUrl('Mei Lin'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Mika',
    imageUrl: `${CHARACTER_IMG}/mika.webp`,
    cardsImgUrl: generateCardUrls('Mika'),
    portraitUrl: generatePortraitUrl('Mika'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Nia',
    imageUrl: `${CHARACTER_IMG}/nia.webp`,
    cardsImgUrl: generateCardUrls('Nia'),
    portraitUrl: generatePortraitUrl('Nia'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Orlea',
    imageUrl: `${CHARACTER_IMG}/orlea.webp`,
    cardsImgUrl: generateCardUrls('Orlea'),
    portraitUrl: generatePortraitUrl('Orlea'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Owen',
    imageUrl: `${CHARACTER_IMG}/owen.webp`,
    cardsImgUrl: generateCardUrls('Owen'),
    portraitUrl: generatePortraitUrl('Owen'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Rei',
    imageUrl: `${CHARACTER_IMG}/rei.webp`,
    cardsImgUrl: generateCardUrls('Rei'),
    portraitUrl: generatePortraitUrl('Rei'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Renoa',
    imageUrl: `${CHARACTER_IMG}/renoa.webp`,
    cardsImgUrl: generateCardUrls('Renoa'),
    portraitUrl: generatePortraitUrl('Renoa'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Rin',
    imageUrl: `${CHARACTER_IMG}/rin.webp`,
    cardsImgUrl: generateCardUrls('Rin'),
    portraitUrl: generatePortraitUrl('Rin'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Selene',
    imageUrl: `${CHARACTER_IMG}/selene.webp`,
    cardsImgUrl: generateCardUrls('Selene'),
    portraitUrl: generatePortraitUrl('Selene'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Tressa',
    imageUrl: `${CHARACTER_IMG}/tressa.webp`,
    cardsImgUrl: generateCardUrls('Tressa'),
    portraitUrl: generatePortraitUrl('Tressa'),
    baseCards: [],
    uniqueCards: [],
  },
  {
    name: 'Veronica',
    imageUrl: `${CHARACTER_IMG}/veronica.webp`,
    cardsImgUrl: generateCardUrls('Veronica'),
    portraitUrl: generatePortraitUrl('Veronica'),
    baseCards: [],
    uniqueCards: [],
  },
  // {
  //   name: 'Yuki',
  //   imageUrl: `${CHARACTER_IMG}/yuki.webp`,
  //   cardsImgUrl: generateCardUrls('Yuki'),
  //   portraitUrl: generatePortraitUrl('Yuki'),
  //   baseCards: [],
  //   uniqueCards: [],
  // },
];

@Injectable({
  providedIn: 'root',
})
export class Czn {
  private platformId = inject(PLATFORM_ID);

  private availableCharacters = signal<CharacterOption[]>(CHARACTERS);
  readonly characters = this.availableCharacters.asReadonly();
  readonly neutralCardUrl = `${CHARACTER_DECK_BASE}/neutral.gif`;
  readonly monsterCardUrl = `${CHARACTER_DECK_BASE}/monster.gif`;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllCharacterCardMetadata();
    }
  }

  /**
   * Carga el archivo .js del personaje y extrae los nombres de las cartas.
   * Utiliza el nombre del personaje para construir la URL.
   * @param characterName El nombre del personaje (ej. 'Cassius').
   * @returns Una promesa que resuelve con los metadatos de las cartas.
   */
  private async loadCharacterCardMetadata(characterName: string): Promise<CHARACTER_META> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('No se puede cargar scripts en el servidor'));
    }
    const fileName = characterName.charAt(0).toLowerCase() + characterName.slice(1).toLowerCase();
    const scriptUrl = `${CHARACTER_DECK_BASE}/${characterName}/${fileName}.js`;

    return new Promise((resolve, reject) => {
      delete (window as any).CHARACTER_META;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptUrl;

      script.onload = () => {
        const meta = (window as any).CHARACTER_META as CHARACTER_META_RES;

        if (meta && meta.epiphany && meta.base) {
          const result = {
            base: meta.base,
            unique: meta.epiphany,
          };

          delete (window as any).CHARACTER_META;
          script.remove();
          resolve(result);
        } else {
          script.remove();
          reject(
            new Error(
              `CHARACTER_META no se encontró o estaba incompleto después de cargar ${scriptUrl}`,
            ),
          );
        }
      };

      script.onerror = (error) => {
        script.remove();
        console.error(`Error al cargar ${scriptUrl}:`, error);
        reject(new Error(`Fallo al cargar el script: ${scriptUrl}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Itera sobre todos los personajes, carga sus metadatos de cartas
   * y actualiza el estado 'availableCharacters'.
   */
  public async loadAllCharacterCardMetadata(): Promise<void> {
    const updatedCharacters: CharacterOption[] = [...this.availableCharacters()];

    const promises = updatedCharacters.map(async (character, index) => {
      try {
        const meta = await this.loadCharacterCardMetadata(character.name);

        updatedCharacters[index] = {
          ...character,
          baseCards: meta.base,
          uniqueCards: meta.unique,
        };
      } catch (error) {
        console.error(`Error al cargar los metadatos para ${character.name}:`, error);
      }
    });

    await Promise.all(promises);

    this.availableCharacters.set(updatedCharacters);
  }

  getCharacterNameList(): CharacterName[] {
    return this.availableCharacters().map((character) => character.name);
  }
}
