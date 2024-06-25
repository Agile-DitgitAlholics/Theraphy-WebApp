import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Physiotherapist} from "../../../security/model/physiotherapist";
import {PhysiotherapistService} from "../../../security/services/physiotherapist.service";
import {ConsultationService} from "../../services/consultation.service";
import {InternalConsultationService} from "../../services/internal-consutation.service";
import {ReviewService} from "../../../social/services/review.service";
import {CreateConsultation} from "../../model/createConsultation";

@Component({
  selector: 'app-consultation-details',
  templateUrl: './consultation-details.component.html',
  styleUrls: ['./consultation-details.component.css']
})
export class ConsultationDetailsComponent implements OnInit{
  physiotherapist!: Physiotherapist;
  physiotherapistId! : number;
  consultation!: CreateConsultation;
  reviewQuantity: number = 0 ;
  constructor(private route: ActivatedRoute, private physiotherapistService: PhysiotherapistService, private consultationService: ConsultationService, private sharedConsultationService: InternalConsultationService, private reviewService: ReviewService) {
    this.route.params.subscribe(params => {
      this.physiotherapistId = +params['id'];
    });

  }

  consultationBackup!: CreateConsultation ;
  ngOnInit(): void {
    this.physiotherapistService.getById(this.physiotherapistId).subscribe((response: any)=>{
      this.physiotherapist = response;
    })
    this.reviewService.getReviewsByPhysiotherapistId(this.physiotherapistId).subscribe((response:any) => {
      this.reviewQuantity = response.content.length;
    })

    const storedData =  localStorage.getItem('consultationData');
    if (storedData) {
      this.consultation = JSON.parse(storedData);
    }
    // this.consultation = this.sharedConsultationService.getConsultation();
  }



  goBack() {
    window.history.back();
  }


  createConsultation(){
    this.consultationService.createConsultation(this.consultation).subscribe((response:any) => {
      console.log("Consultation created")
    })

  }


}
