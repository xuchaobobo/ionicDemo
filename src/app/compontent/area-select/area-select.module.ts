/*
 * @Author: your name
 * @Date: 2020-05-08 14:06:05
 * @LastEditTime: 2020-05-13 17:29:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\area-select\area-select.module.ts
 */
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AreaSelectComponent } from './area-select.component'
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [AreaSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeModule.forRoot(),
  ],
  exports:[AreaSelectComponent]
})
export class AreaSelectModule { }
