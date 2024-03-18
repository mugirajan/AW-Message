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
  private apicontactUrl ='http://localhost:3000/contacts'

  // private url: string = env.environment.apiUrl + "category/";

  constructor(private http: HttpClient) { }
  
 
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('assets/db.json');
  }

  createCatergory(data: any) {
    if(data.id != undefined){ 
      return this.UpdateCategory(data)
    } else {
      delete data.id; 
      return this.http.post(this.apiUrl, data);
    }
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apicontactUrl);
    
  }

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
    
  }

  editCategoryName(categoryId: number, newName: string): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.patch(url, { name: newName });
  }

 
  deleteList(id: string): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.delete(url);
  }



  UpdateCategory(data: any) {
    let updateUrl = this.apiUrl  + data.id;
    return this.http.put(updateUrl, data);
  }




}
