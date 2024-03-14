import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Testimonial } from '../models/testimonial.model';
import * as env from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  private apiUrl = 'http://localhost:3000/testimonials/'; 

  
  private testimonial$ = new BehaviorSubject<Testimonial[]>([]);
  // private url: string = env.environment.apiUrl+ "testimonials/";

  constructor(private http: HttpClient) { }

  createTestimonial(data: any) {
    return this.http.post(this.apiUrl, data);
  }
  // createTestimonial(data: any) {
  //   return this.http.post(this.url + "create", data);
  // }

  deleteTestimonial(data: number) {
    // return this.http.delete(this.url + "delete/"+data);

    return this.http
      .delete(this.apiUrl + "delete/" + data, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateTestimonial(data: any) {
    return this.http.post(this.apiUrl + "update", data);
  }

  getTestimonials() {
    return this.http.get(this.apiUrl + "getDetails");
  }


  public putATestiomonial(data: Testimonial) {
    let formData = new FormData();
    formData.append('t_img_file', data.t_img_file);
    formData.append('t_msg', data.t_msg);
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

  public updateATestimonial(data: any) {

    let formData = new FormData();
    formData.append('t_id',data.t_id);
    formData.append('t_img_file', data.t_img_file);
    formData.append('t_msg', data.t_msg);
    formData.append('t_role', data.t_role);
    formData.append('t_name', data.t_name);
    formData.append('active_status', String(data.active_status));
    formData.append('t_date', data.t_date);
    return this.http
      .post(this.apiUrl + 'update', formData, {
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



}
