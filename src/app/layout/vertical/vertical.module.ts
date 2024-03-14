import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalLayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    VerticalLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgbAlertModule,
    NgbToastModule
  ],
  exports: [
    VerticalLayoutComponent
  ]
})
export class VerticalModule { }
