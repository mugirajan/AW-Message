import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddTemplate } from '../models/addTemplate.model';
import { Template } from '@angular/compiler/src/render3/r3_ast';
// import{}
// import { Template } from './template.model'; // Assuming you have a Template model

@Injectable({
  providedIn: 'root'
})
export class AddTemplateService {
  private apiUrl = 'http://localhost:3000/templates/'; 

  constructor(private http: HttpClient) { }
 
  createTemplate(data: any) {
    console.log("called createtmplateL: ", data)
    return this.http.post(this.apiUrl, data);
  }

  getTemplate() {
    return this.http.get(this.apiUrl);
    
  }

  editTemplateName(categoryId: number, newName: string): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.patch(url, { name: newName });
  }

 
  deleteTemplate(id: string): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.delete(url);
  }

  // Define a method to add a template
  // addTemplate(template: Template): Observable<any> {
  //   // Assuming your API endpoint for adding templates is '/api/addTemplate'
  // }
UpdateTemplate(data: any) {
  let updateUrl = this.apiUrl  + data.id;
  return this.http.put(updateUrl, data);
}
}
