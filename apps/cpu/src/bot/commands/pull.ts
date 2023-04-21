/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    APIApplicationCommandInteractionDataStringOption,
    APIApplicationCommandOption,
    APIApplicationCommandStringOption,
    APIChatInputApplicationCommandInteraction,
    APIInteractionResponse,
    InteractionResponseType,
} from "discord-api-types/v10"
import { ExtraData } from "../bot"
import Command from "./_BaseCommand"
import { startStack, stopStack, updateStack } from "../../portainer"

export default class Cmd extends Command {
    name = "stack"
    description = "Manage a stack"
    options: APIApplicationCommandOption[] = [
        {
            name: "stack",
            description: "The stack to manage",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Kiai",
                    value: "kiai",
                },
            ],
        },
        {
            name: "action",
            description: "The action to perform",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Pull",
                    value: "pull",
                },
                {
                    name: "Start",
                    value: "start",
                },
                {
                    name: "Stop",
                    value: "stop",
                },
            ],
        },
    ]

    async run(interaction: APIChatInputApplicationCommandInteraction, data: ExtraData): Promise<APIInteractionResponse | undefined> {
        const stack = interaction.data.options![0] as APIApplicationCommandInteractionDataStringOption
        const action = interaction.data.options![1] as APIApplicationCommandInteractionDataStringOption

        let done: Response | undefined

        switch (action.value) {
            case "pull":
                done = await updateStack(stack.value, data.env)
                break
            case "start":
                done = await startStack(stack.value, data.env)
                break
            case "stop":
                done = await stopStack(stack.value, data.env)
                break
            default:
                done = undefined
        }

        console.log(stack, action, done)

        if (!done) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Invalid action",
                },
            }
        }

        switch (done.status) {
            case 200:
                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: "Done",
                    },
                }
            default:
                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `${done.status}: ${JSON.stringify(await done.json())}`,
                    },
                }
        }
    }
}
