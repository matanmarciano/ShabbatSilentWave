import moment from "moment";
import {Moment} from "moment/moment";

export type NewsItem = {
    title?: string,
    description?: string,
    pubDate?: moment.Moment,
}

export interface RedAlertResponse {
    notificationId: string,
    time: number
    threat: number
    isDrill: boolean
    cities: string[]
}
export interface RedAlertRepresentation extends RedAlertResponse{
    exp: Moment
}