import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular'
import { StationSelectComponent } from '../../../compontent/station-select/station-select.component'
import { ProviderService } from '../../../service/provider.service'
import { AppConfig } from '../../../api.config'
import * as _ from 'lodash';
import * as moment from 'moment'
@Component({
  selector: 'app-interannual-variation',
  templateUrl: './interannual-variation.page.html',
  styleUrls: ['./interannual-variation.page.scss'],
})
export class InterannualVariationPage implements OnInit {


  titles: any = '年际变化';
  nowYear: any;
  seleceList: any = [

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
  startContraTime
  endContraTime
  types = ['Q']
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
    this.min=moment(new Date(Date.now() - 24 * 365 * 60 * 60 * 1000 * yearData)).format('YYYY')
		this.max=moment(new Date(Date.now())).format('YYYY')
    this.stationName = "朱沱(三)"
    this.startTime = moment(new Date(Date.now() - 24 * 365 * 5 * 60 * 60 * 1000)).format('YYYY');
    this.endTime = moment(new Date(Date.now() - 24 * 365 * 3 * 60 * 60 * 1000)).format('YYYY');
    this.startContraTime = moment(new Date(Date.now() - 24 * 365 * 5 * 60 * 60 * 1000)).format('YYYY');
    this.endContraTime = moment(new Date(Date.now() - 24 * 365 * 3 * 60 * 60 * 1000)).format('YYYY');
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
  startContraTimeChange(e){
    this.startContraTime=moment(this.startContraTime).format('YYYY')
  }
  endContraTimeChange(e){
    this.endContraTime=moment(this.endContraTime).format('YYYY')
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
    this.area=data.selectarea
		this.river=data.selectriver
    this.stationName = _.map(data.selectStation, 'stnm').join(',')
  }
  searchData() {
    var inturlType = this.types[0].toLowerCase();
    var urlName;


    var stcds = _.toString(_.map(this.station, 'stcd'));
    var startTime = this.startTime, endTime = this.endTime, startContraTime = this.startContraTime, endContraTime = this.endContraTime;

    var url = '/swns/stsc/' + inturlType + '/yearContrastChart.gaeaway';
    var params;
    if (inturlType == 'q') {
      urlName = '径流量'
      params = {
        'stcds': stcds,
        'startTime': startTime,
        'endTime': endTime,
        'startContrastTime': startContraTime,
        'endContrastTime': endContraTime
      };
    } else {
      urlName = '输沙量'
      params = {
        'stcds': stcds,
        'startTime': startTime,
        'endTime': endTime,
        'startContrastTime': startContraTime,
        'endContrastTime': endContraTime,
        'sdtp': '悬移质'
      };
    }
    let intoption = {

      title: {
        text: '',
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        hideDelay: 2000,
        formatter: function (params) {
          var str = "<div class='_ec_tolltip'>";

          var xValue = params[0].value[0];
          var unit;
          if (intoption.title.text.indexOf('径流量') != -1) {
            unit = '(亿m³)'
          } else {
            unit = '(万t)'
          }

          for (var i = 0; i < params.length; i++) {
            str += "<div><span class='_ec_title icon-bullet_yellow'>" + params[i].seriesName + ":</span><span class='_ec_value'>" + params[i].value + unit + "</span></div>";
          }

          str += "<div>";
          return str;

        }
      },
      grid: {
        bottom: 10,
        top: 90,
        left: 20,
        right: 20,
        containLabel: true
      },
      legend: {
        orient: "horizontal",
        x: 'center',
        y: 20,
        type:'scroll',
        width:'80%',
        data: []
      },
      xAxis: {
        scale: true,
        name: "",
        type: 'category',
        data: []
      },
      yAxis: {
        name: '',
        min: function (value) {
          var val = value.min - (value.max - value.min)
          if (val > 0) {
            let num=val/100
            var valY = parseInt(String(num));
            if (val == 0) {
              return 0;
            } else {
              return valY * 100;
            }
          } else {
            return 0;
          }
        },
        max: function (value) {
          let num=(value.max) / 100
          var val = parseInt(String(num)) + 1;
          if (val == 0) {
            return 100;
          } else {
            return val * 100;
          }
        },
        type: 'value',

      },
      series: []
    };
    this.httpService.getIntTab1PData(url, params).then(response => {

      let res = JSON.parse(response)
      if (res) {
        var list = res.data;
        var serise = [];
        var lends = []
        _.forEach(list, function (val, i) {
          console.log(i, val);
          var obj = {
            name: i,
            // label: labelOption,
            data: val,
            type: 'bar'
          }
          lends.push(i)
          serise.push(obj)
        })
        var urlNameUnit;
        if (urlName == '径流量') {
          urlNameUnit = '径流量(亿m³)'
        } else {
          urlNameUnit = '输沙量(万t)'
        }
        intoption.series = serise;

        intoption.legend.data = lends;
        intoption.yAxis.name = urlNameUnit;
        intoption.title.text = '年' + urlName + '变化对比'
        intoption.xAxis.data = res.stationNames;
        this.initEchart(intoption)

      }
    })
  }
  public chart: any;
  initEchart(option) {
    let ec = echarts as any;
    let container = document.getElementById('interVarchart');
    this.chart = ec.init(container);
    this.chart.clear()
    this.chart.setOption(option);
  }

}
