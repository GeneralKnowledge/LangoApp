# Universal Survival Phrasebook — Project Structure & Data Format Proposal

This document proposes a minimal, extensible architecture for an anonymous, local-first Next.js app.

## 1) Proposed Project Structure

```txt
universal-survival-phrasebook/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                         # route guard -> onboarding or learn
│  ├─ onboarding/page.tsx              # first language + target language selection
│  ├─ learn/page.tsx                   # phrase cards (new + preview)
│  ├─ review/page.tsx                  # SRS queue & grading buttons
│  ├─ settings/page.tsx                # voice, speed, reset, language prefs
│  └─ globals.css
├─ components/
│  ├─ PhraseCard.tsx
│  ├─ QueueFilters.tsx
│  ├─ ReviewButtons.tsx
│  ├─ LanguageMultiSelect.tsx
│  └─ AudioControls.tsx
├─ data/
│  ├─ ui/
│  │  ├─ en.json
│  │  ├─ es.json
│  │  └─ ...
│  └─ packs/
│     ├─ spanish.json
│     ├─ french.json
│     ├─ arabic.json
│     └─ ...
├─ lib/
│  ├─ types.ts                         # shared type definitions
│  ├─ constants.ts                     # modules, language list, defaults
│  ├─ srs.ts                           # scheduling logic (Again/Hard/Good/Easy)
│  ├─ queue.ts                         # due + new queue builder
│  ├─ tts.ts                           # Web Speech API helpers
│  ├─ storage/
│  │  ├─ db.ts                         # IndexedDB setup + migrations
│  │  ├─ settingsRepo.ts
│  │  ├─ progressRepo.ts
│  │  └─ seenRepo.ts
│  └─ i18n.ts                          # simple UI translation lookup
├─ public/
│  └─ icons/
├─ docs/
│  ├─ project-structure-and-data-format.md
│  └─ content-authoring-guide.md       # optional future guide
├─ package.json
├─ tsconfig.json
└─ README.md
```

## 2) Core Types (TypeScript)

```ts
export type ModuleId =
  | 'GREETINGS'
  | 'POLITENESS'
  | 'BASICS'
  | 'INTRO'
  | 'NUMBERS'
  | 'FOOD'
  | 'DIRECTIONS'
  | 'TRANSPORT'
  | 'EMERGENCY';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface PhraseMeaning {
  [uiLangCode: string]: string;
}

export interface PhraseItem {
  id: string;                         // e.g. "greetings.hello"
  module: ModuleId;
  difficulty: 1 | 2 | 3;
  meaning: PhraseMeaning;             // translated meaning in UI languages
  say: {
    native: string;                   // phrase in target language script
    romanization?: string | null;     // pronunciation support when useful
  };
  notes?: string;
}

export interface PhrasePack {
  languageCode: string;               // e.g. "es", "ja", "ar"
  languageName: string;               // e.g. "Spanish"
  version: number;
  phrases: PhraseItem[];
}

export interface ReviewState {
  phraseId: string;
  targetLang: string;
  dueAt: string;                      // ISO date
  intervalDays: number;
  easeFactor: number;                 // starts at 2.5
  repetitions: number;
  lastGrade: Grade | null;
  lastReviewedAt?: string;
  isNew: boolean;
}
```

## 3) Phrase Pack JSON Format

Each target language has its own pack in `data/packs/<language>.json`.

```json
{
  "languageCode": "es",
  "languageName": "Spanish",
  "version": 1,
  "phrases": [
    {
      "id": "greetings.hello",
      "module": "GREETINGS",
      "difficulty": 1,
      "meaning": {
        "en": "Hello",
        "es": "Hola",
        "fr": "Bonjour",
        "ar": "مرحبًا"
      },
      "say": {
        "native": "Hola",
        "romanization": null
      },
      "notes": "Neutral greeting."
    }
  ]
}
```

### Content Rules
- `id` is globally stable and reused across all language packs.
- `meaning` must include at least `en` and ideally all supported UI languages.
- `romanization` is required for scripts where pronunciation is not obvious to most learners.
- `difficulty` is lightweight sequencing metadata (1 easiest → 3 harder).

## 4) Local Storage Schema (IndexedDB)

Database name: `usp-db`, versioned for migrations.

### Object stores
1. `settings` (key: `id = "singleton"`)
   - `uiLanguage`
   - `targetLanguages[]`
   - `selectedVoiceByLang`
   - `speechRate`
   - `slowMode`
2. `reviewProgress` (compound key: `[targetLang, phraseId]`)
   - full `ReviewState`
3. `seenPhrases` (compound key: `[targetLang, phraseId]`)
   - `seenAt`
4. `meta` (optional)
   - app schema version, last opened timestamp

## 5) SRS Scheduler (Simple SM-2 style)

Initial state for unseen phrase:
- `repetitions = 0`
- `intervalDays = 0`
- `easeFactor = 2.5`
- `isNew = true`

Grade behavior:
- **Again**: `repetitions = 0`, `intervalDays = 0` (requeue soon), `easeFactor -= 0.2`
- **Hard**: `intervalDays = max(1, round(intervalDays * 1.2))`, `easeFactor -= 0.15`
- **Good**:
  - if first success: `intervalDays = 1`
  - second success: `intervalDays = 3`
  - else: `intervalDays = round(intervalDays * easeFactor)`
- **Easy**: similar to Good but with bonus multiplier (`* 1.3`) and slight `easeFactor += 0.1`

Clamp `easeFactor` to a sane floor (e.g. `1.3`).

## 6) Review Queue Generation

Input:
- selected `targetLanguage`
- optional module filter
- phrase pack
- user progress records

Algorithm:
1. Load all due cards where `dueAt <= now`.
2. Apply filters (`module`, `targetLanguage`).
3. If queue size < desired session size (e.g. 20), add unseen phrases as `NEW` in ascending difficulty/module order.
4. Merge into queue with labels:
   - `DUE` for scheduled reviews
   - `NEW` for first-time cards
5. Persist progress after each grade.

## 7) UI + Route Flow

1. `/`:
   - if no settings → redirect `/onboarding`
   - else → redirect `/learn`
2. `/onboarding`:
   - choose UI language
   - choose one or more target languages
3. `/learn`:
   - browse/start phrases
   - play audio via Web Speech API
4. `/review`:
   - queue session, grading buttons (Again/Hard/Good/Easy)
5. `/settings`:
   - language prefs, voice, speed, slow playback, local data reset

## 8) Extensibility

To add a new target language later:
1. Create `data/packs/<new-language>.json` using the same schema.
2. Register language metadata in `lib/constants.ts`.
3. Optionally add UI translation file in `data/ui/`.

No backend migrations are required because all data is local and keyed by `targetLang + phraseId`.
