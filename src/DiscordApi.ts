/* eslint-disable no-use-before-define */
import Discord, { Events, GatewayIntentBits, REST, Routes, TextChannel, ThreadChannel } from "discord.js";
import Context from "./Context";
import discordCommands from "./DiscordCommands";
import logger from "./logger";
import ThreadStatus from "./types/ThreadStatus";
import Token from "./types/Token";

export default class DiscordApi {
  private context: Context;

  public discordClient: Discord.Client;

  public guild: Discord.Guild | null = null;

  private notificationChannel: TextChannel | null = null;

  private welcomeChannel: TextChannel | null = null;

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

      // Get Discord guild
      try {
        this.guild = await this.discordClient.guilds.fetch(process.env.DISCORD_GUILD_ID!);
      } catch (e) {
        this.context.handleError("Failed to find the Discord guild", e);
        throw Error("Failed to find Discord guild");
      }

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
      } else if (interaction.isButton()) {
        // Button
        const token = new Token();
        this.context.discordIdTokens.set(token, interaction.user.id);
        try {
          interaction.reply({
            content: `Welcome, ${interaction.user.username}! Please log in to VATSIM with the following link: ${process.env
              .LANDING_PAGE_URL!}/login?discord=${token.value}`,
            ephemeral: true,
          });
        } catch (e) {
          this.context.handleError("Failed reply to Discord button interaction", e);
        }
      }
    });

    await this.discordClient.login(process.env.DISCORD_TOKEN!);
  };

  public getChannel = async (channelId: string) => {
    try {
      const channel = await this.discordClient.channels.fetch(channelId);
      if (channel) {
        return channel;
      }
      throw new Error("Channel is null");
    } catch (e) {
      this.context.handleError(`Failed to find channel with ID ${channelId}`, e);
      return null;
    }
  };

  public sendNotificationMessage = async (message: string, sendErrorToAdmins = true) => {
    if (!this.notificationChannel) {
      if (sendErrorToAdmins) {
        this.context.handleError("Failed to send notification message", "Notification channel is null");
      } else {
        logger.error("Failed to send notification message: Notification channel is null");
      }
      return;
    }

    try {
      await this.notificationChannel.send(message);
    } catch (e) {
      if (sendErrorToAdmins) {
        this.context.handleError("Failed to send notification message", e);
      } else {
        logger.error(`Failed to send notification message: ${e}`);
      }
    }
  };
}

export const assignThreadStatus = async (thread: ThreadChannel, newStatus: ThreadStatus) => {
  const match = /\[\d+\]/.exec(thread.name)!;
  let oldName = thread.name;
  if (match !== null) {
    oldName = thread.name.substring(match.index);
  }

  let newName = oldName;
  switch (newStatus) {
    case ThreadStatus.Investigating:
      newName = `🔎 ${oldName}`;
      break;
    case ThreadStatus.InProgress:
      newName = `🛠️ ${oldName}`;
      break;
    case ThreadStatus.Resolved:
      newName = `✅ ${oldName}`;
      break;
    case ThreadStatus.NotDoing:
      newName = `❌ ${oldName}`;
      break;
    default:
  }

  await thread.setName(newName.substring(0, 100));
};

export const closeThread = async (thread: ThreadChannel, isBug: boolean) => {
  await assignThreadStatus(thread, ThreadStatus.Resolved);

  if (isBug) {
    await thread.send(
      "It looks like this issue has been resolved, so I'm going to close this thread now. Thanks again for the report. If you have further concerns or wish to reopen this issue, please create a new issue thread."
    );
  } else {
    await thread.send(
      "It looks like this request has been fulfilled, so I'm going to close this thread now. Thanks again for reaching out. If you have further concerns or wish to reopen this issue, please create a new issue thread."
    );
  }

  await thread.setLocked(true);
  await thread.setArchived(true);
};

export const inProgressThread = async (thread: ThreadChannel) => {
  await assignThreadStatus(thread, ThreadStatus.InProgress);
};
