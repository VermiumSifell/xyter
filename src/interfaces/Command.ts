import { SlashCommandBuilder } from "@discordjs/builders";

export interface ICommand {
  modules: any;
  builder: SlashCommandBuilder;
  execute: Promise<void>;
}
