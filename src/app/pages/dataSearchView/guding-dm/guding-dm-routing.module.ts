/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 21:54:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\guding-dm\guding-dm-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GudingDmPage } from './guding-dm.page';
import { SectionSelectComponent } from '../../../compontent/section-select/section-select.component'
import { KljpChartComponent } from '../../../compontent/kljp-chart/kljp-chart.component'
const routes: Routes = [
  {
    path: '',
    component: GudingDmPage
  }
];

@NgModule({
  entryComponents:[SectionSelectComponent,KljpChartComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GudingDmPageRoutingModule {}
