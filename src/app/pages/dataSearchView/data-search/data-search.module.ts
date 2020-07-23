import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataSearchPageRoutingModule } from './data-search-routing.module';

import { DataSearchPage } from './data-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataSearchPageRoutingModule
  ],
  declarations: [DataSearchPage]
})
export class DataSearchPageModule {}
