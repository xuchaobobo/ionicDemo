/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 11:46:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\ann-kl-line\ann-kl-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnKlLinePage } from './ann-kl-line.page';
import { StationSelectComponent } from './../../compontent/station-select/station-select.component'


const routes: Routes = [
  {
    path: '',
    component: AnnKlLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnKlLinePageRoutingModule {}
