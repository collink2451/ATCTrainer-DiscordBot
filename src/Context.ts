import DiscordApi from "./DiscordApi";
import DiscordCommandProcessor from "./DiscordCommandProcessor";
import logger from "./logger";

export default class Context {
  discordApi: DiscordApi | null = null;

  discordCommandProcessor: DiscordCommandProcessor | null = null;

  registerDiscordApi = (discordApi: DiscordApi) => {
    this.discordApi = discordApi;
  };

  registerDiscordCommandProcessor = (discordCommandProcessor: DiscordCommandProcessor) => {
    this.discordCommandProcessor = discordCommandProcessor;
  };

  // eslint-disable-next-line class-methods-use-this
  handleError = (message: string, error: unknown) => logger.error(`${message}: ${error}`);
}
