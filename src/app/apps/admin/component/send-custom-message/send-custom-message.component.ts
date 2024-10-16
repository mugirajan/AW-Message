import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Category } from "../../models/category.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Column } from "src/app/shared/advanced-table/advanced-table.component";
import { Subscription } from "rxjs";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProductModel2 } from "../../models/product.model";
import {
  Select2Group,
  Select2Option,
  Select2UpdateEvent,
} from "ng-select2-component";
import { HttpClient } from "@angular/common/http";
import { WAMesssagingService } from "../../service/wa.message.service";
import { sendCustomService } from "../../service/sendcustom-message.service";
import { sendCustom } from "../../models/autotemp.model";
import { Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-send-custom-message",
  templateUrl: "./send-custom-message.component.html",
  styleUrls: ["./send-custom-message.component.scss"],
})
export class SendCustomMessageComponent implements OnInit {
  messageForm!: FormGroup;
  sendCustom!: FormGroup;
  storedData: sendCustom[] = [];
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
  productDeleteID: any;
  TemplateForm!: FormGroup;
  templateform!: FormGroup;
  contacts: any[] = [];
  checklistorcontact: string = "";
  // localhost URL
  url = "https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/";
  //Production URL
  // url = "http://13.126.175.153/";

  senderResource: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  senderResourcelist: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  senderResourcelistarray: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  senderResourcecontactarray: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  senderResourceMessage: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  contactID: any[] = [];
  listID: string[] = [];
  categoryDeleteID: any;
  selectedSender: Select2Option[] = [];
  selectedMessage: Select2Option[] = [];

  cat_resource: Category[] = [];
  categories: Select2Group[] = [
    {
      label: "",
      options: [],
    },
  ];
  canSubmit: boolean = true;
  requestData: any[] = [];

  @ViewChild("advancedTable")
  advancedTable: any;

  @ViewChild("sizeableModal")
  sizeableModal!: TemplateRef<NgbModal>;

  @ViewChild("positionModal")
  positionModal!: TemplateRef<NgbModal>;

  @ViewChild("positionModal2")
  positionModal2!: TemplateRef<NgbModal>;

  selectedLabel: any;
  selectedValue: any | undefined;
  selectedValuetmp: any;

  constructor(
    private sendCustomService: sendCustomService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private msgServ: WAMesssagingService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pageTitle = [
      { label: "Admin", path: "/apps/" },
      { label: "Default Message", path: "/", active: true },
    ];

    this.http
      .get<any>(this.url + "lists/getLists.php")
      .subscribe((response: any) => {
        if (response.success) {
          if (response.data.length > 0) {
            response.data.forEach((con: any, ind: number) => {
              this.senderResource[0].options.push({
                label: con.t_name,
                value: con.t_role,
                id: con.id,
              });
            });
          } else {
            console.warn("Not found.");
          }
        } else {
          console.error("Error:", response.message); // Handle the error message
        }
      });

    this.msgServ.getContacts().subscribe((contacts) => {
      this.contacts = contacts;
    });

    this.TemplateForm = this.fb.group({
      sender: ["", Validators.required],
      headerTxt: ["", Validators.required],
      message: ["", Validators.required],
    });

    //date and time
    this.sendCustom = this.fb.group({
      cont_list: [""],
      custom_template: [""],
    });

    //template start
    this.http
      .get<any[]>(this.url + "template/getTemplates.php")
      .subscribe((response: any) => {
        if (response.success) {
          if (response.data.length > 0) {
            this.senderResourceMessage[0].options = [];
            response.data.forEach((cus: any) => {
              this.senderResourceMessage[0].options.push({
                label: cus.temp_name,
                value: cus.temp_body,
                id: cus.id,
              });
            });
          } else {
            console.warn("Not found.");
          }
        } else {
          console.error("Error:", response.message); // Handle the error message
        }
        // console.log("temp data :", data)
      });

    this.templateform = this.fb.group({
      temp_name: [""],
      temp_body: [""],
    });
    //template end

    //list
    this.http
      .get<any[]>(this.url + "lists/getLists.php")
      .subscribe((response: any) => {
        if (response.success) {
          if (response.data.length > 0) {
            // console.log("list data :", data);
            this.senderResourcelistarray[0].options = [];
            response.data.forEach((con: any) => {
              this.senderResourcelistarray[0].options.push({
                label: con.c_name,
                value: con.selectedOptions,
                id: con.id,
              });
            });
          } else {
            console.warn("Not found.");
          }
        } else {
          console.error("Error:", response.message); // Handle the error message
        }
      });

    //contact id array
    this.http
      .get<any>(this.url + "contacts/getContacts.php")
      .subscribe((response: any) => {
        if (response.success) {
          if (response.data.length > 0) {
            response.data.forEach((con: any) => {
              this.senderResourcecontactarray[0].options.push({
                label: con.t_name,
                value: con.id,
              });
            });
            this.contactID = this.contactID.concat(
              response.data.map((con: any) => [con.id])
            );
          } else {
            console.warn("No categories found.");
          }
        } else {
          console.error("Error:", response.message); // Handle the error message
        }

        // console.log('contact id', this.contactID);
      });

    // get Variants
    // this.fetchData();

    // product form
    this.messageForm = this.fb.group({
      sender: ["", Validators.required],
      headerTxt: ["", Validators.required],
      message: ["", Validators.required],
    });
    this.resetMessageForm();
    //list end
  }

  resetMessageForm() {
    this.TemplateForm.reset();
  }

  onSenderSelectedarray(da: Select2UpdateEvent) {
    // console.log('Selected da:', da.options[0].id);
    this.selectedValue = da.options[0].id;
  }

  onSenderSelectedcontactarray(da: Select2UpdateEvent) {
    console.log("Selected da:", da.options[0]);
    this.selectedValue = da.options[0].value;
    // this.contactID.push(selectedarray);
  }

  onSenderCustomMessage(da: Select2UpdateEvent) {
    console.log(da.options[0]);
    this.selectedValuetmp = da.options[0].value;
  }

  onMessageTemplateSelected(da: Select2UpdateEvent) {}
  onMessageChange(event: Event): void {
    const selectedcon = (event.target as HTMLSelectElement).value;
    this.TemplateForm.patchValue({ message: selectedcon });
  }

  sendMessagelist(): void {
    console.log("list :", this.selectedValue);
    console.log("template :", this.selectedValuetmp);
    console.log("checklistorcontact :", this.checklistorcontact);

    if (this.checklistorcontact == "contact") {
      this.http
        .get<any>(this.url + `contacts/getAContact.php?id=${this.selectedValue}`)
        .subscribe((data) => {
          this.msgServ
            .customTemplate(data.t_role, data.t_name, this.selectedValuetmp)
            .subscribe((resp: any) => {
              this.toastr.success("Message sent successfully!");
              this.resetMessageForm();
            });
        });
    } else {
      this.http
        .get<any>(this.url + `lists/getAList.php?id=${this.selectedValue}`)
        .subscribe((item) => {
          const selectedOptions: string[] = item.selectedOptions;
          selectedOptions.forEach((id) => {
            this.http
              .get<any>(this.url + `contacts/getContacts.php?id=${id}`)
              .subscribe((data) => {
                this.msgServ
                  .customTemplate(
                    data.t_role,
                    data.t_name,
                    this.selectedValuetmp
                  ).subscribe((resp: any) => {
                    this.toastr.success("Message sent successfully!");
                    this.resetMessageForm();
                  });
              });
          });
        });
    }
  }

  //radio button for contact or list
  showContactDropdown: boolean = false;
  showListDropdown: boolean = false;

  toggleDropdown(selection: string): void {
    if (selection === "contact") {
      this.checklistorcontact = "contact";
      this.showContactDropdown = true;
      this.showListDropdown = false;
    } else if (selection === "list") {
      this.checklistorcontact = "list";
      this.showContactDropdown = false;
      this.showListDropdown = true;
    }
  }

  // //radio button for custom or fb template
  // submitSendCustom() {
  //   if (this.sendCustom.valid) {
  //     const formData = this.sendCustom.value;
  //     formData.cont_list = Array.isArray(formData.cont_list)
  //       ? formData.cont_list
  //       : [formData.cont_list];
  //     console.log("data:", formData);
  //     this.http.post<sendCustom>(this.url + "/sendCustom/createSendCustom.php", formData)
  //       .subscribe((data) => {
  //         this.storedData.push(data);
  //         this.sendCustom.reset();
  //       });
  //   }
  // }

  // fetchData() {
  //   this.http
  //     .get<sendCustom[]>(this.url + "sendCustom/getSendCustom.php")
  //     .subscribe((response: any) => {
  //       if (response.success) {
  //         if (response.data.length > 0) {
  //           this.storedData = response.data;
  //         } else {
  //           console.warn("Not found.");
  //         }
  //       } else {
  //         console.error("Error:", response.message); // Handle the error message
  //       }
  //     });
  // }

  // deleteTemp(id: string): Observable<void> {
  //   return this.http.delete<void>(this.url + "sendCustom/" + id);
  // }

  // deleteAutoTemp(id: string): void {
  //   this.deleteTemp(id).subscribe(
  //     () => {
  //       this.storedData = this.storedData.filter((item) => item.id !== id);
  //       this.toastr.success("Item deleted successfully!");
  //     },
  //     (error) => {
  //       console.error("Error deleting item:", error);
  //       this.toastr.error("Failed to delete item. Please try again.");
  //     }
  //   );
  // }
}
