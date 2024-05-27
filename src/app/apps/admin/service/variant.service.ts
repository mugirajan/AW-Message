import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Variant } from '../models/variant.model';

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  // private apiUrl = 'http://localhost:3000/variants';
  // private apiUrl1 = 'http://localhost:3000/list'; 

  private apiUrl = 'http://13.127.116.149/variants';
  private apiUrl1 = 'http://13.127.116.149/list'; 

  constructor(private http: HttpClient) { }

  
  createSchedule(data: any) {
    if(data.id != undefined){ 
      return this.UpdateSchedule(data)
    } else {
      delete data.id; 
      return this.http.post(this.apiUrl, data);
    }
  }

  deleteVariant(variantId: any): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${variantId}`;
    return this.http.delete(deleteUrl);
  }

  getSchedule(): Observable<Variant[]> {
    return this.http.get<Variant[]>(this.apiUrl);  
  }

  getVariant(): Observable<Variant[]> {
    return this.http.get<Variant[]>(this.apiUrl);
    
  }
  getList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl1);
    
  }
  
   UpdateSchedule(data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${data.id}`;
    return this.http.put(updateUrl, data);
  }
  

}

