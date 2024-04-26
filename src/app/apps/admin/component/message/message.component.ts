import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { WAMesssagingService } from "../../service/wa.message.service";
import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  messageForm!: FormGroup;
  actionType: string = "Add New";

  contacts: any[] =[];

  // senders

  senderResource: any[] = [
    {
        label: 'Select receivers...',
        options: [
          // { value: "918056221146", label: "Kamalraj Ganesan" }
        ]
    },
  ];
 
  // messageResource: Select2Group[] = [
  //   {
  //       label: '',
  //       options: [
  //         { value: "custom_msg", label: "Custom Message Template 1" }
  //       ]
  //   },
  // ];
  selectedSender: Select2Option[] = [];
  selectedMessage: Select2Option[] = [];

  


  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;
  

  constructor(
    private fb: FormBuilder,
    private msgServ: WAMesssagingService,
    private conserv: ContactService,
    private http: HttpClient
  ) { 

  }

  ngOnInit(): void {
    
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Custom Message', path: '/', active: true }];

    this.http.get<any[]>('http://localhost:3000/list').subscribe(data => {
      this.senderResource[0].options = [];
    
      data.forEach((con: any) => {
        this.senderResource[0].options.push({ label: con.c_name, value: con.c_selected });
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
  }


	// used to get data from db.json file
	_fetchData() {

    // load the senderContact to senderResource variable
    // this.senderResource = ?
  }


	// reset form and file
  resetMessageForm() {
    this.messageForm.reset()
  }

	// set sender details for WA message transfer
	onSenderSelected(da: Select2UpdateEvent) {}

	// set message template details for WA message transfer
	onMessageTemplateSelected(da: Select2UpdateEvent) {}

  // 
  sendMessage(): void {
    const headerTxt = this.messageForm.value.headerTxt;
    const msg = this.messageForm.value.message;
    const selectedSenderValue = this.messageForm.value.sender;

    const phoneNumbers = selectedSenderValue.split(',');

    phoneNumbers.forEach((phoneNumber:any) => {
      const trimmedPhoneNumber = phoneNumber.trim(); 

      this.msgServ.sendWACustomTemplateMessage(trimmedPhoneNumber, headerTxt, msg).subscribe(
        (resp: any) => {
          console.log(`Message sent successfully to ${trimmedPhoneNumber}`);
        },
        (error: any) => {
          console.error(`Error sending message to ${trimmedPhoneNumber}:`, error);
        }
      );
    });
  }

}
 


  



