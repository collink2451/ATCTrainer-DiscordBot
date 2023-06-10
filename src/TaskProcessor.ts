import Context from "./Context";
import logger from "./logger";
import Token from "./types/Token";
import { FIVE_MIN_IN_MS } from "./utils/constants";

export default class TaskProcessor {
  private context: Context;

  private nextUserUpdateTime: Date;

  constructor(context: Context) {
    this.context = context;
    setInterval(this.removeExpiredTokens, FIVE_MIN_IN_MS);
    this.nextUserUpdateTime = new Date();
    this.nextUserUpdateTime.setUTCHours(6, 0, 0, 0);
    if (this.nextUserUpdateTime.getTime() < new Date().getTime()) {
      this.nextUserUpdateTime.setDate(this.nextUserUpdateTime.getDate() + 1);
    }
    logger.info(`Next user update time scheduled for ${this.nextUserUpdateTime.toISOString()}`);
  }

  removeExpiredTokens = () => {
    const currentTime = new Date();
    const expiredTokens: Token[] = [];
    const tokens = Array.from(this.context.discordIdTokens.keys());
    tokens.forEach((token) => {
      if (token.expiresAt < currentTime) {
        expiredTokens.push(token);
      }
    });

    if (expiredTokens.length > 0) {
      logger.info(`Removing ${expiredTokens.length} expired Discord ID token(s)...`);
    }

    expiredTokens.forEach((token) => this.context.discordIdTokens.delete(token));
  };
}
