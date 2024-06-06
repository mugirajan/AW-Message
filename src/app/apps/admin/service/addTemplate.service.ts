import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AddTemplate } from '../models/addTemplate.model';
@Injectable({
  providedIn: 'root'
})
export class AddTemplateService {
  private apiUrl = 'http://localhost:3000/template'; 

  // private apiUrl = 'http://13.235.132.13/template'; 


  constructor(private http: HttpClient) { }

  
  createTemp(data: any) {
    if(data.id != undefined){ 
      return this.UpdateTemp(data)
    } else {
      delete data.id; 
      return this.http.post(this.apiUrl, data);
    }
  }

  deleteAddTemplate(AddTemplateId: any): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${AddTemplateId}`;
    return this.http.delete(deleteUrl);
  }

  getTemp(): Observable<AddTemplate[]> {
    return this.http.get<AddTemplate[]>(this.apiUrl);  
  }

  getAddTemplate(): Observable<AddTemplate[]> {
    return this.http.get<AddTemplate[]>(this.apiUrl);
    
  }
  
  
   UpdateTemp(data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${data.id}`;
    return this.http.put(updateUrl, data);
  }
  

}

