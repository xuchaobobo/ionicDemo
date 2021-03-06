/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-05-08 09:59:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\app.module.ts
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { LoginGuardGuard } from './guard/login-guard.guard'
import { AppComponent } from './app.component';

// import { HTTP } from '@ionic-native/http/ngx';
import {HttpModule} from '@angular/http'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import {ProviderService} from './service/provider.service';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
// import { TimeFormatPipe } from './pipes/time-format/time-format.pipe'
// import {StationSelectComponent} from './compontent/station-select/station-select.component'


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(),
     AppRoutingModule,
     IonicStorageModule.forRoot({name: '__mydb',
     driverOrder: ['indexeddb', 'sqlite', 'websql']})
    ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    File,
    FileOpener,
    AndroidPermissions,
    AppVersion,
    ProviderService,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoginGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
