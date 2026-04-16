# Ambience Audio Files

Place three MP3 files here. They are served locally to avoid CDN hotlink blocking.

## Required files

| Filename | Preset label | Where to get it |
|---|---|---|
| `minimalist-tech.mp3` | 💻 Minimalist Tech | https://pixabay.com/music/beats-wait-for-it-120s-7071/ — click Download |
| `soft-cinematic.mp3` | 🎬 Soft Cinematic | https://pixabay.com/music/ambient-soft-background-music-for-video-118154/ — click Download |
| `corporate-flow.mp3` | 🏢 Corporate Flow | https://pixabay.com/music/corporate-that-background-ambient-114376/ — click Download |

## Why local files?

Pixabay, Mixkit, and similar CDNs block direct `<audio src="...">` hotlinking from third-party origins.
They return 403 unless the request comes from their own website. Serving from `public/` bypasses this entirely.

## Alternative sources (all royalty-free)

- https://pixabay.com/music/search/ambient/
- https://freemusicarchive.org/genre/Ambient/
- Any MP3 you own — just rename it to match the filename above.

## File size tip

Keep each file under 3 MB. A 2–3 minute loop at 128 kbps is ideal.
