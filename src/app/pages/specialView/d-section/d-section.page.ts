import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProviderService } from '../../../service/provider.service'
import { UnitsService } from '../../../service/units.service'
import * as _ from 'lodash'


@Component({
  selector: 'app-d-section',
  templateUrl: './d-section.page.html',
  styleUrls: ['./d-section.page.scss'],
})
export class DSectionPage implements OnInit {
  public chart: any;
  titleName:any
  areaJson
  area:string='三峡库区'
  areas
  year;
  years
  param;
  chartDiV
  constructor(
    public httpService:ProviderService,
    public activeRoute: ActivatedRoute,
    public unitsService:UnitsService
  ) { 
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params['titleName']){
        let titleName=params['titleName']
        this.titleName=titleName
        this.param=params['param']
        // console.log(chartInfo.option)
        let that=this
        this.httpService.getDmAndMsno(this.param).then(res=>{
          let json=JSON.parse(res)
          that.areaJson=json
          that.areas=_.keys(json)
          that.area=that.areas[0]
          that.year=json[that.area][0].yr
          that.years=json[that.areas[0]]
          that.param={
            xscds:json[that.area][0].xscd,
            msno:json[that.area][0].msno
          }
          that.searchData()
        })
      }
    })
  }

  ngOnInit() {
  }
  compareByArea(o1,o2){
    return o1==o2
  }
  areaChange(e){
    this.area=e.detail.value;
    this.year=this.areaJson[this.area][0]
    this.years=this.areaJson[this.area]
  }
  yearChange(e){
    this.year=e.detail.value;
    let selectObj=_.filter(this.areaJson[this.area],function(item){
      return item.yr== e.detail.value
    })[0]
    this.param={
      xscds:selectObj.xscd,
      msno:selectObj.msno
    }
  }
  searchData(){
    let that=this
    this.httpService.queryDmxChart(this.param).then(res=>{
      let json=JSON.parse(res)
      that.chartDiV=json
      for(let i=0;i<json.length;i++){
        let titleText = '断面:' + json[i].xsnm;
        let map ={}
        for (let j = 0; j < json[i].series.length; j++) {
          var key = Object.keys(json[i].series[j])[0];
          var value = json[i].series[j][key][0];
          map[key] = value;
        }
        // map["minY"] = json[i].series[0].minY;

        setTimeout(function(){
          that.unitsService.chartLines(map, json[i].xscd, "value", "起点距(m)", "高程(m)", titleText,'duanmian');
        },3000)
       
      }
    })
  }
}
