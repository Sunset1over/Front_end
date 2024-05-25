import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import * as braintree from 'braintree-web';
import { CreditCardModel } from "../models/CreditCard.model";
import { Router } from "@angular/router";
import { PayPalService } from "../services/paypal.service";
import { PaymentRequestModel } from "../models/PaymentRequest.model";
import { environment } from "../../../environments/environment.prod";
import { HeaderComponent } from "../../../shared/components/header/header/header.component";
import { ProductResponse } from "../models/ProductResponse";
import { NgForOf } from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  PaymentForm!: FormGroup;
  ProductSubscription!: ProductResponse[];
  private unsubscribe$ = new Subject<void>();

  constructor(private paymentService: PayPalService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.PaymentForm = new FormGroup({
      "cardNumber": new FormControl("", [Validators.required, Validators.pattern(/^\d{16}$/)]),
      "CVV": new FormControl("", [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
      "date": new FormControl("", Validators.required),
      "productName": new FormControl("", Validators.required),
    });
    this.GetAllProducts();
  }

  submit = (PaymentFormValue: any) => {
    const payment = { ...PaymentFormValue };

    const formattedDate = this.formatExpirationDate(payment.date);

    const paymentObject: CreditCardModel = {
      cardNumber: payment.cardNumber,
      CVV: payment.CVV,
      Date: formattedDate
    };

    this.initializeBraintree(paymentObject, payment.productName);
  }

  initializeBraintree(CreditCardData: CreditCardModel, productId: string) {
    const CLIENT_AUTHORIZATION = environment.CLIENT_AUTHORIZATION;
    braintree.client.create({
      authorization: CLIENT_AUTHORIZATION
    }, (clientErr, clientInstance) => {
      if (clientErr) {
        console.error(clientErr);
        return;
      }

      const cardData = {
        number: CreditCardData.cardNumber,
        expirationDate: CreditCardData.Date,
        cvv: CreditCardData.CVV,
        billingAddress: {
          postalCode: '12345'
        }
      };

      clientInstance.request({
        endpoint: 'payment_methods/credit_cards',
        method: 'post',
        data: {
          creditCard: cardData
        }
      }, (tokenizeErr: any, response: { creditCards: { nonce: any; }[]; }) => {
        if (tokenizeErr) {
          this.toastr.error(tokenizeErr);
          return;
        }

        const paymentRequest: PaymentRequestModel = {
          paymentMethodNonce: response.creditCards[0].nonce,
          ProductId: productId
        };

        this.paymentService.Create(paymentRequest)
          .pipe(
            takeUntil(this.unsubscribe$),
            tap((paymentResponse) => {
              if(!paymentResponse.empty) {
                this.toastr.success("Payment successful.")
                this.router.navigate(["/profile"]).then(
                  () => {},
                  () => {}
                )
              }
            }),
            catchError((err) => {
              if(err.status == 400) this.toastr.error("Check the data is correct")
              if(err.status == 423) this.toastr.info("Subscription already exists");
              return of(undefined)
            })
          ).subscribe();
      });
    });
  }

  GetAllProducts() {
    this.paymentService.GetProduct()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((productResponse: ProductResponse[]) => {
          this.ProductSubscription = productResponse;
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }

  cancel(): void {
    this.router.navigate(["/profile"]).then(
      () => {},
      () => {}
    );
  }

  formatExpirationDate(date: string): string {
    if (!date) return '';

    const [year, month] = date.split('-');
    return `${month}/${year.slice(2)}`;
  }
}
