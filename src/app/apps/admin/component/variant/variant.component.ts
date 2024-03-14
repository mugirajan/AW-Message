import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actionEvent } from '../../models';
import { VariantService } from '../../service/variant.service';
import { NotificationService } from 'src/app/layout/shared/service/notification.service';
import { Variant } from '../../models/variant.model';
import { Select2Group, Select2Option } from 'ng-select2-component';
import * as varConst from '../../constants/variant.constant'
import { Select2UpdateEvent } from 'ng-select2-component'
import { Category } from '../../models/category.model';
import { DynaFormService } from '../../service/form.service';


@Component({
  selector: 'app-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss']
})
export class VariantComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  records: any = [];
  columns: Column[] = [];
  loading: boolean = false;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  variantForm!: FormGroup;
  actionType: string = "Add New";
  variantDeleteID: any;
  categoryResource: any = [];
  categories: Select2Group[] = [
    {
        label: '',
        options: [
        ]
    },
  ];
  products: Select2Group[] = [
    {
        label: '',
        options: [
        ]
    },
  ];
  specLabels: any = [];
  idFormBasedOnCategory!: boolean;
  selectedCategory: Select2Option[] = [];
  selectProduct: any;
  selectedProduct: Select2Option[] = [];

  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;

  
  // Constructor
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private varServ: VariantService,
    private notifyServ: NotificationService,
    private formServ: DynaFormService
  ) { }

  // OnInit 
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage variant', path: '/', active: true }];
    
    // get Variants
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.variantForm = this.fb.group({
      id: [''],
      variant: ['', Validators.required],
      category: ['', Validators.required],
      product: ['', Validators.required],
      varnt_order: ['', Validators.required],
      specs: new FormArray([]),
      active_status: ['', Validators.required]
    });

    this.resetVariantForm();

    this.varServ.getallCategories().subscribe( (res: any) => {
      this.categoryResource = res;
      res.forEach((e : any) => {
        this.categories[0].options.push({ value: e.id, label: e.c_name })
      });
    })

  }


  /**
   * fetches table records
   */
  _fetchData(): void {
    
    this.varServ.getVariants().subscribe((data: any) =>{
      if(data.length > 0) {
        data.forEach((e : any)=>{
        e.active_status = e.active_status == true ? 'active':'inactive'
        })
        this.records =  data;
    console.log("Fetch : ", this.records)

      }
    });
  }

  
  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'id',
        label: 'Id',
        formatter: (a: Variant) => a.id
      },
      {
        name: 'v_name',
        label: 'Variant Name',
        formatter: (a: Variant) => a.v_name
      },
      {
        name: 'prod_id',
        label: 'Product Id',
        formatter: (a: Variant) => a.prod_id
      },
      {
        name: 'varnt_order',
        label: 'Variant Order',
        formatter: (a: Variant) => a.varnt_order
      },
      {
        name: 'cate_id',
        label: 'Category',
        formatter: this.variantCategoryFormatter.bind(this)
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.variantActiveStatusFormatter.bind(this)
      },
    ];
  }

  // category name formatter
  variantCategoryFormatter(data: Variant): any {  

    let cat_obj :Category[]= this.categoryResource.filter((e:any)=>{
      return e.id == data.cate_id
    });

    let cat_value: string = ``;
    if(cat_obj.length > 0) {
      cat_value = `${cat_obj[0].c_name}`
      return this.sanitizer.bypassSecurityTrustHtml(cat_value);
    } else {
      return "";
    }
  }

  // active_statuss formatter
  variantActiveStatusFormatter(data: Variant): any {
    if (data.active_status == 'active') {
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
  matches(row: any, term: string) {
      return row.id?.toString().includes(term) || 
      row.prod_id?.toString().toLowerCase().includes(term) || 
      row.v_name?.toLowerCase().toString().includes(term) || 
      row.cate_id?.toString().toLowerCase().includes(term) ||
      row.active_status?.toString().toLowerCase().includes(term)
      
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
  
  private _filterData(data: any[], term: string): any[] {
    return data.filter((item: any) => this.matches(item, term));
  }
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  

 
  

  /**
   * Receives the emitted data from tablee
   * @param action action type
   * @param data record info
   */
  actionTriggerd(event: actionEvent) {

    switch (event.action) {
      case "edit":
        this.actionType = "Edit";
        this.editVariantForm(event.record);
        // this.showEditDisabledDialogue();
        break;
      case "delete":
        this.actionType = "Delete";
        this.deleteVariantForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }


  //To Confirm delete action
  deleteVariantForm(record: any) {
    this.variantDeleteID = record.id;
    this.openVerticallyCentered(this.positionModal);
  }

  // Open edit disabled temporarily dialogue window
  showEditDisabledDialogue() {
    this.openVerticallyCentered(this.positionModal2);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedVariant(){
    this.varServ.deleteVariant(this.variantDeleteID).subscribe( (val) => {
      if(val['isSuccess'] == true) {
        this.notifyServ.addNotification(
          {
            text: "Variant Deleted Successfully",
            level: "success",
            autohide: true,
          }
        );
      }
      else{
        this.notifyServ.addNotification(
          {
            text: "Error while deleting variant",
            level: "error",
            autohide: true,
          }
        );
      }
      this._fetchData();
    });
    this.variantDeleteID = -1;
    this.closeVariantModal();
  }

  // A test method to perform a sample notification
  sample() {
    this.notifyServ.addNotification(
      {
        id: 2,
        text: "Hello",
        level: "success",
        autohide: true,
        title: "Festa solar 2"
      }
    );
  }


  /**
   * Modal methods
   */

  //  opens add modal
  openAddVariantModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetVariantForm();
    this.openVariantModal(content);
  }

  //  Open variant modal
  openVariantModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  //  close variant modal
  closeVariantModal(): void {
    this.modalService.dismissAll();
    this.resetVariantForm();
  }



  /**
   * Edit form  --- needs improvement
   */
  editVariantForm(data: any) {
    
    this.resetVariantForm();
    this.modalService.open(this.sizeableModal, { size: "xl" });
    
    this.specLabels = this.setVariantForm(data.cate_id);

    this.variantForm.patchValue({
      id: data.id,
      variant: data.v_name,
      category: data.cate_id,
      product: data.prod_id,
      specs: [],
      varnt_order: data.varnt_order,
      active_status: data.active_status=='active'? "true": "false"
    });

    this.selectedCategory = this.categories[0].options.filter( (a: any) => {
      return a.value == data.cate_id
    })
    this.fetchProductsBasedOnCategory(data.cate_id)
    this.selectProduct = data.prod_id;
    this.variantForm.removeControl("specs");
    this.variantForm.addControl("specs", this.formServ.generateFormWithValues(this.specLabels, JSON.parse(data.specs)));
  }

  
  /**
   * Form methods
   */

  //  get variant form values
  getvariantFormValue(): any {
    return this.variantForm.value;
  }

  //  gets the form details   - ---- need imp
  submitvariantForm(modal: TemplateRef<NgbModal>) {
    
    // prepping data for service
    let data:any = this.getvariantFormValue();

    let transData = data;
    var jsonSpec: any = [];
    data.specs.forEach( (e: any, i: number) => {
      jsonSpec.push(e['grp']);
    });
    jsonSpec['model'] = data['variant'];
    transData['specs'] = JSON.stringify(jsonSpec);

    if(this.actionType == "Add New") {

      this.varServ.createVariant(data).subscribe( (val: any) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Variant Created Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while creating variant",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetVariantForm();
      this.closeVariantModal();
    }
    else if(this.actionType == "Edit"){
      
      this.varServ.updateAVariant(data).subscribe( (val: any) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Variant Update Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while Updating variant",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetVariantForm();
      this.closeVariantModal();
    }
    
    // this._fetchData();
    
  }


  // get method for variant form's formarray
  get getVariantFormFormArray() {
    const frm = <FormArray>this.variantForm.get('specs');
    return frm;
  }

  // get method for variant form's formarray
  get getVariantFormItemFormArray() {
    const frm = <FormArray>this.variantForm.get('specs');
    return frm;
  }


  // set variant form
  setVariantForm(value: any) {

    /**
     *  Category mappings
     *  
     *  17 - "Single Phase String Inverter"
     *  18 - "Three Phase String Inverter"
     *! 19 - "Three Phase String Inverter(LV)"
     *  20 - "Hybrid Inverter"
     *  21 - "Accessory & Monitoring"
     *  24 - "BOS Kit"
     *  25 - "HV - LiFePo4 Batteries"
     *  26 - "LV - LiFePo4 Batteries"
     *  27 - "ESS"
     *  28 - "Solar Module - Monofacial"
     *  29 - "Solar Module - Bifacial"
     *  30 - "Solar Module - Topcon"
     * 
     */

    // this.resetVariantSpecs()
    
    switch(value) {
      case 17 : {
        return varConst.Variant1Val;
      }
      case 18 : {
        return varConst.Variant2Val;
      }
      case 20 : {
        return varConst.Variant4Val;
      }
      case 21 : {
        return varConst.Variant5Val;
      }
      case 24 : {
        return varConst.Variant8Val;
      }
      // needs attention
      case 28: {
        return varConst.Variant7Val;
      }
      case 29: {
        return varConst.Variant7Val;
      }
      case 30: {
        return varConst.Variant7Val;
      }
      // for ESS
      default:{
        return this.setVariantFormESS(value)
      }
    }

  }
  
  // ESS variant form 
  // check for product
  setVariantFormESS(value: any) {
    
    switch(value) {
    
      // BOS-G(HV)
      case 1069 : {
        return varConst.Variant9Val;
      }
      // GB-L(HV)
      case 1070 : {
        return varConst.Variant10Val;
      }
      // GB-SCL(HV)
      case 1071 : {
        return varConst.Variant11Val;
      }
      // GB-SL(HV)
      case 1072 : {
        return varConst.Variant12Val;
      }
      // GE-F60-EU(HV)
      case 1073 : {
        return varConst.Variant13Val;
      }
      // GE-F60-US(HV)
      case 1074 : {
        return varConst.Variant14Val;
      }
      // MS-G230(HV)
      case 1075 : {
        return varConst.Variant15Val;
      }
      
      // ESS-LV
      // AI-W5.1-B
      case 1057 : {
        return varConst.Variant16Val;
      }
      // AI-W5.1-B-ESS
      case 1052 : {
        return varConst.Variant17Val;
      }
      // AI-W5.1-ESS(LV)
      case 1058 : {
        return varConst.Variant18Val;
      }
      // AI-W5.1(LV)
      case 1059 : {
        return varConst.Variant19Val;
      }
      // AIO-7.6K-20KWH-CABINET-US(LV)
      case 1060 : {
        return varConst.Variant20Val;
      }
      // AIO-CABINET-EU/US(LV)
      case 1061 : {
        return varConst.Variant21Val;
      }
      // RW-L2.5(LV)
      case 1062 : {
        return varConst.Variant22val;
      }
      // RW-M5.3(LV)
      case 1063 : {
        return varConst.Variant23Val;
      }
      // RW-M6.1-B(LV)
      case 1064 : {
        return varConst.Variant24Val;
      }
      // SE-G5.1 Pro-B
      case 1066 : {
        return varConst.Variant25Val;
      }
      // SE-G5.1PRO(LV)
      case 1067 : {
        return varConst.Variant26Val;
      }
      // SE-G5.3(LV)
      case 1068 : {
        return varConst.Variant27Val;
      }
      // SE-G20.4(LV)
      case 1065 : {
        return varConst.Variant28Val;
      }
      default: {
        return null;
      }
    }
  }

  // reset specs
  resetVariantSpecs() {
    (this.variantForm.get("specs") as FormArray).clear();
  }


  setCategoryForm(data: any) {
    
    this.specLabels = data;
    this.variantForm.removeControl("specs");
    this.variantForm.addControl("specs", this.formServ.generateForm(this.specLabels));
  }

  // reset form and file
  resetVariantForm() {
    this.variantForm.reset()
  }

  // dropdown listener for category
  // trigger for product dropdown resource value
  onCategorySelected(da: Select2UpdateEvent) {
    
    let varConst: any = []
    if(this.actionType != "Edit") {
      if( da.value != 25 && da.value != 26 ) {
        
        this.idFormBasedOnCategory = true;
        varConst = this.setVariantForm(da.value);
        this.setCategoryForm(varConst);
      } else{
        
        varConst = this.setVariantForm(da.value);
        this.idFormBasedOnCategory = false;
      }
    }
    this.fetchProductsBasedOnCategory(da.value)
  }

  onProductSelected(da: Select2UpdateEvent) {

    if(this.actionType != "Edit") {
      if(!this.idFormBasedOnCategory) {
        this.setCategoryForm(this.setVariantForm(da.value));
      }
    }
  }


  // fetch products based on a category
  fetchProductsBasedOnCategory(category: any) {

    this.varServ.getProducts(category).subscribe( (val: any) => {
      this.products[0].options = []
      val.forEach((e : any) => {
        this.products[0].options.push({ value: e.id, label: e.name })
      });      
      if(this.selectProduct && this.selectProduct != null) {
        this.selectedProduct = this.products[0].options.filter( (a: any) => {
          return a.value == this.selectProduct
        })
      }
    })
  }


}
