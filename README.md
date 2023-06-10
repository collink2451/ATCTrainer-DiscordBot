# vatsim-vnas/discord-bot

https://github.com/vatsim-vnas/discord-bot

## Overview

This repository contains the source code for the vNAS Discord bot. The bot currently allows developers to file new Jira issues using the `/bug`, `/improvement`, and `/feature` commands, updates threads based on Jira ticket status, and notifies developers when a new NuGet or npm package is available.

## Running Locally

1. Download and install [Node.js](https://nodejs.org/en/)

2. Navigate to the `/discord-bot` directory and execute the following command to install npm packages:

   ```
   npm i
   ```

3. Create a `.env` file and include the following entries. Missing values must be obtained from a vNAS administrator:

   ```
    DISCORD_TOKEN=
    DISCORD_CLIENT_ID=
    DISCORD_GUILD_ID=953714419597201408
    JIRA_USER=vnas.bot@gmail.com
    JIRA_TOKEN=
    DEBUG_MODE=true
    DEBUG_CHANNEL_ID=
   ```

4. Execute the following command to start the local server:

   ```
   npm run dev
   ```

5. To forward webhooks to your local machine, sign up for an [ngrok](https://ngrok.com/) account and install the local utility. You must contact Nathan Rankin about forwarding webhooks to your ngrok URL.

## Contributing

Contributions must be designed on a separate branch based off of `master`. When completed, a PR must be initiated with Nathan Rankin (@nrankin18) added as a reviewer. After an approval is granted, the PR may be **squash merged** into the `master` branch. Please remove the default squash commit message with the entire commit history.

## Deploying

> ⚠️ The Discord Bot will automatically be deployed upon any push to the `master` branch.

## Troubleshooting

To restart the bot on prod, execute `systemctl --user restart bot.virtualnas.net.service` as the `vnas` user.
