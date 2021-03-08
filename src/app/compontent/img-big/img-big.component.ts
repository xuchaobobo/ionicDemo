/*
 * @Descripttion: 
 * @version: 
 * @Author: xcb
 * @Date: 2021-03-08 14:57:20
 * @LastEditors: xcb
 * @LastEditTime: 2021-03-08 16:34:11
 */
import panzoom from 'panzoom'
import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"

@Component({
  selector: 'app-img-big',
  templateUrl: './img-big.component.html',
  styleUrls: ['./img-big.component.scss'],
})
export class ImgBigComponent implements OnInit {
  @Input() url:any
  constructor(public modal:ModalController) {

   }

  ngOnInit() {
    var emelent=document.getElementById('pdfImg')
    panzoom(emelent)
  }
  dissView(){
    this.modal.dismiss()
  }
}
