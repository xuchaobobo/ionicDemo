/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-30 11:25:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\kljp-line\kljp-line-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'

import { KljpLinePage } from './kljp-line.page';

const routes: Routes = [
  {
    path: '',
    component: KljpLinePage
  }
];

@NgModule({
  entryComponents:[StationSelectComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KljpLinePageRoutingModule {}
