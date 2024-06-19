import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { ConsultationService } from "../../services/consultation.service";
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { PatientService } from "../../../security/services/patient.service";
import { Consultation } from "../../model/Consultation";
import { DiagnosisDialogComponent } from "../../../shared/components/diagnosis-dialog/diagnosis-dialog.component";

@Component({
  selector: 'app-consultations-list',
  templateUrl: './consultations-list.component.html',
  styleUrls: ['./consultations-list.component.css']
})
export class ConsultationsListComponent implements OnInit {
  consultations: Consultation[] = [];
  originals: Consultation[] = [];
  upcomingButtonActive: boolean;
  pastButtonActive: boolean;
  patientLoggedId: number = 0;
  loading: boolean = true;

  constructor(
      private consultationService: ConsultationService,
      private patientService: PatientService,
      private router: Router,
      private dialog: MatDialog
  ) {
    this.upcomingButtonActive = false;
    this.pastButtonActive = false;

    // Suscribirse a eventos de navegación
    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(async () => {
          await this.loadPatientData();
        });
  }

  async ngOnInit() {
    await this.loadPatientData();
  }

  async loadPatientData() {
    try {
      const response: any = await this.patientService.getPatientLogged().toPromise();
      this.patientLoggedId = response.id;
      await this.getAllMyConsultations(this.patientLoggedId);
    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
    }
  }

  async getAllMyConsultations(patientId: number) {
    try {
      console.log("tetta");
      const response: any = await this.consultationService.getByPatientId(patientId).toPromise();
      console.log(response.content);
      this.consultations = response.content;
      this.originals = response.content;

      // Invertir la lista manualmente
      this.consultations = this.consultations.slice().reverse();
      this.originals = this.originals.slice().reverse();

      this.loading = false; // Cambia el estado de carga
    } catch (error) {
      console.error('Error al obtener consultas:', error);
      this.loading = false;
    }
  }

  filterConsultations(searchName: string) {
    this.consultations = this.originals.filter(consultation => {
      return consultation.physiotherapistId.user.firstname.toLowerCase().includes(searchName.toLowerCase()) ||
          consultation.physiotherapistId.user.lastname.toLowerCase().includes(searchName.toLowerCase());
    });
  }

  viewDetailsById(id: number) {
    this.router.navigate([`/physiotherapist-profile/${id}`]);
  }

  filterUpcomingConsultations() {
    if (this.upcomingButtonActive) {
      this.upcomingButtonActive = false;
      this.consultations = this.originals;
    } else {
      this.upcomingButtonActive = true;
      this.pastButtonActive = false;
      this.consultations = this.originals.filter(consultation => !consultation.done);
    }
  }

  filterPastConsultations() {
    if (this.pastButtonActive) {
      this.pastButtonActive = false;
      this.consultations = this.originals;
    } else {
      this.pastButtonActive = true;
      this.upcomingButtonActive = false;
      this.consultations = this.originals.filter(consultation => consultation.done);
    }
  }

  openDiagnosisDialog(consultation: any) {
    this.dialog.open(DiagnosisDialogComponent, {
      data: {
        topic: consultation.topic,
        date: consultation.date,
        hour: consultation.hour,
        physiotherapist_full_name: consultation.physiotherapist.user.firstname + " " + consultation.physiotherapist.user.lastname,
        diagnosis: consultation.diagnosis,
      },
    });
  }
}
