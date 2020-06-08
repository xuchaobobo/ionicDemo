/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-30 19:58:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\interannual-variation\interannual-variation-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterannualVariationPage } from './interannual-variation.page';
import { StationSelectComponent } from './../../compontent/station-select/station-select.component'


const routes: Routes = [
  {
    path: '',
    component: InterannualVariationPage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterannualVariationPageRoutingModule {}
