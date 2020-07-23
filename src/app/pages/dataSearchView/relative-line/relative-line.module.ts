/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:54:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit,
 * @FilePath: \app\src\app\pages\relative-line\relative-line.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelativeLinePageRoutingModule } from './relative-line-routing.module';

import { RelativeLinePage } from './relative-line.page';
import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
import {StationSelectModule} from '../../../compontent/station-select/station-select.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    RelativeLinePageRoutingModule
  ],
  declarations: [RelativeLinePage]
})
export class RelativeLinePageModule {}
