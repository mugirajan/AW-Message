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
import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';

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
  categoryList!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";
  val2!: Category;
  categorySubscription!: Subscription;
  categoryDeleteID:any;
  roles: any[] = [];


  

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  requestData: any[]=[];
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  ListData: any = {};
  contacts: any[] =[];



  

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private catServ: CategoryService,
    private notifyServ: NotificationService,
    private conserv: ContactService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage category', path: '/', active: true }];


    this.http.get<any>('http://localhost:3000/contacts').subscribe(data => {
      this.contacts = data.contacts;
    });
  
    this.catServ.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
    
    // get Categories
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.categoryList = this.fb.group({ 
      id:[''],
      c_name: ['', Validators.required],
      c_desc: ['',Validators.required],
      c_number: ['', Validators.required],
      active_status: [false, Validators.required],
    });

    // this.resetcontactForm();
  }
  ListForm() {
    this.catServ.createCatergory(this.categoryList.value)
      .subscribe(response => {
        console.log('List added successfully:', response);
      }, error => {
        console.error('Error adding List:', error);
      });

      this.closeListModal();
      this._fetchData();
      

  }
  
  /**
   * fetches table records
   */
  _fetchData(): void {
    this.catServ.getCategory().subscribe((data: any) =>{
      if(data.length > 0) {
        this.records =  data;
      }
    });

    // this.catServ.getContacts().subscribe((data: any) =>{
    //   console.log("asdfghj")
    //   if(data.length > 0) {
    //     this.records =  data;
    //   }
    // });
  }

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
        name: 'c_number',
        label: 'Number',
        formatter: (order: Category) => order.c_number,
        
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.categoryActiveStatusFormatter.bind(this)
      },
    ];
  }

  
  categoryIDFormatter(data: Category): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

    
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
      // row.c_number.toLowerCase().includes(term) ||
      row.c_number.toLowerCase().includes(term) ||
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
    // const matchesUnqCatName = item.c_number.toLowerCase().includes(term);
    const matchesSuprCat = item.c_number.toLowerCase().includes(term);
    const matchesActiveStatus = this._matchesActiveStatus(item, term);
  
    return (
      matchesId ||
      matchesCName ||
      matchesCDesc ||
      // matchesUnqCatName ||
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
        this.editCategoryName(event.record);
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

  deleteList() {
    if (this.categoryDeleteID) {
     this.catServ.deleteList(this.categoryDeleteID).subscribe(
       (response) => {
         console.log('Delete successful', response);
       },
       (error) => {
         console.error('Error deleting testimonial', error);
       }
     );
   } else {
     console.error('Testimonial ID is missing.');
   }
   }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedContact(){
    this.catServ.deleteList(this.categoryDeleteID).subscribe( (val) => {
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
        // this.notifyServ.addNotification(
        //   {
        //     text: "",
        //     level: "error",
        //     autohide: true,
        //   }
        // );
      }
      this._fetchData();
    });
    this.categoryDeleteID = -1;
    this.closeListModal();
    
  }

 
  openAddCategoryModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetCategoryForm();
    this.openCategoryModal(content);
  }

  openCategoryModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  closeListModal(): void {
    this.modalService.dismissAll();
    this.resetCategoryForm();
  }

  
  editCategoryName(data: Category) {
    this.modalService.open(this.sizeableModal, { size: 'xl' });
    this.categoryList.patchValue({ ...data });
  }

  UpdateCategory() {
    this.catServ.UpdateCategory(this.categoryList.value).subscribe(
      (response) => {
        console.log('Update response:', response);
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
  
  get form1() { return this.categoryList.controls; }

 

  // reset form and file
  resetCategoryForm() {
    // files reset
    this.files = []
    // form reset
    this.categoryList.reset()
  }


}
