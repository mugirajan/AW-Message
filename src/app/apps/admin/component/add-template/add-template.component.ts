import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Column } from "src/app/shared/advanced-table/advanced-table.component";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { actionEvent } from "../../models";
import { NotificationService } from "src/app/layout/shared/service/notification.service";
import { HttpClient } from "@angular/common/http";
import { AddTemplateService } from "../../service/addTemplate.service";
import { AddTemplate } from "../../models/addTemplate.model";

@Component({
  selector: "app-add-template",
  templateUrl: "./add-template.component.html",
  styleUrls: ["./add-template.component.scss"],
})
export class AddTemplateComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  records: any = [];
  columns: Column[] = [];
  loading: boolean = false;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  templateform!: FormGroup;
  actionType: string = "Add New";
  AddTemplateDeleteID: any;
  categoryResource: any = [];
  specLabels: any = [];
  idFormBasedOnCategory!: boolean;
  selectProduct: any;
  AddTemplate: AddTemplate[] = [];

  @ViewChild("sizeableModal")
  sizeableModal!: TemplateRef<NgbModal>;
  @ViewChild("positionModal")
  positionModal!: TemplateRef<NgbModal>;
  @ViewChild("positionModal2")
  positionModal2!: TemplateRef<NgbModal>;

  selectedOptions: string[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notifyServ: NotificationService,
    private http: HttpClient,
    private tempServ: AddTemplateService
  ) {}

  // OnInit
  ngOnInit(): void {
    this.pageTitle = [
      { label: "Admin", path: "/apps/" },
      { label: "Add Custom Template", path: "/", active: true },
    ];

    this._fetchData();

    this.initTableCofig();

    this.templateform = this.fb.group({
      id: [""],
      temp_name: ["", Validators.required],
      temp_body: ["", Validators.required],
      active_status: ["", Validators.required],
    });

    this.resettemplateform();
  }

  ScheduleForm() {
    const formData = this.templateform.value;
    this.tempServ.createTemp(formData).subscribe((response) => {
      console.log("Rep:  ", response);
      this.templateform.reset();
      this._fetchData();
    });

    this.closeAddTemplateModal();
  }

  _fetchData(): void {
    this.tempServ.getTemp().subscribe((data: any) => {
      if (data.length > 0) {
        this.records = data;
      }
    });
  }

  initTableCofig(): void {
    this.columns = [
      // {
      //   name: "id",
      //   label: "Id",
      //   formatter: (a: AddTemplate) => a.id,
      // },
      {
        name: "temp_name",
        label: "Template Name",
        formatter: (a: AddTemplate) => a.temp_name,
      },
      {
        name: "temp_body",
        label: "Body",
        formatter: (a: AddTemplate) => a.temp_body,
      },
      {
        name: "active_status",
        label: "Active Status",
        formatter: this.AddTemplateActiveStatusFormatter.bind(this),
      },
    ];
  }

  AddTemplateActiveStatusFormatter(data: AddTemplate): any {
    if (data.active_status) {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-success text-success"><i class="mdi mdi-check"></i> Active </span></h5>`
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<h5><span class="badge bg-soft-danger text-danger"><i class="mdi mdi-close"></i> In Active </span></h5>`
      );
    }
  }

  /**
   * Match table data with search input
   * @param row Table row
   * @param term Search the value
   */
  matches(row: AddTemplate, term: string) {
    return (
      row.id?.toString().includes(term) ||
      row.temp_name?.toString().toLowerCase().includes(term) ||
      row.temp_body?.toLowerCase().toString().includes(term)
    );
  }

  searchData(searchTerm: string): void {
    console.log("Search Term:", searchTerm);
    if (searchTerm === "") {
      this._fetchData();
    } else {
      console.log(searchTerm)
      searchTerm.toLowerCase()
      let updatedData = this.records;
      updatedData = updatedData.filter((product: any) =>
        this.matches(product, searchTerm)
      );
      this.records = updatedData;

    }
  }

  private _filterData(data: any[], term: string): any[] {
    return data.filter((item: any) => this.matches(item, term));
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
        this.edittemplateform(event.record);
        break;
      case "delete":
        this.actionType = "Delete";
        this.deleteAddTemplate(event.record);
        break;
      default:
        this.actionType = "Add New";
        break;
    }
  }

  showEditDisabledDialogue() {
    this.openVerticallyCentered(this.positionModal2);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  deleteAddTemplate(AddTemplate: any) {
    this.AddTemplateDeleteID = AddTemplate.id;
    this.openVerticallyCentered(this.positionModal);
  }

  deletedSeletedAddTemplate() {
    this.tempServ.deleteAddTemplate(this.AddTemplateDeleteID).subscribe(
      (response) => {
        if (response["isSuccess"] == true) {
          this.notifyServ.addNotification({
            text: "AddTemplate Deleted Successfully",
            level: "success",
            autohide: true,
          });
        } else {
          // this.notifyServ.addNotification({
          //   text: "Error while deleting AddTemplate",
          //   level: "error",
          //   autohide: true,
          // });
        }
        this._fetchData();
      },
      (error) => {
        console.error("Error deleting AddTemplate:", error);
      }
    );
    this.AddTemplateDeleteID = -1;
    this.closeAddTemplateModal();
  }

  openAddAddTemplateModal(content: TemplateRef<NgbModal>): void {
    this.actionType = "Add New";
    this.resettemplateform();
    this.openAddTemplateModal(content);
  }

  openAddTemplateModal(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: "xl" });
  }

  closeAddTemplateModal(): void {
    this.modalService.dismissAll();
    this.resettemplateform();
  }

  edittemplateform(data: any) {
    this.resettemplateform();
    this.modalService.open(this.sizeableModal, { size: "xl" });

    this.templateform.patchValue({
      id: data.id,
      temp_name: data.temp_name,
      temp_body: data.temp_body,
      active_status: data.active_status ? "true" : "false",
    });
    this.tempServ.UpdateTemp(this.templateform.value).subscribe(
      (response) => {
        console.log("updated successfully:", response);
      },
      (error) => {
        console.error("Error updating AddTemplate:", error);
      }
    );
  }

  gettemplateformValue(): any {
    return this.templateform.value;
  }

  resettemplateform() {
    this.templateform.reset();
  }
}
