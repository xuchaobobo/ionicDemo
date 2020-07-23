import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrototypeChartPageRoutingModule } from './prototype-chart-routing.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { PrototypeChartPage } from './prototype-chart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrototypeChartPageRoutingModule
  ],
  declarations: [PrototypeChartPage],
  providers:[ScreenOrientation,StatusBar]
})
export class PrototypeChartPageModule {}
