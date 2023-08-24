import 'dotenv/config'

import { SlashCommandBuilder } from 'discord.js'
import mongodbOperations from '../utils/mongodbOperations';
import { questionHandler } from '../handler/questionHandler';
import { Server } from '../types/server';
// @ts-ignore
import * as moment from 'moment-timezone';

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
            .setDescription('The time for when the question should be posted (between 0 and 24. example: 15)')
            .setRequired(true))
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The allowed role to configure the bot (You need to have this role to use this command)')
            .setRequired(true)),

	async execute(interaction: any) {
		//#TODO: set correct type for parameter interaction
        const role = interaction.options.getRole("role");
		const channel = interaction.options.getChannel('channel');
        const timezone = interaction.options.getString('timezone');
        const time = interaction.options.getString('time');

		//#TODO: set correct type for parameter role
		const hasRole = interaction.member.roles.cache.some((r: any) => r.name === role.name );

		if (!hasRole) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
		if(!moment.tz.zone(timezone)) return interaction.reply({ content: 'Error: invalid timezone', ephemeral: true });
		
		const db = new mongodbOperations('servers');
		let message: string = 'Setup completion was successful :white_check_mark:';

		try {
			await db.connect();
			const serverObj: Server = {
				guildId: interaction.guildId,
				channelId: channel.id,
                channelName: channel.name,
                timezone: timezone,
                time: time,
                role: role.name
			}
			const server = await db.getOne({guildId: interaction.guildId})
			if (server) {
				const result = await db.update({guildId: interaction.guildId}, serverObj);
				if(result.modifiedCount === 0) {
					message = 'Setup completion was unsuccessful :neutral_face:';
				} else {
					//#FIXME: Cancel current job for the specific server
					
					await questionHandler(interaction.guildId, interaction.client);
					message = 'Setup succesfully updated :white_check_mark:';
				}
				console.log(`A document was updated with the _id: ${result}`);
				
			} else {
				const result = await db.insert(serverObj);
				console.log(JSON.stringify(result, null, 2));
				if (result) {
					await questionHandler(interaction.guildId, interaction.client);
				} else {
					message = 'Setup completion was unsuccessful :neutral_face:';
				}
				console.log(`A document was inserted with the _id: ${result}`);
			}
			
		  } finally {
			// Ensures that the client will close when you finish/error
			await db.close();
		  }

          await interaction.reply({content: message, ephemeral: true});
	},
};

export default setup;