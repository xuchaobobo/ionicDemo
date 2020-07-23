import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppHelpPageRoutingModule } from './app-help-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { AppHelpPage } from './app-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    AppHelpPageRoutingModule
  ],
  declarations: [AppHelpPage]
})
export class AppHelpPageModule {}
