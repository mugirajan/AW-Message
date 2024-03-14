import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import * as env from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private url: string = env.environment.apiUrl + "product/";
  private caturl: string = env.environment.apiUrl + "category/";

  constructor(private http: HttpClient) { }

  
  createProduct(data: any) {
    return this.http.post(this.url + "create", data);
  }

  deleteProduct(data: number) {
    // return this.http.delete(this.url + "delete/"+data);

    return this.http
      .delete(this.url  + "delete/"+data, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          return response
        })
      );
  }

  updateProduct(data: any) {
    return this.http.post(this.url + "update", data);
  }

  getProduct() {
    return this.http.get(this.url + "getAllProducts");  
  }

  getallCategories() {
    return this.http.get(this.caturl + "getAllCategory");
  }


  public putAProduct(data: any) {
    let formData = new FormData();
    formData.append('p_uni_code', data.p_uni_code);
    formData.append('p_name', data.p_name);
    formData.append('p_shrt_desc', data.p_shrt_desc);
    formData.append('p_desc', data.p_desc);
    formData.append('p_category', data.p_category);
    formData.append('p_ftd_img_file', data.p_ftd_img_file);
    formData.append('p_kypts', data.p_kypts)
    
    // formData.append('p_catlog_file', data.p_catlog_file);
    // formData.append('p_datasheet_file', data.p_datasheet_file);

    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i])
    }

    formData.append('p_order', data.p_order)
    formData.append('is_ft_prod', String(data.is_ft_prod));
    formData.append('active_status', String(data.active_status));
    formData.append('catlogue_status', String(data.catlogue_status));
    formData.append('datasheet_status', String(data.datasheet_status));


    for (let i = 0; i < data.p_img_file.length; i++) {
      formData.append("p_img_file", data.p_img_file[i])
    }

    return this.http
      .post(this.url + 'create', formData, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          return response
        })
      );
  }

  public updateAProduct(data: any) {

    let formData = new FormData();
    formData.append('p_id',data.p_id);
    formData.append('p_uni_code', data.p_uni_code);
    formData.append('p_name', data.p_name);
    formData.append('p_shrt_desc', data.p_shrt_desc);
    formData.append('p_desc', data.p_desc);
    formData.append('p_category', data.p_category);
    formData.append('p_ftd_img_file', data.p_ftd_img_file);
    formData.append('p_kypts', data.p_kypts)
    // formData.append('p_img_file', data.p_img_file);
    formData.append('p_spcs', data.p_spcs_file);
    formData.append('p_catlog_file', data.p_catlog_file);
    formData.append('p_datasheet_file', data.p_datasheet_file);
    formData.append('is_ft_prod', String(data.is_ft_prod));
    formData.append('active_status', String(data.active_status));

    for (let i = 0; i < data.p_img_file.length; i++) {
      formData.append("p_img_file", data.p_img_file[i])
    }
    return this.http
      .post(this.url + 'update', formData, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          return response
        })
      );
  }


}
