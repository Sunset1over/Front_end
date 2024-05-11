import {MonthlyLoginCountResponse} from "./MonthlyLoginCountResponse.model";

export interface LoginStatisticResponseModel{
  dateFrom: string
  dateTo: string
  monthlyLoginCount: MonthlyLoginCountResponse[]
  totalLogins: number
  totalRegistrations: number
}
