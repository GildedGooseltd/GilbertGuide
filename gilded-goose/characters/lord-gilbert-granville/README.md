# Lord Gilbert Granville

Reusable character pack for Gilded Goose guide / mascot.

## Files

| File | Use |
|------|-----|
| `gilbert-icon.svg` | App icon, chat avatar, favicon source (96×96) |
| `gilbert-portrait.png` | Square bust — avatars, social, thumbnails |
| `gilbert-walk.png` | Walking / welcoming — picker hero |
| `gilbert-reading.png` | Reading a book |
| `gilbert-thinking.png` | Wing to chin, pondering |
| `gilbert-presenting.png` | Wings spread, presenting |
| `gilbert-seated.png` | Seated with clipboard |
| `gilbert-celebrating.png` | Triumphant dance step |
| `gilbert-caricature-library.png` | Framed portrait — marketing, print |
| `gilbert-seal.png` | Logo / wordmark seal with gold frame |
| `CHARACTER.json` | Locked traits + image prompt for AI tools |

## Wired in

Project picker (`clients/pav-law/project-picker/assets/`):

- `gigi-goose-guide.svg` ← `gilbert-icon.svg`
- `gigi-goose-walk.png` ← `gilbert-walk.png`
- `gigi-logo-frame.png` ← seal (unchanged)

## Regenerate

Paste `imagePrompt` from `CHARACTER.json` into Grok / ChatGPT / Midjourney. Attach any file from this folder as style reference.
