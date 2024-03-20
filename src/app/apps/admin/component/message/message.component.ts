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

  senderResource: Select2Group[] = [
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
  sendMessage() {

    this.msgServ.sendWACustomTemplateMessage(this.messageForm.value['sender'], this.messageForm.value['headerTxt'], this.messageForm.value['message']).subscribe( (resp: any) => {
      console.log("Return output: ", resp)
    })
  }


}
