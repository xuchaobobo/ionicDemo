/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-18 17:33:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\hyd-info\hyd-info-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HydInfoPage } from './hyd-info.page';


const routes: Routes = [
  {
    path: '',
    component: HydInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HydInfoPageRoutingModule {}
