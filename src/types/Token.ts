import { ulid } from "ulid";
import { ONE_HOUR_IN_MS } from "../utils/constants";

export default class Token {
  value: string;

  expiresAt: Date;

  constructor() {
    this.value = ulid();
    this.expiresAt = new Date(Date.now() + ONE_HOUR_IN_MS);
  }
}
