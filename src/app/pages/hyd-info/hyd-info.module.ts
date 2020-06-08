/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:53:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\hyd-info\hyd-info.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HydInfoPageRoutingModule } from './hyd-info-routing.module';

import { HydInfoPage } from './hyd-info.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    HydInfoPageRoutingModule,
    TabtitleModule,
    
  ],
  declarations: [HydInfoPage],
  
})
export class HydInfoPageModule {}
