import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModel2 } from '../../models/product.model';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { HttpClient } from '@angular/common/http';
import { WAMesssagingService } from '../../service/wa.message.service';
import { sendCustomService } from '../../service/sendcustom-message.service';
import { sendCustom } from '../../models/autotemp.model';
import { Observable } from 'rxjs';


import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sendcustom-Message',
  templateUrl: './sendcustom-Message.html',
  styleUrls: ['./sendcustom-Message.scss']
})

export class sendcustomMessage implements OnInit {
  messageForm!: FormGroup;
  sendCustom!: FormGroup;
  storedData: sendCustom[] = [];
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
  productDeleteID: any;
  TemplateForm!: FormGroup;
  templateform!: FormGroup;
  contacts: any[] = [];
  // localhost URL
  // url = "http://localhost:3000/";
  //Production URL
  url = "http://13.235.132.13/";


  senderResource: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  senderResourcelist: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  senderResourcelistarray: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  senderResourcecontactarray: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  senderResourceMessage: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  contactID: any[] = [];
  listID: string[] = [];
  categoryDeleteID: any;
  selectedSender: Select2Option[] = [];
  selectedMessage: Select2Option[] = [];

  cat_resource: Category[] = [];
  categories: Select2Group[] = [
    {
      label: '',
      options: [
      ]
    },
  ];
  canSubmit: boolean = true;
  requestData: any[] = [];

  @ViewChild('advancedTable')
  advancedTable: any;

  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;

  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;

  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;

  selectedLabel: any;
  selectedValue: any | undefined;



  constructor(
    private sendCustomService: sendCustomService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private msgServ: WAMesssagingService,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Default Message', path: '/', active: true }];

    this.http.get<any>(this.url + 'contacts').subscribe(data => {
      data.forEach((con: any, ind: number) => {
        this.senderResource[0].options.push(
          { label: con.t_name, value: con.t_role }
        )
      });;
    });



    this.msgServ.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });

    this._fetchData();

    this.TemplateForm = this.fb.group({
      sender: ['', Validators.required],
      headerTxt: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.productForm = this.fb.group({
      p_id: [''],
      p_name: ['', Validators.required],
      p_uni_code: ['', Validators.required],
      p_shrt_desc: ['', Validators.required],
      p_desc: ['', Validators.required],
      p_category: ['', Validators.required],
      p_kypts: ['', Validators.required],
      p_order: ['', Validators.required],
      is_ft_prod: ['', Validators.required],
      active_status: [false, Validators.required],
      catlogue_status: [false, Validators.required],
      datasheet_status: [false, Validators.required],
    });

    //date and time
    this.sendCustom = this.fb.group({
      cont_list: [''],
      custom_template: ['']
    });

    //template start
    this.http.get<any[]>(this.url + 'template').subscribe(data => {
      console.log("temp data :", data)
      this.senderResourceMessage[0].options = [];
      data.forEach((cus: any) => {
        this.senderResourceMessage[0].options.push({ label: cus.temp_name, value: cus.temp_body, id: cus.id });
      });
    });

    this.templateform = this.fb.group({
      temp_name: [''],
      temp_body: ['']
    })
    //template end

    //list started

    this.http.get<any[]>('list').subscribe(data => {
      this.senderResourcelist[0].options = [];
      data.forEach((con: any) => {
        this.senderResourcelist[0].options.push({ label: con.c_name, value: con.id, id: con.id });
      });
    });

    //list 
    this.http.get<any[]>(this.url + 'list').subscribe(data => {
      console.log("list data :", data);
      this.senderResourcelistarray[0].options = [];
      data.forEach((con: any) => {
        console.log("hello",con.selectedOptions);

        this.senderResourcelistarray[0].options.push({ label: con.c_name, value: con.selectedOptions });
      });
    });

    //contact id array
    this.http.get<any>(this.url + 'contacts').subscribe(data => {
      data.forEach((con: any) => {
        this.senderResourcecontactarray[0].options.push({ label: con.t_name, value: con.id });
      });
      this.contactID = this.contactID.concat(data.map((con: any) => [con.id]));
      console.log('contact id', this.contactID);
    });

    // get Variants
    this.fetchData();

    // product form
    this.messageForm = this.fb.group({
      sender: ['', Validators.required],
      headerTxt: ['', Validators.required],
      message: ['', Validators.required],
    });
    this.resetMessageForm();
    //list end
  }
  _fetchData() {

  }



  resetMessageForm() {
    this.TemplateForm.reset()
  }

  // onSenderSelected(da: Select2UpdateEvent) {
  //   this.selectedValue = da.options[0].id;
  // }
  onSenderSelectedarray(da: Select2UpdateEvent) {
    console.log('Selected da:', da.options[0].id);
    this.selectedValue = da.options[0].id;
  }
  // onSenderSelectedcontact(da:Select2UpdateEvent){
  //   this.selectedLabel = da.options[0].label;
  // }
  onSenderSelectedcontactarray(da: Select2UpdateEvent) {
    const selectedarray = da.options[0].id;
    this.contactID.push(selectedarray);
    // console.log('Selected values:', this.contactID);
  }
  onSenderCustomMessage(da: Select2UpdateEvent) {
    // this.selectedValue = da.options[0].id;
  }



  onMessageTemplateSelected(da: Select2UpdateEvent) {

  }
  onMessageChange(event: Event): void {
    const selectedcon = (event.target as HTMLSelectElement).value;
    this.TemplateForm.patchValue({ message: selectedcon });
  }

  sendMessage() {
    console.log("sender", this.TemplateForm.value)
    const msg = this.TemplateForm.value.message;
    this.msgServ.sendWACustomTemplateMessage(
      this.TemplateForm.value['sender'], this.selectedLabel, this.TemplateForm.value['message']
    ).subscribe(
      (resp: any) => {
        if (resp) {
          this.toastr.success('Message sent successfully!');
          this.resetMessageForm()
        }
        else {
          this.toastr.error('Message not sent!');
        }
      }

    );
  }


  sendMessagelist(): void {
    const msg = this.messageForm.value.message;
    const selectedSenderValue = this.messageForm.value.sender
    console.log("selected value ", this.selectedValue)
    this.http.get<any>(this.url + `list/${this.selectedValue}`).subscribe((item) => {
      const selectedOptions: string[] = item.selectedOptions;
      selectedOptions.forEach(id => {
        this.http.get<any>(this.url + `contacts/${id}`).subscribe((data) => {
          this.msgServ.sendWACustomTemplateMessage(data.t_role, data.t_name, msg).subscribe((resp: any) => {
            this.toastr.success('Message sent successfully!');
            this.resetMessageForm()
          });
        });
      });
    });
  }

  //radio button for contact or list

  showContactDropdown: boolean = false;
  showListDropdown: boolean = false;

  toggleDropdown(selection: string): void {
    if (selection === 'contact') {
      this.showContactDropdown = true;
      this.showListDropdown = false;
    } else if (selection === 'list') {
      this.showContactDropdown = false;
      this.showListDropdown = true;
    }
  }

  //radio button for custom or fb template

  submitSendCustom() {
    if (this.sendCustom.valid) {
      const formData = this.sendCustom.value;
      formData.cont_list = Array.isArray(formData.cont_list) ? formData.cont_list : [formData.cont_list];
      this.http.post<sendCustom>(this.url + 'sendCustom', formData).subscribe(data => {
        this.storedData.push(data);
        this.sendCustom.reset();
      });
    }
  }


  fetchData() {
    this.http.get<sendCustom[]>(this.url + 'sendCustom').subscribe(data => {
      this.storedData = data;
    });
  }


  deleteTemp(id: string): Observable<void> {
    return this.http.delete<void>(this.url + 'sendCustom/' + id);
  }

  deleteAutoTemp(id: string): void {
    this.deleteTemp(id).subscribe(
      () => {
        this.storedData = this.storedData.filter(item => item.id !== id);
        this.toastr.success('Item deleted successfully!');
      },
      (error) => {
        console.error('Error deleting item:', error);
        this.toastr.error('Failed to delete item. Please try again.');
      }
    );
  }


}