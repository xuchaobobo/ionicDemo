/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2020-04-11 16:59:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\login\login.page.ts
 */
import { Component, OnInit } from '@angular/core';

import {NavController} from '@ionic/angular'

import { ProviderService } from '../service/provider.service'
import { AutheticationService } from './../service/authetication.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit {
  name='王伟'
  password:any='123456';
  constructor(
    public navCtrl:NavController,
    public httpService:AutheticationService,
     private geolocation: Geolocation) {
      
     }

  logIn(){
  
    //  window.localStorage.setItem('token',userInfo)
     var json={
        dep:'长江委水文局',
        name:this.name,
        password:this.password
     }
    this.httpService.login(json)
  
  }
  ngOnInit() {
  //  this.getGps()
  }
  getGps(){
    this.geolocation.getCurrentPosition().then((resp) => {
      alert(resp.coords.latitude+'-'+resp.coords.longitude)
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      alert(data.coords.latitude+'-'+data.coords.longitude)
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
     });
  }

}
