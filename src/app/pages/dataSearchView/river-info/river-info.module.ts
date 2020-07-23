/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:53:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\river-info\river-info.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiverInfoPageRoutingModule } from './river-info-routing.module';

import { RiverInfoPage } from './river-info.page';
import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    IonicSelectableModule,
    RiverInfoPageRoutingModule
  ],
  declarations: [RiverInfoPage]
})
export class RiverInfoPageModule {}
