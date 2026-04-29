import { SlashCommandBuilder } from "discord.js";

const createThreadCommand = new SlashCommandBuilder()
  .setName("create")
  .setDescription("Creates new ticket")
  .addStringOption((optionBuilder) => {
    return optionBuilder.setName("issue-id").setDescription("Github Issue ID").setRequired(true);
  });
const inProgressThreadCommand = new SlashCommandBuilder().setName("in-progress").setDescription("Sets status to in progress");
const resolveThreadCommand = new SlashCommandBuilder().setName("resolve").setDescription("Resolves and closes the thread");

const discordCommands = [
  createThreadCommand,
  inProgressThreadCommand,
  resolveThreadCommand,
];

export default discordCommands;
