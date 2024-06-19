import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BaseService} from "../../shared/services/base.service";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Payment} from "../model/payment";

@Injectable({
  providedIn: 'root'
})
export class PaymentService{

  stripeUrl='http://127.0.0.1:58447/api/v1/payments'


  // Common options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(protected http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    // @ts-ignore
    if (error.error instanceof ErrorEvent) {
      // Default error handling
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return Observable with Error Message to Client
    return throwError(() => new Error('Something happened with request, please try again later'));
  }

  confirm(id: string): Observable<string>{
    return this.http.post<string>(`${this.stripeUrl}/confirm/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  cancel(id: string): Observable<string>{
    return this.http.post<string>(`${this.stripeUrl}/cancel/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  payment(paymentIntentDto: Payment): Observable<string> {
    return this.http.post<string>(`${this.stripeUrl}/paymentIntent`, paymentIntentDto , this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
