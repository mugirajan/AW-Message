import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestimonialComponent } from './component/testimonial/testimonial.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/product/product.component';
import { VariantComponent } from './component/variant/variant.component';
import { SheduleComponent } from './component/shedule/shedule.component';
import { MessageComponent } from './component/message/message.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "testimonial",
    pathMatch: "full",
  },
  {
    path: "testimonial",
    component: TestimonialComponent
  },
  {
    path: "category",
    component: CategoryComponent
  },
  {
    path: "product",
    component: ProductComponent
  },
  {
    path: "variant",
    component: VariantComponent
  },
  {
    path: "schedule",
    component: SheduleComponent
  },
  {
    path: "send-message",
    component: MessageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
