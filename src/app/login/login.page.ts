/*
 * @Author: your name
 * @Date: 2020-04-03 16:56:05
 * @LastEditTime: 2021-04-07 10:42:20
 * @LastEditors: xcb
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\login\login.page.ts
 */
import { Component, OnInit } from '@angular/core';

import { NavController ,ToastController} from '@ionic/angular'

import { ProviderService } from '../service/provider.service'
import { AutheticationService } from './../service/authetication.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage'
import { BehaviorSubject } from 'rxjs'
import { Md5 } from "ts-md5/dist/md5";
import { Baseui } from '../common/baseui'

const TOKEN_KEY = 'auth-token'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends Baseui implements OnInit {
  name = ''
  password: any = '';
  dep = ''
  depList = []
  nums = ['C', '6', 'Z', 't'];
  yzm=''
  str = '';
  canvas = null
  image = null
  authenticationState = new BehaviorSubject(false)
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public httpService: AutheticationService,
    public http: ProviderService,
    public toastController: ToastController,
    private geolocation: Geolocation) {
      super();
  }

  logIn() {

    //  window.localStorage.setItem('token',userInfo)
    var json = {
      dep: this.dep,
      name: this.name,
      password: Md5.hashStr(this.password).toString()
    }
    let str=this.nums.join('').toLowerCase()
    if(this.yzm.toLowerCase()==str){
      console.log(str,this.yzm)
      this.httpService.login(json)
    }else{
      super.showToast(this.toastController,'验证码错误')
      this.yzm=''
    }
   


  }
  ngOnInit() {
    this.getDep()
    this.drawCode("");
    this.setInterForm()
    //  this.getGps()
  }
  setInterForm() {
    let that = this
    setInterval(function () {
      that.getDep()
      this.dep='';
     this.name='';
      this.password='';
      that.drawCode("");
    }, 60000)
  }
  getCode(n) {
    var all = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
    var b = [];
    for (var i = 0; i < n; i++) {
      var index = Math.floor(Math.random() * 62);
      b.push(all.charAt(index));

    }
    return b;
  };
  // 绘制验证码
  drawCode(str) {
    // this.resetCode()

    this.canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
    var context: CanvasRenderingContext2D = this.canvas.getContext("2d"); //获取画布2D上下文
    context.fillStyle = "white"; //画布填充色
    context.fillRect(0, 0, this.canvas.width, this.canvas.height); //清空画布
    context.fillStyle = "cornflowerblue"; //设置字体颜色
    context.font = "25px Arial"; //设置字体
    var rand = new Array();
    var x = new Array();
    var y = new Array();
    this.nums = this.getCode(4)
    for (var i = 0; i < 4; i++) {
      rand.push(rand[i]);
      rand[i] = this.nums[i]
      x[i] = i * 20 + 10;
      y[i] = Math.random() * 20 + 20;
      context.fillText(rand[i], x[i], y[i]);
    }
    str = rand.join('').toUpperCase();
    //画3条随机线
    for (var i = 0; i < 3; i++) {
      this.drawline(this.canvas, context);
    }

    // 画30个随机点
    for (var i = 0; i < 30; i++) {
      this.drawDot(this.canvas, context);
    }
    this.convertCanvasToImage(this.canvas);
    return str;
  }

  // 随机线
  drawline(canvas, context) {
    context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
    context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
    context.lineWidth = 0.5; //随机线宽
    context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
    context.stroke(); //描边，即起点描到终点
  }
  // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
  drawDot(canvas, context) {
    var px = Math.floor(Math.random() * canvas.width);
    var py = Math.floor(Math.random() * canvas.height);
    context.moveTo(px, py);
    context.lineTo(px + 1, py + 1);
    context.lineWidth = 0.2;
    context.stroke();

  }
  // 绘制图片
  convertCanvasToImage(canvas) {
    document.getElementById("verifyCanvas").style.display = "none";
    this.image = document.getElementById("code_img");
    this.image.src = canvas.toDataURL("image/png");
    return this.image;
  }
  getDep() {
    this.http.depData().then(res => {
      // alert('res'+res)
      this.depList = JSON.parse(res).data
      // this.dep=this.depList[2]
    }).catch(error => {
      // alert('error'+error)
    })
  }
  getGps() {
    this.geolocation.getCurrentPosition().then((resp) => {
      alert(resp.coords.latitude + '-' + resp.coords.longitude)
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      alert(data.coords.latitude + '-' + data.coords.longitude)
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

}
