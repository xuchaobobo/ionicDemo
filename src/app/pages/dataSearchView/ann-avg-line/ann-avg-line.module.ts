/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:54:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\ann-avg-line\ann-avg-line.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnAvgLinePageRoutingModule } from './ann-avg-line-routing.module';

import { AnnAvgLinePage } from './ann-avg-line.page';
import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
import {StationSelectModule} from '../../../compontent/station-select/station-select.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    AnnAvgLinePageRoutingModule
  ],
  declarations: [AnnAvgLinePage]
})
export class AnnAvgLinePageModule {}
