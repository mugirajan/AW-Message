import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

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
  // senders
  senderResource: Select2Group[] = [
    {
        label: '',
        options: [
        ]
    },
  ];
  // message templates
  messageResource: Select2Group[] = [
    {
        label: '',
        options: [
        ]
    },
  ];
  selectedSender: Select2Option[] = [];
  selectedMessage: Select2Option[] = [];


  @ViewChild('sizeableModal')
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal')
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild('positionModal2')
  positionModal2!: TemplateRef<NgbModal>;
  

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { 

  }

  ngOnInit(): void {
    
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Manage variant', path: '/', active: true }];

    // get Variants
    this._fetchData();

		// product form
		this.messageForm = this.fb.group({
			id: [''],
			message: ['', Validators.required],
			template: ['', Validators.required],
			sender: ['', Validators.required]
		});
		this.resetVariantForm();
  }


	// used to get data from db.json file
	_fetchData() {}


	// reset form and file
  resetVariantForm() {
    this.messageForm.reset()
  }

	// set sender details for WA message transfer
	onSenderSelected(da: Select2UpdateEvent) {}

	// set message template details for WA message transfer
	onMessageTemplateSelected(da: Select2UpdateEvent) {}


}
