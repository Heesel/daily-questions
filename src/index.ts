import { Client, GatewayIntentBits, Events, REST, Routes } from "discord.js"
//@ts-ignore
import config from "../config.json"
import { commandHandler } from "./handler/command"

const token = config.token

const client = new Client({ 
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions]
});

client.on('ready', async() => {
    if (!client.user || !client.application) {
        return;
    }
    await commandHandler.load(client);
    //@ts-ignore
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
client.login(token);