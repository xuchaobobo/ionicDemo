import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RealTableDetailComponent} from './real-table-detail.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TimeFormatPipe } from '../../pipes/time-format/time-format.pipe'



@NgModule({
  declarations: [RealTableDetailComponent,TimeFormatPipe],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule
  ],
  exports:[RealTableDetailComponent]
})
export class RealTableDetailModule { }
