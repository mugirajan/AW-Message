import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../service/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Product, ProductModel2 } from '../../models/product.model';
import { actionEvent } from '../../models';
import { Select2Group } from "ng-select2-component";
import { NotificationService } from 'src/app/layout/shared/service/notification.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  records: ProductModel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  productForm!: FormGroup;
  file1: File[] = [];
  file2: File[] = [];
  pdf_file: File[] = [];
  datasheetFile: File[] = [];
  actionType: string = "Add New";
  val2!: Category;
  productSubscription!: Subscription;
  productDeleteID:any;
  cat_resource: Category[]= [];
  categories : Select2Group[] = [
    {
        label: '',
        options: [
        ]
    },
  ];
  canSubmit: boolean = true;
  requestData: any[]=[];

  @ViewChild('advancedTable') 
  advancedTable: any;
  
  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;


  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private prodServ: ProductService,
    private notifyServ: NotificationService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Custom Template', path: '/', active: true }];
    
    this.fetchCatgeory();

    // get Testimonials
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.productForm = this.fb.group({
      p_id:[''],
      p_name: ['', Validators.required],
      p_uni_code: ['', Validators.required],
      p_shrt_desc: ['',Validators.required],
      p_desc: ['', Validators.required],
      p_category: ['', Validators.required],
      p_kypts: ['', Validators.required],
      p_order: ['', Validators.required],
      is_ft_prod:['',Validators.required],
      active_status: [false, Validators.required],
      catlogue_status: [false, Validators.required],
      datasheet_status: [false, Validators.required],
    });

    this.resetProductForm();
  }


  /**
   * fetches table records
   */
  _fetchData(): void {

    this.prodServ.getProduct().subscribe((data: any) =>{
      this.records =  data;
    });

  }

  /**
   * fetches table records
   */
  fetchCatgeory(): void {

    this.prodServ.getallCategories().subscribe((data: any) =>{        
      data.forEach((e : any) => {
        this.categories[0].options.push({ value: e.id, label: e.c_name })
      });
      this.cat_resource = data;
    });

  }
    
  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'p_id',
        label: 'S.NO',
        formatter: this.productIDFormatter.bind(this)
      },
      {
        name: 'p_name',
        label: 'Name',
        formatter: (order: Product) => order.p_name
      }, 
  
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.productActiveStatusFormatter.bind(this)
      },
      
    ];
  }

  productIDFormatter(data: Product): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

  productcategoryFormatter(data: Product): any {  

    let cat_obj :Category[]= this.cat_resource.filter((e:any)=>{
      return e.id == data.p_category
    });
    let cat_value: string = ``;
    cat_value = `${cat_obj[0].c_name}`
    return this.sanitizer.bypassSecurityTrustHtml(cat_value);
  }

  productFeaturedImageFormatter(data: Product): any {
    let featured_image: string = ``;
    featured_image = `<a href="javascript:void(0)"><img src="${'http://festasolar.com/'+data.p_ftd_img}" alt="featured-img" height="32" /></a>`
    return this.sanitizer.bypassSecurityTrustHtml(featured_image);
  }
  
  productImageFormatter(data: Product): any {
    let arr  = data.p_img.split("|");
    let image: string = ``;
    arr.forEach((e:any,i)=>{
      image += `<a href="javascript:void(0)"><img src="${'http://festasolar.com/'+arr[i]}" alt="featured-img" height="32" /></a> &nbsp;`
    })
    // image = `<a href="javascript:void(0)"><img src="${arr.length}" alt="featured-img" height="32" /></a>`
    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

  productCatalogFormatter(data: Product): any {
    let arr = data.p_catlog;
    let image: string = ``;
    image = `<a href="${'http://festasolar.com/'+arr}"> <strong> click here to go to file </strong> </a>`
    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

  productDatsheetFormatter(data: Product): any {
    let arr = data.p_datasheet;
    let image: string = ``;
    image = `<a href="${'http://festasolar.com/'+arr}"> <strong> click here to go to file </strong> </a>`
    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

  // formats payment status cell
  productActiveStatusFormatter(data: Product): any {
    if (data.active_status === "true") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Active </span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> In Active </span></h5>`
      );
    }
  }

  //formats catlogue
  productCatlogueStatusFormatter(data: Product): any {
    if (data.catlogue_status === "true") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Yes </span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> No </span></h5>`
      );
    }
  }

  //formats datasheet
  productDatasheetStatusFormatter(data: Product): any {
    if (data.datasheet_status === "true") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Yes </span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> No </span></h5>`
      );
    }
  }

  // formats payment status cell
  productFeaturedProductFormatter(data: Product): any {
    if (data.is_ft_prod === "true") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Active </span></h5>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> In Active </span></h5>`
      );
    }
  }

  /**
 * Match table data with search input
 * @param row Table row
 * @param term Search the value
 */
matches(row: Product, term: string) {
  return (
    row.id?.toString().includes(term) ||
    row.p_uni_code?.toString().toLowerCase().includes(term) ||
    row.p_name?.toLowerCase().includes(term) ||
    row.p_category?.toString().toLowerCase().includes(term) ||
    row.active_status?.toString().toLowerCase().includes(term)
  );
}

searchData(searchTerm: string): void {
  console.log('Search Term:', searchTerm);
  if (searchTerm === '') {
    this._fetchData();
  } else {
    searchTerm = searchTerm.toLowerCase();
    this.records = this._filterData(this.records, searchTerm);
  }
}

private _filterData(data: ProductModel2[], term: string): ProductModel2[] {
  return data.filter((item: ProductModel2) => this._itemMatches(item, term));
}

private _itemMatches(item: ProductModel2, term: string): boolean {
  const matchesId = item.id?.toString().toLowerCase().includes(term);
  const matchesProdCode = item.p_uni_code?.toString().toLowerCase().includes(term);
  const matchesPName = item.p_name?.toLowerCase().includes(term);
  const matchesPCategory = item.p_category?.toString().toLowerCase().includes(term);
  const matchesActiveStatus = this._matchesActiveStatus(item, term);

  return (
    matchesId ||
    matchesProdCode ||
    matchesPName ||
    matchesPCategory ||
    matchesActiveStatus
  );
}

private _matchesActiveStatus(item: ProductModel2, term: string): boolean {
  if ('inactive'.includes(term) && item.active_status === 'false') {
    return true;
  } else if ('active'.includes(term) && item.active_status === 'true') {
    return true;
  } else {
    return false;
  }
}

  
  /**
   * Receives the emitted data from tablee
   * @param action action type
   * @param data record info
   */
  actionTriggerd(event: actionEvent) {
    // console.log("Event: ", event)
    switch (event.action) {
      case "edit":
        // this.actionType = "Edit";
        // this.editProductForm(event.record);
        this.showEditDisabledDialogue();
        break;
      case "delete":
        this.actionType = "Delete";
        this.deleteProductForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }

  //To Confirm delete action
  deleteProductForm(record: any) {
    this.productDeleteID = record.id;
    this.openVerticallyCentered(this.positionModal);
  }

  // Open edit disabled temporarily dialogue window
  showEditDisabledDialogue() {
    this.openVerticallyCentered(this.positionModal2);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedProduct(){
    this.prodServ.deleteProduct(this.productDeleteID).subscribe( (val) => {
      if(val['isSuccess'] == true) {
        this.notifyServ.addNotification(
          {
            text: "Product Deleted Successfully",
            level: "success",
            autohide: true,
          }
        );
      }
      else{
        this.notifyServ.addNotification(
          {
            text: "Error while Deleting product",
            level: "error",
            autohide: true,
          }
        );
      }
      this._fetchData();
    });
    this.productDeleteID = -1;
    this.closeProductModal();
  }

  /**
   * Modal methods
   */

  //  opens add modal
  openAddProductModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.openProductModal(content);
  }

  //  Open product modal
  openProductModal(content: TemplateRef<NgbModal>): void {
    this.resetProductForm();
    this.modalService.open(content, { size: "xl" });
  }

  //  close product modal
  closeProductModal(): void {
    this.modalService.dismissAll();
    this.resetProductForm();
  }

  
  /**
   * Edit form
   */
  editProductForm(data: Product) {
    this.resetProductForm();
    this.modalService.open(this.sizeableModal, { size: "xl" });
    this.productForm.setValue(
      {
        p_id:data.id,
        p_name: data.p_name,
        p_uni_code: data.p_uni_code,
        p_shrt_desc: data.p_shrt_desc,
        p_desc: data.p_desc,
        p_category: Number(data.p_category),
        p_kypts: data.p_kypts,
        p_order: data.prod_order,
        is_ft_prod: data.is_ft_prod,
        active_status: data.active_status,
        catlogue_status: data.catlogue_status,
        datasheet_status: data.datasheet_status,
      }
    )
    this.getImageFile(data.p_ftd_img,this.file1);
    this.getImageFile(data.p_catlog,this.pdf_file);
    this.getImageFile(data.p_datasheet,this.datasheetFile);

    let arr  = data.p_img.split("|");
    for(let i=0;i<=arr.length;i++){
      this.getImageFile(arr[i],this.file2);
    }

  }

  /**
   * Form methods
   */
  
  //  convenience getter for easy access to form fields
  get form1() { return this.productForm.controls; }

  //  adds new file in uploaded files
  onSelectFile1(event: any) {
    this.file1.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemoveFile1(event: any) {
    this.file1.splice(this.file1.indexOf(event), 1);
  }

  //  adds new file in uploaded files
  onSelectFile2(event: any) {
    this.file2.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemoveFile2(event: any) {
    this.file2.splice(this.file2.indexOf(event), 1);
  }

  //  adds new file in uploaded files
  onSelectPdfFile(event: any) {
    this.pdf_file.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemovePdfFile(event: any) {
    this.pdf_file.splice(this.pdf_file.indexOf(event), 1);
  }

  //  adds new file in uploaded files
  onSelectDatasheetFile(event: any) {
    this.datasheetFile.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemoveDatasheetFile(event: any) {
    this.datasheetFile.splice(this.datasheetFile.indexOf(event), 1);
  }

  //  returns the preview url
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

  //  formats the size
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //  gets the form details
  submitProductFormForm() {
    
    this.canSubmit = true;

    // prepping data for service
    let data:Product = this.productForm.value;
    data.files = [];

    data.p_ftd_img_file = this.file1[0];
    data.p_img_file = this.file2;

    if(this.file2.length == 0) {
      this.notifyServ.addNotification(
        {
          text: "Product images should be uploaded",
          level: "error",
          autohide: true,
        }
      );
      this.canSubmit = false 
      console.log("not there product_image");
    } else {
      console.log("there product images")
      data.p_img_file = this.file2;
    }
    if(this.file1.length > 1){
      this.notifyServ.addNotification(
        {
          text: "Featured product images should not be more than one",
          level: "error",
          autohide: true,
        }
      );
      console.log("not there featured_product_images")
      this.canSubmit = false
    } else {
      console.log("Attaching featured files to the data")
      data.p_ftd_img_file = this.file1[0];
    }

    if(this.productForm.get('catlogue_status')?.value == 'true') {
      if(this.pdf_file.length > 1){
        this.notifyServ.addNotification(
          {
            text: "Catalogue file should not be more than one",
            level: "error",
            autohide: true,
          }
        );
        console.log("not there catalogue")
        this.canSubmit = false
      } else {
        console.log("Adding catalogue")
        data.files.push(this.pdf_file[0]);
      }
    } else {
      console.log("There is no catalogue file to push")
      // data.p_catlog_file = null;
    }

    if(this.productForm.get('datasheet_status')?.value == 'true') {
      if(this.datasheetFile.length > 1) {
        this.notifyServ.addNotification(
          { 
            text: "Datasheet file should not be more than one",
            level: "error",
            autohide: true,
          }
        );
        console.log("not there datasheet")
        this.canSubmit = false
      } else {
        console.log("Adding datasheet")
        data.files.push(this.datasheetFile[0]);
      }
    } else {
      console.log("There is no datasheet file to push")
      // data.p_catlog_file = null;
    }

    console.log("Data: ", data);

    if(this.canSubmit) {
    // if(false) {
      if(this.actionType == "Add New")
      {
        this.prodServ.putAProduct(data).subscribe( (val) => {
          if(val['isSuccess'] == true) {
            this.notifyServ.addNotification(
              {
                text: "Product Created Successfully",
                level: "success",
                autohide: true,
              }
            );
          }
          else{
            this.notifyServ.addNotification(
              {
                text: "Error while creating product",
                level: "error",
                autohide: true,
              }
            );
          }
          this._fetchData();
        });
        this.resetProductForm();
        this.closeProductModal();
      }
      else if(this.actionType == "Edit"){
        this.prodServ.updateAProduct(data).subscribe( (val) => {
          if(val['isSuccess'] == true) {
            this.notifyServ.addNotification(
              {
                text: "Product Updated Successfully",
                level: "success",
                autohide: true,
              }
            );
          }
          else{
            this.notifyServ.addNotification(
              {
                text: "Error while updating product",
                level: "error",
                autohide: true,
              }
            );
          }
          this._fetchData();
        });
        this.resetProductForm();
        this.closeProductModal();
      }
    }
  }

  // reset form and file
  resetProductForm() {
    // files reset
    this.file1 = []
    this.file2 = []
    this.pdf_file = []
    this.datasheetFile = []
    // form reset
    this.productForm.reset()
  }

  srcToFile(src:any, fileName:any, mimeType:any){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
  }

  getImageFile(imgPath:any, file:File[]){
    let img = this.srcToFile(
      imgPath, 
      imgPath.split('/').pop(),
      'image/'+imgPath.split('/').pop().split('.')[1]);

      img.then((value)=>{
      file.push(value)
    })
  }

}
