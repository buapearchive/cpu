import { Env } from "./index"

const panelUrl = "https://panel.buape.com"

const pfetch = async (path: string, options: RequestInit, env: Env) => {
    return await fetch(`${panelUrl}/api${path}`, {
        ...options,
        headers: {
            "Cf-Access-Client-Id": env.CF_ACCESS_ID,
            "Cf-Access-Client-Secret": env.CF_ACCESS_SECRET,
            "X-API-Key": env.PORTAINER_KEY,
        },
    })
}

export const getStacks = async (env: Env) => {
    const res = await pfetch(`/stacks`, {}, env)
    return await res.json()
}
