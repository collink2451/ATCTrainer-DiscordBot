/* eslint-disable no-use-before-define */
import { Channel, CommandInteraction, ThreadChannel } from "discord.js";
import Context from "./Context";
import { closeThread, inProgressThread } from "./DiscordApi";
import logger from "./logger";

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

    if (!checkInThread(command, channel)) {
      return;
    }

    const threadChannel = channel as ThreadChannel;

    switch (command.commandName) {
      case "resolve": {
        closeThread(threadChannel);
        command.reply(`Resolved thread.`);
        return;
      }
      case "in-progress": {
        inProgressThread(threadChannel);
        command.reply(`Status set to in progress.`);
        return;
      }
      case "create": {
        await command.reply("Thread tagged with issue ID.");

        const issueKey = command.options.get("issue-id")?.value?.toString().toUpperCase();
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
    command.reply("This command must be used inside a thread.");
    return false;
  }
  return true;
};
