import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Job} from "../model/job";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {Certification} from "../model/certification";

@Injectable({
  providedIn: 'root'
})
export class CertificationService extends BaseService<Certification>{

  endPoint = '/health-expertise/certifications';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  getByPhysiotherapistId(physiotherapistId: number): Observable<Certification> {
    const getCertificationsByPhysiotherapistIdUrl = `${this.basePath}/byPhysiotherapistId/${physiotherapistId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Certification>(getCertificationsByPhysiotherapistIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError));
  }
}
