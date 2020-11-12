import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import * as _ from 'lodash';
import * as moment from 'moment'
@Component({
  selector: 'app-cal-year-line',
  templateUrl: './cal-year-line.page.html',
  styleUrls: ['./cal-year-line.page.scss'],
})
export class CalYearLinePage implements OnInit {

  titles:any='历年过程线';
  nowYear:any;
  seleceList:any=[

    {
      'name': '径流量',
      'value': 'Q',
      'id': '2',
      'flag': true
    },
    {
      'name': '输沙量',
      'value': 'QS',
      'id': '3',
      'flag': false
    },
  ]
station
stationName
startTime
endTime
area='金沙江下游'
river='长江'
types = ['Q']
constructor(
  public modalController: ModalController,
  public toastController: ToastController,
  public httpService: ProviderService,
) {
  this.station = [{
    stcd: "60104800",
    stnm: "朱沱(三)",
    stct: null,
    bshncd: null,
    hnnm: null,
    rvnm: "长江",
    obitmcd: null
  }]
  this.stationName = "朱沱(三)"
  this.startTime = moment(new Date(Date.now() - 24 * 365 * 13 * 60 * 60 * 1000)).format('YYYY');
  this.endTime = moment(new Date(Date.now() - 24 * 365 * 3 * 60 * 60 * 1000)).format('YYYY');
 
}
ngOnInit() {
  this.searchData() 
}
startTimeChange(e){
  this.startTime=moment(this.startTime).format('YYYY')
}
endTimeChange(e){
  this.endTime=moment(this.endTime).format('YYYY')
}
  async changeSelect(selectedType){
    if (selectedType.flag) {
			this.seleceList.forEach(function (item) {
				if (item.id == selectedType.id) {
					item.flag = !item.flag
				}
			})

			this.types = _.pull(this.types, selectedType.value)
		} else {
			if (this.types.length > 1 && !(selectedType.flag)) {
				const toast = await this.toastController.create({
					message: '类型选择不能超过两个',
					duration: 2000
				})
				toast.present()
				return false
			} else {
				this.seleceList.forEach(function (item) {
					if (item.id == selectedType.id) {
						item.flag = !item.flag
					}
				})
			}
			this.types.push(selectedType.value)


		}
  }
 
  async selectSation() {

    const modal = await this.modalController.create({
      component: StationSelectComponent,
      cssClass: 'station_elect',
      componentProps: {
        types: this.types,
        typeLen: this.types.length,
        defaultArea:this.area,
				defaultRiver:this.river,
        defaultStation: this.station
      }
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.station = data.selectStation
    this.area=data.selectarea
		this.river=data.selectriver
    this.stationName = _.map(data.selectStation, 'stnm').join(',')
  }
  async searchData(){
    var inturlType=this.types;
    
      var selectedType=_.filter(this.seleceList,{'flag':true})
			var inturlTypeName=_.map(selectedType,'name');
     
			var startNames=_.map(this.station,'stnm');
			var stcdslist=_.map(this.station,'stcd')
			var stcds=_.toString(stcdslist);
			var startTime=this.startTime,endTime=this.endTime;
			var urls=[];
			_.forEach(inturlType,function(val,i){
        let uls;
        if(val=='Q'){
          uls='qs/sedimentLineChart'
        }else{
          uls='q/runoffLineChart'
        }
				urls.push( '/swns/stsc/'+uls+'.gaeaway')
			})
		
			// var url = '/swns/stsc/'+inturlType+'.gaeaway';
			var params={
				'stcds':stcds,
				'startTime':startTime,
				'endTime':endTime,
				'stationNames':startNames,
				'type':'year'
			};
			if(inturlType.length>1&&stcdslist.length>1){
				const toast = await this.toastController.create({
					message: '类型选择不能超过两个',
					duration: 2000
				})
				toast.present()
			}else{
        var toption = {
          title:{
            text:'',
            x:'center'
          },
          tooltip : {
            trigger : 'axis',
            
          },
          grid:{
            top : 80,
            left:20,
            right:20,
            // left : 20,
            // right : 80,
            // bottom : 10,
            containLabel: true
          },
          legend:{
            type:'scroll',
            width:'80%',
            orient : "horizontal",
            x : 'center',
            y : 20,
            data:[]
          },
          xAxis : {
            
            scale:true,
            name : "时间",
            nameLocation:'middle',
            nameTextStyle:{
              lineHeight:60
            },
            boundaryGap: false,
            
            type : 'category',
            data : []
          },
          yAxis : [{
    
            name:'',
            scale:true,
            type : 'value',
            
          }],
          series : []
        };
       
        if(urls.length==1){
          this.httpService.getIntTab2PData(urls[0],params).then(reponse=>{
            let res = JSON.parse(reponse)
            if(res){
              let list=res;
              let serise=[];
              let lends=[]
              var xAxisData;
              
              _.forEach(list,function(val,i){
              
                if(_.indexOf(stcdslist,i)!=-1){
                  if(val.xAxis.data.length>0){
                    toption.xAxis.data=val.xAxis.data;
                  }
                  
                  var obj={
                    name :val.name,
                    data : val.data,
                    symbol:'none',
                    type : val.type
                  }
                  
                  lends.push(val.name)
                  serise.push(obj)
                }
    
                
              })
              var yName;
              if(inturlTypeName[0]=='输沙量'){
                yName='输沙量(万t)'
              }else{
                yName='径流量(亿m³)'
              }
              toption.series=serise;
              toption.legend.data=lends;
              toption.yAxis[0].name=yName;
              //+inturlTypeName[0]
              toption.title.text=res.rows.stnm.join(',')+'年变化对比'
              // toption.xAxis.data=xAxisData;
             
              
              this.initEchart(toption)
            }
          })
         
        }else{
          this.httpService.getIntTab2PData(urls[0],params).then(reponse=>{
            let res = JSON.parse(reponse)
            this.httpService.getIntTab2PData(urls[1],params).then(reponse1=>{
              let res1 = JSON.parse(reponse1)
              let list=res,list1=res1;
              let serise=[],yAxis=[];
              let lends=[]
              let titleName=[]
              var xAxisData;
              _.forEach(list,function(val,i){
                console.log(i,val);
                if(_.indexOf(stcdslist,i)!=-1){
                  if(val.xAxis.data.length>0){
                    toption.xAxis.data=val.xAxis.data;
                  }
                  var obj={
                    name :val.name,
                    data : val.data,
                    type : val.type,
                    symbol:'none',
                    yAxisIndex:0,
                  
                  }
                  var yName;
                  if(val.name.indexOf('输沙量')!=-1){
                    yName='输沙量(万t)'
                  }else{
                    yName='径流量(亿m³)'
                  }
                  var obj1={
                    name:yName,
                    scale:true,
                    type : 'value',
                    
                  }
                  yAxis.push(obj1)
                  lends.push(val.name)
                  titleName.push(yName)
                  serise.push(obj)
                }
    
                
              })
              _.forEach(list1,function(val,i){
               
                if(_.indexOf(stcdslist,i)!=-1){
                  if(val.xAxis.data.length>0){
                    toption.xAxis.data=val.xAxis.data;
                  }
                  var obj={
                    name : val.name,
                    data : val.data,
                    type : val.type,
                    symbol:'none',
                    yAxisIndex:1,
                  
                  }
                  var yName1;
                  if(val.name.indexOf('输沙量')!=-1){
                    yName1='输沙量(万t)'
                  }else{
                    yName1='径流量(亿m³)'
                  }
                  var obj1={
                    name:yName1,
                    scale:true,
                    type : 'value'
                  }
                  yAxis.push(obj1)
                  lends.push(val.name)
                  titleName.push(yName1)
                  serise.push(obj)
                }
    
                
              })
            toption.series=serise;
            toption.legend.data=lends;
            var lengName=titleName.join('、')
            toption.yAxis=yAxis;
            toption.title.text=lengName+'年变化对比'
            // toption.xAxis.data=xAxisData;
            this.initEchart(toption)
            })
          })
        
        }
        
			}
  }
 public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('calYearchart');
    this.chart = ec.init(container);
   this.chart.clear()
    this.chart.setOption(option);
  }

}

