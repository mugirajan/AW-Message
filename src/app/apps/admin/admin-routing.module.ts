import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './component/testimonial/testimonial.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/product/product.component';
import { VariantComponent } from './component/variant/variant.component';
import { SheduleComponent } from './component/shedule/shedule.component';
import { MessageComponent } from './component/message/message.component';
import { AddTemplateComponent } from './component/add-template/add-template.component';
import { PunchComponent } from './component/punch/punch-component';
import { StatsComponent } from './component/logstats/stats-component';
import { automatTempComponent } from './component/automatic-temp/automat-temp';
import { FilterContactComponent } from './component/filter-contact/filter-contact.component';
import { SendCustomMessageComponent } from './component/send-custom-message/send-custom-message.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "contact",
    pathMatch: "full",
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "list",
    component: CategoryComponent
  },
  {
    path: "Add-Template",
    component: AddTemplateComponent
  },
  {
    path: "custom",
    component: ProductComponent
  },
  {
    path: "schedule",
    component: VariantComponent
  },
  {
    path: "logout",
    component: SheduleComponent
  },
  {
    path: "custom-single-message-template",
    component: MessageComponent
  },
  {
    path: "punch",
    component:PunchComponent
  },
  {
    path: "logstats",
    component:StatsComponent
  },
  {
    path: "automatic",
    component: automatTempComponent 
  },
  {
    path: "expired-contacts",
    component: FilterContactComponent
  },
  {
    path: "sendcustomMessage",
    component: SendCustomMessageComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
