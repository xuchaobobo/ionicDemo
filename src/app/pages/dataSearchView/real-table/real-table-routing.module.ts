/*
 * @Author: your name
 * @Date: 2020-04-18 21:07:40
 * @LastEditTime: 2020-05-15 17:49:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\real-table\real-table-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreaSelectComponent } from '../../../compontent/area-select/area-select.component'
import { RealTableDetailComponent } from '../../../compontent/real-table-detail/real-table-detail.component'

import { RealTablePage } from './real-table.page';

const routes: Routes = [
  {
    path: '',
    component: RealTablePage
  }
];

@NgModule({
  entryComponents:[AreaSelectComponent,RealTableDetailComponent],

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealTablePageRoutingModule {}
