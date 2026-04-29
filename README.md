# ATCTrainer Discord Bot

A TypeScript Discord bot that manages forum thread statuses by tagging threads with GitHub issue IDs and tracking their progress through to resolution.

## Slash Commands

| Command | Description |
|---------|-------------|
| `/create <issue-id>` | Prefixes the thread name with the GitHub issue ID (e.g. `[PROJ-123] thread name`) |
| `/in-progress` | Marks the thread as in progress (adds 🛠️ prefix) |
| `/resolve` | Resolves and closes the thread (adds ✅ prefix, sends a closing message, locks and archives) |

All commands must be run inside a forum thread.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js 18+
- **Library:** Discord.js 14
- **Logging:** Winston with daily log rotation

## Setup

### Requirements

- Node.js 18+
- A Discord application with bot token ([Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_client_id
DISCORD_GUILD_ID=your_discord_server_id
```

3. Start the bot:

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with ts-node-dev (auto-reloads) |
| `npm run build` | Compile TypeScript to `build/` |
| `npm start` | Run compiled build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
