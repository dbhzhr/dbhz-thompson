# dbhz-thompson — Kralj Tomislav u 3D

Digitalno rješenje koje povezuje DBHZ digitalni muzej i pjesmu „Kralj Tomislav"
Marka Perkovića Thompsona: 3D bista kralja Tomislava okreće se u ritmu pjesme.

**Web:** https://dbhz-thompson.domovina.ai (noindex — razvojna verzija; prava
na glazbu nisu riješena).

## Gdje je što

| Što | Gdje |
|---|---|
| Video kompozicije (HyperFrames, Three.js) | `domovinatv/hyperframes-domovina-ai` → `videos/dbhz-kralj-tomislav/` |
| 3D model biste (GLB) i viewer spec | `dbhzhr/dbhz-3d-modeli` |
| Landing | `site/public/` (statički) + `site/src/index.js` (Worker: video iz R2 s Range/206) |

## Isječci

| | Pjesma (spot yD9r0grKCkA) | Trajanje | Status |
|---|---|---|---|
| A | 84,13–144,13 s: krunidba na Duvanjskom polju → 1. refren „Žezlo i kruna" | 60 s | 16:9 + 9:16 |
| B | 110,04–144,13 s: samo 1. refren (landing: `#b`) | 34,1 s | 16:9 + 9:16 |
| C | 296,6–335,6 s: „Blagoslov od pape, Tomislav je kralj" + završni refren | ~39 s | planirano |

## Novi render → web

```bash
# u hyperframes-domovina-ai/videos/dbhz-kralj-tomislav
npx hyperframes@0.8.174 render . -o renders/kralj-tomislav-a-16x9.mp4
npx hyperframes@0.8.174 render . -c formati/a-9x16.html -o renders/kralj-tomislav-a-9x16.mp4

# ovdje: faststart (moov na početak) pa u R2
ffmpeg -i <render>.mp4 -c copy -movflags +faststart site/media/<ime>.mp4
cd site && npx wrangler r2 object put dbhz-thompson/video/<ime>.mp4 \
  --file media/<ime>.mp4 --content-type video/mp4 --remote
npx wrangler deploy
```

Zamke (iz odds.domovina.ai): static assets ne vraćaju 206 pa Safari/iOS ne
pušta video — zato Worker + R2; lokalni DNS pamti negativan odgovor ako se
domena provjerava prije deploya (`--resolve` ili flush cache).

## Dokumenti

- [2026-10-19 Video „Kralj Tomislav"](docs/2026-10-19-video-kralj-tomislav.md) — tekst pjesme, zamke, odluke, mjerenja
