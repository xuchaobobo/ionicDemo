import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RealTableDetailComponent} from './real-table-detail.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TimeFormatModule } from '../../pipes/time-format/time-format.module'



@NgModule({
  declarations: [RealTableDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    TimeFormatModule
  ],
  providers:[TimeFormatModule],
  exports:[RealTableDetailComponent]
})
export class RealTableDetailModule { }
