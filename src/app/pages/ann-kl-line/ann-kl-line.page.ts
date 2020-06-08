import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from './../../compontent/station-select/station-select.component'
import { ProviderService } from './../../service/provider.service'
import * as _ from 'lodash';
@Component({
  selector: 'app-ann-kl-line',
  templateUrl: './ann-kl-line.page.html',
  styleUrls: ['./ann-kl-line.page.scss'],
})
export class AnnKlLinePage implements OnInit {

  titles:any='多年颗粒级配';
  seleceList:any=[
    {
      'name':'悬移质',
      'value':'CS',
      'id':'1',
      'flag':true
    },
    // {
    //   'name':'沙推移质',
    //   'id':'2',
    //   'flag':false
    // },
    // {
    //   'name':'卵石推移质',
    //   'id':'3',
    //   'flag':false
    // },
]
station
  types = ['CS']
  dateType = 'year'
  stationName
  selectedList = '悬移质'
  selectYear = ['2018']
  selectedMonth = ['1']
  years = []
  momths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
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
  }
  ngOnInit() {
    this.initYears()
  	this.searchData()
  }
  changeSelect(name) {
    this.selectedList = name
    this.seleceList.forEach(function (item) {
      item.flag = false
      if (item.name == name) {
        item.flag = !item.flag

      }
    })
  }
  async selectSation() {

    const modal = await this.modalController.create({
      component: StationSelectComponent,
      cssClass: 'station_elect',
      componentProps: {
        types: this.types,
        typeLen: this.types.length,
        defaultStation: this.station
      }
    })
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.station = data.selectStation

    this.stationName = _.map(data.selectStation, 'stnm').join(',')
  }
  initYears() {
    let nowYear = new Date().getFullYear() - 1
    for (var i = 0; i < 50; i++) {
      this.years.push({ "name": nowYear, "value": nowYear })

      nowYear--
    }
  }
  async monthChange(e){
    if(this.selectYear.length>1){
      const toast = await this.toastController.create({
        message: '条件错误，只能选择单年和多月数据或者多年单月数据套绘.',
        duration: 2000
      });
      toast.present();
      
      console.log(e)
      return false
    }
  }
  searchData(){
    var inturlType=this.types;
    var type=this.dateType
    var stationNames=_.map(this.station,'stnm');
    var stcdslist=_.map(this.station,'stcd')
    var stcds=_.toString(stcdslist);
    var yearTime=this.selectYear
    var startTime=_.toString(yearTime)
    var monthTime=_.toString(this.selectedMonth);
    var mulType=_.toString(_.map(_.filter(this.seleceList,{'flag':true}),'name'))
    
    
    // var url = '/swns/stsc/'+inturlType+'.gaeaway';
    var params;
    if(type=='year'){
      params={
        'stcds':stcds,
        'startTime':startTime,
        'stationNames':yearTime,
        'type':type,
        'mulType':mulType,
      };
    }else{
      params={
        'stcds':stcds,
        'startTime':startTime,
        'stationNames':yearTime,
        'type':type,
        'mulType':mulType,
        'month':monthTime
      };
    }
    var kLption = {
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
					for(var i = 0;i<params.length;i++){
						str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+":</span><span class='_ec_value'>"+parseFloat(params[i].value[0]).toFixed(3)+'mm -- '+parseFloat(params[i].value[1]).toFixed(1)+"%</span></div>";
					}
					
					str+="<div>";
					return str;
					
				}
			},
			grid:{
				// bottom:20,
				// top:50,
				// left:20,
				// right:70,
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
				name : "粒径(mm)",
        type : 'log',
        nameLocation:'middle',
        nameTextStyle:{
          lineHeight:60
        },
				splitLine:{
					show:false     //去掉网格线
				 },
				 axisLabel:{
					 show:false
				 },
				min:'0.001'
			},
			yAxis : {
				name:'百分比(%)',
				scale:true,
				type : 'value'
			},
			series : []
		};
    this.httpService.getIntTab4PData(params).then(response=>{
      let res = JSON.parse(response)
      if(res){
        var serise=[];
        var lends=[]
        _.forEach(res,function(val,i){
          var obj={}
        
            obj={
              name : i,
              
              data : val,
              type : 'line',
              smooth: true,
            
              markLine:{
                symbol:'none',
                precision:3,
                data:[
                  {
                    xAxis: 0.001,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:1
                    },
                    label:{
                      position:'start'
                    }
                  },
                  {
                    xAxis: 0.002,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.003,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.004,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.005,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.006,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.007,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.008,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.009,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.01,
                    lineStyle:{
                      type:'solid',
                      color:"#000"
                    },
                    label:{
                      position:'start'
                    }
                  },
                  {
                    xAxis: 0.02,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.03,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.04,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.05,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.06,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.07,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.08,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.09,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.1,
                    lineStyle:{
                      type:'solid',
                      color:"#000"
                    },
                    label:{
                      position:'start'
                    }
                  },
                  {
                    xAxis: 0.2,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.3,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.4,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      show:false
                    }
                  },
                  {
                    xAxis: 0.5,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      
                      show:false
                    }
                  },
                  {
                    xAxis: 0.6,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      
                      show:false
                    }
                  },
                  {
                    xAxis: 0.7,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      
                      show:false
                    }
                  },
                  {
                    xAxis: 0.8,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                    
                      show:false
                    }
                  },
                  {
                    xAxis: 0.9,
                    lineStyle:{
                      type:'solid',
                      color:"#000",
                      width:0.5
                    },
                    label:{
                      
                      show:false
                    }
                  },
                  {
                    xAxis: 1,
                    lineStyle:{
                      type:'solid',
                      color:"#000"
                    },label:{
                      position:'start'
                    }
                  },
                ]
              }
            }
            
          
          
          lends.push(i)
          serise.push(obj)
        })
        kLption.series=serise;
        
        kLption.legend.data=lends;
        // kLption.yAxis.name='';
        kLption.title.text='多年颗粒级配';
        // kLption.xAxis.name='时间(月)'
        
        this.initEchart(kLption)
      }
    })
  }
 public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('annKlLinechart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }

}
