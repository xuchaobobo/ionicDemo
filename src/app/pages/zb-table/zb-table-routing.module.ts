/*
 * @Author: your name
 * @Date: 2020-04-18 21:08:23
 * @LastEditTime: 2020-05-15 17:01:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\zb-table\zb-table-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreaSelectComponent } from './../../compontent/area-select/area-select.component'
import { KljpTableComponent } from './../../compontent/kljp-table/kljp-table.component'
import { ZbTablePage } from './zb-table.page';

const routes: Routes = [
  {
    path: '',
    component: ZbTablePage
  }
];

@NgModule({
  entryComponents:[AreaSelectComponent,KljpTableComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZbTablePageRoutingModule {}
