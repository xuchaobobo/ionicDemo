import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import { AppConfig } from '../../../api.config'
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-along-line',
  templateUrl: './along-line.page.html',
  styleUrls: ['./along-line.page.scss'],
})
export class AlongLinePage implements OnInit {
  titles: any = '沿程线';
  nowYear: any;

  public customPickerOptions = {
    buttons: [{
      text: '取消',
      handler: () => console.log('Clicked 取消!')
    }, {
      text: '确认',
      handler: () => {
        console.log('Clicked 确认');
        // return false; 选择日期完成后，日期控件不会消失      
        console.log(this.nowYear);
      }
    }]
  }
  types: any='z';
  times:any='2018'
  area='金沙江下游'
  river='长江'
  stationName
  station
  years=['2018','2017']
  dateType='year'
  
  forYear = 'YYYY'
	disMonth = 'YYYY-M'
	picMonth = 'YYYY M'
	disDay = 'YYYY-MM-DD'
  picDay = 'YYYY MM DD'
  dayTime;
  min;
  max;
	dayTimeDisTime = this.forYear
	timeFor= this.forYear;
	dayTimePicTime = this.forYear
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public httpService: ProviderService,
    public unitService: UnitsService
  ) {
    let year=parseInt(AppConfig.year)
    this.dayTime = moment(new Date(Date.now() - 24 * 710 * 60 * 60 * 1000)).format(this.forYear);
    this.times='2018'
    this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * year)).format(this.forYear)
		this.max=moment(new Date(Date.now())).format(this.forYear)
  }
  ngOnInit() {
    // this.setYears(_.map(this.station,'stcd'))
    
    this.getDefaultstation()
    
  }
  ngAfterViewInit(){
    // this.searchData()
  }
  typeChange(e){
    console.log(e.detail.value)
    this.types=e.detail.value
  }
  getDefaultstation(){
    let typeStr=_.toString(this.types)
    let param={
      riverMod:'[{"startdist":2656492,"endist":1861000}]',
      type:typeStr
    }
  
    
    let arr=[]
    this.httpService.getStationByRiver(param).then(res=>{
      let data = JSON.parse(res)
      this.station = data;
      
      let len=_.map(data,'stnm').length-1
      this.stationName=_.map(data,'stnm')[0]+'~'+_.map(data,'stnm')[len]
      if(this.times==''){
        this.addTime()
      }
      this.searchData()
    })
  }
  timeChange(e){

  }
  datetimeChange(e) {

  }
  dateTypeChange(e){
    this.times=''
    let year=parseInt(AppConfig.year)
  
    if (this.dateType == 'year') {
			this.dayTime=moment(new Date(Date.now() - 24 * 365*2 * 60 * 60 * 1000)).format(this.forYear)
			this.timeFor=this.forYear
      this.dayTimeDisTime = this.forYear
	
      this.dayTimePicTime = this.forYear
      this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * year)).format(this.forYear)
      this.max=moment(new Date(Date.now())).format(this.forYear)
		} else if (this.dateType == 'month') {
			this.dayTime=moment(new Date(Date.now() - 24 * 30*24 * 60 * 60 * 1000)).format(this.disMonth)
			this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * year)).format(this.disMonth)
      this.max=moment(new Date(Date.now())).format(this.disMonth)
      this.dayTimeDisTime = this.disMonth
      this.timeFor=this.disMonth
			this.dayTimePicTime = this.picMonth
		} else {
      this.dayTime=moment(new Date(Date.now() - 24 * 720 * 60 * 60 * 1000)).format(this.disDay)
      this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * year)).format(this.disDay)
      this.max=moment(new Date(Date.now())).format(this.disDay)
      this.dayTimeDisTime = this.disDay
      this.timeFor=this.disDay
			this.dayTimePicTime = this.picDay
		}
  }
  addTime(){
    let addTimes=moment(this.dayTime).format(this.timeFor)
    if(this.times.indexOf(addTimes)!=-1){
      this.times=this.times
    }else{
      if(this.times==''){
        this.times=addTimes
      }else{
        this.times =this.times+','+addTimes
      }
      
    }
    
  }
  
  async selectSation() {

		const modal = await this.modalController.create({
			component: StationSelectComponent,
			cssClass: 'station_elect',
			componentProps: {
				types: this.types,
        typeLen: 1,
        defaultArea:this.area,
				defaultRiver:this.river,
				defaultStation: this.station
			}
		})
		await modal.present();
		const { data } = await modal.onDidDismiss();
		this.station = data.selectStation
  let datas=data.selectStation
  this.area=data.selectarea,
		this.river=data.selectriver
  let len=data.selectStation.length-1
    this.stationName = _.map(datas,'stnm')[0]+'~'+_.map(datas,'stnm')[len]
	
	}
  public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('alongLinechart');
    this.chart = ec.init(container);
    this.chart.clear()
    if(option.series.length>0){
      this.chart.setOption(option);
    }
    
  }
  searchData(){
    let processTypeName
    if(this.types=='z'){
      processTypeName='水位(m)'
    }else if(this.types=='q'){
      processTypeName='流量(m³/s)'
    }else if(this.types=='cs'){
      processTypeName='含沙量(kg/m³)'
    }else if(this.types=='qs'){
      processTypeName='输沙率(kg/s)'
    }else if(this.types=='tz'){
      processTypeName='颗粒级配(mm)'
    }
    
    if(this.dateType=='month'){
      // var mTime=formSelects.value('datelist','val')
      var timeArr=[];
      // $.each(mTime,function(i,item){
      //   var arr=item.split('-');
      //   var str=arr[0]+'-'+parseInt(arr[1])
      //   timeArr.push(str)

      // })
      // time=timeArr.join(",")
    }
    var dstrvmNum=1889.6,water=0
    // if(selectVal.length==1&&selectVal[0].area1=='三峡库区'){
    //   dstrvmNum=
    // }else{
    //   water=1.697
    // }
    var datastr;
    if(this.types=='tz'){
      datastr='AVPD'
    }else{
      datastr='AV'+(this.types.toUpperCase())
    }
  
    let url = "/swns/stsc/"+this.types+"/getAlongWater.gaeaway";
    let param={
      'stcds' : _.toString(_.map(this.station,'stcd')),
      'time' :_.toString(this.times),
      "type" : this.dateType
    }
    this.httpService.getAlongData(url,param).then(res=>{
      let msg=JSON.parse(res)
      
      let alongOption={
        title:{
          text:'',
          textStyle:{
            fontSize:12
          },
          padding:[5,0,0,30]
        },
       
        grid:{
          bottom:30,
          // top:50,
          // left:'3%',
          // right:90,
          containLabel: true
        },
        tooltip : {
          trigger: 'axis',
          hideDelay:2000,
          formatter:function(params){
            
            var str="<div class='_ec_tolltip'>";
            if(alongOption.title.text.indexOf('水位')!=-1){
              var xValue = params[0].value[0];
              str+="<div><span class='_ec_title icon-bullet_green'>里程：</span><span class='_ec_value'>"+xValue+"</span></div>";
              str+="<div><span class='_ec_title icon-bullet_yellow'>站点：</span><span class='_ec_value'>"+params[0].value[2]+"</span></div>";
              // str+="<div><span class='_ec_title icon-bullet_yellow'>高程基准：</span><span class='_ec_value'>"+params[0].value[4]+"</span></div>";
              str+="<div><span class='_ec_title icon-bullet_yellow'></span><span class='_ec_value'>"+params[0].value[3]+"</span></div>";
              for(var i = 0;i<params.length;i++){
                str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+alongOption.yAxis.name+'('+params[0].value[4]+')'+":</span><span class='_ec_value'>"+params[i].value[1]+"</span></div>";
              }
            }else{
              var xValue = params[0].value[0];
              str+="<div><span class='_ec_title icon-bullet_green'>里程：</span><span class='_ec_value'>"+xValue+"</span></div>";
              str+="<div><span class='_ec_title icon-bullet_yellow'>站点：</span><span class='_ec_value'>"+params[0].value[2]+"</span></div>";
              // str+="<div><span class='_ec_title icon-bullet_yellow'>高程基准：</span><span class='_ec_value'>"+params[0].value[4]+"</span></div>";
              for(var i = 0;i<params.length;i++){
                str+="<div><span class='_ec_title icon-bullet_yellow'>"+params[i].seriesName+alongOption.yAxis.name+":</span><span class='_ec_value'>"+params[i].value[1]+"</span></div>";
              }
            }
            
            
            str+="<div>";
            return str;
            
          }
        },
        legend:{
          orient : "horizontal",
          x : 'center',
          y : 20,
          data:[]
        },
        xAxis : {
          axisLine:{  
            // lineStyle:{  
            // 	color:'white',  
            // 	width:2  
            // }  
          },
          scale:true,
          name : "距坝里程(km)",
          
          type : 'value',
          boundaryGap : false,
          // nameLocation:'start',
          nameLocation:'middle',
          nameTextStyle:{
            lineHeight:60
          },
          inverse:true,
          data : [  ]
        },
        yAxis : {
          gridIndex:0,
          position:'left',
          name:'',
          scale:true,
          type : 'value'
        },
        series : []
      }
      var series=[]
        var legendData=[]
					for(var i in msg){
						var num=0;
						num++;
						var arr=msg[i];
						var xAxis=[]
						var seriesdata=[]
						var markPointData=[]
						if(msg[i].length>0){
              var dstrvmAvg = (msg[i][0]['DSTRVM']-msg[i][msg[i].length-1]['DSTRVM'])/5;
              var dstrvm = 0;
              for(var j=0;j<msg[i].length;j++){
                if(datastr=='AVZ'){
                  var fdt = msg[i][j]['FDTMNMRL'] + ':'+ msg[i][j][datastr]
                  var waterVal=msg[i][j]['LEV'] - water
                  var DSTRVM=msg[i][j]['DSTRVM']-dstrvmNum
                  seriesdata.push([DSTRVM,waterVal,msg[i][j]['STNM'],fdt,msg[i][j]['FDTMNM']])
                  if(j==0){
                    markPointData.push({value: msg[i][j]['STNM'], xAxis: DSTRVM, yAxis: waterVal});
                  }else{
                    dstrvm = dstrvm + (msg[i][j-1]['DSTRVM']-msg[i][j]['DSTRVM']);
                    if(dstrvm>dstrvmAvg){
                      markPointData.push({value: msg[i][j]['STNM'], xAxis: DSTRVM, yAxis: waterVal});
                      dstrvm=0;
                    }
                  }
                }else{
                  var fdt = msg[i][j]['FDTMNMRL'] + ':'+ msg[i][j][datastr]
                  
                  var DSTRVM=msg[i][j]['DSTRVM']-dstrvmNum
                  seriesdata.push([DSTRVM,msg[i][j][datastr],msg[i][j]['STNM']])
                  if(j==0){
                    markPointData.push({value: msg[i][j]['STNM'], xAxis: DSTRVM, yAxis: msg[i][j][datastr]});
                  }else{
                    dstrvm = dstrvm + (msg[i][j-1]['DSTRVM']-msg[i][j]['DSTRVM']);
                    if(dstrvm>dstrvmAvg){
                      markPointData.push({value: msg[i][j]['STNM'], xAxis: DSTRVM, yAxis: msg[i][j][datastr]});
                      dstrvm=0;
                    }
                  }
                }
                
              }
              series.push(
                {
                  name : i,
                  data : seriesdata,
                  markPoint : {
                    data: markPointData
                  },
                  type : 'line'
                }
              )
              legendData.push(i);
            }
					
						
					}
					var yname="";
					if(this.types=="z"){
						yname="水位（m）"
					}else if(this.types=="q"){
						yname="流量（m³/s）"
					}else if(this.types=="cs"){
						yname="含沙量（kg/m³）"
					}else if(this.types=="qs"){
						yname="输沙率（kg/s）"
					}else if(this.types=="tz"){
						yname="中数粒径（mm）"
					}
					alongOption.title.text=yname
					alongOption.series=series
					alongOption.legend.data=legendData
					// alongOption.yAxis[0].name=processTypeName
				;
          this.initEchart(alongOption)
					
    })
  }
}
