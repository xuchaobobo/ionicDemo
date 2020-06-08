/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-28 16:02:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\process-line\process-line.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessLinePageRoutingModule } from './process-line-routing.module';

import { ProcessLinePage } from './process-line.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import {StationSelectModule} from './../../compontent/station-select/station-select.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    ProcessLinePageRoutingModule
  ],
  declarations: [ProcessLinePage],
  
})
export class ProcessLinePageModule {}
