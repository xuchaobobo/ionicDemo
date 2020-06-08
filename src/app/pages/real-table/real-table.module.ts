/*
 * @Author: your name
 * @Date: 2020-04-18 21:07:40
 * @LastEditTime: 2020-05-15 17:49:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\real-table\real-table.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealTablePageRoutingModule } from './real-table-routing.module';

import { RealTablePage } from './real-table.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import { AreaSelectModule } from './../../compontent/area-select/area-select.module'
import { RealTableDetailModule } from './../../compontent/real-table-detail/real-table-detail.module'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    RealTableDetailModule,
    AreaSelectModule,
    NgxDatatableModule,
    RealTablePageRoutingModule
  ],
  declarations: [RealTablePage]
})
export class RealTablePageModule {}
