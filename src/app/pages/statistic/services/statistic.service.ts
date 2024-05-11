import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {StatisticRequestModel} from "../models/statisticRequest.model";
import {LoginStatisticResponseModel} from "../models/LoginStatisticResponse.model";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class StatisticService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient, private cookieService: CookieService){}

  GetLoginStatistic(request: StatisticRequestModel): Observable<LoginStatisticResponseModel>{
    return this.http.get<LoginStatisticResponseModel>(`${this.api}/api/Statistic/GetLoginInfo?DateFrom=${request.DateFrom}&DateTo=${request.DateTo}`)
  }
}
