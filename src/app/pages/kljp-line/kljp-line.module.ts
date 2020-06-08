/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-30 11:25:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\kljp-line\kljp-line.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KljpLinePageRoutingModule } from './kljp-line-routing.module';

import { KljpLinePage } from './kljp-line.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import {StationSelectModule} from './../../compontent/station-select/station-select.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    KljpLinePageRoutingModule
  ],
  declarations: [KljpLinePage]
})
export class KljpLinePageModule {}
