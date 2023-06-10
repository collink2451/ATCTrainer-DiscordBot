import JiraClient from "jira-client";
import DiscordApi from "./DiscordApi";
import DiscordCommandProcessor from "./DiscordCommandProcessor";
import TaskProcessor from "./TaskProcessor";
import logger from "./logger";
import Token from "./types/Token";

export default class Context {
  discordApi: DiscordApi | null = null;

  jiraClient: JiraClient;

  discordCommandProcessor: DiscordCommandProcessor | null = null;

  taskProcessor: TaskProcessor | null = null;

  discordIdTokens: Map<Token, string> = new Map<Token, string>();

  attachmentsDir: string;

  constructor(attachmentsDir: string) {
    this.attachmentsDir = attachmentsDir;
    this.jiraClient = new JiraClient({
      protocol: "https",
      host: "crcdev.atlassian.net",
      username: process.env.JIRA_USER,
      password: process.env.JIRA_TOKEN,
      apiVersion: "3",
      strictSSL: true,
    });
  }

  registerDiscordApi = (discordApi: DiscordApi) => {
    this.discordApi = discordApi;
  };

  registerDiscordCommandProcessor = (discordCommandProcessor: DiscordCommandProcessor) => {
    this.discordCommandProcessor = discordCommandProcessor;
  };

  registerTaskProcessor = (taskProcessor: TaskProcessor) => {
    this.taskProcessor = taskProcessor;
  };

  // eslint-disable-next-line class-methods-use-this
  handleError = (message: string, error: unknown) => logger.error(`${message}: ${error}`);

  exchangeDiscordIdToken = (tokenValue: string) => {
    const tokens = Array.from(this.discordIdTokens.keys());
    const token = tokens.find((t) => t.value === tokenValue);
    if (token) {
      const discordId = this.discordIdTokens.get(token);
      this.discordIdTokens.delete(token);
      return discordId;
    }
    return undefined;
  };
}
