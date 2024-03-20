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
import { HttpClient } from '@angular/common/http';


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
  ScheduleList!: FormGroup;
  actionType: string = "Add New";
  variantDeleteID: any;
  categoryResource: any = [];
  // categories: Select2Group[] = [
  //   {
  //       label: '',
  //       options: [
  //       ]
  //   },
  // ];
  // products: Select2Group[] = [
  //   {
  //       label: '',
  //       options: [
  //       ]
  //   },
  // ];
  specLabels: any = [];
  idFormBasedOnCategory!: boolean;
  selectedCategory: Select2Option[] = [];
  selectProduct: any;
  selectedProduct: Select2Option[] = [];
  list: any[] = [];

  selectedGroupName: string = ''; 
  
  

  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;

  selectedOptions: string[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private varServ: VariantService,
    private notifyServ: NotificationService,
    private formServ: DynaFormService,
    private http: HttpClient,
  ) { }

  // OnInit 
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage variant', path: '/', active: true }];
    
    this.http.get<any>('http://localhost:3000/list').subscribe(data => {
      this.list = data.list;
    });
  
    this.varServ.getList().subscribe(list => {
      this.list = list;
    });
   
    this._fetchData();

    
    this.initTableCofig();

    
    this.ScheduleList = this.fb.group({
      id: [''],
      Body_Text: ['', Validators.required],
      group_id: ['', Validators.required],
      group_name:['', Validators.required],
      active_status: ['', Validators.required],
      selectedDate: ['', Validators.required]
    });

    this.resetScheduleList();


  }



  onGroupNameSelect(event: any): void {
    const selectedId = event.target.value;
    const selectedGroup = this.list.find(group => group.id === selectedId);
    if (selectedGroup) {
      this.selectedGroupName = selectedGroup.c_name;
      this.ScheduleList.patchValue({
        group_name: this.selectedGroupName
      });
    }
  }
  ScheduleForm() {
    const formData = this.ScheduleList.value;
    this.varServ.createSchedule(formData).subscribe(response => {
      this.ScheduleList.reset();
      this.selectedGroupName = '';
     
    }, error => {
      console.error('Error adding List:', error);
    });
  
    this.closeVariantModal();
    this._fetchData();
  }

  
  
  _fetchData(): void {
    this.varServ.getSchedule().subscribe((data: any) =>{
      if(data.length > 0) {
        this.records =  data;
      }
    });
  }
 
  
  
 
  initTableCofig(): void {
    this.columns = [
      {
        name: 'id',
        label: 'Id',
        formatter: (a: Variant) => a.id
      },
      {
        name: 'group_name',
        label: 'Group Name',
        formatter: (a: Variant) => a.group_name
      },
      {
        name: 'Body_Text',
        label: 'Body_Text',
        formatter: (a: Variant) => a.Body_Text
      },
  
      {
        name: 'Selected_Date',
        label: 'Selected Date',
        formatter: (a: Variant) => a.selectedDate
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.variantActiveStatusFormatter.bind(this)
      },
    ];
  }  
  

  
  variantActiveStatusFormatter(data: Variant): any {
    if (data.active_status) {
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
      row.Body_Text?.toString().toLowerCase().includes(term) || 
      row.category?.toLowerCase().toString().includes(term) || 
      row.cate_id?.toString().toLowerCase().includes(term)
          
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
        this.editScheduleList(event.record);
        break;
      case "delete":
        this.actionType = "Delete";
        this. deleteVariant(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
}

  showEditDisabledDialogue() {
    this.openVerticallyCentered(this.positionModal2);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deleteVariant(variant: any) {
    this.variantDeleteID = variant.id;
    this.openVerticallyCentered(this.positionModal);
  }

  deletedSeletedVariant() {
    this.varServ.deleteVariant(this.variantDeleteID).subscribe(
      (response) => {
        if (response['isSuccess'] == true) {
          this.notifyServ.addNotification({
            text: "Variant Deleted Successfully",
            level: "success",
            autohide: true,
          });
        } else {
          // this.notifyServ.addNotification({
          //   text: "Error while deleting variant",
          //   level: "error",
          //   autohide: true,
          // });
        }
        this._fetchData(); 
      },
      (error) => {
        console.error('Error deleting variant:', error);
      }
    );
    this.variantDeleteID = -1; 
    this.closeVariantModal(); 
  }
  
  openAddVariantModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetScheduleList();
    this.openVariantModal(content);
  }

  
  openVariantModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  
  closeVariantModal(): void {
    this.modalService.dismissAll();
    this.resetScheduleList();
  }

  editScheduleList(data: any) {
    this.resetScheduleList();
    this.modalService.open(this.sizeableModal, { size: 'xl' });
  
    this.ScheduleList.patchValue({
      id: data.id,
      group_id: data.group_id,
      Body_Text: data.Body_Text,
      selectedDate: data.selectedDate,
      active_status: data.active_status ? 'true' : 'false', 
    });
    this.varServ.UpdateSchedule(this.ScheduleList.value).subscribe(
      response => {
        console.log('updated successfully:', response);
      },
      error => {
        console.error('Error updating variant:', error);
      }
    );
    
    
  }
  
  
  getScheduleListValue(): any {
    return this.ScheduleList.value;
  }

  resetScheduleList() {
    this.ScheduleList.reset()
  }


}
