import { Component, OnInit } from '@angular/core';
import {Platform,NavController,LoadingController,ToastController} from '@ionic/angular'
import { ProviderService } from '../../../service/provider.service'
import { Baseui } from '../../../common/baseui'
import { AppConfig } from '../../../api.config';

@Component({
  selector: 'app-edit-pwd',
  templateUrl: './edit-pwd.page.html',
  styleUrls: ['./edit-pwd.page.scss'],
})
export class EditPwdPage  extends Baseui implements OnInit {
  name=AppConfig.userName
  password:any=AppConfig.userName;
  id=AppConfig.userId
  newpassword=''
  constructor(public http:ProviderService,public toastController: ToastController) {
    super()
   }

  ngOnInit() {
  }
  editPwd(){
    var json={
      userId:this.id,
      opassword:this.password,
      npassword:this.newpassword
    }
    this.http.updatePsd(json).then(res=>{
      // alert('res'+res)
      if(res){
        super.showToast(this.toastController,'修改成功')
      }
    }).catch(error=>{
      super.showToast(this.toastController,'修改失败')
      // alert('error'+error)
    })
  }

}
