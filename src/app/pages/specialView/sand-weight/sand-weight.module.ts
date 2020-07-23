import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SandWeightPageRoutingModule } from './sand-weight-routing.module';

import { SandWeightPage } from './sand-weight.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SandWeightPageRoutingModule
  ],
  declarations: [SandWeightPage]
})
export class SandWeightPageModule {}
