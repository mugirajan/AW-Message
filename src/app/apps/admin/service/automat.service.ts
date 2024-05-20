import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AutoTemp } from '../models/autotemp.model';

@Injectable({
  providedIn: 'root'
})
export class AutoTempService {

  private apiUrl = 'http://localhost:3000/datetime/'; 
  
  private AutoTemp$ = new BehaviorSubject<AutoTemp[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  // Create
  createAutoTemp(data: any) { 
    if(data.id != undefined){ 
      return this.updateAutoTemp(data)
    } else {
      delete data.id; 
      this.toastr.success('Date and Time Added Succesfully!');
      return this.http.post(this.apiUrl, data);
    }
  }
  
  
  // Delete
  deleteAutoTemp(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.delete(url);
  }
 
  // Fetch by ID
  fetchAutoTempById(id: number): Observable<AutoTemp> {
    return this.http.get<AutoTemp>(`${this.apiUrl}${id}`);
  }
  
  // Update
  updateAutoTemp(data: AutoTemp): Observable<AutoTemp> {
    this.toastr.success('Date and Time Updated Successfully!');
    const url = `${this.apiUrl}${data.id}`;
    return this.http.put<AutoTemp>(url, data);
  }
 
  // Get all
  getAutoTemps(): Observable<AutoTemp[]> {
    return this.http.get<AutoTemp[]>(this.apiUrl);
  }
}
