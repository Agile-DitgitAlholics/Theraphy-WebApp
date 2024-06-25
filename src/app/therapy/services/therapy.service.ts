import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {MedicalHistory} from "../../health-record-expertise/model/medical-history/medical-history";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Therapy} from "../model/therapy";
import {catchError, Observable, retry} from "rxjs";
import {Treatment} from "../model/treatment";

@Injectable({
  providedIn: 'root'
})
export class TherapyService extends BaseService<Therapy> {

  endPoint = '/therapy/therapies';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }
  getActiveTherapyByPatientId(): Observable<Therapy>{

      const jwtToken = localStorage.getItem('jwtToken');


      if (!jwtToken) {
          throw new Error('Token JWT no encontrado en el localStorage.');
      }
      const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
      });

      //return this.http.post<createConsultation>(createConsultationUrl,consultation, {headers} )

      return this.http.get<Therapy>(
      `${this.basePath}/activeTherapyByPatientId`,
          {headers})
      .pipe(
        retry(2),
        catchError(this.handleError),  );
  }


}
