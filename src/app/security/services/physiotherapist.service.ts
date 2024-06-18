
import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {CreatePhysiotherapist} from "../model/CreateUsers/createPhysiotherapist";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CreatePatient} from "../model/CreateUsers/createPatient";
import {Observable} from "rxjs";
import {Physiotherapist} from "../model/physiotherapist";
import {Page} from "../model/Page";

@Injectable({
  providedIn: 'root'
})
export class PhysiotherapistService extends BaseService<Physiotherapist>{

  endPoint = '/profile/physiotherapists';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  createPhysiotherapist(physiotherapist: CreatePhysiotherapist): Observable<CreatePhysiotherapist> {
    const createPhysiotherapistUrl = `${this.basePath}/registration-physiotherapist`;
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.post<CreatePhysiotherapist>(createPhysiotherapistUrl, physiotherapist, { headers });
  }

  getAllPhysiotherapists(): Observable<Page<Physiotherapist>> {
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      throw new Error('Token JWT no encontrado en el localStorage.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.get<Page<Physiotherapist>>(this.basePath, { headers });
  }
}
