import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {MedicalHistory} from "../model/medical-history/medical-history";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {CreateMedicalHistory} from "../model/medical-history/CreateMedicalHistory";

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService extends BaseService<MedicalHistory> {

  endPoint = '/health-expertise/medical-histories';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  createMedicalHistory(medicalHistory: CreateMedicalHistory): Observable<CreateMedicalHistory>{
    const createMedicalHistoryUrl = `${this.basePath}`;
    const jwtToken = localStorage.getItem('jwtToken');


    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });


    return this.http.post<CreateMedicalHistory>(createMedicalHistoryUrl,medicalHistory, {headers} )

  }

  getByPatientId(patientId: number): Observable<MedicalHistory> {
    const getMedicalHistoryByPatientIdUrl = `${this.basePath}/byPatientId/${patientId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<MedicalHistory>(getMedicalHistoryByPatientIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError));
  }
}
