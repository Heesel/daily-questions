import fs from "fs";
import { Client, Collection } from "discord.js";


export const commandHandler = {
    async load(client: Client) {
        console.log("Command handler running");
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

        const commandsArr = await Promise.all(commandFiles.map(async command => (await import(`../commands/${command}`)).default));

        client.commands = commandsArr.reduce((res, command) => {
            res.set(command.data.name, command);
            return res;
        }, new Collection());

        return client.commands;

    }
}