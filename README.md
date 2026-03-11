# Universal Survival Phrasebook

A local-first, anonymous phrase learning app for travelers.

## Features
- No login, no server-side user data.
- Onboarding: choose UI language + one or more target languages.
- Localized UI labels for all supported language codes with English fallback (translation scaffolding ready for iterative refinement).
- Learn screen with phrase cards, favorites, and Web Speech API playback.
- Review screen with SRS flow (Again/Hard/Good/Easy) and same-session requeue for misses.
- Settings for speech speed, slow mode, voice selection, and local reset.
- Phrase content shipped as JSON packs in `data/packs`.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Storage
Uses browser LocalStorage:
- `usp.settings`
- `usp.progress`
- `usp.favorites`

Clearing browser storage resets progress.

## Content checks

```bash
npm run validate:content
npm run validate:ui
```

This validates phrase IDs and required English meanings across language packs.


UI dictionaries are stored in `data/ui/*.json` and currently contain complete key coverage for each supported UI language code.
