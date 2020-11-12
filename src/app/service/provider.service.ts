/*
 * @Author: your name
 * @Date: 2020-04-06 11:02:38
 * @LastEditTime: 2020-05-18 14:27:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\service\provider.service.ts
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions,ResponseContentType} from '@angular/http';
import * as $ from 'jquery'
import { AppConfig } from '../api.config';
import { environment } from '../../environments/environment'
import 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  public config:any={
    domain:'http://10.6.204.6:5010/'
  }
  loader: any;
  constructor(private http: Http) {
 }
 static defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token,});
 static formHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json','Authorization': AppConfig.token});
 static uploadHeasers = new Headers({'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7','Authorization': AppConfig.token});
 static downHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded;','Authorization': AppConfig.token})
 //
 static defaultOptions = new RequestOptions({headers: ProviderService.defaultHeaders});
 static formOptions = new RequestOptions({headers: ProviderService.formHeaders});
 static uploadOptions = new RequestOptions({headers: ProviderService.uploadHeasers});
 static downOptions = new RequestOptions({withCredentials: true,headers:ProviderService.downHeaders,responseType: ResponseContentType.Blob})
public get(url: string, paramObj?: any,options=ProviderService.defaultOptions) {
  
    let httpurl
    console.log(environment.production)
    if(environment.production){
      httpurl=environment.baseUrl+'/'+url
    }else{
      httpurl=url
    }
    // // 
    // alert(httpurl + this.toQueryString(paramObj))
   return this.http.get(httpurl + this.toQueryString(paramObj),options)
    .toPromise()
    .then(res =>{
      // alert('httpRes:'+res)
      return this.handleSuccess(res.text())
    } )
    .catch(error => this.handleError(error));
  }
  public downget(url: string, paramObj?: any,options=ProviderService.downOptions) {
    let headers = new Headers(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': AppConfig.token,
      }
      );
      let httpurl
      if(environment.production){
        httpurl=environment.baseUrl+'/'+url
      }else{
        httpurl=url
      }
     return this.http.get(httpurl + this.toQueryString(paramObj),options)
      .toPromise()
      .then(res => this.downhandleSuccess(res))
      .catch(error => this.handleError(error));
    }
    private downhandleSuccess(res) {//请求成功的回调
      // console.log('Http-Response=='+JSON.stringify(res.json()))
    
      let cookie = res.headers['Cookie'];
      let result=res.json()
     
    if (result && result.resultCode != "0000") {
     let params = {
          title: "错误！",
          subTitle: result.message,
     }
    }
    return result;
    }
public post(url: string, paramObj: any,options: RequestOptions = ProviderService.formOptions) {
//x-www-form-urlencoded
let headers = new Headers(
  {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7',
    'Authorization': AppConfig.token,
  }
  );
  let httpurl
      if(environment.production){
        httpurl=environment.baseUrl+'/'+url
      }else{
        httpurl=url
      }
return this.http.post(httpurl, paramObj,options)
 .toPromise()
 .then(res => {
  // console.log('Http-Response=='+JSON.stringify(res.json()))
  // res.json()
   this.handleSuccess(res.text())
  })
 .catch(error => this.handleError(error));
}

private handleSuccess(result) {//请求成功的回调
  // alert('handleSuccess'+result)
if (result && result.resultCode != "0000") {
 let params = {
      title: "错误！",
      subTitle: result.message,
 }
}
return result;
}
public downpost(url: string, paramObj: any,options: RequestOptions = ProviderService.downOptions) {
  //x-www-form-urlencoded
  // let httpurl=this.config.domain+url
  return this.http.post(url, paramObj,options)
   .toPromise()
   .then(res => {
    // console.log('Http-Response=='+JSON.stringify(res.json()))
    res.json()
    //  this.handleSuccess(res)
    // return res
    })
   .catch(error => error);
  }
  


private handleError(error: Response | any) {//请求失败的回调
  
let msg = '请求失败';
if (error.status == 0) {
 msg = '请求地址错误';
}
if (error.status == 400) {
 msg = '请求无效';
 console.log('请检查参数类型是否匹配');
}
if (error.status == 404) {
 msg = '请求资源不存在';
 console.error(msg+'，请检查路径是否正确');
}
let params = {
    title: "错误！",
    subTitle: msg,
}
return error;
}

/**
* @param obj　参数对象
* @return {string}　参数字符串
* @example
*  声明: var obj= {'name':'zhangsan',sex:1};
*  调用: toQueryString(obj);
*  返回: "?name=zhangsan&age=1"
*/
private toQueryString(obj) {
let ret = [];
for (let key in obj) {
 key = encodeURIComponent(key);
 let values = obj[key];
 if (values && values.constructor == Array) {//数组
   let queryValues = [];
   for (let i = 0, len = values.length, value; i < len; i++) {
     value = values[i];
     queryValues.push(this.toQueryPair(key, value));
   }
   ret = ret.concat(queryValues);
 } else { //字符串
   ret.push(this.toQueryPair(key, values));
 }
}
let str = obj?'?' + ret.join('&'):""
return str;

}

private toQueryPair(key, value) {
if (typeof value == 'undefined') {
 return key;
}
return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}

 
  
  login(json){
    return this.get('swns/base/user/dologin.gaeaway',json)
  }
  depData(){
    return this.get("swns/base/user/selectDepNew.gaeaway")
  }
  getAllAreas(){
    return this.get('/swns/base/basin/area.gaeaway','')
  }
  /**
   * @description: 获取所有测站站点接口
   * @param {type} 
   * @return: 
   */  
  getStaion(){
    return this.get('swns/stsc/allStations.gaeaway','')
  }
  /**
   * @description: 获取水文站点信息
   * @param {type} 
   * @return:
   */  
  getRealStaion(json){
    return this.get('swns/real/realStBprpB.gaeaway',json)
  }
  /**
   * @description: 获取水文实时水位流量信息
   * @param {json} 
   * @return: 
   */  
  getRealStaionSearch(json){
    return this.get('swns/real/realStRiverR.gaeaway',json)
  }
  
  /**
   * @description: 通过站名获取历史同期年份
   * @param {stcd} 
   * @return: 
   */  
  getHisYears(stcd){
    return this.get('swns/real/realHisYr.gaeaway',{stcd:stcd})
  }
  /**
   * @description: 获取水文站点历史同期数据
   * @param {url,json} 
   * @return: 
   */  
  getHisSearchData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取水库站点数据
   * @param {json} 
   * @return: 
   */
  async getRealWaterData(url,json){
    return await this.get(url,json)
  /**
   * @description: 根据分区获取河流
   * @param {type} 
   * @return: 
   */  
  }
  getAllRirver(json){
    return this.get('swns/base/river/mod.gaeaway',json)
  }
  /**
   * @description: 通过河流获取站点
   * @param {type} 
   * @return: 
   */
  getStationByRiver(json){
    return this.get('swns/base/section/survey.gaeaway',json)
  }
  /**
   * @description: 通过河流获取断面
   * @param {type} 
   * @return: 
   */
  getSectionByRiver(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取echart图例接口数据
   * @param {stcds,startTime,endTime,stationNames,type}  stcds
   * @return: 
   */
  async getLineData(url,stcds,startTime,endTime,stationNames,type){
    
    var param={
      		"stcds":stcds,
				'startTime':startTime,
				'endTime':endTime,
				'stationNames':stationNames,
				"type" : type
    }
    return await this.get(url,param)
  }
  /**
   * @description: 获取沿程线数据
   * @param {type} 
   * @return: 
   */
  getAlongData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取关系线数据
   * @param {type} 
   * @return: 
   */
  getRelativeData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取颗粒级配数据
   * @param {param} 
   * @return: 
   */
  getKlJPData(json){
    return this.get('swns/stsc/kl/lineChart.gaeaway',json)
  }
  /**
   * @description: 获取年际变化数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab1PData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取历年变化数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab2PData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取多年平均年内数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab3PData(url,json){
    return this.get(url,json)
  }
  /**
   * @description: 获取多年颗数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab4PData(json){
    return this.get('swns/stsc/kl/averageLineChart.gaeaway',json)
  }
  /**
   * @description: 获取实时库容站点
   * @param {type} 
   * @return: 
   */
  getRealStaions(){
    return this.get('swns/capacity/queryCapacity.gaeaway')
  }
  /**
   * @description: 获取实时库容数据
   * @param {param} 
   * @return: 
   */
  getRealKRData(param){
    return this.get('swns/capacity/getCapacityForData.gaeaway',param)
  }
   /**
   * @description:根据断面码获取测次
   * @param {param} 
   * @return: 
   */
  getXscdByMsno(xscd){
    return this.get('swns/sect/xshd/queryDmxCcAndKljp.gaeaway',{
			xscd: xscd,
		})
  }
  /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSectionData(param){
    return this.get('swns/sect/msxsrs/queryDmxChart.gaeaway',param)
  }
  /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSixData(xscd,msno,value){
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/msxsrs/getSix.gaeaway',pamasix)
  }
   /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSixsData(xscd,msno,value){
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/msxsrs/getSixs.gaeaway',pamasix)
  }
  /**
   * @description: 根据距河口里程获取河流
   * @param {type} 
   * @return: 
   */
  getAllRivers(data){
    var pama = {
			riverMod: data
		};
    return this.get('swns/base/river/mod.gaeaway',pama)
  }
  getZbTable(url,param){
    return this.get(url,param)
  }
  getklTable(param){
    return this.get('swns/stsc/kl/selectDdbByStcdAndTime.gaeaway',param)
  }
  getDirTree(parse){
    return this.get('swns/file/directories.gaeaway',parse)
  }
  getDirChildTree(param){
    
    return this.get('swns/file/listFiles.gaeaway',param)
  }
  creatDir(param){
    return this.get('swns/file/createDir.gaeaway',param)
  }
  deleteDir(parse){
    return this.get('swns/file/deleteFiles.gaeaway',parse)
  }
  upLoadFile(paramObj){
    return this.post('swns/file/upFiles.gaeaway', paramObj, ProviderService.uploadOptions)
  }
  getDownFile(parmobj){
    
    return this.downget('swns/file/download.gaeaway', parmobj)
  }
  getRealDetailTable(url,parmObj){
    return this.get(url, parmObj)
  }
  getDsannt(parmObj){
    return this.get('swns/sect/segracou/getDsannt.gaeaway', parmObj)
  }
  getDaXscdByMsno(stcd){
    let parmObj={
      stcd:stcd
    }
    return this.get('swns/stsc/getBigSectTime.gaeaway', parmObj)
  }
  dmxChart(parmObj){
    return this.get('swns/sect/xsmsrs/chart.gaeaway', parmObj)
  }
  getAllDxscd(){
    let parmObj={
      ndnm:""
    }
    return this.get('swns/stsc/allBdmStcd.gaeaway', parmObj)
  }
  getdSixData(xscd,msno,value){
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/xsmsrs/getSix.gaeaway',pamasix)
  }
   /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getdSixsData(xscd,msno,value){
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/xsmsrs/getSixs.gaeaway',pamasix)
  }
  getSearchKey(key){
    var pama = {
			keyword: key,
		};
    return this.get('swns/search.gaeaway',pama)
  }
  getObservictionData(param){
    return this.get('swns/special/getWaterByStcdAndTime.gaeaway',param)
  }
  getDmAndMsno(param){
    
    return this.get('swns/special/getDmAndMsno.gaeaway',param)
  }
  queryDmxChart(param){
    
    return this.get('swns/sect/msxsrs/queryDmxssChart.gaeaway',param)
  }
  queryGrainCompositionChart(url){
    
    return this.get('swns/special/'+url+'.gaeaway')
  }
  updatePsd(params){
    
    return this.get('swns/base/user/updatePsd.gaeaway',params)
  }
  
}
