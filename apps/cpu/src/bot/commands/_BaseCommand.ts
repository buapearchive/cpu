import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandAutocompleteResponse, APIApplicationCommandInteraction, APIApplicationCommandOption, APIInteractionResponse } from "discord-api-types/v10"
import { ExtraData } from "../bot"

export default class Command {
    name = "cmd"
    description = "No description"
    options: APIApplicationCommandOption[] = []

    async run(interaction: APIApplicationCommandInteraction, data: ExtraData): Promise<APIInteractionResponse | undefined> {
        throw new Error("Not implemented")
    }

    async autocomplete(interaction: APIApplicationCommandAutocompleteInteraction, data: ExtraData): Promise<APIApplicationCommandAutocompleteResponse | undefined> {
        throw new Error("Not implemented")
    }
}
