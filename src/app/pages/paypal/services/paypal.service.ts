import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {Observable} from "rxjs";
import {PaymentRequestModel} from "../models/PaymentRequest.model";
import {ProductResponse} from "../models/ProductResponse";

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient) {}

  Create(request: PaymentRequestModel): Observable<any> {
    return this.http.post(`${this.api}/api/Payment/Create`, request)
  }

  GetProduct(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.api}/api/Payment/GetAllProducts`);
  }
}
