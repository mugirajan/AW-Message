import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './component/testimonial/testimonial.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/product/product.component';
import { VariantComponent } from './component/variant/variant.component';
import { SheduleComponent } from './component/shedule/shedule.component';

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
    path: "custom",
    component: ProductComponent
  },
  {
    path: "logout",
    component: VariantComponent
  },
  {
    path: "schedule",
    component: SheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
