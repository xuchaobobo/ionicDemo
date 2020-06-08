/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-28 16:09:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\process-line\process-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessLinePage } from './process-line.page';
import { StationSelectComponent } from './../../compontent/station-select/station-select.component'


const routes: Routes = [
  {
    path: '',
    component: ProcessLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessLinePageRoutingModule {}
