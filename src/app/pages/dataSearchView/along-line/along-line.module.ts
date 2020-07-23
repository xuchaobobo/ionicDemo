/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:53:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\along-line\along-line.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlongLinePageRoutingModule } from './along-line-routing.module';

import { AlongLinePage } from './along-line.page';
import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
import {StationSelectModule} from '../../../compontent/station-select/station-select.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    AlongLinePageRoutingModule
  ],
  declarations: [AlongLinePage],
  
})
export class AlongLinePageModule {}
