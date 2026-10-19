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

## Isječci (druga iteracija, 2026-10-19)

Svaki video: intro kartica 2 s → pjesma (rez u pauzi vokala) → outro kartica 3 s.
Uz stihove jedna povijesna činjenica i jedan citat (izvori u video repou,
`analiza/povijesni-kontekst.md`).

| | Pjesma (spot yD9r0grKCkA) | Video | Landing |
|---|---|---|---|
| A | 84,13–147,54 s: krunidba → cijeli 1. refren | 68,4 s | `/` |
| B | 110,04–147,54 s: cijeli 1. refren | 42,5 s | `#b` |
| D | 252,31–297,1 s: „Kad s perona siđeš…" → „…o junaštvu tvom" | 49,8 s | `#d` |
| C | 297,1–367,25 s: Split, „Tomislav je kralj", „Još zemlja se mrvi", „Kroz Bosnu… Kraljevstvo tvoje" | 75,2 s | `#c` |

Svi u 16:9 i 9:16.

## Novi render → web

```bash
# u hyperframes-domovina-ai/videos/dbhz-kralj-tomislav
python3 generiraj-kompozicije.py && node provjeri-trajanja.mjs
./snapshot-storyboard.sh && python3 generiraj-storyboard.py   # boards/storyboard.html
./render-sve.sh                                               # svih 8 u renders/

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
