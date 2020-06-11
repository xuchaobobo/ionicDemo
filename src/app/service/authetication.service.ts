/*
 * @Author: your name
 * @Date: 2020-04-08 11:24:52
 * @LastEditTime: 2020-04-08 12:14:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\service\authetication.service.ts
 */
import {Platform,NavController,LoadingController} from '@ionic/angular'
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import {Storage} from '@ionic/storage'
import { ProviderService } from '../service/provider.service'
import { Baseui } from '../common/baseui'
const TOKEN_KEY = 'auth-token'

@Injectable({
  providedIn: 'root'
})
export class AutheticationService extends Baseui  {
  authenticationState = new BehaviorSubject(false)
  constructor(private storage:Storage,private plt:Platform,public navCtrl:NavController,public loadingCtrl:LoadingController,public httpService:ProviderService) {
    super()
    this.plt.ready().then(()=>{
      this.checkToken()
    })
   }
   login(json){
    super.show(this.loadingCtrl);
    this.storage.get(TOKEN_KEY).then(res=>{
       
      //  this.authenticationState.next(true)
      if(res&&res.name==json.name){
        super.hide(this.loadingCtrl)
        this.authenticationState.next(true)
        this.navCtrl.navigateForward('tabs')
      }else{
        this.httpService.login(json).then(res=>{
          console.log(res)
          if(res=='success'){
            super.hide(this.loadingCtrl)
            return this.storage.set(TOKEN_KEY,json).then(
              res=>{
                this.authenticationState.next(true)
                this.navCtrl.navigateForward('tabs')
              }
            )
              
          }
         
        })
      }
       
     }).catch(err=>{
     
     })
   
   }
   isAuthentication(){
     return this.authenticationState.value;
   }
   loginOut(){
    return this.storage.remove(TOKEN_KEY).then(()=>{
      this.authenticationState.next(false)
    })
   }
   checkToken(){
    return this.storage.get(TOKEN_KEY)
   }
}
