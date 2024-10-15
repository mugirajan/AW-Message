import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map } from "rxjs";
import { AddTemplate } from "../models/addTemplate.model";
@Injectable({
  providedIn: "root",
})
export class AddTemplateService {
  apiUrl = "http://localhost/api/template/";

  // private apiUrl = 'http://13.126.175.153/template';

  constructor(private http: HttpClient) {}

  createTemp(data: any) {
    if (data.id != undefined) {
      return this.UpdateTemp(data);
    } else {
      delete data.id;
      return this.http.post(this.apiUrl + "createTemplate.php", data);
    }
  }

  deleteAddTemplate(AddTemplateId: any): Observable<any> {
    const deleteUrl = `${this.apiUrl}deleteTemplate.php?id=${AddTemplateId}`;
    return this.http.delete(deleteUrl);
  }

  getTemp(): Observable<AddTemplate[]> {
    return this.http.get<AddTemplate[]>(this.apiUrl + "getTemplates.php");
  }

  getATemplate(id: any): Observable<AddTemplate[]> {
    return this.http.get<AddTemplate[]>(
      this.apiUrl + "getATemplate.phph?id=" + id
    );
  }

  UpdateTemp(data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}updateTemplate.php`;
    return this.http.post(updateUrl, data);
  }
}
