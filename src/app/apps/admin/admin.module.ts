import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';

import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from "../../shared/widget/widget.module";

import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuillModule } from 'ngx-quill';
// import { readFile } from 'fs';

import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';

import { ContactService } from './service/testimonial.service';

import { ContactComponent } from './component/testimonial/testimonial.component';
import { ProductComponent } from './component/product/product.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductService } from './service/product.service';
import { CategoryService } from './service/category.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { VariantComponent } from './component/variant/variant.component';
import { VariantService } from './service/variant.service';
import { DynaFormService } from './service/form.service';
import { SheduleComponent } from './component/shedule/shedule.component';
import { MessageComponent } from './component/message/message.component';
import { WAMesssagingService } from './service/wa.message.service';
import { AddTemplateComponent } from './component/add-template/add-template.component';
import { PunchComponent } from './component/punch/punch-component';
import { StatsComponent } from './component/logstats/stats-component';
import { automatTempComponent } from './component/automatic-temp/automat-temp';
import { sendcustomMessage } from './component/sendcustom-message/sendcustom-message';
import { AddTemplateService } from './service/addTemplate.service';
import { AutoTempService } from './service/automat.service';
import { sendCustomService } from './service/sendcustom-message.service';



@NgModule({
    declarations: [
        ContactComponent,
        ProductComponent,
        CategoryComponent,
        VariantComponent,
        SheduleComponent,
        MessageComponent,
        AddTemplateComponent,
        PunchComponent,
        StatsComponent,
        automatTempComponent,
        sendcustomMessage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module,
        NgxDropzoneModule,
        QuillModule,
        PageTitleModule,
        AdvancedTableModule,
        AdminRoutingModule,
        WidgetModule,
        HttpClientModule,
        NgbToastModule
    ],
    providers: [
        ContactService,
        ProductService,
        CategoryService,
        VariantService,
        DynaFormService,
        WAMesssagingService,
        AddTemplateService,
        AutoTempService,
        sendCustomService
    ]
})
export class AdminModule { }
