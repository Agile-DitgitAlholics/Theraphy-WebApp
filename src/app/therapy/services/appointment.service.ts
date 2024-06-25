import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Therapy} from "../model/therapy";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {Treatment} from "../model/treatment";
import {Appointment} from "../model/appointment";
import {Diagnosis} from "../../home/model/diagnosis";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService extends BaseService<Appointment> {

  endPoint = '/therapy/appointments';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }
  getAppointmentByDateAndTherapyId(therapyId: number, date: string): Observable<Appointment>{

    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    //return this.http.post<createConsultation>(createConsultationUrl,consultation, {headers} )

    return this.http.get<Appointment>(
        `${this.basePath}/byDate/${date}/TherapyId/${therapyId}`,
        {headers})
        .pipe(
            retry(2),
            catchError(this.handleError),  );
  }

  getUpcomingAppointments(patientId: number): Observable<Appointment>{
    const getLastsAppointmentsByPatientIdUrl = `${this.basePath}/appointment/therapy-patient/${patientId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.http.get<Appointment>(getLastsAppointmentsByPatientIdUrl, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

}
