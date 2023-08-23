import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js'
import fs from "fs";
import path from 'path';

const attachment = new AttachmentBuilder('./src/assets/picture.jpg');
// get current year
const year = new Date().getFullYear();
const help = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows a list of commands'),
	async execute(interaction: any) {
        const embed = new EmbedBuilder()
            .setColor('#ffa207')
            .setTitle('List of commands')
            .setAuthor({ name: 'Daily Questions', iconURL: 'attachment://picture.jpg', url: 'https://hessel-portfolio.vercel.app/' })
            .addFields(
                { name: '- help', value: 'Get a list of commands' },
                { name: '- setup', value: 'Setup or update the configuration for the server' },
                { name: '- question', value: 'Add questions to the bot' },
                { name: '- cancel', value: 'Cancel the questions for the server (run setup to conntinue the bot)' },
            )
            .setTimestamp()
            .setFooter({ text: `©Daily Questions - ${year}`, iconURL: 'attachment://picture.jpg'});
        await interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
	},
};

export default help;