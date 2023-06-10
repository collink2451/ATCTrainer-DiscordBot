/* eslint-disable no-use-before-define */
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import Context from "./Context";
import DiscordApi from "./DiscordApi";
import DiscordCommandProcessor from "./DiscordCommandProcessor";
import TaskProcessor from "./TaskProcessor";
import logger from "./logger";

class Main {
  private context: Context;

  private discordApi: DiscordApi;

  private discordCommandProcessor: DiscordCommandProcessor;

  private taskProcessor: TaskProcessor;

  constructor() {
    logger.info("Starting up...");

    const attachmentsDir = path.resolve(__dirname, "attachments");
    if (fs.existsSync(attachmentsDir)) {
      fs.rmSync(attachmentsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(attachmentsDir);

    this.context = new Context(attachmentsDir);
    this.discordApi = new DiscordApi(this.context);
    this.discordCommandProcessor = new DiscordCommandProcessor(this.context);
    this.taskProcessor = new TaskProcessor(this.context);

    this.context.registerDiscordApi(this.discordApi);
    this.context.registerDiscordCommandProcessor(this.discordCommandProcessor);
    this.context.registerTaskProcessor(this.taskProcessor);
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
