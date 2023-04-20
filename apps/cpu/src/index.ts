export interface Env {
	CLIENT_ID: string
	TOKEN: string
	PUBLIC_KEY: string
	PORTAINER_KEY: string
    CF_ACCESS_ID: string
    CF_ACCESS_SECRET: string
}

export const randomString = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
    )
}
export class JsonResponse extends Response {
    constructor(body?: unknown, init?: ResponseInit) {
        const jsonBody = JSON.stringify(body)
        init = init || {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        }
        super(jsonBody, init)
    }
}

import { isValidRequest, PlatformAlgorithm } from "discord-verify"
import { Router } from "itty-router"
import { InteractionRouter } from "./bot/bot"
import { deployCommands } from "./deploy"

const router = Router()

router.get("/", (request, {}) => {
    return Response.redirect("https://buape.com", 301)
})

router.get("/deploy/urmom", async (req, { env }) => {
    const deployed = await deployCommands({ token: env.TOKEN, id: env.CLIENT_ID })
    if (!deployed.ok) {
        const msg = (await deployed.json()) as { message: string }
        return new Response("Failed to deploy commands: " + msg.message, { status: 500 })
    }
    return new Response("Deployed commands")
})

router.all("/interaction", (req, { env }) => InteractionRouter.handle(req, { env }))

router.all("*", () => new Response("Not found", { status: 404 }))

export default {
    async fetch(request: Request, env: Env, context: ExecutionContext) {
        if (request.method === "POST" && request.url.includes("/interaction")) {
            const isValid = await isValidRequest(request, env.PUBLIC_KEY, PlatformAlgorithm.Cloudflare)
            if (!isValid) {
                return new Response("Invalid request signature", { status: 401 })
            }
        }
        return router.handle(request, { env })
    },
}
