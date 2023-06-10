import { SlashCommandBuilder } from "discord.js";

const createFeatureTicketCommand = new SlashCommandBuilder()
  .setName("feature")
  .setDescription("Creates new feature ticket")
  .addStringOption((optionBuilder) => {
    return optionBuilder.setName("issue-id").setDescription("Github Issue ID").setRequired(true);
  });
const createImprovementTicketCommand = new SlashCommandBuilder()
  .setName("improvement")
  .setDescription("Creates new improvement ticket")
  .addStringOption((optionBuilder) => {
    return optionBuilder.setName("issue-id").setDescription("Github Issue ID").setRequired(true);
  });
const createBugTicketCommand = new SlashCommandBuilder()
  .setName("bug")
  .setDescription("Creates new bug ticket")
  .addStringOption((optionBuilder) => {
    return optionBuilder.setName("issue-id").setDescription("Github Issue ID").setRequired(true);
  });
const inProgressThreadCommand = new SlashCommandBuilder().setName("in-progress").setDescription("Sets status to in progress");
const resolveThreadCommand = new SlashCommandBuilder().setName("resolve").setDescription("Resolves and closes the thread");

const discordCommands = [
  createFeatureTicketCommand,
  createImprovementTicketCommand,
  createBugTicketCommand,
  inProgressThreadCommand,
  resolveThreadCommand,
];

export default discordCommands;
