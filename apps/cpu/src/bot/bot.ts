import { Router } from "itty-router"
import { InteractionType, APIInteraction, InteractionResponseType, MessageFlags, ComponentType, ButtonStyle } from "discord-api-types/v10"
import { getCommand } from "./commands"
import { Env, JsonResponse } from ".."
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10"

const router = Router({ base: "/interaction" })

const cpuRole = "1098464619338682420"

export type ExtraData = {
	env: Env
}

router.post("/", async (request, data: { env: Env }) => {
    const reqData = (await request.json()) as APIInteraction

    // Ping
    if (reqData.type === InteractionType.Ping) {
        return new JsonResponse({ type: InteractionResponseType.Pong })
    }

    if (!reqData.member) {
        try {
            return new JsonResponse({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "You must be in a server to use this command.",
                },
            })
        } catch (e) {
            console.error(e)
        }
        return
    }

    if (!reqData.member.roles.includes("1098464619338682420")) {
        try {
            return new JsonResponse({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "You do not have access to use this command.",
                },
            })
        } catch (e) {
            console.error(e)
        }
        return
    }

    // Application Command
    if (reqData.type === InteractionType.ApplicationCommand) {
        if (isChatInputApplicationCommandInteraction(reqData)) {
            const name = reqData.data.name
            const cmd = getCommand(name, reqData)
            if (!cmd) {
                return new Response("Not found", { status: 404 })
            }

            const result = await cmd.run(reqData, { env: data.env })
            if (result) {
                return new JsonResponse(result)
            }
        }
    }

    // Autocomplete
    if (reqData.type === InteractionType.ApplicationCommandAutocomplete) {
        const name = reqData.data.name
        const cmd = getCommand(name, reqData)
        if (!cmd) {
            return new Response("Not found", { status: 404 })
        }

        const result = await cmd.autocomplete(reqData, { env: data.env })
        if (result) {
            return new JsonResponse(result)
        }
    }

    return new Response("Not found", { status: 404 })
})

router.all("*", () => new Response("Not found", { status: 404 }))

export { router as InteractionRouter }
