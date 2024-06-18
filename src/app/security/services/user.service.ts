import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {User} from "../model/CreateUsers/user";
import {BaseService} from "../../shared/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{
  endPoint = '/security/auth';

  constructor(http: HttpClient) {
    super(http);
    this.basePath += this.endPoint;
  }

  login(username: string, password: string): Observable<any>{
    const credentials = {username, password};
    console.log(credentials);
    return this.http.post(`${this.basePath}/authentication`, credentials).pipe(
      tap((response: any) => {
        console.log('Response from server:', response); // Verifica la estructura de la respuesta
        if (response.access_Token) { // Accede a access_Token
          localStorage.setItem('jwtToken', response.access_Token); // Almacena access_Token en localStorage
        }
      }),
      catchError((error: any) => {
        console.error('Error from server:', error);
        return throwError(error);
      })
    );
  }
  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.basePath}/get-user`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error from server:', error);
        return throwError(error);
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.basePath}/registration`, user).pipe(
      tap((response: any) => {
        console.log('Response from server:', response);
        if (response.access_Token) {
          localStorage.setItem('jwtToken', response.access_Token);
        }
      })
    );
  }

  logout(): void{
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken')!;
    return !!token;
  }

  /*getUserInfo(): Observable<User>{
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }*/

}
