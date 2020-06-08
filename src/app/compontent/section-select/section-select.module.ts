/*
 * @Author: your name
 * @Date: 2020-05-05 21:17:54
 * @LastEditTime: 2020-05-05 21:21:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\section-select\section-select.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SectionSelectComponent } from './section-select.component'


@NgModule({
  declarations: [SectionSelectComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  exports:[SectionSelectComponent]
})
export class SectionSelectModule { }
