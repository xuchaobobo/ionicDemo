/*
 * @Author: your name
 * @Date: 2020-04-18 21:08:23
 * @LastEditTime: 2020-05-15 17:47:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\pages\zb-table\zb-table.page.ts
 */
import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { AreaSelectComponent } from '../../../compontent/area-select/area-select.component'
import { KljpTableComponent } from '../../../compontent/kljp-table/kljp-table.component'
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import { AppConfig } from '../../../api.config'
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-zb-table',
  templateUrl: './zb-table.page.html',
  styleUrls: ['./zb-table.page.scss'],
  
})
export class ZbTablePage implements OnInit {
  titles:any='整编信息'
  message={
    emptyMessage: '无数据',

    // Footer total message
    totalMessage: '共',
  
    // Footer selected message
    selectedMessage: 'selected'
  }
  rows = [
  ];
  area=['金沙江下游']
  river='长江'
  cols=[]
  types=['z']
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
    {
      'name':'水位',
      'id':'z',
      'flag':true
    },
    {
      'name':'流量',
      'id':'q',
      'flag':false
    },
    {
      'name':'含沙量',
      'id':'cs',
      'flag':false
    },
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
  zbstartTime: any;
  zbendTime: any;
  riverMod='[{"startdist":2656492,"endist":1861000},{"startdist":2656492,"endist":2504802},{"startdist":2504802,"endist":2386081},{"startdist":2386081,"endist":2187648},{"startdist":2187648,"endist":2066259},{"startdist":2066259,"endist":1899600}]'
  selectedList='z'
  unit;
  min;
  max;
  typeObj={
    'z':'avz',
    'q':'avq',
    'cs':'avcs',
    'qs':'avqs',
    'tz':'avpd',
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
    this.area=['金沙江下游']
    this.river='长江'
    let year=parseInt(AppConfig.year)
    this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * year)).format('YYYY')
		this.max=moment(new Date(Date.now())).format('YYYY')
    this.zbstartTime = moment(new Date(Date.now() - 24 * 365 * 7 * 60 * 60 * 1000)).format('YYYY');

    this.zbendTime = moment(new Date(Date.now() - 24 * 365 * 2 * 60 * 60 * 1000)).format('YYYY');
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
    this.zbstartTime=moment(new Date(this.zbstartTime)).format('YYYY');
  }
  endTimeChange(e){
    this.zbendTime=moment(new Date(this.zbendTime)).format('YYYY');
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
    this.station =data.selectStations
    this.area=data.selectarea,
    this.river=data.selectriver,
    // this.riverMod=data.riverMod
		this.stationName = _.map(data.selectStations, 'stnm').join(',')
		
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
          
          var url = "swns/stsc/" + typeList + "/lineChart.gaeaway";
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
              obj.type='month'
              obj.treeStatus = 'collapsed';
              for(let j=0;j<stationList.length;j++){
                let filterObj=Object()
                
                if(typeList=='tz'){
                  filterObj={mth:num,stcd:stationList[j]}
                }else{
                  filterObj={dt:date,stcd:stationList[j]}
                }
                let val
                if(_.find(data,filterObj)!=undefined){
                  val=_.find(data,filterObj)[this.typeObj[typeList]]
                }else{
                  val=''
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
          let time=id.split('-')
          let mouth
          let day=this.unitService.getDayNumByYearMonth(time[0],time[1])
          if(time[1]<10){
            mouth='-0'+time[1]
          }else{
            mouth='-'+time[1]
          }
          let param = {
            "type": 'day',
            "startTime": time[0]+mouth+'-01',
            "endTime": time[0]+mouth+'-'+day,
            'stcds':stcds
          };
          // var rval =this.river;
          let typeList=this.selectedList
        
          var url = "swns/stsc/" + typeList + "/lineChart.gaeaway";
          this.httpService.getZbTable(url,param).then(res=>{
            let allData=JSON.parse(res)
            let data=JSON.parse(res).rows
            let arr=[]
            let len=day
            let num=1
            let stationList = stcds.split(',')
            if(typeList!='tz'){
              for(let i=0;i<len;i++){
                var obj=Object()
                
                let nowDay
                if(num<10){
                  nowDay='0'+num
                }else{
                  nowDay=num
                }
                let date=time[0]+mouth+'-'+nowDay
                obj.yr=nowDay
                obj.id=date
                obj.type='day'
                for(let j=0;j<stationList.length;j++){
                  let val
                  if(_.find(data,{dt:date,stcd:stationList[j]})!=undefined){
                    val=_.find(data,{dt:date,stcd:stationList[j]})[this.typeObj[typeList]]
                  }else{
                    val='-'
                  }
                  
                  obj[stationList[j]]=val
                }
                obj.parentId=id
                num++
                arr.push(obj)
              }
              
              if(_.findIndex(this.rows,arr)==-1){
                this.rows=[...this.rows,...arr]
    
              }
            }else{
              // debugger
              // console.log(allData)
            }
           
            
          })
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
  onSelect(e){
    
  }
  async onActivate(e){
    if(e.column&&e.column.prop!='yr'&&e.row.type=='month'&&this.selectedList=='tz'){
      console.log(e.column,e.row)
      let idarr=e.row.id.split('-')
      let month
      if(idarr[1]<10){
        month='-0'+idarr[1]
      }else{
        month='-'+idarr[1]
      }
      let param={
        stcd: e.column.prop,
        time: idarr[0]+month
      }
      
      const modal = await this.modalController.create({
        component: KljpTableComponent,
        cssClass: 'station_elect',
        componentProps: {
          tableDataparam: param,
          tableType:'kl',
          stnm:e.column.name
        }
      })
      await modal.present();
    }
  }
  setMargin({ row, column, value }){
    // if(row.type=='month'){
    //   return {
    //     'margin-left':'15px!important'
    //   }
    // }else if(row.type=='day'){
    //   return {
    //     'margin-left':'30px!important'
    //   }
    // }else{
    //   return {
    //     'margin-left':'0px'
    //   }
    // }
    
  }
  getYearData(){
    let stcds=_.toString(_.map(this.station,'stcd'))
    var param = {
			"type": 'year',
			"startTime": this.zbstartTime,
      "endTime": this.zbendTime,
      'stcds':stcds
    };
    
		// var rval =this.river;
    let typeList=this.selectedList
	
    var url = "swns/stsc/" + typeList + "/lineChart.gaeaway";
    this.httpService.getZbTable(url,param).then(res=>{
      this.unit=JSON.parse(res).unit
      let data=JSON.parse(res).rows
      let arr=[]
      let len=(this.zbendTime - this.zbstartTime)+1
      let num=Number(this.zbstartTime)
      let stationList = stcds.split(',')
      
      for(let i=0;i<len;i++){
        var obj=Object()
        obj.yr=num
        obj.id=num
        obj.type='year'
        for(let j=0;j<stationList.length;j++){
         
          let val
            if(_.find(data,{yr:num,stcd:stationList[j]})!=undefined){
              val=_.find(data,{yr:num,stcd:stationList[j]})[this.typeObj[typeList]]
            }else{
              val='-'
            }
          // let val=_.find(data,{yr:num,stcd:stationList[j]})[this.typeObj[typeList]]
          obj[stationList[j]]=val
        }
        num++
        arr.push(obj)
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
