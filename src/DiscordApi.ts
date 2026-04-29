/* eslint-disable no-use-before-define */
import Discord, { Events, GatewayIntentBits, REST, Routes, ThreadChannel } from "discord.js";
import Context from "./Context";
import discordCommands from "./DiscordCommands";
import logger from "./logger";

export default class DiscordApi {
  private context: Context;

  public discordClient: Discord.Client;

  constructor(context: Context) {
    this.context = context;
    this.discordClient = new Discord.Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
    });
  }

  initialize = async () => {
    logger.info("Initializing Discord API...");

    this.discordClient.once(Events.ClientReady, async () => {
      logger.info("Connected to Discord");

      // Register commands
      const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
      try {
        const res = (await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!), {
          body: discordCommands,
        })) as { length: string };
        logger.info(`Registered ${res.length} Discord commands`);
      } catch (e) {
        this.context.handleError("Failed to register Discord commands", e);
      }
    });

    // Handle interactions
    this.discordClient.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        // Commands
        if (!this.context.discordCommandProcessor) {
          this.context.handleError("Failed to handle Discord command", "CommandProcessor is null");
          return;
        }

        logger.info(`Handling Discord ${interaction.commandName} command...`);
        try {
          await this.context.discordCommandProcessor.handleCommand(interaction);
        } catch (e) {
          this.context.handleError(`Failed to handle Discord ${interaction.commandName} command`, e);
        }
        logger.info(`Finished handling Discord ${interaction.commandName} command`);
      }
    });

    await this.discordClient.login(process.env.DISCORD_TOKEN!);
  };

}

const prefixThreadName = async (thread: ThreadChannel, prefix: string) => {
  const match = /\[\d+\]/.exec(thread.name)!;
  const baseName = match !== null ? thread.name.substring(match.index) : thread.name;
  await thread.setName(`${prefix} ${baseName}`.substring(0, 100));
};

export const closeThread = async (thread: ThreadChannel) => {
  await prefixThreadName(thread, "✅");

  await thread.send(
    "It looks like this request has been fulfilled, so I'm going to close this thread now. Thanks again for reaching out. If you have further concerns or wish to reopen this issue, please create a new issue thread."
  );

  await thread.setLocked(true);
  await thread.setArchived(true);
};

export const inProgressThread = async (thread: ThreadChannel) => {
  await prefixThreadName(thread, "🛠️");
};
