import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Diagnosis} from "../model/diagnosis";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {Consultation} from "../../consultations/model/Consultation";

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService extends BaseService<Diagnosis>{
  endPoint = '/health-expertise/diagnoses';
  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  getByPatientId(patientId: number): Observable<Diagnosis> {
    const getLastDiagnosisByPatientIdUrl = `${this.basePath}/byPatientId/${patientId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Consultation>(getLastDiagnosisByPatientIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  getLastDiagnosis(): Observable<Diagnosis>{

    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Diagnosis>(this.basePath, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

}
