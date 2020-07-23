/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:54:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\interannual-variation\interannual-variation.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterannualVariationPageRoutingModule } from './interannual-variation-routing.module';

import { InterannualVariationPage } from './interannual-variation.page';
import {StationSelectModule} from '../../../compontent/station-select/station-select.module'

import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    StationSelectModule,
    InterannualVariationPageRoutingModule
  ],
  declarations: [InterannualVariationPage]
})
export class InterannualVariationPageModule {}
