import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import * as env from "src/environments/environment";
import { Category } from "../models/category.model";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = "http://localhost/api/list/";
  private apicontactUrl = "http://localhost/api/contacts/";

  // private apiUrl = 'http://13.126.175.153/list/';
  // private apicontactUrl ='http://13.126.175.153/contacts'

  // private url: string = env.environment.apiUrl + "category/";

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>("assets/db.json");
  }

  // Create or Update Category based on whether 'id' exists
  createCategory(data: any): Observable<any> {
    if (data.id) {
      return this.updateCategory(data);
    } else {
      delete data.id;
      return this.http.post(`${this.apiUrl}createList.php`, data);
    }
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apicontactUrl + "getContacts.php");
  }

  getCategory(): Observable<Category[]> {
    console.log("Get Category");
    return this.http.get<Category[]>(this.apiUrl+"getLists.php");
  }

  // Delete a list by ID
  deleteList(id: string): Observable<any> {
    const url = `${this.apiUrl}deleteList.php?id=${id}`; // Update to the correct endpoint
    return this.http.delete(url);
  }

  // Update existing category
  updateCategory(data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}updateList.php?id=${data.id}`; // Update to the correct endpoint
    return this.http.post(updateUrl, data);
  }
}
