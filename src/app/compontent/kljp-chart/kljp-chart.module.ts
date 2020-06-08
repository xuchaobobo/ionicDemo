import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {KljpChartComponent} from './kljp-chart.component'



@NgModule({
  declarations: [KljpChartComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports:[KljpChartComponent]
})
export class KljpChartModule { }
