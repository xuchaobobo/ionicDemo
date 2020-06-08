/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 09:44:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\ann-avg-line\ann-avg-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnAvgLinePage } from './ann-avg-line.page';
import { StationSelectComponent } from './../../compontent/station-select/station-select.component'

const routes: Routes = [
  {
    path: '',
    component: AnnAvgLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnAvgLinePageRoutingModule {}
