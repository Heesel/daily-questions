//@ts-ignore
import mongodbOperations from '../utils/mongodbOperations';
import { Client } from "discord.js"

export const questionHandler = async (guildId: string, client: Client) => {
    const dbServers = new mongodbOperations('servers');
    const dbQuestions = new mongodbOperations('questions');
    try {
        await dbServers.connect();
        const server = await dbServers.getOne({guildId: guildId});
        if (server) {
            console.log(`Scheduling job for server: ${server._id}`);
            //#TODO: Schedule job for each server
           
            await dbQuestions.connect();
            
        } else {
            console.log('No server found');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await dbServers.close();
    }
}