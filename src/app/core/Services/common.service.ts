import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = 'http://localhost:3000/apartments'; 


  constructor(private http: HttpClient) {}

  getApartments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSameValueOf(list: any[], key: string, value: any): number {
    return list.filter(item => item[key] === value).length;
  }
}
