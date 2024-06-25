import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Physiotherapist} from "../../../security/model/physiotherapist";
import {ActivatedRoute, Router} from "@angular/router";
import {PhysiotherapistService} from "../../../security/services/physiotherapist.service";
import {InternalConsultationService} from "../../services/internal-consutation.service";
import {ReviewService} from "../../../social/services/review.service";
import {CreateConsultation} from "../../model/createConsultation";

@Component({
  selector: 'app-book-consultation',
  templateUrl: './book-consultation.component.html',
  styleUrls: ['./book-consultation.component.css']
})
export class BookConsultationComponent implements OnInit{
  hours: number[] = Array.from({ length: 13 }, (_, i) => i + 7); // Array de horas (0-23)
  minutes: number[] = [0, 15, 20, 30, 35, 45, 50]; // Array de minutos (0-59)
  selectedHour: number = 7;
  selectedMinute: number = 0;
  schedule: string = "";
  isSundaySelected: boolean = false;
  isBeforeDate: boolean = false;
  consultationForm: FormGroup;
  physiotherapist!: Physiotherapist;
  physiotherapistId: number = 0;
  reviewQuantity: number = 0 ;
  ratingRounded: number=0;


  consultation: CreateConsultation=  new CreateConsultation(
    0,
    false,
    '',
    '',
    '',
    '',
    '',
    1
  );

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private physiotherapistService: PhysiotherapistService, private sharedConsultationService: InternalConsultationService, private reviewService: ReviewService) {
    this.consultationForm = this.fb.group({
      date: ['', Validators.required],
      hour: ['', Validators.required],
      place: ['', Validators.required],
      minute: ['', Validators.required],
      topic: ['', Validators.required],
    });
    this.route.params.subscribe(params => {
      this.physiotherapistId = +params['id'];
      this.consultationForm.patchValue({ physiotherapistId: this.physiotherapistId });
    });

  }

  ngOnInit(): void {
    this.physiotherapistService.getById(this.physiotherapistId).subscribe((response: any)=>{
      this.physiotherapist = response
      this.ratingRounded = response.rating.toFixed(1);
      console.log(response);
    })
    this.reviewService.getReviewsByPhysiotherapistId(this.physiotherapistId).subscribe((response:any) => {
      this.reviewQuantity = response.content.length;
    })
  }



  goBack() {
    window.history.back();
  }

  onSubmit(){
    if(this.consultationForm.valid){
      this.consultation.date = this.schedule;
      if(this.selectedHour<10){
        this.consultation.hour = "0" + this.selectedHour.toString() + ":" ;
        if(this.selectedMinute<10){
          this.consultation.hour += "0" + this.selectedMinute.toString();
        }else {
          this.consultation.hour += this.selectedMinute.toString();
        }
      }else if(this.selectedMinute<10) {
        this.consultation.hour = this.selectedHour.toString() + ":" + "0" + this.selectedMinute.toString();
      }else{
        this.consultation.hour = this.selectedHour.toString() + ":" + this.selectedMinute.toString();
      }
      this.consultation.place = this.consultationForm.value.place;
      this.consultation.topic = this.consultationForm.value.topic;

      this.consultation.physiotherapistId = this.physiotherapist.id;

      this.sharedConsultationService.setConsultation(this.consultation);
      this.router.navigate([`/consultation-details/physiotherapist/${this.physiotherapist.id}`]);
    }
  }
  isBeforeHour: boolean = false;
  isBeforeMinute: boolean = false;
  onDateChange(selectedDate: Date): void {
    console.log(selectedDate.getDate().toString());
    console.log((selectedDate.getMonth() + 1).toString());
    console.log(selectedDate.getFullYear().toString());
    this.schedule = selectedDate.getFullYear().toString() + "-" + (selectedDate.getMonth() + 1).toString() + "-" + selectedDate.getDate().toString();
    console.log('la fecha que eligio su cita es: ' + this.schedule);
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay();
      this.isSundaySelected = dayOfWeek === 0;

      const currentDate = new Date();

      if (selectedDate < currentDate) {
        this.isBeforeDate = true;
      } else if(selectedDate == currentDate) {
        this.isBeforeDate = true;
      }
      else{
        this.isBeforeDate = false;
      }
      console.log("Select date: " + selectedDate);
      console.log("current date: " + currentDate);
    }

  }

  onHourChange(){
    const currentDate = new Date();
    console.log("la hora es: " + this.selectedHour);
    console.log("The hour: " + currentDate.getHours());
    if(this.selectedHour < currentDate.getHours()){
      this.isBeforeHour = true;
    }

  }

  onHourMinute(){
    const currentDate = new Date();
    console.log("el minuto es: " + this.selectedMinute);
    console.log("The minute: " + currentDate.getMinutes());
    if(this.selectedMinute < currentDate.getMinutes()){
      this.isBeforeMinute = true;
    }

  }

}
