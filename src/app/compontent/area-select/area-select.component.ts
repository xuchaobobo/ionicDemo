/*
 * @Author: your name
 * @Date: 2020-05-08 14:05:34
 * @LastEditTime: 2020-05-14 15:14:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\area-select\area-select.component.ts
 */
import { Component, Injectable, OnInit, ViewChild,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ToastController } from '@ionic/angular'
import { ProviderService } from './../../service/provider.service'
import { TREE_ACTIONS, KEYS, ITreeState, ITreeOptions} from 'angular-tree-component';
import { UnitsService } from './../../service/units.service'

import { toJS } from 'mobx'; 
import * as _ from 'lodash';



@Component({
  selector: 'app-area-select',
  templateUrl: './area-select.component.html',
  styleUrls: ['./area-select.component.scss'],
  
})
export class AreaSelectComponent implements OnInit {
 
  @Input() types:any
  @Input() defaultStation:any

  selectStations=this.defaultStation
  // selectStations=[]
  stations=[]
  nodes 
  state: ITreeState;
  defaultChecked
  
  selectArea=[]
  // fenqu
  // options:{
  //   useTriState: false,
  // }
 
  constructor(
    private service: UnitsService,
    public httpService:ProviderService, 
    public modal:ModalController,
    public toastController:ToastController
  ) { 
    
    // this.state = {
    //   ...this.state,
    //   // focusedNodeId
    // };
  }
  options: ITreeOptions = {
    displayField: 'name',
    // useCheckbox: true,
    // getChildren:this.getChildren.bind(this),
    isExpandedField: 'expanded',
    idField: 'id',
    hasChildrenField: 'children',
    
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        },
        click: (tree, node) => this.check(node, !node.data.checked)
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    nodeHeight: 23,
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },
    
  }
  items;
  rows: string[];
  rivers
  selectRiver
  selected_node_id: object[]=[];
  selected_node_name = '';
  riverMod
  
  public check(node, checked) {
    this.updateChildNodeCheckbox(node, checked);
    this.updateParentNodeCheckbox(node.realParent);
    
  }
 
  public updateChildNodeCheckbox(node, checked) {
    node.data.checked = checked;
    let obj={
      "startdist":node.data.startdist,
      "endist":node.data.endist
    }
    if (checked) {
      // this.selected_node_id.push(node.data.id)
      // let arr:any[]=
      this.selected_node_id=_.concat(this.selected_node_id,node.data)
      // alert(node.data.text);
    }else{
      
      if(this.selected_node_id.length>0){
        this.selected_node_id=_.filter(this.selected_node_id,function(item,i){
          return item['name']!=node.data.name&& item['name']!=node.data.area1
        })
      }
     
    }
    this.getRivers(this.selected_node_id)
    if (node.children) {
      node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
    }
  }
 
  public updateParentNodeCheckbox(node) {
    if (!node) {
      return;
    }
 
    let allChildrenChecked = true;
    let noChildChecked = true;
 
    for (const child of node.children) {
      if (!child.data.checked || child.data.indeterminate) {
        allChildrenChecked = false;
      }
      if (child.data.checked) {
        noChildChecked = false;
      }
    }
 
    if (allChildrenChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
    }
    this.updateParentNodeCheckbox(node.parent);
  }
 
 
 
  ngOnInit() {
    this.initAreaData()
   
  }
  getChildren(node: any) {
    const newNodes = [
      {
        name: 'child1'
      }, {
        name: 'child2'
      }
    ];

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 1000);
    });
  }
  treeinit(data,defaultChecked?) {
    
    // 删除所有children，以防止多次调用。
    data.forEach(function (item) {
      delete item.children;
    });
    // 将数据存储为以ID为KEY的map索引数据列
    var map = {};
    data.forEach(function (item) {
      map[item.id] = item;
    });
    let val = [];
    data.forEach(function (item) {
      // 以当前遍历项的pid，去map对象中找到索引的ID。
      var parent = map[item.pid];
      // 如果找到索引，那么说明此项不在顶级当中，那么需要把此项添加到，他对应的父级中。
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID，那么直接把当前的item添加到val结果集中，作为顶级。
        val.push(item);
      }
    });
    return val;
  }
  dissView(){
    this.modal.dismiss()
  }
  initAreaData(){
    this.httpService.getAllAreas().then(async res=>{
      var areaArr=[];	
      let that=this
			res = JSON.parse(res)
			  _.forEach(res,function(val,i){
          if(val.length>0){
            for(let i=0;i<val.length;i++){
              
            if(val[i].area2==null){
              val[i]['name']=val[i].area1;
              val[i]['id']=val[i].area1
              val[i]['pid']=null
             
            }else{
              val[i]['name']=val[i].area2;
              val[i]['id']=val[i].area2
              val[i]['pid']=val[i].area1
            }
            if(val[i].area1=='三峡库区'){
              val[i]['checked']=true
              that.selected_node_id.push(val[i])
            }
            areaArr.push(val[i])
          }
           
          }

			  })
		
	
			 
        this.nodes=this.treeinit(areaArr,this.defaultChecked)
        this.getRivers(this.selected_node_id)
		  })
  }
  getRivers(checkedData){
    let arr=[]
    if(checkedData.length>0){
      for(let i=0;i<checkedData.length;i++){
        var obj={
          "startdist":checkedData[i].startdist,
          "endist":checkedData[i].endist
        }
        arr.push(obj)
      }
      
    }
    this.riverMod=JSON.stringify(arr)
    this.httpService.getAllRivers(JSON.stringify(arr)).then(res=>{
      let data=JSON.parse(res)
      let arrRiver=[]
      _.forEach(data.name,function(item){
        arrRiver.push({name:item,children:[]})
      })
      this.rivers=arrRiver
      this.selectRiver=data.name[0]
      this.riverSelect(arrRiver[0])
      this.selectStations=this.defaultStation
    })
  }
  riverSelect(river){
    
    let typeStr=_.toString(this.types).toUpperCase()
    let param = Object()
    if (river.name == '长江' ||river.name == '金沙江') {
      param.riverMod = this.riverMod
    } else {
      param.rivers = river.name
    }
    param.type=typeStr
    
  
    let stnm=this.defaultStation
    let arr=[]
    this.httpService.getStationByRiver(param).then(res=>{
      let data=JSON.parse(res)
     
        data.forEach(function(iten){

          
          if(_.findIndex(stnm,{'stcd':iten.stcd})!=-1){
            iten.flag=true
            arr.push(iten)
          }else{
            iten.flag=false
          }
       
      })
      
      this.stations=_.concat(this.stations,arr)
      this.stations=_.uniqWith(this.stations,_.isEqual)
      this.rivers.forEach(function(item){
        
        if(item.name==river.name){
          item.children=data
        }
      })
    })
  }
  async changeSelect(selectStation){
    this.selectStations=this.defaultStation
      selectStation.flag=!selectStation.flag
    
      if(selectStation.flag){
        this.selectStations.push(selectStation)
        
      }else{
        this.selectStations=_.filter(function(iten){
          return iten.stnm!=selectStation.stnm
        })
      }
    
   
  }
  selestData(){
    this.selectStations=_.uniqWith(this.selectStations,_.isEqual)
    this.modal.dismiss({
      selectStations:this.selectStations,
      // riverMod:this.riverMod
    })
  }
 




}
