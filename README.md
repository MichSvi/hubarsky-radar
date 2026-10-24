# Hubársky radar

Webová aplikácia (PWA), ktorá podľa počasia, typu lesa, nadmorskej výšky a skutočných nálezov odhaduje,
ktoré huby a s akou šancou nájdete na zvolenom mieste – dnes a v najbližších 7 dňoch. Primárne po slovensky, prepínateľné do angličtiny.

## Spustenie

```bash
npm install
npm run dev        # vývoj na http://localhost:5173
npm run build      # produkčná verzia do dist/ (vrátane service workera dist/sw.js)
npm run preview    # náhľad produkčnej verzie na http://localhost:4173
```

`dist/` je čisto statická stránka – dá sa nasadiť zadarmo na Netlify, Cloudflare Pages, GitHub Pages alebo Vercel.
Notifikácie a inštalácia na plochu fungujú iba cez HTTPS (alebo localhost).

## Zdroje dát (všetky zadarmo, bez API kľúča)

| Čo | Zdroj |
|---|---|
| Počasie 30 dní dozadu + 8 dní predpoveď, teplota a vlhkosť pôdy, nadmorská výška | [Open-Meteo](https://open-meteo.com) |
| Typ lesa (listnatý / ihličnatý / bez stromov, 10 m) | [Copernicus HRL Dominant Leaf Type 2018](https://land.copernicus.eu/) (EEA image server), záložne OpenStreetMap Overpass |
| Fotografie druhov, nálezy v okolí | [iNaturalist API](https://api.inaturalist.org/v1/docs/) |
| Mapa, vyhľadávanie miest | OpenStreetMap, Nominatim |

## Štruktúra

- `src/data/species.ts` – 30 druhov: sezóna, teplotný profil, potreba zrážok, dreviny, výška, poznávacie znaky, zameniteľné (jedovaté) druhy
- `src/lib/score.ts` – výpočet šance (popis metódy je aj v aplikácii v záložke „Ako to funguje“)
- `src/lib/alerts.ts`, `src/sw.ts` – sledované miesta a upozornenia (kontrola pri otvorení aplikácie + Periodic Background Sync v Chrome/Android po inštalácii)

## Obmedzenia

- Upozornenia na pozadí bez otvorenia aplikácie fungujú len v Chromium prehliadačoch s nainštalovanou PWA.
  Pre spoľahlivé push notifikácie na všetkých zariadeniach (aj iPhone) treba malý server (napr. Cloudflare Worker s cron-om + Web Push).
- Šanca je heuristický odhad, nie kalibrovaná pravdepodobnosť. Ďalším krokom by bolo kalibrovať parametre na historických nálezoch (iNaturalist/GBIF) a historickom počasí (Open-Meteo archive).
