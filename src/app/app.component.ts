
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UnitsService } from './service/units.service'
import { Device } from '@ionic-native/device/ngx';
import  {LoginPage} from "./login/login.page";
import { AppConfig } from './api.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  menulists:any
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
   private unitsService:UnitsService,
   public device:Device
  ) {
    this.initializeApp();
    this.menulists=[
      {
        title:'实时数据查询',
        menus:[
          {
            icon:'icon-shuiwenzhuanti',
            title:'水文信息',
            url:'/tabs/tab2/hyd-info'
          },{
            icon:'icon-shuiku',
            title:'水库信息',
            url:'/tabs/tab2/river-info'
          }
        ]  
      },
      {
        title:'整编数据查询',
        menus:[
          {
            icon:'icon-guochengfenxi',
            title:'过程线',
            url:'/tabs/tab2/process-line'
          },{
            icon:'icon-zhandianshujutongji',
            title:'沿程线',
            url:'/tabs/tab2/along-line'
          },{
            icon:'icon-guanxi',
            title:'关系线',
            url:'/tabs/tab2/relative-line'
          },{
            icon:'icon-shachen',
            title:'颗粒级配',
            url:'/tabs/tab2/kljp-line'
          },{
            icon:'icon-table',
            title:'整编表查询',
            url:'/tabs/tab2/zb-table'
            },{
              icon:'icon-RectangleCopy',
              title:'实测表查询',
              url:'/tabs/tab2/real-table'
              }
        ]  
      },
      {
        title:'年际变化分析',
        menus:[
          {
            icon:'icon-nianbianhua',
            title:'年际变化',
            url:'/tabs/tab2/interannual-variation'
          },{
            icon:'icon-nianhualishuai',
            title:'历年过程线',
            url:'/tabs/tab2/cal-year-line'
          },{
            icon:'icon-linianzhenti',
            title:'多年平均年内分配',
            url:'/tabs/tab2/ann-avg-line'
          },{
            icon:'icon-sheji',
            title:'多年颗粒级配',
            url:'/tabs/tab2/ann-kl-line'
          }
        ]  
      },
      {
        title:'断面分析',
        menus:[
          {
            icon:'icon-biaozhunhengduanmian',
            title:'固段分析',
            url:'/tabs/tab3/guding-dm'
          },
          {
            icon:'icon-bianpoduanmianpipei',
            title:'大断面分析',
            url:'/tabs/tab3/da-dm'
          }
        ]  
      },
      //  {
      //   title:'库容分析',
      //   menus:[
      //     {
      //       icon:'icon-kurong',
      //       title:'库容分析',
      //       url:'/tabs/tab4/kurong'
      //     }
      //   ]  
      // },
      ]
    this.unitsService.autoUpdateApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      AppConfig.platform=this.device.platform
      AppConfig.uuid=this.device.uuid
      console.log(this.device.platform)
      // alert(this.device.uuid)
    });
  }
}
