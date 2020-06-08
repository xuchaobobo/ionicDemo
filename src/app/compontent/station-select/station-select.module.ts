/*
 * @Author: your name
 * @Date: 2020-04-08 14:06:06
 * @LastEditTime: 2020-04-08 21:05:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\station-select\station-select.module.ts
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StationSelectComponent } from './station-select.component'


@NgModule({
  declarations: [StationSelectComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  exports:[StationSelectComponent]
})
export class StationSelectModule { }
