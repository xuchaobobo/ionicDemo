/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-04 16:04:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\cal-year-line\cal-year-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalYearLinePage } from './cal-year-line.page';
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'


const routes: Routes = [
  {
    path: '',
    component: CalYearLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalYearLinePageRoutingModule {}
