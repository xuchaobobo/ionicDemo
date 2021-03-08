/*
 * @Descripttion: 
 * @version: 
 * @Author: xcb
 * @Date: 2020-11-16 11:25:27
 * @LastEditors: xcb
 * @LastEditTime: 2021-03-08 16:23:00
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImgBigComponent } from '../../../compontent/img-big/img-big.component'

import { CyhdPage } from './cyhd.page';

const routes: Routes = [
  {
    path: '',
    component: CyhdPage
  }
];

@NgModule({
  entryComponents:[ImgBigComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyhdPageRoutingModule {}
