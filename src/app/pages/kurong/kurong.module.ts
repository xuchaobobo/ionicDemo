/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:58:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\kurong\kurong.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KurongPageRoutingModule } from './kurong-routing.module';

import { KurongPage } from './kurong.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KurongPageRoutingModule,
    TabtitleModule
  ],
  declarations: [KurongPage]
})
export class KurongPageModule {}
