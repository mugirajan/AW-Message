import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { WAMesssagingService } from "../../service/wa.message.service";
import { ContactService } from '../../service/testimonial.service';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';


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

  contacts: any[] = [];

  // senders

  senderResource: any[] = [
    {
      label: 'Select receivers...',
      options: [
        // { value: "918056221146", label: "Kamalraj Ganesan" }
      ]
    },
  ];

  selectedSender: Select2Option[] = [];
  selectedMessage: Select2Option[] = [];


  // localhost URL
  url = "https://fusion24fitness-avadi.blackitechs.in/api_avd/";
  //Production URL
  // url = "http://13.126.175.153/";


  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;
  selectedValue: string | undefined;



  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private msgServ: WAMesssagingService,
    private conserv: ContactService,
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Custom Message', path: '/', active: true }];

    this.http.get<any[]>(this.url+'lists/getLists.php').subscribe((response:any) => {
      if (response.success) {
        if (response.data.length > 0) {
          this.senderResource[0].options = [];
          response.data.forEach((con: any) => {
            this.senderResource[0].options.push({ label: con.c_name, value: con.id, id: con.id });
          });
        } else {
          console.warn("No categories found.");
        }
      } else {
        console.error("Error:", response.message); // Handle the error message
      }
      
    });

    this._fetchData();

    this.messageForm = this.fb.group({
      sender: ['', Validators.required],
      headerTxt: ['', Validators.required],
      message: ['', Validators.required],
    });
    this.resetMessageForm();
  }


  _fetchData() {

  }

  resetMessageForm() {
    this.messageForm.reset()
  }

  onSenderSelected(da: Select2UpdateEvent): void {
    this.selectedValue = da.options[0].id;
  }



  onMessageTemplateSelected(da: Select2UpdateEvent) {
    console.log('onMessageTemplateSelected', da)
  }

  // 
  sendMessage(): void {
    const msg = this.messageForm.value.message;
    const selectedSenderValue = this.messageForm.value.sender

    this.http.get<any>(this.url+'list/'+this.selectedValue).subscribe((item) => {
      const selectedOptions: string[] = item.selectedOptions;
      selectedOptions.forEach(id => {
        this.http.get<any>(this.url+'contacts/'+id).subscribe((data) => {
          this.msgServ.customTemplate(data.t_role, data.t_name, msg).subscribe((resp: any) => {
            this.toastr.success('Message sent successfully!');
            this.resetMessageForm()
          });
        });
      });
    });
  }

}












