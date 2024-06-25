import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {CreateReview} from "../model/createReview";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CreatePhysiotherapist} from "../../security/model/CreateUsers/createPhysiotherapist";
import {catchError, Observable, retry} from "rxjs";
import {Review} from "../model/review";

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends BaseService<Review>{

  endPoint = '/social/reviews';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  createReview(review: CreateReview): Observable<CreateReview> {
    const createReviewUrl = `${this.basePath}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.post<CreateReview>(createReviewUrl, review, { headers });
  }

  getByPhysiotherapistId(physiotherapistId: number): Observable<Review> {
    const getReviewsByPhysiotherapistIdUrl = `${this.basePath}/byPhysiotherapistId/${physiotherapistId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Review>(getReviewsByPhysiotherapistIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError));
  }
}
