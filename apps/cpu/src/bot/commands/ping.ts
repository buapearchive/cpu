import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10"
import { ExtraData } from "../bot"
import Command from "./_BaseCommand"

export default class Cmd extends Command {
    name = "ping"
    description = "Ping the bot"

    async run(interaction: APIChatInputApplicationCommandInteraction, data: ExtraData): Promise<APIInteractionResponse | undefined> {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Pong!",
            },
        }
    }
}
