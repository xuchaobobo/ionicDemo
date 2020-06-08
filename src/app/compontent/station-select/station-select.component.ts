/*
 * @Author: your name
 * @Date: 2020-04-08 13:36:06
 * @LastEditTime: 2020-05-06 14:40:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\compontent\station-select\station-select.component.ts
//  */
import * as $ from 'jquery'
import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ToastController } from '@ionic/angular'
import { ProviderService } from './../../service/provider.service'
import * as _ from 'lodash';

@Component({
  selector: 'app-station-select',
  templateUrl: './station-select.component.html',
  styleUrls: ['./station-select.component.scss'],
})
export class StationSelectComponent implements OnInit {
  public menulists:any;
  @Input() types: any;
  @Input() typeLen:any;
  @Input() defaultStation:any
  fenqu:any;
  stations=[]
  riverList=[]
  constructor( 
     public httpService:ProviderService, 
     public modal:ModalController,
     public toastController:ToastController) {

      }

  ngOnInit() {
    this.initdata()
    
  }
  async changeSelect(selectStation){
    if(this.typeLen==1){
      selectStation.flag=!selectStation.flag
    
      if(selectStation.flag){
        this.stations.push(selectStation)
        
      }else{
        this.stations=_.filter(function(iten){
          return iten.stnm!=selectStation.stnm
        })
      }
    }else if(this.typeLen>1){
        if(this.stations.length>0&&!(selectStation.flag)){
          const toast =await this.toastController.create({
            message: '站点不能多选',
            duration: 2000
          })
          toast.present()
        }else{
          
          selectStation.flag=!selectStation.flag
    
          if(selectStation.flag){
            this.stations.push(selectStation)
            
          }else{
            this.stations=_.filter(function(iten){
              return iten.stnm!=selectStation.stnm
            })
          }
        }
        
    }
   
  }
  dissView(){
    this.modal.dismiss()
  }
  selestData(){
    this.stations=_.uniqWith(this.stations,_.isEqual)
    this.modal.dismiss({
      selectStation:this.stations
    })
  }
  fenquSelect(ites){
    let valArr=[]
    let newMenuList=this.menulists
   _.forEach(newMenuList,function(item){
     
     if(item.title==ites.title){
      item.active=true
     }else{
      item.active=false
     }
     if(item.children.length>0){
      _.forEach(item.children,function(cliItem){
       
        if(cliItem.title==ites.title){
          cliItem.active=true
         }else{
          cliItem.active=false
         }
      })
     }
   })
   this.menulists=newMenuList
    valArr.push({
      "startdist":ites.startdist,
      "endist":ites.endist
    })
    
    this.fenqu=JSON.stringify(valArr)
    this.initRiverAndStation(this.fenqu)
    
  }
  riverSelect(river){
    let typeStr=_.toString(this.types)
    let param = Object()
    if (river.name == '长江' ||river.name == '金沙江') {
      param.riverMod = this.fenqu
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
      
      this.stations=arr
      this.riverList.forEach(function(item){
        
        if(item.name==river.name){
          item.children=data
        }
      })
    })
  }
  initRiverAndStation(data){
    let arrRiver=[]
    this.httpService.getAllRirver({'riverMod':data}).then(res=>{
      let data=JSON.parse(res)
      _.forEach(data.name,function(item){
        arrRiver.push({name:item,children:[]})
      })
      this.riverList=arrRiver
      this.riverSelect(arrRiver[0])
    })
  }
  initdata(){
    this.httpService.getAllAreas().then(res=>{
      console.log(res)
      res = JSON.parse(res)
      var areaArr=[];
				$.each(res,function(i,val){
					var obj={
						
					};
					if(val.length>=1){
						var arr=[]
						for(let i=0;i<val.length;i++){
							
							if(val[i].area2!=null){
								
								val[i]['title']=val[i].area2;
                val[i]['id']=val[i].area2
                val[i]['pid']=0
                val[i]['active']=false
								arr.push(val[i])
							}else{
								val[i]['title']=val[i].area1;
                val[i]['id']=val[i].area1
                val[i]['pid']=1
                if(val[i].area1=='三峡库区'){
                  val[i]['active']=true
                }else{
                  val[i]['active']=false
                }
                
								obj=val[i]
							}
						}
						obj['children']=arr
					}
					areaArr.push(obj)
        })
  this.menulists=areaArr
  this.fenqu = '[{"startdist":2656492,"endist":1861000}]'
  this.initRiverAndStation(this.fenqu)
 
  
      // this.initTree('#myZtree', areaArr);
    })
  }
}
