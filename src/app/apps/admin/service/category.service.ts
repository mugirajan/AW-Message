import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import * as env from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url: string = env.environment.apiUrl + "category/";

  constructor(private http: HttpClient) { }
  
  createCategory(data: any) {
    return this.http
      .post(this.url + 'create', data, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteCategory(data: number) {
    return this.http
    .delete(this.url + "delete/"+data, {
      reportProgress: true,
      responseType: 'json',
    })
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateCategory(data: any) {
    data.id = data.c_id;
    return this.http
    .post(this.url + "update", data, {
      reportProgress: true,
      responseType: 'json',
    })
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getCategory() {
    return this.http.get(this.url + "getAllCategory");
  }
}
