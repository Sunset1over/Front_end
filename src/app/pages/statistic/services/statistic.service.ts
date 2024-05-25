import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {StatisticRequestModel} from "../models/statisticRequest.model";
import {LoginStatisticResponseModel} from "../models/LoginStatisticResponse.model";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {SubscriptionStatisticResponseModel} from "../models/SubscriptionStatisticResponse.model";
import {RecommendationStatisticResponseModel} from "../models/RecommendationStatisticResponse.model";

@Injectable({
  providedIn: 'root'
})

export class StatisticService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient){}

  GetLoginStatistic(request: StatisticRequestModel): Observable<LoginStatisticResponseModel>{
    return this.http.get<LoginStatisticResponseModel>(`${this.api}/api/Statistic/GetLoginInfo?DateFrom=${request.DateFrom}&DateTo=${request.DateTo}`)
  }

  GetUserInfoStatistic(request: StatisticRequestModel): Observable<SubscriptionStatisticResponseModel>{
    return this.http.get<SubscriptionStatisticResponseModel>(`${this.api}/api/Statistic/GetUserInfo?DateFrom=${request.DateFrom}&DateTo=${request.DateTo}`)
  }

  GetRecommendationInfo(request: StatisticRequestModel): Observable<RecommendationStatisticResponseModel>{
    return this.http.get<RecommendationStatisticResponseModel>(`${this.api}/api/Statistic/GetRecommendationInfo?DateFrom=${request.DateFrom}&DateTo=${request.DateTo}`)
  }
}
