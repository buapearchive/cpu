import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10"
import { ExtraData } from "../bot"
import Command from "./_BaseCommand"
import { getStacks } from "../../portainer"

export default class Cmd extends Command {
    name = "pull"
    description = "Pull the latest Kiai code and deploy it"

    async run(interaction: APIChatInputApplicationCommandInteraction, data: ExtraData): Promise<APIInteractionResponse | undefined> {
        const stacks = await getStacks(data.env)
        
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: JSON.stringify(stacks),
            },
        }
    }
}
