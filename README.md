# Mesrop – Latin-to-Armenian Transliterator

## ℹ️ Description

This app turns Latin script into Armenian and vice versa. For example, you enter "abc" – you get "աբծ".

"Mesrop" is the name of the inventor of the Armenian alphabet: Mesrop Mashtots, an Armenian linguist and polymath from the 4-5 centuries CE.

## 🤷‍♂️ Why do I need it?

If you want to type in Armenian but your physical keyboard doesn't have Armenian characters, you can just type Armenian words in Latin characters, then run your text through this app – and you get that same text in Armenian characters. That can be useful in a few cases:

- You study Armenian 🇦🇲
- You already know Armenian, just don't have a physical keyboard with an Armenian layout
- You got a message in Armenian written in Latin characters

## ⚙️ Tech used
### Runtime
- Node.js 22.18+ (runs .ts files directly, no separate building)
- TypeScript ES2023+

### Libraries
#### Telegram bot
- grammY.js 1.45.1+ (Telegram bot framework)
- @grammyjs/conversations 2.1.1+ (multi-step conversations used in the bot's quizzes)
#### CLI
- commander 15.0.0+ (CLI argument and flag parsing)

### Dev tools
- Vitest 4.1.10+ (tests)
- Biome 2.5.6+ (formatting, linting, import sorting)
- @types/node 26.1.2+ (Node type definitions)
- npm 11.12.1+ (package manager) 

## 🕹️ How to use

The app has multiple interfaces:

1. Telegram bot
2. CLI (Terminal commands)
3. (Will be added later) Web app

### 🤖 Telegram bot
*Currently not always running! Want to test it? Let me know, I'll run the server for you*

The bot can turn Latin text to Armenian: just start it and send your input – it'll respond with the same text in Armenian. Just start the bot (/start) and start sending text written in Latin characters – the bot will send you back the same text written in Armenian characters.

It also has quizzes: send /practice and choose which letters you want to practice. You'll get 10 questions with increasing difficulty.

### ↪️ CLI – Terminal commands
You can run the "mesrop" command in your Terminal and transliterate text right there. Here's how to make it work locally:

1. Make sure you have Node.js 22.18+ installed
2. Run `npm install` for the local version of this repo
3. Run `npm link` to make the "mesrop" command available globally

If you don't want to link, you can just run the command directly, e.g.: `node src/cli/index.ts "barev"`.

## 🤔 More about the app
### Transliteration?
Ok, but what's this transliter... transliterate... t-thing? "To transliterate" essentially means to take letters of one alphabet and turn them into letters of another alphabet, keeping the sounds they represent the same.

Even if you don't know any languages that use some alphabet different from the one English uses (it's a version of a Latin alphabet), it won't be hard for you to imagine that they can have letters to represent similar sounds. Like the sound "f" is represented with the letter "ф" in Ukrainian – but it's practically the same sound as what comes to your mind when you see "f" in an English word.

Armenian has its own letters to represent many sounds you use in English. "F" is "Ֆ", "S" is "Ս", "T" is "S"... Ok, this is getting too confusing – you can see the whole alphabet in a table inside the app to get a better idea. But the key concept remains the same: turn letters of one alphabet to letters of another with the goal to represent the same sounds.











