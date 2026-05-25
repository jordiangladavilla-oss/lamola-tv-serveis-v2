# La Mola · TV Serveis (V2 — editorial)

Versió redissenyada del kiosk del coffee corner segons el llenguatge
boutique-editorial de la landing `crossfitlamola.com`.

## Diferències clau respecte V1

- **Stage 1920×1080** escalat amb `transform: scale(min(vw/1920, vh/1080))` —
  resolució de disseny fixa.
- **HUD top + HUD bottom**: brand · coords · live · tagline · clock i progress dots.
- **Slide intro** amb grid 2×2 dels 4 pros en tiles.
- **Slide pro** amb layout "editorial split" — vídeo amb badge `RECOMANAT` i
  ref `LM-{id}-26`, info amb dashes accent, QR card amb cropmarks.
- **3 famílies tipogràfiques** self-hosted: Montserrat (display), Instrument Serif
  (italics editorials), JetBrains Mono (labels).
- **Cap border-radius** — estil cru editorial.
- **Italic és sempre serif** — signatura del llenguatge boutique.

## Estructura

```
index.html              # Display TV (vanilla, ES modules)
admin.html              # Editor (mateix patró que V1)
services.json / config.json
sw.js                   # Cache offline (v2-1)
css/{tokens,tv}.css     # Tokens i estils del kiosk
js/tv/                  # Mòduls vanilla
fonts/                  # Self-hosted woff2
media/                  # Fotos, vídeos, logos
```

## Run local

```bash
npx http-server -p 8765 -c-1
# open http://localhost:8765/
```

## Deploy

GitHub Pages a `main`/root. URL final: `https://jordiangladavilla-oss.github.io/lamola-tv-serveis-v2/`
