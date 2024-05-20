import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModel2 } from '../../models/product.model';
import { Select2Group, Select2Option, Select2UpdateEvent} from 'ng-select2-component';
import { HttpClient } from '@angular/common/http';
import { WAMesssagingService } from '../../service/wa.message.service';
import { AutoTempService } from '../../service/automat.service';
import { AutoTemp } from '../../models/autotemp.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'automat-temp',
  templateUrl: './automat-temp.html',
  styleUrls: ['./automat-temp.scss']
})

export class automatTempComponent  implements OnInit {
    messageForm!: FormGroup;
    datetimeForm!: FormGroup;
    storedData: AutoTemp[] = [];
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
    TemplateForm!: FormGroup;
    contacts: any[] =[];
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
    selectedSender: Select2Option[] = [];
    selectedMessage: Select2Option[] = [];
  
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
  
    selectedLabel:any;
    selectedValue: string | undefined;

    

    constructor(
      private autoTempService: AutoTempService,
      private toastr: ToastrService,
      private fb: FormBuilder,
      private msgServ: WAMesssagingService,
      private http: HttpClient) { }
  
    ngOnInit(): void {
  
      this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Default Message', path: '/', active: true }];

      this.http.get<any>('http://localhost:3000/contacts').subscribe(data => {
        data.forEach( (con: any, ind: number) => {
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

      //date and time
      this.datetimeForm = this.fb.group({
        d_id:[''],
        date: ['', Validators.required],
        time: ['', Validators.required]
      });
  

      //list started

      this.http.get<any[]>('http://localhost:3000/list').subscribe(data => {
      this.senderResourcelist[0].options = [];
          data.forEach((con: any) => {
            this.senderResourcelist[0].options.push({ label: con.c_name, value:con.id, id:con.id });
          });
    });
    

    // get Variants
    this._fetchData();

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
    
    onSenderSelected(da: Select2UpdateEvent) {
      this.selectedValue = da.options[0].id;
    }
    onSenderSelectedcontact(da:Select2UpdateEvent){
      this.selectedLabel = da.options[0].label;
    }

  
    onMessageTemplateSelected(da: Select2UpdateEvent) {

    }
    onMessageChange(event: Event): void {
      const selectedcon = (event.target as HTMLSelectElement).value;
      this.TemplateForm.patchValue({ message: selectedcon });
    }
    
    sendMessage() {
      console.log("sender" , this.TemplateForm.value)
      const msg = this.TemplateForm.value.message;
      this.msgServ.sendWACustomTemplateMessage(
        this.TemplateForm.value['sender'], this.selectedLabel, this.TemplateForm.value['message']
      ).subscribe(
        (resp: any) => {
          if(resp){
          this.toastr.success('Message sent successfully!');
          this.resetMessageForm()
          }
          else{
            this.toastr.error('Message not sent!');
          }
        }
        
      );
    }

    
    sendMessagelist(): void {
      const msg = this.messageForm.value.message;
      const selectedSenderValue = this.messageForm.value.sender
  
      this.http.get<any>(`http://localhost:3000/list/${this.selectedValue}`).subscribe((item) => {
        const selectedOptions: string[] = item.selectedOptions;
        selectedOptions.forEach(id => {
          this.http.get<any>(`http://localhost:3000/contacts/${id}`).subscribe((data) => {
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

    showCustomDropdown: boolean = false;
    showTemplateDropdown: boolean = false;

    toggledown(selection: string): void {
      if (selection === 'custom') {
          this.showCustomDropdown = true;
          this.showTemplateDropdown = false;
      } else if (selection === 'template') {
          this.showCustomDropdown = false;
          this.showTemplateDropdown = true;
      }
    }

    //schedule form 
    submitdatetimeForm() {
      if (this.datetimeForm.valid) {
        this.autoTempService.createAutoTemp(this.datetimeForm.value).subscribe((data:any) => {
          this.storedData.push(data)
          this.datetimeForm.reset();
        });
      }
    }
  
    fetchData() {
      this.autoTempService.getAutoTemps().subscribe(data => {
        this.storedData = data;
      });
    }
  
    deleteAutoTemp(id: number) {
      this.autoTempService.deleteAutoTemp(id).subscribe(() => {
        this.storedData = this.storedData.filter(item => item.id !== id);
      });
    }
  
    editAutoTemp(autoTemp: AutoTemp) {
      this.datetimeForm.patchValue(autoTemp);
    }
  
    updateDatetimeForm() {
      if (this.datetimeForm.valid) {
        this.autoTempService.updateAutoTemp(this.datetimeForm.value).subscribe(data => {
          const index = this.storedData.findIndex(item => item.id === data.id);
          if (index !== -1) {
            this.storedData[index] = data;
          }
          this.datetimeForm.reset();
        });
      }
    }
  }