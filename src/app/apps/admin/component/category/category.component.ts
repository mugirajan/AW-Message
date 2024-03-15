import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Category, CategoryMOdel2 } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../service/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { actionEvent } from '../../models';
import { NotificationService } from 'src/app/layout/shared/service/notification.service';
import { Variant } from '../../models/variant.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  records: CategoryMOdel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  categoryForm!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";
  val2!: Category;
  categorySubscription!: Subscription;
  categoryDeleteID:any;


  

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  requestData: any[]=[];
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;


  

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private catServ: CategoryService,
    private notifyServ: NotificationService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage category', path: '/', active: true }];
    
    // get Categories
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.categoryForm = this.fb.group({ 
      c_id:[''],
      c_name: ['', Validators.required],
      unq_cat_name: ['', Validators.required],
      c_desc: ['',Validators.required],
      supr_cat: ['', Validators.required],
      active_status: [false, Validators.required],
    });

    // this.resetcontactForm();
  }

  
  /**
   * fetches table records
   */
  _fetchData(): void {
    this.catServ.getCategory().subscribe((data: any) =>{
      this.records =  data;
    });;
  }


  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 'c_id',
        label: 'Category ID',
        formatter: this.categoryIDFormatter.bind(this)
      },
      {
        name: 'c_name',
        label: 'Name',
        formatter: (order: Category) => order.c_name
      }, 
      {
        name: 'supr_cat',
        label: 'Super Category',
        formatter: (order: Category) => order.supr_cat,
        width: 100
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.categoryActiveStatusFormatter.bind(this)
      },
    ];
  }

  // formats testimonial ID cell
  categoryIDFormatter(data: Category): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

    // formats payment status cell
  categoryActiveStatusFormatter(data: Category): any {
    if (data.active_status == "true") {
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
  
  matches(row: Category, term: string) {
    return (
      row.id?.toString().includes(term) ||
      row.c_name.toLowerCase().includes(term) ||
      row.c_desc.toLowerCase().includes(term) ||
      row.unq_cat_name.toLowerCase().includes(term) ||
      row.supr_cat.toLowerCase().includes(term) ||
      this._matchesActiveStatus(row, term)
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

  
  private _filterData(data: Category[], term: string): Category[] {
    return data.filter((item: Category) => this._itemMatches(item, term));
  }
  
  private _itemMatches(item: Category, term: string): boolean {
    const matchesId = item.id?.toString().includes(term);
    const matchesCName = item.c_name.toLowerCase().includes(term);
    const matchesCDesc = item.c_desc.toLowerCase().includes(term);
    const matchesUnqCatName = item.unq_cat_name.toLowerCase().includes(term);
    const matchesSuprCat = item.supr_cat.toLowerCase().includes(term);
    const matchesActiveStatus = this._matchesActiveStatus(item, term);
  
    return (
      matchesId ||
      matchesCName ||
      matchesCDesc ||
      matchesUnqCatName ||
      matchesSuprCat ||
      matchesActiveStatus
    );
  }
  
  private _matchesActiveStatus(item: Category, term: string): boolean {
    if ('inactive'.includes(term) && item.active_status.toLowerCase() === 'false') {
      return true;
    } else if ('active'.includes(term) && item.active_status.toLowerCase() === 'true') {
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
    switch (event.action) {
      case "edit":
        this.actionType = "Edit";
        this.editCategoryForm(event.record);
        break;
      case "delete":
        this.actionType = "Delete";
        this.deleteCategoryForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }

  
  //To Confirm delete action
  deleteCategoryForm(record: any) {
    this.categoryDeleteID = record.id;
    this.openVerticallyCentered(this.positionModal);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedContact(){
    this.catServ.deleteCategory(this.categoryDeleteID).subscribe( (val) => {
      if(val['isSuccess'] == true) {
        this.notifyServ.addNotification(
          {
            text: "Category deleted Successfully",
            level: "success",
            autohide: true,
          }
        );
      }
      else{
        this.notifyServ.addNotification(
          {
            text: "Error while deleting category",
            level: "error",
            autohide: true,
          }
        );
      }
      this._fetchData();
    });
    this.categoryDeleteID = -1;
    this.closeContactModal();
    
  }

  /**
   * Modal methods
  */

  //  opens add modal
  openAddCategoryModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetCategoryForm();
    this.openCategoryModal(content);
  }

  //  Open testimonial modal
  openCategoryModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  //  close testimonial modal
  closeContactModal(): void {
    this.modalService.dismissAll();
    this.resetCategoryForm();
  }

  /**
   * Edit form
   */
  editCategoryForm(data: Category) {
    this.modalService.open(this.sizeableModal, { size: "xl" });
    this.categoryForm.setValue(
      {
        c_id:data.id,
        c_name: data.c_name,
        c_desc: data.c_desc,
        supr_cat: data.supr_cat,
        unq_cat_name: data.unq_cat_name,
        active_status: data.active_status,
      }
    )
  }

  /**
   * Form methods
  */
  
  //  convenience getter for easy access to form fields
  get form1() { return this.categoryForm.controls; }



  //  gets the form details
  submitCategoryFormForm(modal: TemplateRef<NgbModal>) {
    
    // prepping data for service
    let data:Category = this.categoryForm.value;
    // data.t_img_file = this.files[0];

    if(this.actionType == "Add New")
    {
      this.catServ.createCategory(data).subscribe( (val) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Category Created Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while creating category",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetCategoryForm();
      this.closeContactModal();
    }
    else if(this.actionType == "Edit"){
      this.catServ.updateCategory(data).subscribe( (val) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Category Updated Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while updating category",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetCategoryForm();
      this.closeContactModal();
    }
    
    // this._fetchData();
    
  }


  // reset form and file
  resetCategoryForm() {
    // files reset
    this.files = []
    // form reset
    this.categoryForm.reset()
  }


}
