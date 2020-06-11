/*
 * @Author: your name
 * @Date: 2020-04-18 21:08:23
 * @LastEditTime: 2020-05-15 17:00:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\zb-table\zb-table.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZbTablePageRoutingModule } from './zb-table-routing.module';

import { ZbTablePage } from './zb-table.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import { AreaSelectModule } from './../../compontent/area-select/area-select.module'
import { KljpTableModule } from './../../compontent/kljp-table/kljp-table.module'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KljpTableModule,
    // DataTableModule,
    NgxDatatableModule,
    TabtitleModule,
    AreaSelectModule,
    ZbTablePageRoutingModule
  ],
  declarations: [ZbTablePage]
})
export class ZbTablePageModule {}
