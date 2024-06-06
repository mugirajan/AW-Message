import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Testimonial } from '../models/testimonial.model';
import { Observable,catchError  } from 'rxjs';
import * as env from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // private apiUrl = 'http://localhost:3000/contacts/';

  private apiUrl = 'http://13.235.132.13/contacts/'; 


  
  private testimonial$ = new BehaviorSubject<Testimonial[]>([]);
  // private url: string = env.environment.apiUrl+ "testimonials/";

  constructor(private http: HttpClient,private toastr: ToastrService,) { }

  createContacts(data: any) {
    
    if(data.id != undefined){ 
      return this.updateContact(data)
    } else {
      delete data.id; 
      this.toastr.success('Contact Added Succesfully!');

      return this.http.post(this.apiUrl, data);

    }
  }
  

  deleteCon(id: string): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.delete(url);
  }
 
  fetchDataForId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }
  

 updateContact(data: any) {
    this.toastr.success('edit successfully!');
    let updateUrl = this.apiUrl  + data.id;
    console.log("url: ", updateUrl)
    console.log("Data: ", data)
    return this.http.put(updateUrl, data);
  }
  

  // getContacts() {
  //   return this.http.get(this.apiUrl + "getDetails");
  // }

  getContacts() {
    return this.http.get<Testimonial[]>(this.apiUrl);
  }


  public putATestiomonial(data: Testimonial) {
    let formData = new FormData();
    formData.append('t_img_file', data.t_img_file);
    formData.append('t_role', data.t_role);
    formData.append('t_name', data.t_name);
    formData.append('active_status', String(data.active_status));
    formData.append('t_date', data.t_date);
    return this.http
      .post(this.apiUrl + 'create', formData, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          if(response['isSuccess'] == false) {
            // console.log("Toster triggered...!", response['message'])
          }
          return response;
        })
      );
  }

  public updateATestimonial(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('t_id', String(data.t_id));  
    formData.append('t_role', data.t_role);
    formData.append('t_name', data.t_name);
    formData.append('active_status', String(data.active_status));
    formData.append('t_date', data.t_date);
  
    return this.http.post(this.apiUrl + 'update', formData, {
      reportProgress: true,
      responseType: 'json',
    }).pipe(
      map((response: any) => {
        if (response['isSuccess'] === false) {
          console.log("Toster triggered...!", response['message']);
        }
        return response; 
      }),
      catchError((error: any) => {
        console.error('Update testimonial error:', error);
        throw error; 
      })
    );
  }
  



}
