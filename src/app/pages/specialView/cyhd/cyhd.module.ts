import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CyhdPageRoutingModule } from './cyhd-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { ImgBigModule } from '../../../compontent/img-big/img-big.module'


import { CyhdPage } from './cyhd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    IonicModule,
    ImgBigModule,
    CyhdPageRoutingModule
  ],
  declarations: [CyhdPage],
  providers:[Geolocation]
})
export class CyhdPageModule {}
