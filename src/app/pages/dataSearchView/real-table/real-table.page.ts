/*
 * @Author: your name
 * @Date: 2020-04-18 21:07:40
 * @LastEditTime: 2020-05-15 17:50:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\real-table\real-table.page.ts
 */
import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { AreaSelectComponent } from '../../../compontent/area-select/area-select.component'
import { RealTableDetailComponent } from '../../../compontent/real-table-detail/real-table-detail.component'
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-real-table',
  templateUrl: './real-table.page.html',
  styleUrls: ['./real-table.page.scss'],
})
export class RealTablePage implements OnInit {
  titles='实测信息'
  message={
    emptyMessage: '无数据',

    // Footer total message
    totalMessage: '共',
  
    // Footer selected message
    selectedMessage: 'selected'
  }
  rows = [
  ];
  area=['三峡库区']
  river='长江'
  cols=[]
  types=['q']
  station=[{
    stcd: "60104800",
    stnm: "朱沱(三)",
    stct: null,
    bshncd: null,
    hnnm: null,
    rvnm: "长江",
    obitmcd: null
  }]
  stationName
  seleceList:any=[
    // {
    //   'name':'水位',
    //   'id':'z',
    //   'flag':true
    // },
    {
      'name':'流量',
      'id':'q',
      'flag':true
    },
    // {
    //   'name':'含沙量',
    //   'id':'cs',
    //   'flag':false
    // },
    {
      'name':'输沙率',
      'id':'qs',
      'flag':false
    },
    {
      'name':'颗粒级配',
      'id':'tz',
      'flag':false
    },
    
]
startTime: any;
endTime: any;
riverMod='[{"startdist":2656492,"endist":1861000},{"startdist":2656492,"endist":2504802},{"startdist":2504802,"endist":2386081},{"startdist":2386081,"endist":2187648},{"startdist":2187648,"endist":2066259},{"startdist":2066259,"endist":1899600}]'
selectedList='q'
unit
typeObj={
  'z':'avz',
  'q':'q',
  'cs':'avcs',
  'qs':'ssqs',
  'tz':'mdpd',
}
  constructor(
    private cd: ChangeDetectorRef,
    public modalController: ModalController,
		public toastController: ToastController,
		public httpService: ProviderService,
		public unitService:UnitsService
  ) {
    this.station = [{
			stcd: "60104800",
			stnm: "朱沱(三)",
			stct: null,
			bshncd: null,
			hnnm: null,
			rvnm: "长江",
			obitmcd: null
		},{
			stcd: "60105400",
			stnm: "寸滩",
			stct: null,
			bshncd: null,
			hnnm: null,
			rvnm: "长江",
			obitmcd: null
		}]
    this.stationName = "朱沱(三),寸滩"
    this.area=['三峡库区']
    this.river='长江'
    this.startTime = moment(new Date(Date.now() - 24 * 365*7 * 60 * 60 * 1000)).format('YYYY');

    this.endTime = moment(new Date(Date.now() - 24 * 365*2 * 60 * 60 * 1000)).format('YYYY');
   }

  ngOnInit() {
   this.getYearData()
  }
  changeSelect(select){
    this.selectedList=select.id
    let that=this
    this.seleceList.forEach(function(item){
      item.flag=false
        if(item.id==select.id){
            item.flag=!item.flag
            that.types=[select.id]
        }
    })
  }
  startTimeChange(e){
    this.startTime=moment(new Date(this.startTime)).format('YYYY');
  }
  endTimeChange(e){
    this.endTime=moment(new Date(this.endTime)).format('YYYY');
  }
	async selectRiver() {

		const modal = await this.modalController.create({
			component: AreaSelectComponent,
			cssClass: 'station_elect',
			componentProps: {
				types: this.types,
				defaultArea:this.area,
        defaultRiver:this.river,
				defaultStation: this.station
			}
		})
		await modal.present();
		const { data } = await modal.onDidDismiss();
		this.station = data.selectStations
    this.riverMod=data.riverMod
    this.area=data.selectarea,
    this.river=data.selectriver,
		this.stationName = _.map(data.selectStations, 'stnm').join(',')
		console.log(data);
  }
  async onActivate(e){
    if(e.column&&e.column.prop!='yr'){
      console.log(e.column,e.row)
      
      let tableObj={
        detailUrl:'',
        dataName:'',
        filedName:''
      }
      
      if(this.selectedList=='q'){
        tableObj.detailUrl="swns/stsc/obq/selectFlowByStcd.gaeaway";
        tableObj.dataName="流量（  m³/s）";
        tableObj.filedName="q";
      }else if(this.selectedList=='qs'){
        tableObj.detailUrl="swns/stsc/obqs/selectFlowByStcd.gaeaway";
        tableObj.dataName="输沙率（ kg/s）";
        tableObj.filedName="ssqs";
       
      }else{
        tableObj.detailUrl="swns/stsc/kl/selectChpdByStcdAndTime.gaeaway";
        tableObj.dataName="中数粒径（mm）";
        tableObj.filedName="mdpd";
      }
      let param
      if(e.row.type=='month'){
        let idarr=e.row.id.split('-')
        let month
        if(idarr[1]<10){
          month='-0'+idarr[1]
        }else{
          month='-'+idarr[1]
        }
        param={
          stcd: e.column.prop,
          // time: idarr[0]+month,
          startTime : idarr[0]+month+"-01",
          endTime : idarr[0]+month+"-31"
        }
      }else{
        param={
          stcd: e.column.prop,
          // time: idarr[0]+month,
          startTime : e.row.id+"-01",
          endTime :e.row.id+"-12"
        }
      }
      
      
      const modal = await this.modalController.create({
        component: RealTableDetailComponent,
        cssClass: 'station_elect',
        componentProps: {
          tableDataparam: param,
          tableObj:tableObj,
          stnm:e.column.name
        }
      })
      await modal.present();
    }
  }
  onTreeAction(e){
    
    let year=e.row.yr
    let id=e.row.id
    let row=e.row
    if (row.treeStatus === 'collapsed') {
      let stcds=_.toString(_.map(this.station,'stcd'))
      row.treeStatus = 'expanded';
     
      if(_.findIndex(this.rows,{parentId:id})==-1){
        if(e.row.type=='year'){
        
          let param = {
            "type": 'month',
            "startTime": year+'-01',
            "endTime": year+'-12',
            'stcds':stcds
          };
          // var rval =this.river;
          let typeList=this.selectedList
        
          let url
          if(typeList=='q'){
            url='swns/stsc/obq/selectFlow.gaeaway'
          }else if(typeList=='qs'){
            url='swns/stsc/obqs/selectSandy.gaeaway'
          }else{
            url='swns/stsc/kl/selectDdb.gaeaway'
          }
          this.httpService.getZbTable(url,param).then(res=>{
            let data=JSON.parse(res).rows
            let arr=[]
            let len=12
            let num=1
            let stationList = stcds.split(',')
            
            for(let i=0;i<len;i++){
              var obj=Object()
              let date=year+'-'+num
              obj.id=date
              obj.yr=num+'月'
              let month;
              obj.type='month'
              if(num<10){
                month='0'+num
              }else{
                month=num
              }
              obj.treeStatus = 'collapsed';
              for(let j=0;j<stationList.length;j++){
                let val
                if(_.find(data,{yr:_.toString(year),mth:_.toString(month),stcd:stationList[j]})){
                  val=_.find(data,{yr:_.toString(year),mth:_.toString(month),stcd:stationList[j]})[this.typeObj[typeList]]
                 
                }else{
                  val='-'
                }
                obj[stationList[j]]=val
              }
              obj.parentId=year
              num++
              arr.push(obj)
            }
            
            if(_.findIndex(this.rows,arr)==-1){
              this.rows=[...this.rows,...arr]
  
            }
            
          })  
        }else if(e.row.type=='month'){
    //       let time=id.split('-')
    //       let mouth
    //       let day=this.unitService.getDayNumByYearMonth(time[0],time[1])
    //       if(time[1]<10){
    //         mouth='-0'+time[1]
    //       }else{
    //         mouth='-'+time[1]
    //       }
    //       let param = {
    //         "type": 'day',
    //         "startTime": time[0]+mouth+'-01',
    //         "endTime": time[0]+mouth+'-'+day,
    //         'stcds':stcds
    //       };
    //       // var rval =this.river;
    //       let typeList=this.selectedList
        
    //       let url
    // if(typeList=='q'){
    //   url='swns/stsc/obq/selectFlow.gaeaway'
    // }else if(typeList=='qs'){
    //   url='swns/stsc/obqs/selectSandy.gaeaway'
    // }else{
    //   url='swns/stsc/kl/selectDdb.gaeaway'
    // }
    //       this.httpService.getZbTable(url,param).then(res=>{
    //         let data=JSON.parse(res).rows
    //         let arr=[]
    //         let len=day
    //         let num=1
    //         let stationList = stcds.split(',')
            
    //         for(let i=0;i<len;i++){
    //           var obj=Object()
              
    //           let nowDay
    //           if(num<10){
    //             nowDay='0'+num
    //           }else{
    //             nowDay=num
    //           }
    //           let date=time[0]+mouth+'-'+nowDay
    //           obj.yr=nowDay
    //           obj.id=date
    //           obj.type='day'
    //           for(let j=0;j<stationList.length;j++){
    //             let val
    //             if(_.find(data,{dt:date,stcd:stationList[j]})!=undefined){
    //               val=_.find(data,{dt:date,stcd:stationList[j]})[this.typeObj[typeList]]
    //             }else{
    //               val=''
    //             }
                
    //             obj[stationList[j]]=val
    //           }
    //           obj.parentId=id
    //           num++
    //           arr.push(obj)
    //         }
            
    //         if(_.findIndex(this.rows,arr)==-1){
    //           this.rows=[...this.rows,...arr]
  
    //         }
            
    //       })
        }
      }else{
        this.rows = [...this.rows];
      }
      
      this.cd.detectChanges();

    }else{
      if(row.type!='day'){
        row.treeStatus = 'collapsed';
      }
      
      this.rows = [...this.rows];
      this.cd.detectChanges();
    }
    
  }
  setMargin({ row, column, value }){
    if(row.type=='month'){
      return {
        'margin-left':'15px!important'
      }
    }else if(row.type=='day'){
      return {
        'margin-left':'30px!important'
      }
    }else{
      return {
        'margin-left':'0px'
      }
    }
    
  }
  getYearData(){
    let stcds=_.toString(_.map(this.station,'stcd'))
    var param = {
			"type": 'year',
			"startTime": this.startTime,
      "endTime": this.endTime,
      'stcds':stcds,
      // 'riverMod':this.riverMod
		};
		// var rval =this.river;
    let typeList=this.selectedList
    let url
    if(typeList=='q'){
      url='swns/stsc/obq/selectFlow.gaeaway'
    }else if(typeList=='qs'){
      url='swns/stsc/obqs/selectSandy.gaeaway'
    }else{
      url='swns/stsc/kl/selectDdb.gaeaway'
    }
    // var url = "swns/stsc/" + typeList + "/lineChart.gaeaway";
    this.httpService.getZbTable(url,param).then(res=>{
      
      this.unit=JSON.parse(res).unit
      let data=JSON.parse(res).rows
      let arr=[]
      let len=(this.endTime - this.startTime)+1
      let num=Number(this.startTime)
      let stationList = stcds.split(',')
      if(data.length>0){
        // for(let i=0;i<data.length;i++){
          
        // }

        for(let i=0;i<len;i++){
          var obj=Object()
          obj.yr=num
          obj.id=num
          obj.type='year'
          for(let j=0;j<stationList.length;j++){
            let val
            if(_.find(data,{yr:_.toString(num),stcd:stationList[j]})!=undefined){
              val=_.find(data,{yr:_.toString(num),stcd:stationList[j]})[this.typeObj[typeList]]
            }else{
              val='-'
            }
            obj[stationList[j]]=val
          }
          num++
          arr.push(obj)
        }
      }
      
      
      this.rows=_.reverse(arr).map(d => {
        d.treeStatus = 'collapsed';
        d.parentId = null;
        return d;
      });
      
      this.cols=this.station
    })
  }

}
