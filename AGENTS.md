# Mesrop

Latin ⇄ Armenian transliteration with two interfaces: a CLI and a Telegram bot (grammY) with letter-practice quizzes.

## Layout

- `src/shared/` – interface-agnostic logic and data (transliteration tables, transliterators, lessons)
- `src/cli/` – CLI (commander)
- `src/telegram-bot/` – Telegram bot

## Commands

- `npm test` – run tests (vitest, watch mode)
- `npx vitest related --run <changed files>` – run only the tests that depend on the given files
- `npm run check` – format + lint + organize imports (Biome, writes fixes)
- `npm run bot` – run the bot locally (needs `.env`, see `.env.example`)

## Rules

- Nothing is done without an explicit request: no unrequested edits, and never commit or push – the user does that.
- After every code change:
  1. Run `npm run check`, so formatting never ends up in a separate commit.
  2. Run the tests covering the changed logic (`npx vitest related --run <changed files>`).
- Don't add or update tests on your own. If tests fail, or behaviour they cover has changed, report it and say which tests may need an update.
