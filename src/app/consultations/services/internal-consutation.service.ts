import { Injectable } from '@angular/core';
import {CreateConsultation} from "../model/createConsultation";

@Injectable({
  providedIn: 'root'
})
export class InternalConsultationService {

  consultation!: CreateConsultation;

  constructor() { }


  setConsultation(consultation: CreateConsultation){
    this.consultation = consultation;
    localStorage.setItem('consultationData', JSON.stringify(this.consultation));
  }

  getConsultation(){
    return this.consultation;
  }

}
