import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  // Resource Endpoint

  protected basepath='http://localhost:8080/api/v1'


  // Common options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(protected http: HttpClient) {
  }

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

  // Create Resource
  create(item: any): Observable<T> {
    return this.http.post<T>(
      `${this.basePath}`,
      JSON.stringify(item),
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  // Get Resource by id
  getById(id: any): Observable<T> {
    return this.http.get<T>(
      `${this.basePath}/${id}`,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  getConsultationByPhysiotherapistId(id: number): Observable<T>{
    return this.http.get<T>(
      `${this.basePath}/consultationByPhysiotherapistId/${id}`,
      this.httpOptions)
      .pipe(
      retry(2),
      catchError(this.handleError));
  }

  getReviewsByPhysiotherapistId(id: number): Observable<T>{
    return this.http.get<T>(
      `${this.basePath}/byPhysiotherapistId/${id}`,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  // Get All Resources
  getAll(): Observable<T> {
    return this.http.get<T>(`${this.basePath}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Delete Resource
  delete(route: any, id: any) {
    return this.http.delete(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Update Resource
  update( id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.basePath}/${id}`,
      JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAll1(): Observable<any> {
    return this.http.get(`${this.basePath}`,this.httpOptions).pipe(retry(2), catchError(this.handleError));
  }

  getItemByField(field: any, value: any): Observable<T>{
    return this.http.get<T>(
      `${this.basePath}/${field}=${value}`,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  protected basePath='https://api-iotheraphy-production-97a8.up.railway.app/api/v1'

  getItemByExternalId(field: any, value: any, external: any): Observable<T>{
    return this.http.get<T>(
      `https://springboot-app-theraphy-heroku.herokuapp.com/api/v1/${external}/${value}/${field}`,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

}
