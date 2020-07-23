import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../service/provider.service'
import { AppConfig } from './../../api.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name='原松'
  password:any='Q_2345_Q';
  dep='长江委水文局'
  uuid=''
  depList=[]
  constructor(
    public http:ProviderService,
  ) { }

  ngOnInit() {
    this.getDep()
  }
  getDep(){
    this.http.depData().then(res=>{
      // alert('res'+res)
      this.depList=JSON.parse(res).data
      this.dep=this.depList[1]
    }).catch(error=>{
      // alert('error'+error)
    })
  }
  getUuid(){
    this.uuid=AppConfig.uuid
  }
  register(){

  }

}
