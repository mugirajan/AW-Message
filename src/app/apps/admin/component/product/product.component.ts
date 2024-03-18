import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { Subscription } from 'rxjs';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../service/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Product, ProductModel2 } from '../../models/product.model';
import { actionEvent } from '../../models';
// import { Select2Group } from "ng-select2-component";
import { WAMesssagingService } from "../../service/wa.message.service"

import { NotificationService } from 'src/app/layout/shared/service/notification.service';
import { Select2Group, Select2Option, Select2UpdateEvent } from 'ng-select2-component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

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
  senderResource: Select2Group[] = [
    {
        label: 'Kamalraj Ganesan',
        options: [
          { value: "918056221146", label: "Kamalraj Ganesan" }
        ]
    },
  ];
  // message templates
  messageResource: Select2Group[] = [
    {
        label: '',
        options: [
          { value: "custom_msg", label: "Custom Message Template 1" }
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
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private prodServ: ProductService,
    private msgServ: WAMesssagingService,
    private notifyServ: NotificationService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Admin', path: '/apps/' }, { label: 'Custom Template', path: '/', active: true }];
    
    // this.fetchCatgeory();

    // get Testimonials
    this._fetchData();
    this.TemplateForm = this.fb.group({
			sender: ['', Validators.required],
      headerTxt: ['', Validators.required],
		});

    // initialize table configurations
    // this.initTableCofig();

    // product form
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

    // this.resetProductForm();
  }
  // used to get data from db.json file
	_fetchData() {

    // load the senderContact to senderResource variable
    // this.senderResource = ?
  }


  resetMessageForm() {
    this.TemplateForm.reset()
  }
  // set sender details for WA message transfer
	onSenderSelected(da: Select2UpdateEvent) {}

	// set message template details for WA message transfer
	onMessageTemplateSelected(da: Select2UpdateEvent) {}

  // 
  sendMessage() {

    this.msgServ.customTemplate(this.TemplateForm.value['sender'], this.TemplateForm.value['headerTxt']).subscribe( (resp: any) => {
      console.log("Return output: ", resp)
    })
  
  }

  /**
   * fetches table records
   */
}