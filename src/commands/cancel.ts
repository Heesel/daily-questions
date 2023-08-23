import { SlashCommandBuilder } from 'discord.js'
const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: any) {
        //#TODO: set correct type for parameter interaction
		//#TODO: Cancel current job for server
		await interaction.reply('Pong!');
	},
};

export default ping;