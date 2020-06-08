/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-05 21:56:06
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\guding-dm\guding-dm.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GudingDmPageRoutingModule } from './guding-dm-routing.module';

import { GudingDmPage } from './guding-dm.page';
import { TabtitleModule } from '../../compontent/tabtitle/tabtitle.module'
import { SectionSelectModule } from '../../compontent/section-select/section-select.module'
import { KljpChartModule} from '../../compontent/kljp-chart/kljp-chart.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectionSelectModule,
    KljpChartModule,
    GudingDmPageRoutingModule,
    TabtitleModule,
  ],
  declarations: [GudingDmPage]
})
export class GudingDmPageModule {}
