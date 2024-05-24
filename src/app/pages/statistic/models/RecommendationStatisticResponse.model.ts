import {MonthlyRecommendationsCount} from "./MonthlyRecommendationsCount.model";

export interface RecommendationStatisticResponseModel {
  dateFrom: string
  dateTo: string
  monthlyCounts: MonthlyRecommendationsCount[]
  totalRecommendations: number
}
