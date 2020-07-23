import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaDmPageRoutingModule } from './da-dm-routing.module';
import { TabtitleModule } from '../../../compontent/tabtitle/tabtitle.module'
import { SectionSelectModule } from '../../../compontent/section-select/section-select.module'
import { IonicSelectableModule } from 'ionic-selectable';
import { DaDmPage } from './da-dm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabtitleModule,
    SectionSelectModule,
    IonicSelectableModule,
    IonicModule,
    DaDmPageRoutingModule
  ],
  declarations: [DaDmPage]
})
export class DaDmPageModule {}
