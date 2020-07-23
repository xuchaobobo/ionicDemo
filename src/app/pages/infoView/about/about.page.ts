import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx'

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appName
  packageName
  versionCode
  versionNumber
  constructor(public appVersion:AppVersion) { }

  ngOnInit() {
    this.appVersion.getAppName().then(value=>{
      this.appName=value
    })
    this.appVersion.getPackageName().then(value=>{
      this.packageName=value
    })
    this.appVersion.getVersionCode().then(value=>{
      this.versionCode=value
    })
    this.appVersion.getVersionNumber().then(value=>{
      this.versionNumber=value
    })
  }

}
