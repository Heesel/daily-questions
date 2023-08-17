import fs from "fs";
import "dotenv/config";
import { Client, Collection } from "discord.js";


export const commandHandler = {
    async load(client: any) {
        console.log("Command handler running");
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

        const commandsArr = await Promise.all(commandFiles.map(async command => (await import(`../commands/${command}`)).default));

        client.commands = commandsArr.reduce((res, command) => {
            res.set(command.data.name, command);
            return res;
        }, new Collection());

        return client.commands;

    },

    async register(client: any, clientId: string|undefined, token: string|undefined, REST: any, Routes:any) {
        const restApi = new REST({ version: '10' });
        restApi.setToken(token);
        (async () => {
        	try {
            	const commands = client.commands.map((command: any) => command.data.toJSON());
            
        		console.log(`Started refreshing ${commands.length} application (/) commands.`);

        		// The put method is used to fully refresh all commands in the guild with the current set
        		const data = await restApi.put(
        			Routes.applicationCommands(clientId),
        			{ body: commands },
        		);

        		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        	} catch (error) {
        		// And of course, make sure you catch and log any errors!
        		console.error(error);
        	}
        })();
    }
}

