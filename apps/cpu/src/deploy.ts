import { getRawCommands } from "./bot/commands"

const commands = getRawCommands()

const deployCommands = async (data: { token: string; id: string }) => {
    const url = `https://discord.com/api/v10/applications/${data.id}/commands`

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${data.token}`,
        },
        method: "PUT",
        body: JSON.stringify(commands),
    })
    if (!response.ok) {
        console.error(commands)
    }
    return response
}

export { deployCommands }
