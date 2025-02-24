import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private residenceUrl = 'http://localhost:3000/residences';

    listResidences: any[] = [];

  constructor(private http: HttpClient) {}

  getResidences(): Observable<any[]> {
    return this.http.get<any[]>(this.residenceUrl);
  }

  deleteResidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.residenceUrl}/${id}`);
  }

  addResidence(residence: any): Observable<any> {
    return this.http.post<any>(this.residenceUrl, residence);
  }

  updateResidence(id: number, residence: any): Observable<any> {
    return this.http.put<any>(`${this.residenceUrl}/${id}`, residence);
  }

  getResidenceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.residenceUrl}/${id}`);
  }

  getApartmentsByResidenceId(residenceId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/apartments?residenceId=${residenceId}`);
  }
  
  deleteApartment(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/apartments/${id}`);
  }

}