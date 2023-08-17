import 'dotenv/config'

import { SlashCommandBuilder } from 'discord.js'
import { mongodbOperations } from '../utils/mongodbOperations';
import { Server } from '../types/server';
import * as moment from 'moment-timezone';

const uri = process.env.CONNECTION_STRING;

const setup = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Configure the bot')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('The name of the channel to post the question in')
			.setRequired(true))
        .addStringOption(option => option
            .setName('timezone')
            .setDescription('The timezone for when the question should be posted')
            .setRequired(true))
        .addStringOption(option => option
            .setName('time')
            .setDescription('The time for when the question should be posted')
            .setRequired(true))
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The allowed role to configure the bot (You need to have this role to use this command)')
            .setRequired(true)),
	async execute(interaction: any) {
		//#TODO: set correct type for parameter interaction
        const role = interaction.options.getRole("role");
		const hasRole = interaction.member.roles.cache.some((r: any) => r.name === role.name );

		if (!hasRole) return interaction.reply('You do not have permission to use this command!');
		if(!uri) return interaction.reply('Something went wrong! Please contact the developer');
		
		const db = new mongodbOperations(uri, 'servers');

		try {
			await db.connect();

            const channel = interaction.options.getChannel('channel');
            const timezone = interaction.options.getString('timezone');
            const time = interaction.options.getString('time');

			const result = await db.insert({
				guildId: interaction.guildId,
				channelId: channel.id,
                channelName: channel.name,
                timezone: timezone,
                time: time,
                role: role.name
			});
			console.log(`A document was inserted with the _id: ${result}`);
		  } finally {
			// Ensures that the client will close when you finish/error
			await db.close();
		  }

          await interaction.reply('Inserted');
	},
};

export default setup;