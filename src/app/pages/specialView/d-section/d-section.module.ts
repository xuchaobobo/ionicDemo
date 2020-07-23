import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DSectionPageRoutingModule } from './d-section-routing.module';

import { DSectionPage } from './d-section.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DSectionPageRoutingModule
  ],
  declarations: [DSectionPage]
})
export class DSectionPageModule {}
