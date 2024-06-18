import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Review} from "../../social/model/review";
import {Job} from "../model/job";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService<Job>{

  endPoint = '/health-expertise/jobs';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  getByPhysiotherapistId(physiotherapistId: number): Observable<Job> {
    const getJobsByPhysiotherapistIdUrl = `${this.basePath}/byPhysiotherapistId/${physiotherapistId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Job>(getJobsByPhysiotherapistIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError));
  }
}
