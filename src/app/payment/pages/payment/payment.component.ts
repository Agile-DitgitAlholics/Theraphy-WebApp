import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StripeCardComponent, StripeService} from "ngx-stripe";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentService} from "../../services/payment.service";
import {Router} from "@angular/router";
import {Payment} from "../../model/payment";
import { StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {ConsultationService} from "../../../consultations/services/consultation.service";
import {CreateConsultation} from "../../../consultations/model/createConsultation";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() topic!: string;
  @Input() date!: string;
  @Input() hour!: string;
  @Input() price!: number;
  isLoading: boolean = false;


  error: any;

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };


  stripeForm!: FormGroup;
  consultation!: CreateConsultation;
  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private router: Router,
    private fb: FormBuilder,
    private consultationService: ConsultationService,
    private _snackBar: MatSnackBar
  ) {

  }


  ngOnInit() {
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    const storedData =  localStorage.getItem('consultationData');
    if (storedData) {
      this.consultation = JSON.parse(storedData);
    }
  }




  createToken(): void {
    const name = this.stripeForm.get('name')!.value;
    console.log("name" + name);
    this.createConsultation();
    this._snackBar.open('Payment successfully', '',{
      duration:6000,
      horizontalPosition:'center',
      verticalPosition:'bottom',
    })
    this.router.navigate(['/my-consultations-list']);
   /* this.stripeService
      .createToken(this.card.element, {name})
      .subscribe((result) => {
        if (result.token) {
          const paymentIntentDto: Payment = {
             token: result.token.id,
            amount: this.price,
            currency: 'PEN'
          };
            this.paymentService.payment(paymentIntentDto).subscribe((response: any) =>  {
              console.log("Payment successfully" + response);
              this.createConsultation();
              this._snackBar.open('Payment successfully', '',{
                duration:6000,
                horizontalPosition:'center',
                verticalPosition:'bottom',
              })
              this.router.navigate(['/physiotherapist-list']);
            });
            this.error = undefined;
        } else if (result.error) {
          this.error = result.error.message;
        }
      });*/
  }
  createConsultation(){
    this.consultationService.createConsultation(this.consultation).subscribe((response:any) => {
      console.log("Consultation created")
    })

  }

}
