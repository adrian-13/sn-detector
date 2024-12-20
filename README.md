# Detektor Sériových Čísel

Tento projekt slúži na rozpoznávanie sériových čísel z nahraných obrázkov pomocou umelej inteligencie. Umožňuje užívateľom nahrať obrázok, analyzovať ho a zobraziť identifikované sériové čísla spolu so spoľahlivosťou rozpoznania.

## Funkcionality
- **Nahrávanie obrázkov**: Jednoduché nahratie obrázkov pomocou drag-and-drop alebo výberom súboru.
- **Automatická analýza**: Po nahraní sa obrázok automaticky analyzuje a extrahujú sa sériové čísla.
- **Flexibilný formát sériových čísel**: Formát rozpoznávaných sériových čísel je možné upraviť podľa potrieb (napr. zmenou regulárnych výrazov alebo pravidiel validácie).
- **Prehľadné výsledky**: Identifikované čísla a ich spoľahlivosť sú prehľadne zobrazené, spolu s dôvodmi neúspechu pre nevalidné nálezy.

## Použitie
1. Nahrajte obrázok so sériovými číslami.
2. Kliknite na tlačidlo **Analyzovať obrázok**.
3. Počkajte na výsledky analýzy:
   - Zobrazia sa sériové čísla spolu so spoľahlivosťou rozpoznania.
   - Ak boli identifikované nevalidné nálezy, zobrazia sa dôvody neúspechu.

## Úprava Formátu Sériových Čísel
Formát sériových čísel je definovaný pomocou regulárneho výrazu:

```typescript
const SN_REGEX = /(serial\s*no\.?)|(s\s*\/\?\s*n\.?)|(serial\s*number)|(serial\s*#)|(sn:?)/i;
```

Ak potrebujete zmeniť podmienky rozpoznania, môžete:
- Upraviť regulárny výraz (`SN_REGEX`) tak, aby vyhovoval požadovanému formátu.
- Prispôsobiť pravidlá validácie vo funkcii `isValidSN` na základe dĺžky, povolených znakov alebo iných kritérií.

## Technológie
- **React.js**: Pre frontend aplikácie.
- **Node.js**: Pre backend analýzu.
- **Azure AI**: Na analýzu obrázkov a extrakciu textu.
- **Tailwind CSS**: Na dizajn a styling.

## Spustenie Lokálne
1. Klonujte repozitár:
   ```bash
   git clone https://github.com/your-repository-url.git
   ```
2. Nainštalujte závislosti:
   ```bash
   npm install
   ```
3. Spustite aplikáciu:
   ```bash
   npm run dev
   ```
4. Otvorte aplikáciu na [http://localhost:3000](http://localhost:3000).

## Prispôsobenie
Ak potrebujete projekt prispôsobiť, môžete:
- Zmeniť pravidlá validácie sériových čísel v súbore `route.tsx`.
- Upraviť dizajn v súbore `Home.tsx` alebo Tailwind CSS triedach.
- Aktualizovať backend endpoint pre analýzu obrázkov v `api/analyze`.

## Príspevky
Vaše príspevky a návrhy na zlepšenie sú vítané! Prosím, vytvorte pull request alebo otvorte issue na GitHube.

---

Tento projekt bol vytvorený s cieľom uľahčiť proces identifikácie sériových čísel a poskytuje dostatočnú flexibilitu na prispôsobenie podľa špecifických požiadaviek.
