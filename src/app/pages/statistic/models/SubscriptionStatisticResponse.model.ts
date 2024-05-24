import {MonthlySubscriptionCount} from "./MonthlySubscriptionCount.model";

export interface SubscriptionStatisticResponseModel {
  dateFrom: string;
  dateTo: string;
  monthlyCounts: MonthlySubscriptionCount[]
  totalSubscriptions: number
  totalAmount: number
}
