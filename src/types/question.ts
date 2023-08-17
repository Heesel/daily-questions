export interface Question {
    _id?: string;
    guildId: string;
    channelId: string;
    question: string;
    alreadyAsked: boolean;
}