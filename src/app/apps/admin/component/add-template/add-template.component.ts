import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
// import { Category, CategoryMOdel2 } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { CategoryService } from '../../service/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { actionEvent } from '../../models';
import { NotificationService } from 'src/app/layout/shared/service/notification.service';
// import { Variant } from '../../models/variant.model';
import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';
import { AddTemplate, AddTemplateMOdel2 } from '../../models/addTemplate.model';
import { AddTemplateService } from '../../service/addTemplate.service';
import { Template } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  records: AddTemplateMOdel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  Template_List!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";
  val2!: AddTemplate;
  categorySubscription!: Subscription;
  categoryDeleteID:any;
  roles: any[] = [];
  selectedNumber: string = '';
  addtemplates:AddTemplate[]=[];
 


  

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  requestData: any[]=[];
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  // TempData: any = {};
  Templates: any[] =[];


  selectedOptions: string[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private TempServ: AddTemplateService,
    private notifyServ: NotificationService,
    private conserv: ContactService,
    private http: HttpClient
    ) { }

   

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Add Template', path: '/', active: true }];

   

    
    // get Categories
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.Template_List = this.fb.group({ 
      // id:[''],
      Temp_name: ['', Validators.required],
      Temp_img: ['',Validators.required],
      // Temp_number: ['', Validators.required],
      Temp_alt_img:['', Validators.required],
      Temp_headers:['', Validators.required],

      active_status: [false, Validators.required],
    });
   
    this.TempServ.getTemplate().subscribe(
      (data: AddTemplate[]) => {
        this.addtemplates = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        this.loading = false;
      }
    );

    
    
   
  };

  // onSelectionChange(event: any): void {
  //   const selectedValue = event.target.value; 
  //   this.selectedOptions.push(selectedValue);
  //   this.contacts = this.contacts.filter(contact => contact.t_role !== selectedValue);
  // }

  // cancelSelection(option: string): void {
  //   this.selectedOptions = this.selectedOptions.filter(item => item !== option);
  // }
  
  
 


  TemplateForm() {
    this.TempServ.createTemplate(this.Template_List.value)
    .subscribe(response => {
      console.log('Contact added successfully:', response);
    }, error => {
      console.error('contact adding testimonial:', error);
    });
    this.closeTemplateModal();
    this._fetchData();
  }
  
  
  
  _fetchData(): void {
    this.TempServ.getTemplate().subscribe((data: any) =>{
      if(data.length > 0) {
        this.records =  data;
      }
    });

   
  }

  initTableCofig(): void {
    this.columns = [
      {
        name: 'Temp_id',
        label: 'AddTemplate ID',
        formatter: this.AddTemplateIDFormatter.bind(this)
      },
      {
        name: 'Temp_name',
        label: 'Name',
        formatter: (order: AddTemplate) => order.Temp_name
      }, 
      {
        name: 'Temp_img',
        label: 'Img Url',
        formatter: (order: AddTemplate) => order.Temp_img
      },
      {
        name: 'Temp_Temp_headers',
        label: 'Context',
        formatter: (order: AddTemplate) => order.Temp_headers
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.AddTemplateActiveStatusFormatter.bind(this)
      },
    ];
  }

  getTotalSelected(selectedOptions: any[]): string {
    return selectedOptions ? selectedOptions.length.toString() : '0';
  }

  
  AddTemplateIDFormatter(data: AddTemplate): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

    
  AddTemplateActiveStatusFormatter(data: AddTemplate): any {
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
  
  matches(row: AddTemplate, term: string) {
    return (
      row.id?.toString().includes(term) ||
      row.Temp_name.toLowerCase().includes(term) ||
      row.Temp_img.toLowerCase().includes(term) ||
      row.Temp_alt_img.toLowerCase().includes(term) ||
      row.Temp_headers.toLowerCase().includes(term) ||
      
      this._matchesActiveStatus(row, term)
    );
  }
  
  // searchData(searchTerm: string): void {
  //   console.log('Search Term:', searchTerm);
  //   if (searchTerm === '') {
  //     this._fetchData();
  //   } else {
  //     searchTerm = searchTerm.toLowerCase();
  //     this.records = this._filterData(this.records, searchTerm);
  //   }
  // }

  
  private _filterData(data: AddTemplate[], term: string): AddTemplate[] {
    return data.filter((item: AddTemplate) => this._itemMatches(item, term));
  }
  
  private _itemMatches(item: AddTemplate, term: string): boolean {
    const matchesId = item.id?.toString().includes(term);
    const matchesTempName = item.Temp_name.toLowerCase().includes(term);
    const matchesTempImg = item.Temp_img.toLowerCase().includes(term);
    const matchesTempAltImg = item.Temp_alt_img.toLowerCase().includes(term);

    // const matchesUnqCatName = item.Temp_number.toLowerCase().includes(term);
    const matchesTempBodyText = item.Temp_headers.toLowerCase().includes(term);
    const matchesActiveStatus = this._matchesActiveStatus(item, term);
  
    return (
      matchesId ||
      matchesTempName ||
      matchesTempImg ||
      matchesTempBodyText ||
      matchesTempAltImg ||
      matchesActiveStatus
    );
  }
  
  private _matchesActiveStatus(item: AddTemplate, term: string): boolean {
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
     this.TempServ.deleteTemplate(this.categoryDeleteID).subscribe(
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
    this.TempServ.deleteTemplate(this.categoryDeleteID).subscribe( (val) => {
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
    this.closeTemplateModal();
    
  }

 
  openAddCategoryModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetCategoryForm();
    this.openCategoryModal(content);
  }

  openCategoryModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  closeTemplateModal(): void {
    this.modalService.dismissAll();
    this.resetCategoryForm();
  }

  
  editCategoryName(data:AddTemplate ) {
    this.modalService.open(this.sizeableModal, { size: 'xl' });
    this.Template_List.patchValue({ ...data });
  }

  UpdateCategory() {
    this.TempServ.UpdateTemplate(this.Template_List.value).subscribe(
      (response) => {
        console.log('Update response:', response);
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
  
  get form1() { return this.Template_List.controls; }

 

  // reset form and file
  resetCategoryForm() {
    // files reset
    this.files = []
    // form reset
    this.Template_List.reset()
  }


}
