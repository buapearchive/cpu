/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const res = (await pfetch(`/stacks`, {}, env)) as any
    return await res.json()
}

export const startStack = async (stackName: string, env: Env) => {
    const stacks = await getStacks(env)
    const stack = stacks.find((s: any) => s.Name === stackName)
    if (!stack) {
        throw new Error("Stack not found")
    }
    const res = await pfetch(`/stacks/${stack.Id}/start?endpointId=${stack.EndpointId}`, { method: "POST" }, env)
    return res
}

export const stopStack = async (stackName: string, env: Env) => {
    const stacks = await getStacks(env)
    const stack = stacks.find((s: any) => s.Name === stackName)
    if (!stack) {
        throw new Error("Stack not found")
    }
    const res = await pfetch(`/stacks/${stack.Id}/stop?endpointId=${stack.EndpointId}`, { method: "POST" }, env)
    return res
}

export const updateStack = async (stackName: string, env: Env) => {
    const stacks = await getStacks(env)
    const stack = stacks.find((s: any) => s.Name === stackName)
    if (!stack) {
        throw new Error("Stack not found")
    }
    const res = await pfetch(
        `/stacks/${stack.Id}/git/redeploy?endpointId=${stack.EndpointId}`,
        {
            method: "PUT",
            body: JSON.stringify({
                repositoryAuthentication: true,
                repositoryGitCredentialID: stack.GitConfig.Authentication.GitCredentialID,
                env: stack.Env,
                prune: true,
                pullImage: true,
            }),
        },
        env
    )
    return res
}
