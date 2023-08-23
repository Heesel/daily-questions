export interface Question {
    _id?: string;
    guildId: string;
    question: string;
    alreadyAsked: boolean;
}