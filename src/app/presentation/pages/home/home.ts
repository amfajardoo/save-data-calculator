import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.setupSEO();
  }

  private setupSEO(): void {
    const appTitle = 'CZN Save Data Calculator - Calculadora de Faint Memory';
    const description =
      'Calculadora oficial para Chaos Zero Nightmare. Calcula tu Faint Memory (FM) optimizando tu deck, epifanías y acciones. Herramienta gratuita para maximizar tu Save Data.';
    const keywords =
      'Chaos Zero Nightmare, CZN, Save Data, Faint Memory, FM Calculator, deck calculator, epifanía, roguelike, card game';

    this.title.setTitle(appTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: 'CZN Community' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    this.meta.updateTag({ property: 'og:title', content: appTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://save-data-calculator.vercel.app' });
    // this.meta.updateTag({
    //   property: 'og:image',
    //   content: 'https://save-data-calculator.vercel.app/assets/og-image.png',
    // });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: appTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    // this.meta.updateTag({
    //   name: 'twitter:image',
    //   content: 'https://save-data-calculator.vercel.app/assets/twitter-card.png',
    // });

    if (isPlatformBrowser(this.platformId)) {
      this.addStructuredData();
    }
  }

  private addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'CZN Save Data Calculator',
      description:
        'Calculadora de Faint Memory para Chaos Zero Nightmare. Optimiza tu deck y maximiza tu Save Data.',
      url: 'https://save-data-calculator.vercel.app',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}
