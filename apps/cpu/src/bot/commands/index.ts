import Ping from "./ping"
import Pull from "./pull"
import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10"

const commands = [new Ping(), new Pull()]

const getCommand = (name: string, data: APIApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction) => {
    const command = commands.find((command) => command.name === name)
    if (command) {
        return command
    } else {
        console.error(`Command "${name}" not found`)
        return null
    }
}

const getRawCommands = () => {
    const rawCommands = commands.map((command): RESTPostAPIApplicationCommandsJSONBody => {
        return {
            name: command.name,
            description: command.description,
            options: command.options,
        }
    })
    return rawCommands
}

export { commands, getCommand, getRawCommands }
