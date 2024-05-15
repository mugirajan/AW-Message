import { Component, OnInit, TemplateRef, ViewChild,ElementRef } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../service/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductModel2 } from '../../models/product.model';
import { WAMesssagingService } from "../../service/wa.message.service"

import { NotificationService } from 'src/app/layout/shared/service/notification.service';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';

import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'automat-temp',
  templateUrl: './automat-temp.html',
  styleUrls: ['./automat-temp.scss']
})

export class automatTempComponent  implements OnInit {
    messageForm!: FormGroup;
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
          label: 'Kamalraj Ganesan',
          options: [
          ]
      },
    ];
    senderResourcelist: Select2Group[] = [
      {
          label: 'Mugilavathi',
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
  
  
    constructor(
      private toastr: ToastrService,
      private sanitizer: DomSanitizer,
      private modalService: NgbModal,
      private fb: FormBuilder,
      private conserv: ContactService,
      private prodServ: ProductService,
      private msgServ: WAMesssagingService,
      private notifyServ: NotificationService,
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

      //list started

      this.http.get<any[]>('http://localhost:3000/list').subscribe(data => {
      this.senderResourcelist[0].options = [];
    
      data.forEach((con: any) => {
          this.senderResourcelist[0].options.push({ label: con.c_name, value: con.c_selected });
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
    onSenderSelected(da: Select2UpdateEvent) {}
  
    onMessageTemplateSelected(da: Select2UpdateEvent) {}
  
    sendMessage() {
      this.msgServ.customTemplate(this.TemplateForm.value['sender'], this.TemplateForm.value['headerTxt']).subscribe(
        (resp: any) => {
          this.toastr.success('Message sent successfully!');
          this.resetMessageForm();
        },
        (error) => {
          this.toastr.error('Failed to send message.');
        }
      );
    }

    sendMessagelist(): void {
      const headerTxt = this.messageForm.value.headerTxt;
      const msg = this.messageForm.value.message;
      const selectedSenderValue = this.messageForm.value.sender;
  
      const phoneNumbers = selectedSenderValue.split(',');
  
      phoneNumbers.forEach((phoneNumber:any) => {
        const trimmedPhoneNumber = phoneNumber.trim(); 
  
        this.msgServ.sendWACustomTemplateMessage(trimmedPhoneNumber, headerTxt, msg).subscribe(
          (resp: any) => {
            this.toastr.success('Message sent successfully!');
            this.resetMessageForm()
  
            console.log(`Message sent successfully to ${trimmedPhoneNumber}`);
          },
          (error: any) => {
            this.toastr.error('Failed to send message.');
            console.error(`Error sending message to ${trimmedPhoneNumber}:`, error);
          }
        );
      });
    }

  }