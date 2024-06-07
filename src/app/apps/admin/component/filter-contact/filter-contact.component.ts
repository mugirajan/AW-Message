import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Column } from "src/app/shared/advanced-table/advanced-table.component";
import { TESTIMONAILLIST } from "../../../ecommerce/shared/data";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { actionEvent } from "../../models";
import { Testimonial, TestimonialModel2 } from "../../models/testimonial.model";
import { ContactService } from "../../service/testimonial.service";
import { NotificationService } from "src/app/layout/shared/service/notification.service";

@Component({
  selector: 'app-filter-contact',
  templateUrl: './filter-contact.component.html',
  styleUrls: ['./filter-contact.component.scss']
})
export class FilterContactComponent implements OnInit {
  
  records: TestimonialModel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  contactForm!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";

  @ViewChild("advancedTable") advancedTable: any;
  @ViewChild("sizeableModal")
  sizeableModal!: TemplateRef<NgbModal>;

  // Constructor
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private testServ: ContactService,
    private notifyServ: NotificationService
  ) {}

  // OnInit
  ngOnInit(): void {
    this.initTableCofig();
    this._fetchData();

    this.contactForm = this.fb.group({
      id: [""],
      t_name: ["", Validators.required],
      t_role: ["", Validators.required],
      t_date: ["", Validators.required],
      t_marriage: ["", Validators.required],
      t_msg: ["", Validators.required],
      t_address: ["", Validators.required],
      t_city: ["", Validators.required],
      t_gender: ["", Validators.required],
      t_mail: ["", Validators.required],
      t_dob: ["", Validators.required],
      t_endsub: ["", Validators.required],
      t_term: ["", Validators.required],
      active_status: ["", Validators.required],
    });

    {{ this.contactForm.get('t_name.')?.value }}
  }

  _fetchData() {
    this.testServ.getContacts().subscribe(
      (data: any) => {
        this.loading = false;
        let d = new Date();
        d.setMonth(d.getMonth() - 2);
        this.records = data.filter((a: any) => { 
          return new Date(a.t_endsub) > new Date(d);
        })
      }
    );
  }

  initTableCofig(): void {
    this.columns = [
      {
        name: "t_membership",
        label: "Membership ID",
        formatter: (order: Testimonial) => order.t_membership,
      },
      {
        name: "t_name",
        label: "Name",
        formatter: (order: Testimonial) => order.t_name,
      },
      {
        name: "t_role",
        label: "Phone",
        formatter: (order: Testimonial) => order.t_role,
        width: 100,
      },

      {
        name: "t_date",
        label: "Membership Date",
        formatter: (order: Testimonial) => order.t_date,
      },
      {
        name: "active_status",
        label: "Active Status",
        formatter: this.contactsActiveStatusFormatter.bind(this),
      },
    ];
  }

  contactsActiveStatusFormatter(data: Testimonial): any {
    if (data.active_status) {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Active </span></h5>`
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> Inactive </span></h5>`
      );
    }
  }

  /**
   * Match table data with search input
   * @param row Table row
   * @param term Search the value
   */
  matches(row: Testimonial, term: string) {
    return (
      row.id?.toString().includes(term) ||
      row.t_date?.toLowerCase().includes(term) ||
      row.t_name?.toLowerCase().includes(term) ||
      row.t_role?.toLowerCase().includes(term)
    );
  }

  /**
   * Search Method
   */
  searchData(searchTerm: string): void {
    if (searchTerm === "") {
      this._fetchData();
    } else {
      let updatedData = this.records;
      //  filter
      updatedData = updatedData.filter((product) =>
        this.matches(product, searchTerm)
      );
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
    switch (event.action) {
      case "edit":
        this.actionType = "Edit";
        this.editcontactForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }

  sample() {
    this.notifyServ.addNotification({
      id: 2,
      text: "Hello",
      level: "success",
      autohide: true,
      title: "Fusion Fitness",
    });
  }

  /**
   * change order status group
   * @param OrderStatusGroup order status
   */
  changeStatusGroup(OrderStatusGroup: string): void {
    this.loading = true;
    let updatedData = TESTIMONAILLIST;
    //  filter
    updatedData =
      OrderStatusGroup === "All"
        ? TESTIMONAILLIST
        : [...TESTIMONAILLIST].filter((o) =>
            o.active_status?.includes(OrderStatusGroup)
          );
    this.records = updatedData;
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }

  /**
   * Modal methods
   */

  openAddContactModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.openconModal(content);
  }

  openconModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  closeContactModal(): void {
    this.modalService.dismissAll();
  }

  /**
   * Edit form
   */
  editcontactForm(data: Testimonial) {
    this.modalService.open(this.sizeableModal, { size: "xl" });
    this.contactForm.patchValue({ ...data });
  }

  //  convenience getter for easy access to form fields
  get form1() {
    return this.contactForm.controls;
  }


}