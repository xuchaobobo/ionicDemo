import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObservationDataPageRoutingModule } from './observation-data-routing.module';

import { ObservationDataPage } from './observation-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObservationDataPageRoutingModule
  ],
  declarations: [ObservationDataPage]
})
export class ObservationDataPageModule {}
