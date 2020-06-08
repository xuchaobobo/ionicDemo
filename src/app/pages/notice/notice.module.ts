/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 20:58:44
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\notice\notice.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticePageRoutingModule } from './notice-routing.module';

import { NoticePage } from './notice.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabtitleModule,
    NoticePageRoutingModule
  ],
  declarations: [NoticePage]
})
export class NoticePageModule {}
