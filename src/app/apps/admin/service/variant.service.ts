import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Testimonial } from '../models/testimonial.model';
import * as env from 'src/environments/environment'
import { Variant } from '../models/variant.model';

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private apiUrl = 'http://localhost:3000/variants';
  private apiUrl1 = 'http://localhost:3000/list/'; 


  private url: string = env.environment.apiUrl;
  private catUrl: string = env.environment.apiUrl + "category/";
  private prodUrl: string = env.environment.apiUrl + "product/";

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('assets/db.json');
  }
  getVariant(): Observable<Variant[]> {
    return this.http.get<Variant[]>(this.apiUrl);
    
  }
  getList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl1);
    
  }
  saveVariant(variantData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, variantData);
  }
  createVariant(data: any) {
    let param: Variant = {
      v_name: data['variant'],
      cate_id: data['category'],
      prod_id: data['product'],
      specs: data['specs'],
      varnt_order: data['v_order'],
      active_status: (data['active_status'] == "true")? 'true' : 'false',
    };
    return this.http.post(this.url + "variant/create", param);
  }

  deleteVariant(data: number) {
    return this.http
      .delete(this.url + "variant/delete/" + data).pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateAVariant(data: any) {
    return this.http.post(this.url + "variant/update", data);
  }

  getVariants() {
    return this.http.get(this.url + "variant/getAllVariants");
  }

  getallCategories() {
    return this.http.get(this.catUrl + "getAllCategory");
  }

  getProducts(data: any) {
    return this.http.get(this.prodUrl+"getProducts/"+data)
  }



}

