/*
 * @Author: your name
 * @Date: 2020-05-15 16:18:14
 * @LastEditTime: 2020-05-15 16:27:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\kljp-table\kljp-table.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {KljpTableComponent} from './kljp-table.component'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [KljpTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule
  ],
  exports:[KljpTableComponent]
})
export class KljpTableModule { }
