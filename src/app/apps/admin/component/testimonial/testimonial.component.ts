import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { TESTIMONAILLIST } from '../../../ecommerce/shared/data';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actionEvent } from '../../models';
import { Testimonial, TestimonialModel2 } from '../../models/testimonial.model';
import { TestimonialService } from '../../service/testimonial.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/layout/shared/service/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit {


  pageTitle: BreadcrumbItem[] = [];
  records: TestimonialModel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  testimonialForm!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";
  val2!: Testimonial;
  testimonialSubscription!: Subscription;
  testimoialDeleteID:any;
  testimonial_img:any;

  

  @ViewChild('advancedTable') advancedTable: any;
  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  requestData: any[]=[];
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  testimonialData: any = {};
  
  // Constructor
  constructor(
    private toastServ: ToastrService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private testServ: TestimonialService,
    private notifyServ: NotificationService
  ) { }

  
  // OnInit 
  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage Contacts', path: '/', active: true }];
    
    // get Testimonials
    this._fetchData();

    // initialize table configurations
    this.initTableCofig();

    // product form
    this.testimonialForm = this.fb.group({
      t_id:[''],
      t_name: ['', Validators.required],
      t_role: ['', Validators.required],
      t_date: ['',Validators.required],
      t_msg: ['', Validators.required],
      t_address:['', Validators.required],
      t_city:['', Validators.required],
      t_gender:['', Validators.required],
      t_mail:['', Validators.required],
      active_status: [false, Validators.required],
    });

    this.resetTestimonialForm();

  }
  submitForm() {
    this.testServ.createTestimonial(this.testimonialData)
      .subscribe(response => {
        console.log('Testimonial added successfully:', response);
        // Optionally, handle success response
      }, error => {
        console.error('Error adding testimonial:', error);
        // Optionally, handle error response
      });
  }


  /**
   * fetches table records
   */
  _fetchData(): void {

    // this.records$ = this.testServ._getAllListOfTestimonial();
    // this.testimonialSubscription = this.records$.subscribe( () => {
    // });
    this.testServ.getTestimonials().subscribe((data: any) =>{
      if(data.length > 0) {
        this.records =  data;
      }
    });

    // this.records = TESTIMONAILLIST;
  }

  
  /**
   * initialize advanced table columns
   */
  initTableCofig(): void {
    this.columns = [
      {
        name: 't_id',
        label: 'Contact ID',
        formatter: this.testimonialIDFormatter.bind(this)
      },
      {
        name: 't_name',
        label: 'Name',
        formatter: (order: Testimonial) => order.t_name
      },
      {
        name: 't_msg',
        label: 'Phone',
        formatter: (order: Testimonial) => order.t_msg,
        width: 100
      },
      
      {
        name: 't_date',
        label: 'Date',
        formatter: this.testimonialDateFormatter.bind(this)
      },
      {
        name: 'active_status',
        label: 'Active Status',
        formatter: this.testimonialActiveStatusFormatter.bind(this)
      },
    ];
  }


  // formats testimonial ID cell
  testimonialIDFormatter(data: Testimonial): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

  //formats testimonial image cell
  testimonialImageFormatter(data: Testimonial): any {
    let image: string = ``;
    // image = `<a href="javascript:void(0)"><img src="${data.t_img}" alt="attestant-img" height="32" /></a>`
    image = `<a href="javascript:void(0)"><img src="${"http://festasolar.com/"+data.t_img.replace("img/stock/", "")}" alt="attestant-img" height="32" /></a>`
    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

  // formats order date cell
  testimonialDateFormatter(data: Testimonial): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `${data.t_date}`
    );
  }

  // formats payment status cell
  testimonialActiveStatusFormatter(data: Testimonial): any {
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
  matches(row: Testimonial, term: string) {
    return row.id?.toString().includes(term)
      || row.t_date?.toLowerCase().includes(term)
      || row.t_name?.toLowerCase().includes(term)
      || row.t_role?.toLowerCase().includes(term)
      || row.t_msg?.toLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = this.records;
      //  filter
      updatedData = updatedData.filter(product => this.matches(product, searchTerm));
      this.records = updatedData;
      // this.records$ = updatedData;
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
        this.actionType = "Edit";
        this.editTestimonialForm(event.record);
        break;
      case "delete":
        this.actionType = "Delete";
        this.deleteTestimonialForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }


  //To Confirm delete action
  deleteTestimonialForm(record: any) {
    this.testimoialDeleteID = record.id;
    this.openVerticallyCentered(this.positionModal);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedTestimonial(){
    this.testServ.deleteTestimonial(this.testimoialDeleteID).subscribe( (val) => {
      if(val['isSuccess'] == true) {
        this.notifyServ.addNotification(
          {
            text: "Testimonial Deleted Successfully",
            level: "success",
            autohide: true,
          }
        );
      }
      else{
        this.notifyServ.addNotification(
          {
            text: "Error while deleting testimonial",
            level: "error",
            autohide: true,
          }
        );
      }
      this._fetchData();
    });
    this.testimoialDeleteID = -1;
    this.closeTestimonialModal();
  }

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
   * change order status group
   * @param OrderStatusGroup order status
   */
  changeStatusGroup(OrderStatusGroup: string): void {
    this.loading = true;
    let updatedData = TESTIMONAILLIST;
    //  filter
    updatedData = OrderStatusGroup === "All" ? TESTIMONAILLIST : [...TESTIMONAILLIST].filter((o) => o.active_status?.includes(OrderStatusGroup))
    this.records = updatedData;
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }



  /**
   * Modal methods
   */

  //  opens add modal
  openAddTestimonialModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resetTestimonialForm();
    this.openTestimonialModal(content);
  }

  //  Open testimonial modal
  openTestimonialModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  //  close testimonial modal
  closeTestimonialModal(): void {
    this.modalService.dismissAll();
    this.resetTestimonialForm();
  }

  /**
   * Edit form
   */
  editTestimonialForm(data: Testimonial) {
    this.modalService.open(this.sizeableModal, { size: "xl" });
    this.testimonialForm.setValue(
      {
        t_id:data.id,
        t_name: data.t_name,
        t_role: data.t_role,
        t_date: data.t_date,
        t_msg: data.t_msg,
        active_status: data.active_status,
      }
    )
    this.testimonial_img = data.t_img;
    let testimg = this.srcToFile(
              this.testimonial_img, 
              this.testimonial_img.split('/').pop(),
              'image/'+this.testimonial_img.split('/').pop().split('.')[1]);

    testimg.then((value)=>{
      this.files.push(value)
    })

  }

  
  /**
   * Form methods
   */
  
  //  convenience getter for easy access to form fields
  get form1() { return this.testimonialForm.controls; }

  //  adds new file in uploaded files
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
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

  //  returns the preview url
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }

  //  get testimonial form values
  gettestimonialFormValue() {
    return this.testimonialForm.value;
  }

  //  gets the form details
  submittestimonialFormForm(modal: TemplateRef<NgbModal>) {
    
    // prepping data for service
    let data:Testimonial = this.testimonialForm.value;
    data.t_img_file = this.files[0];

    if(this.actionType == "Add New")
    {
      this.testServ.putATestiomonial(data).subscribe( (val) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Testimonial Created Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while creating testimonial",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetTestimonialForm();
      this.closeTestimonialModal();
    }
    else if(this.actionType == "Edit"){
      this.testServ.updateATestimonial(data).subscribe( (val) => {
        if(val['isSuccess'] == true) {
          this.notifyServ.addNotification(
            {
              text: "Testimonial Update Successfully",
              level: "success",
              autohide: true,
            }
          );
        }
        else{
          this.notifyServ.addNotification(
            {
              text: "Error while Updating testimonial",
              level: "error",
              autohide: true,
            }
          );
        }
        this._fetchData();
      });
      this.resetTestimonialForm();
      this.closeTestimonialModal();
    }
    
    // this._fetchData();
    
  }

  // reset form and file
  resetTestimonialForm() {
    // files reset
    this.files = []
    // form reset
    this.testimonialForm.reset()
  }

  srcToFile(src:any, fileName:any, mimeType:any){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
  }

}
