import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import { AppConfig } from '../../../api.config'
import * as _ from 'lodash';
import * as moment from 'moment'
@Component({
  selector: 'app-ann-avg-line',
  templateUrl: './ann-avg-line.page.html',
  styleUrls: ['./ann-avg-line.page.scss'],
})
export class AnnAvgLinePage implements OnInit {

  titles: any = '多年平均年内分配';
  nowYear: any;
  seleceList: any = [
    {
      'name': '水位',
      'value': 'Z',
      'id': '1',
      'flag': true
    },
    {
      'name': '径流量',
      'value': 'Q',
      'id': '2',
      'flag': false
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
  types = ['Z']
  selectYear = ['2018']
  years = []
  min;
  max;
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
    let yearData=parseInt(AppConfig.year)
    let lastYear=AppConfig.lastYear
		let dataStart=(parseInt(AppConfig.lastYear)-yearData+1).toString()
    this.min=dataStart
		this.max=lastYear
    this.stationName = "朱沱(三)"
    this.startTime = dataStart;
    this.endTime = lastYear;

  }
  ngOnInit() {
    this.initYears()
    this.searchData()
  }
  initYears() {
    let yearData=parseInt(AppConfig.year)
    let nowYear = parseInt(AppConfig.lastYear) 
    for (var i = 0; i < yearData; i++) {
      this.years.push({ "name": nowYear, "value": nowYear })

      nowYear--
    }
  }
  startTimeChange(e) {
    this.startTime = moment(this.startTime).format('YYYY')
  }
  endTimeChange(e) {
    this.endTime = moment(this.endTime).format('YYYY')
  }
  changeSelect(id) {
    let arr = []
    this.seleceList.forEach(function (item) {
      item.flag = false
      if (item.id == id) {
        arr.push(item.value)
        item.flag = true
      }
    })
    this.types = arr
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
    this.area=data.selectarea,
		this.river=data.selectriver,
    this.stationName = _.map(data.selectStation, 'stnm').join(',')
  }
  searchData() {

    var inturlType=this.types[0].toLowerCase();
    var inturlname=_.toString(_.map(_.filter(this.seleceList,{'flag':true}),'name'))
    var startNames=_.map(this.station,'stnm');
    var stcdslist=_.map(this.station,'stcd')
    var stcds=_.toString(stcdslist);
    var yearslist=this.selectYear;
    var years=_.toString(yearslist)
    var startTime=this.startTime,endTime=this.endTime;
    
    var url='/swns/stsc/'+inturlType+'/EveryMonthAvg.gaeaway'
    
    // var url = '/swns/stsc/'+inturlType+'.gaeaway';
    var params={
      'stcds':stcds,
      'years':years,
      'months':'1,2,3,4,5,6,7,8,9,10,11,12',
      'startAVGTime':startTime,
      'endAVGTime':endTime,
      
    };
    var avgption = {
			title:{
				text:'',
				x:'center'
			},
			tooltip : {
				trigger : 'axis',
				hideDelay:2000,
				formatter:function(params){
					var str="<div class='_ec_tolltip'>";
				
					var xValue = params[0].value[0];
					var unit;
					if(avgption.title.text.indexOf('径流量')!=-1){
						unit='(亿m³)'
					}else if(avgption.title.text.indexOf('输沙量')!=-1){
						unit='(万t)'
					}else if(avgption.title.text.indexOf('水位')!=-1){
						unit='(m)'
					}

					for(var i = 0;i<params.length;i++){
						str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+":</span><span class='_ec_value'>"+params[i].value+unit+"</span></div>";
					}
					
					str+="<div>";
					return str;
					
				}
			},
			grid:{
			
				top:90,
        left:20,
        right:20,
				containLabel: true
			},
			legend:{
				type:'scroll',
				width:'90%',
				orient : "horizontal",
				x : 'center',
				y : 20,
				data:[]
			},
			xAxis : {
				scale:true,
				name : "时间",
        type : 'category',
        nameLocation:'middle',
        nameTextStyle:{
          lineHeight:60
        },
				boundaryGap: false,
				data : []
			},
			yAxis : {
				name:'',
				scale:true,
				type : 'value'
			},
			series : []
		};
    this.httpService.getIntTab3PData(url,params).then(response=>{
      let res = JSON.parse(response)
      if(res){
        var serise=[];
        var lends=[],type;
        var names=inturlname
        var boundaryGapFlag=false
        if(inturlname=='水位'){
          inturlname='水位(m)'
          boundaryGapFlag=false
          type='line'
        }else if(inturlname=='输沙量'){
          boundaryGapFlag=true
          inturlname='输沙量(万t)'
          type='bar'
        }else if(inturlname=='径流量'){
          boundaryGapFlag=true
          inturlname='径流量(亿m³)'
          type='bar'
        }
        _.forEach(res,function(val,i){
          var obj={
            name : i,
            
            data : val,
            type : type,
            symbol:'none',
          }
          lends.push(i)
          serise.push(obj)
        })
        
        avgption.series=serise;
        
        avgption.legend.data=lends;
        avgption.yAxis.name=inturlname;
        avgption.title.text='多年平均'+names+'年内分布变化';
        avgption.xAxis.name='时间(月)'
        avgption.xAxis.boundaryGap=boundaryGapFlag
        avgption.xAxis.data=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
        this.initEchart(avgption)
      }
    })
  }
  public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('annAvgchart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }
}
