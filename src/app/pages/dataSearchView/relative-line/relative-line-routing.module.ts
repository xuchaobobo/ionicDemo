/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-29 10:21:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\relative-line\relative-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelativeLinePage } from './relative-line.page';
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'

const routes: Routes = [
  {
    path: '',
    component: RelativeLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelativeLinePageRoutingModule {}
