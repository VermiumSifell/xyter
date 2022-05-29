import { SlashCommandBuilder } from "@discordjs/builders";

export interface ICommand {
  builder: SlashCommandBuilder;
  moduleData: any;
  execute: Promise<void>;
}
