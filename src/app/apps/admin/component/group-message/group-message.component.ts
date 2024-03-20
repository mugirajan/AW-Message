import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { WAMesssagingService } from "../../service/wa.message.service";
import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-group-message',
  templateUrl: './group-message.component.html',
  styleUrls: ['./group-message.component.scss']
})
export class GroupMessageComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  groupmessageForm!: FormGroup;
  actionType: string = "Add New";
  contacts: any;
  list: any;

  // contacts: any[] =[];

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

  // list:any;


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


    this.http.get<any>('http://localhost:3000/list').subscribe(data => {
      this.list= data;
      data.forEach( (con: any, ind: number) => {
        console.log("ashd",data)
        this.senderResource[0].options.push( 
          { label: con.c_name, value: con.id } 
        )   
      });;
    });

    this.msgServ.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });

    // get Variants
    this._fetchData();

		// product form
		this.groupmessageForm = this.fb.group({
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
    this.groupmessageForm.reset()
  }

	// set sender details for WA message transfer
	onSenderSelected(da: Select2UpdateEvent) {}

	// set message template details for WA message transfer
	onMessageTemplateSelected(da: Select2UpdateEvent) {}

  // 
  sendGroupMessage() {

    // this.msgServ.sendWACustomTemplateMessage(this.groupmessageForm.value['sender'], this.groupmessageForm.value['headerTxt'], this.groupmessageForm.value['message']).subscribe( (resp: any) => {
    //   console.log("Return output: ", resp)
      
    // })

    let data = this.groupmessageForm.value
    console.log("Values: ", data)

    if ( data.sender ) {

      // get list details
      this.http.get("http://localhost:3000/list/"+data.sender).subscribe( (val: any) => {
        val['selectedOptions'].forEach((element: any) => {
          console.log("Contacts : ", element)
          this.http.get("http://localhost:3000/contacts/"+element).subscribe( (cont: any) => {
            this.msgServ.sendWACustomTemplateMessage(cont.t_role, cont.t_name, data.message).subscribe( (ott: any) => {
              console.log(ott)
            })
          })
        });

      })

      // for (const item of this.list) {
      //   for (const selectedOptionId of item.selectedOptions) {
      //     // Find the contact in contacts with matching ID
      //     const contact = this.contacts.find((c: any) => c.id === selectedOptionId);
      //     if (contact) {
      //       // Retrieve t_role associated with the contact
      //       const t_role = contact.t_role;
      //       console.log('t_role:', t_role);
      //     }
      //   }
      // }
    }
    
    if (this.list && this.list.length > 0 && this.contacts && this.contacts.length > 0) {
      for (const item of this.list) {
        for (const selectedOptionId of item.selectedOptions) {
          // Find the contact in contacts with matching ID
          const contact = this.contacts.find((c: any) => c.id === selectedOptionId);
          if (contact) {
            // Retrieve t_role associated with the contact
            const t_role = contact.t_role;
            console.log('t_role:', t_role);
          }
        }
      }
    }
    
  }
 



}
