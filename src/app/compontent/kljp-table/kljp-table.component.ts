/*
 * @Author: your name
 * @Date: 2020-05-15 16:17:06
 * @LastEditTime: 2020-05-15 17:16:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\kljp-table\kljp-table.component.ts
 */
import { Component, Injectable, OnInit, ViewChild,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ProviderService } from './../../service/provider.service'

@Component({
  selector: 'app-kljp-table',
  templateUrl: './kljp-table.component.html',
  styleUrls: ['./kljp-table.component.scss'],
})
export class KljpTableComponent implements OnInit {
  @Input() tableDataparam:any
  @Input() stnm:any
  rows=[]
  message={
    emptyMessage: '无数据',

    // Footer total message
    totalMessage: '共',
  
    // Footer selected message
    selectedMessage: 'selected'
  }
  constructor( 
    public modal:ModalController,
    public httpServer:ProviderService
    ) { }

  ngOnInit() {
    this.getKlTable()
  }
  dissView(){
    this.modal.dismiss()
  }
  getKlTable(){
    console.log(this.tableDataparam)
    this.httpServer.getklTable(this.tableDataparam).then(res=>{
      let data=JSON.parse(res)
      this.rows=data
    })
  }
}
