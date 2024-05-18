import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import * as braintree from 'braintree-web';
import {InputComponent} from "../../../shared/components/input/input/input.component";
import {MainButtonComponent} from "../../../shared/components/main-button/main-button/main-button.component";
import {IInput} from "../../../shared/components/input/models/input.interface";
import {faEye, faKey, faUser} from "@fortawesome/free-solid-svg-icons";
import {MainButtonInterface} from "../../../shared/components/main-button/models/main-button.interface";
import {CreditCardModel} from "../models/CreditCard.model";
import {Router} from "@angular/router";
import {PayPalService} from "../services/paypal.service";
import {PaymentRequestModel} from "../models/PaymentRequest.model";
import {environment} from "../../../environments/environment.prod";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {ProductResponse} from "../models/ProductResponse";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    MainButtonComponent,
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss'
})
export class PaypalComponent implements OnInit{
  PaymentForm!: FormGroup;
  ProductSubscription!: ProductResponse[];

  public cardNumberConfig: IInput = {
    type: 'default',
    placeholder: 'card number',
    isDisabled: false,
    error:"Error",
    icon: faUser
  }
  public CVVConfig: IInput = {
    type: 'default',
    placeholder: 'CVV',
    isDisabled: false,
    error: "Error",
    icon: faEye,
    isChangingType: true
  }
  public dateConfig: IInput = {
    type: 'default',
    placeholder: 'date',
    isDisabled: false,
    error: "Error",
    icon: faEye,
    isChangingType: true
  }
  public PaymentButton: MainButtonInterface = {
    classes: "yellow",
    icon: faKey,
    size: "default",
    text: "Pay"
  }

  constructor(private paymentService: PayPalService, private router: Router) {}

  ngOnInit(): void {
    this.PaymentForm = new FormGroup({
      "cardNumber": new FormControl("", Validators.required),
      "CVV": new FormControl("", Validators.required),
      "date": new FormControl("", Validators.required),
      "productName": new FormControl("", Validators.required),
    })
    this.GetAllProducts()
  }

  submit = (PaymentFormValue:any) => {
    const payment = {...PaymentFormValue}

    const paymentObject: CreditCardModel = {
      cardNumber: payment.cardNumber,
      CVV: payment.CVV,
      Date: payment.date
    }
  console.log(payment)
    this.initializeBraintree(paymentObject, payment.productName)
  }

  initializeBraintree(CreditCardData: CreditCardModel, productId: string) {
    const CLIENT_AUTHORIZATION = environment.CLIENT_AUTHORIZATION
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
          console.error(tokenizeErr);
          return;
        }

        console.log(productId)

        const paymentRequest: PaymentRequestModel = {
          paymentMethodNonce: response.creditCards[0].nonce,
          ProductId: productId
        }

        console.log(response.creditCards[0].nonce);

        this.paymentService.Create(paymentRequest).subscribe({
          next:(paymentResponse) => {
            if(!paymentResponse.empty){

            }
          }
        })
      });
    });
  }

  GetAllProducts(){
    this.paymentService.GetProduct().subscribe({
      next:(productResponse: ProductResponse[]) => {
        console.log(productResponse)
        this.ProductSubscription = productResponse
        console.log(this.ProductSubscription)
      }
    })
  }
}
