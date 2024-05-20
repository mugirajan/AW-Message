import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoTemp } from '../models/autotemp.model';

@Injectable({
  providedIn: 'root'
})
export class AutoTempService {
  private apiUrl = 'http://localhost:3000/datetime/';

  constructor(private http: HttpClient) { }

  createAutoTemp(data: AutoTemp): Observable<AutoTemp> {
    return this.http.post<AutoTemp>(this.apiUrl, data);
  }

  getAutoTemps(): Observable<AutoTemp[]> {
    return this.http.get<AutoTemp[]>(this.apiUrl);
  }

  deleteAutoTemp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  updateAutoTemp(data: AutoTemp): Observable<AutoTemp> {
    return this.http.put<AutoTemp>(`${this.apiUrl}${data.id}`, data);
  }
}
