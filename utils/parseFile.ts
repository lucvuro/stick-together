export const parseFileFromBase64 = async(base64String: string, userId: string, type: string) => {
    const response = await fetch(base64String)
    const blob = await response.blob()
    const file = new File([blob], userId, {type: type})
    return file
}