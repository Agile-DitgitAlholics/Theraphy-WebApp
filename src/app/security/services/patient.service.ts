import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {CreatePatient} from "../model/CreateUsers/createPatient";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry} from "rxjs";
import {User} from "../model/CreateUsers/user";
import {Patient} from "../model/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService extends BaseService<Patient>{
  endPoint = '/profile/patients';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  createPatient(patient: CreatePatient): Observable<CreatePatient> {
    const createPatientUrl = `${this.basePath}/registration-patient`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.post<CreatePatient>(createPatientUrl, patient, { headers });
  }


  getPatientLogged(){
    const getPatientLoggedUrl = `${this.basePath}/PatientLogget`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.get<Patient>(getPatientLoggedUrl, { headers }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateProfilePhoto(patientId: number, photoUrl: string) {
    const updateProfilePhotoUrl = `${this.basePath}/${patientId}`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    // Llama a la función PATCH para actualizar la foto de perfil con la URL de la imagen subida
    this.http.patch(updateProfilePhotoUrl, { photoUrl: photoUrl }, { headers })
      .pipe(
        retry(2),
        catchError(this.handleError))
      .subscribe(() => {
        console.log('Foto de perfil actualizada con éxito');
      });
  }

}
