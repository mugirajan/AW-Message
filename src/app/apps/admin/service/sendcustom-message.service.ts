import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sendCustom } from '../models/autotemp.model';

@Injectable({
  providedIn: 'root'
})
export class sendCustomService {
  private apiUrl = 'https://fusion24fitness-avadi.blackitechs.in/api_avd/scheduledmsg/';

  // private apiUrl = 'http://13.126.175.153/sendcustom/';


  constructor(private http: HttpClient) { }

  createAutoTemp(data: sendCustom): Observable<sendCustom> {
    return this.http.post<sendCustom>(this.apiUrl, data);
  }

  getAutoTemps(): Observable<sendCustom[]> {
    return this.http.get<sendCustom[]>(this.apiUrl);
  }

  
  deleteAutoTemp(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
