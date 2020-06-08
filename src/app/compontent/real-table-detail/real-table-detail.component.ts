import { Component, Injectable, OnInit, ViewChild,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ProviderService } from './../../service/provider.service'

@Component({
  selector: 'app-real-table-detail',
  templateUrl: './real-table-detail.component.html',
  styleUrls: ['./real-table-detail.component.scss'],
})
export class RealTableDetailComponent implements OnInit {

  @Input() tableDataparam:any
  @Input() tableObj:any
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
    console.log(this.tableObj)
    this.httpServer.getRealDetailTable(this.tableObj.detailUrl,this.tableDataparam).then(res=>{
      let data=JSON.parse(res)
      this.rows=data
    })
  }
  showDdb(dt){
    
  }

}
