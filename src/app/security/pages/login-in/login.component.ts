import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PatientService} from "../../services/patient.service";
import {PhysiotherapistService} from "../../services/physiotherapist.service";
import {Physiotherapist} from "../../model/physiotherapist";
import {Patient} from "../../model/patient";

@Component({
  selector: 'app-login-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  physiotherapists: Physiotherapist[] = [];
  patients: Patient[] = []

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private patientService: PatientService,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.patientService.getAll().subscribe((response: any) => {
      this.patients = response.content;
    })
  }

  login() {
    this.userService.login(this.username, this.password).subscribe({
      next: () => {
        this.userService.getUserDetails().subscribe({
          next: (user) => {
            if (user.role === 'PATIENT') {
              this.router.navigate(['/home-patient']);
            } else {
              this.router.navigate(['/home-doctor']);
            }
          },
          error: (error) => {
            console.error('Error al obtener detalles del usuario:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error de inicio de sesión:', error);
      }
    });
  }


  loginForm: FormGroup = this.formBuilder.group({
    username: ['', { validators: [Validators.required], updateOn: 'change'}],
    password: ['', {validators: [Validators.required ], updateOn: 'change'}]
  })

}
