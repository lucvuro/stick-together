import moment from "moment"

export const converUTCStringToDateTime = (UTCstring: string, formatTime: string) => {
    return moment(UTCstring).format(formatTime)
}