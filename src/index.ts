/* eslint-disable no-use-before-define */
import dotenv from "dotenv";
import Context from "./Context";
import DiscordApi from "./DiscordApi";
import DiscordCommandProcessor from "./DiscordCommandProcessor";
import logger from "./logger";

class Main {
  private context: Context;

  private discordApi: DiscordApi;

  private discordCommandProcessor: DiscordCommandProcessor;

  constructor() {
    logger.info("Starting up...");

    this.context = new Context();
    this.discordApi = new DiscordApi(this.context);
    this.discordCommandProcessor = new DiscordCommandProcessor(this.context);

    this.context.registerDiscordApi(this.discordApi);
    this.context.registerDiscordCommandProcessor(this.discordCommandProcessor);
  }

  initialize = async () => {
    await this.discordApi.initialize();
    interruptHandler();
  };
}

const interruptHandler = () => {
  process.on("SIGINT", async () => {
    logger.info("Shutting down due to an interrupt signal...");
    process.exit(0);
  });
};

const main = async () => {
  dotenv.config();
  const instance = new Main();
  try {
    await instance.initialize();
  } catch (e) {
    logger.error(`Failed to initializing: ${e}`);
  }
};

main();
