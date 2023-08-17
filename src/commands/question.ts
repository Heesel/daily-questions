import 'dotenv/config'

import { SlashCommandBuilder } from 'discord.js'
import { mongodbOperations } from '../utils/mongodbOperations';
import { Question } from '../types/question';

const uri = process.env.CONNECTION_STRING;

const question = {
	data: new SlashCommandBuilder()
		.setName('question')
		.setDescription('Configure questions')
		.addStringOption(option => option
			.setName('question')
			.setDescription('The question to ask')
			.setRequired(true)),	
	async execute(interaction: any) {
		//#TODO: set correct type for parameter interaction
		const hasRole = interaction.member.roles.cache.some((r: any) => r.name === "Giga chad");

		if (!hasRole) return interaction.reply('You do not have permission to use this command!');
		if(!uri) return interaction.reply('Something went wrong! Please contact the developer');
		
		const db = new mongodbOperations(uri, 'questions');
		try {
			const question = interaction.options.getString('question');
			await db.connect();
			const result = await db.insert({
				guildId: interaction.guildId,
				question: question,
				alreadyAsked: false,
			});

			console.log(`A document was inserted with the _id: ${result.insertedId}`);
		  } finally {
			// Ensures that the client will close when you finish/error
			await db.close();
		  }

		await interaction.reply('Inserted');
	},
};

export default question;