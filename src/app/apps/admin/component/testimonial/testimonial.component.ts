import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Column } from "src/app/shared/advanced-table/advanced-table.component";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { TESTIMONAILLIST } from "../../../ecommerce/shared/data";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { actionEvent } from "../../models";
import { Testimonial, TestimonialModel2 } from "../../models/testimonial.model";
import { ContactService } from "../../service/testimonial.service";
import { Subscription } from "rxjs";
import { NotificationService } from "src/app/layout/shared/service/notification.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-testimonial",
  templateUrl: "./testimonial.component.html",
  styleUrls: ["./testimonial.component.scss"],
})
export class ContactComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  records: TestimonialModel2[] = [];
  columns: Column[] = [];
  loading: boolean = false;
  statusGroup: string = "All";
  pageSizeOptions: number[] = [10, 25, 50, 100];
  contactForm!: FormGroup;
  files: File[] = [];
  actionType: string = "Add New";
  val2!: Testimonial;
  testimonialSubscription!: Subscription;
  testimoialDeleteID: any;
  testimonial_img: any;

  @ViewChild("advancedTable") advancedTable: any;
  @ViewChild("sizeableModal")
  sizeableModal!: TemplateRef<NgbModal>;
  requestData: any[] = [];
  @ViewChild("positionModal")
  positionModal!: TemplateRef<NgbModal>;
  contactData: any = {};

  testimonials: Testimonial[] = [];
  testimonialToDelete: any;
  testimonialId: string | null = null;

  // Constructor
  constructor(
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private testServ: ContactService,
    private notifyServ: NotificationService
  ) {}

  // OnInit
  ngOnInit(): void {
    this.pageTitle = [
      { label: "Admin", path: "/apps/" },
      { label: "Manage Contacts", path: "/", active: true },
    ];

    this._fetchData();

    this.initTableCofig();

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

    this.testServ.getContacts().subscribe(
      (data: Testimonial[]) => {
        this.testimonials = data;
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching contacts:", error);
        this.loading = false;
      }
    );

    this.resetcontactForm();
  }
  submitForm() {
    this.testServ.createContacts(this.contactForm.value).subscribe(
      (response) => {
        console.log("success");
        this._fetchData();
      },
      (error) => {
        console.error("Error in Contact:", error);
        console.log("error");
      }
    );
    this.closeContactModal();
  }

  _fetchData(): void {
    this.testServ.getContacts().subscribe((data: any) => {
      if (data.length > 0) {
        this.records = data;
      }
    });
  }

  initTableCofig(): void {
    this.columns = [
      // {
      //   name: "t_id",
      //   label: "Contact ID",
      //   formatter: this.contactsIDFormatter.bind(this),
      // },
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
        label: "Date",
        formatter: (order: Testimonial) => order.t_date,
      },
      {
        name: "active_status",
        label: "Active Status",
        formatter: this.contactsActiveStatusFormatter.bind(this),
      },
    ];
  }

  contactsIDFormatter(data: Testimonial): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0)" class="order text-body fw-bold" id="${data.id}">#${data.id}</a> `
    );
  }

  contactsImageFormatter(data: Testimonial): any {
    let image: string = ``;
    // image = `<a href="javascript:void(0)"><img src="${data.t_img}" alt="attestant-img" height="32" /></a>`
    image = `<a href="javascript:void(0)"><img src="${
      "http://fusion.com/" + data.t_img.replace("img/stock/", "")
    }" alt="attestant-img" height="32" /></a>`;
    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

  contactsDateFormatter(data: Testimonial): any {
    return this.sanitizer.bypassSecurityTrustHtml(`${data.t_date}`);
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
      case "delete":
        this.actionType = "Delete";
        this.deleteContactForm(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }

  deleteContactForm(record: any) {
    this.testimoialDeleteID = record.id;
    this.openVerticallyCentered(this.positionModal);
  }

  deleteCon() {
    if (this.testimonialId) {
      this.testServ.deleteCon(this.testimonialId).subscribe(
        (response) => {
          this.toastr.success("Delete successful!");
          console.log("Delete successful", response);
        },
        (error) => {
          this.toastr.success("Error deleting contact!");
          console.error("Error deleting contact", error);
        }
      );
    } else {
      console.error("contact missing.");
    }
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deletedSeletedContact() {
    this.testServ.deleteCon(this.testimoialDeleteID).subscribe((val) => {
      this.toastr.success("Delete successful!");

      if (val["isSuccess"] == true) {
        this.notifyServ.addNotification({
          text: "contact Deleted Successfully",
          level: "success",
          autohide: true,
        });
      } else {
      }
      this._fetchData();

    });
    this.testimoialDeleteID = -1;
    this.closeContactModal();
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
    this.resetcontactForm();
    this.openconModal(content);
  }

  openconModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  closeContactModal(): void {
    this.modalService.dismissAll();
    this.resetcontactForm();
  }

  /**
   * Edit form
   */
  editcontactForm(data: Testimonial) {
    this.modalService.open(this.sizeableModal, { size: "xl" });
    this.contactForm.patchValue({ ...data });
  }

  updateContact() {
    this.testServ.updateContact(this.contactForm.value).subscribe(
      (response) => {
        this.toastr.success("update successfully!");
        this._fetchData();
      },
      (error) => {
        this.toastr.error("error");
      }
    );
  }

  //  convenience getter for easy access to form fields
  get form1() {
    return this.contactForm.controls;
  }

  //  adds new file in uploaded files
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  //  removes file from uploaded files
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  //  formats the size
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  //  returns the preview url
  getPreviewUrl(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  getcontactFormValue() {
    return this.contactForm.value;
  }

  //  gets the form details
  submitcontactForm(modal: TemplateRef<NgbModal>) {
    // prepping data for service
    let data: Testimonial = this.contactForm.value;
    data.t_img_file = this.files[0];

    if (this.actionType == "Add New") {
      this.testServ.putATestiomonial(data).subscribe((val) => {
        if (val["isSuccess"] == true) {
          this.notifyServ.addNotification({
            text: "Contact Created Successfully",
            level: "success",
            autohide: true,
          });
        } else {
          this.notifyServ.addNotification({
            text: "Error while creating Contact",
            level: "error",
            autohide: true,
          });
        }
        this._fetchData();
      });
      this.resetcontactForm();
      this.closeContactModal();
    } else if (this.actionType == "Edit") {
      this.toastr.success("edited sucessful!");

      this.testServ.updateATestimonial(data).subscribe((val) => {
        this.toastr.success("Contact added successfully!");

        if (val["isSuccess"] == true) {
          this.notifyServ.addNotification({
            text: "Contact Update Successfully",
            level: "success",
            autohide: true,
          });
        } else {
          this.notifyServ.addNotification({
            text: "Error while Updating Contact",
            level: "error",
            autohide: true,
          });
        }
        this._fetchData();
      });
      this.resetcontactForm();
      this.closeContactModal();
    }

    // this._fetchData();
  }

  // reset form and file
  resetcontactForm() {
    // files reset
    this.files = [];
    // form reset
    this.contactForm.reset();
  }

  srcToFile(src: any, fileName: any, mimeType: any) {
    return fetch(src)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], fileName, { type: mimeType });
      });
  }
}
