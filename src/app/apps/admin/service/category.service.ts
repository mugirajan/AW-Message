import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as env from 'src/environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/list/'; 
  // private apiUrl1 = 'http://localhost:3000/contacts/'; 



  // private url: string = env.environment.apiUrl + "category/";

  constructor(private http: HttpClient) { }
  
  // createCategory(data: any) {
  //   return this.http
  //     .post(this.url + 'create', data, {
  //       reportProgress: true,
  //       responseType: 'json',
  //     })
  //     .pipe(
  //       map((response: any) => {
  //         return response;
  //       })
  //     );
  // }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('assets/db.json');
  }
  // getoles(): Observable<any[]> {
  //   return this.http.get<any[]>('assets/db.json');
  // }

  createCatergory(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
    
  }
  // getcontacts(): Observable<Category[]> {
  //   return this.http.get<Category[]>(this.apiUrl1);
    
  // }

  editCategoryName(categoryId: number, newName: string): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.patch(url, { name: newName });
  }

  deleteCategory(id: string) {
    const deleteUrl = `${this.apiUrl}${id}`;  
    return this.http.delete(deleteUrl, {
      reportProgress: true,
      responseType: 'json',
    }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateCategory(data: any) {
    data.id = data.c_id;
    return this.http
    .post(this.apiUrl + "update", data, {
      reportProgress: true,
      responseType: 'json',
    })
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // UpdateCategory() {
  //   return this.http.get(this.apiUrl + "getAllCategory");
    
  // }
//   UpdateCategory(id: any) {
//     const updateUrl = ${this.apiUrl}${id};
//     return this.http.put(updateUrl, id);
//   }


}
