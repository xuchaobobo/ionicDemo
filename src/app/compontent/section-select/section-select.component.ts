import * as $ from 'jquery'
import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from "@ionic/angular"
import { ToastController } from '@ionic/angular'
import { ProviderService } from './../../service/provider.service'
import * as _ from 'lodash';

@Component({
  selector: 'app-section-select',
  templateUrl: './section-select.component.html',
  styleUrls: ['./section-select.component.scss'],
})
export class SectionSelectComponent implements OnInit {
  public menulists:any;
  
  @Input() defaultSection:any
  @Input() dataType:any
  fenqu:any;
  allSection
  sections=[]
  riverList=[]
  constructor( 
     public httpService:ProviderService, 
     public modal:ModalController,
     public toastController:ToastController) {

      }

  ngOnInit() {
    this.initdata()
    
  }
  async changeSelect(selectSection){
    
    selectSection.flag=!selectSection.flag
      console.log(this.riverList)
      _.forEach(this.riverList,function(val,i){
        if(val.children.length>0){
          _.forEach(val.children,function(item,j){
            if(item.flag){
              item.flag=false
            }
            if(item.XSNM==selectSection.XSNM){
              item.flag=true
            }
          })
        }
      })
      if(selectSection.flag){
        this.sections=[selectSection]
        
      }else{
        this.sections=_.filter(function(iten){
          return iten.XSNM!=selectSection.XSNM
        })
      }
    
   
  }
  dissView(){
    this.modal.dismiss()
  }
  selestData(){
    this.sections=_.uniqWith(this.sections,_.isEqual)
    
    this.modal.dismiss({
      selectSection:this.sections,
      allSection: this.allSection
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
    
    let param=Object()
    if (river.name == '长江' ||river.name == '金沙江') {
      param.riverMod = this.fenqu
    } else {
      param.rivers = river.name
    }
    let url
    // if(this.dataType=='1'){
      url='swns/base/section/section.gaeaway'
    // }else{
    //   url='swns/base/section/msnos.gaeaway'
    //   param.xsst='N'
    // }
   
    let XSNM=this.defaultSection
    
    let arr=[]
    this.httpService.getSectionByRiver(url,param).then(res=>{
      let data=JSON.parse(res)
     
        data.forEach(function(iten){

          
          if(_.findIndex(XSNM,{'XSNM':iten.XSNM})!=-1){
            iten.flag=true
            arr.push(iten)
          }else{
            iten.flag=false
          }
       
      })
      
      this.sections=arr
      this.allSection=data
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
  this.fenqu='[{"startdist":2656492,"endist":1861000}]'
  this.initRiverAndStation(this.fenqu)
  
  
      // this.initTree('#myZtree', areaArr);
    })
  }
}
