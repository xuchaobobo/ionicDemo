import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    
  ],
  declarations: [
  	LoginPage,

  ],
  providers:[Geolocation]
})
export class LoginPageModule {}
