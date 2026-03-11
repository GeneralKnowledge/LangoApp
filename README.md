# Universal Survival Phrasebook

A local-first, anonymous phrase learning app for travelers.

## Features
- No login, no server-side user data.
- Onboarding: choose UI language + one or more target languages.
- Learn screen with phrase cards and Web Speech API playback.
- Review screen with a simple SRS flow (Again/Hard/Good/Easy).
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

Clearing browser storage resets progress.
