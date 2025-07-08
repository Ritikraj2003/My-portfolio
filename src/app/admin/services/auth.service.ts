import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Authentication/login`, data);
  }


  
  AddProject(project: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Project`, project);
  }
  getAllProjects(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Project`);
  }

  GetProjectById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Project/${id}`);
  }
  UpdateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Project/${id}`, project);
  }
  DeleteProject(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Project/${id}`);
  }

  //AboutMe
  GetAllAboutMe(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/AboutMe`);
  }
  AddAboutMe(aboutMe: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/AboutMe`, aboutMe);
  }

  UpdateAboutMe(id: number, aboutMe: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/AboutMe/${id}`, aboutMe);
  }
  DeleteAboutMe(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/AboutMe/${id}`);
  }
  GetAboutMeById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/AboutMe/${id}`);
  }





}
