import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaterAndSedChangePageRoutingModule } from './water-and-sed-change-routing.module';

import { WaterAndSedChangePage } from './water-and-sed-change.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaterAndSedChangePageRoutingModule
  ],
  declarations: [WaterAndSedChangePage]
})
export class WaterAndSedChangePageModule {}
