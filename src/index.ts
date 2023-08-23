import { Client, GatewayIntentBits, Events, REST, Routes } from "discord.js"
//@ts-ignore
import 'dotenv/config'
import { commandHandler } from "./handler/commandHandler"
import { commandListener } from "./listeners/commandListener";


const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;


const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds]
});


client.on('ready', async () => {
    if (!client.user || !client.application || !token) {
        return;
    }
    await commandHandler.load(client);
    await commandHandler.register(client, clientId, token, REST, Routes);
    await commandListener.run(client, Events);
    
    //@ts-ignore
    console.log(`Logged in as ${client.user.tag}!`);
});



client.login(token);