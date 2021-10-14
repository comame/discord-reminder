export type interactionHandler = (
    body: any,
) => any

export type asyncInteractionHandler = (
    body: any
) => Promise<any>
