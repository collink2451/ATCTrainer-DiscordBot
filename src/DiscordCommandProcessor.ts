/* eslint-disable no-use-before-define */
import { Channel, CommandInteraction, ThreadChannel } from "discord.js";
import Context from "./Context";
import { closeThread, inProgressThread } from "./DiscordApi";
import logger from "./logger";
import { BUG_REPORT_CHANNELS, FEATURE_REQUESTS_CHANNEL_ID } from "./utils/constants";

export default class DiscordCommandProcessor {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  handleCommand = async (command: CommandInteraction) => {
    let channel: Channel | null;
    try {
      channel = await this.context.discordApi!.discordClient.channels.fetch(command.channelId);
      if (!channel) {
        throw Error("Channel is null");
      }
    } catch (e) {
      this.context.handleError("Failed to find command channel", e);
      throw Error("Failed to find command channel");
    }

    switch (command.commandName) {
      case "resolve": {
        if (!checkInThread(command, channel)) {
          return;
        }
        const threadChannel = channel as ThreadChannel;
        closeThread(threadChannel, false);
        command.reply(`Resolved thread.`);
        return;
      }
      case "in-progress": {
        if (!checkInThread(command, channel)) {
          return;
        }
        const threadChannel = channel as ThreadChannel;
        inProgressThread(threadChannel);
        command.reply(`Status set to in progress.`);
        return;
      }
      case "feature":
      case "improvement":
      case "bug": {
        if (!checkInThread(command, channel)) {
          return;
        }
        const threadChannel = channel as ThreadChannel;
        const parentChannel = await this.context.discordApi!.discordClient.channels.fetch(threadChannel.parentId!);
        if (!parentChannel) {
          this.context.handleError("Failed to create Jira ticket", "Parent channel is null");
          return;
        }

        if (!checkBugReportOrFeatureForum(command, parentChannel)) {
          return;
        }

        await command.reply("I created a ticket for you.");

        const issueKey = command.options.get("issue-id")?.value?.toString().toUpperCase();
        // Respond in thread
        if (command.commandName === "bug") {
          try {
            // await threadChannel.send(`Your ticket number is: **${issueKey}**`);
          } catch (e) {
            this.context.handleError(`Failed to send message to ${threadChannel.name} thread`, e);
          }
        } else {
          try {
            // await threadChannel.send(`Your ticket number is: **${issueKey}**`);
          } catch (e) {
            this.context.handleError(`Failed to send message to ${threadChannel.name} thread`, e);
          }
        }

        // Set thread name
        try {
          await threadChannel.setName(`[${issueKey}] ${threadChannel.name}`.substring(0, 100));
        } catch (e) {
          this.context.handleError(`Failed to set ${threadChannel.name} name`, e);
        }
        break;
      }
      default:
        logger.info(`Unknown Discord command: ${command.commandName}`);
    }
  };
}

const checkInThread = (command: CommandInteraction, channel: Channel) => {
  if (!channel.isThread()) {
    logger.info(`${command.commandName} command was not executed in a thread. Ignoring.`);
    command.reply("Because this isn't a thread, I cannot create a ticket for you.");
    return false;
  }
  return true;
};

const checkBugReportOrFeatureForum = async (command: CommandInteraction, parentChannel: Channel) => {
  if (parentChannel.id !== FEATURE_REQUESTS_CHANNEL_ID && !BUG_REPORT_CHANNELS.includes(parentChannel.id)) {
    logger.info(`${command.commandName} command was not executed in a valid thread. Ignoring.`);
    command.reply("Because this isn't a valid forum, I cannot create a ticket for you.");
    return false;
  }

  return true;
};
