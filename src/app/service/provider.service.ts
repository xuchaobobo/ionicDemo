/*
 * @Author: your name
 * @Date: 2020-04-06 11:02:38
 * @LastEditTime: 2021-04-07 15:14:55
 * @LastEditors: xcb
 * @Description: In User Settings Edit
 * @FilePath: \app\src\app\service\provider.service.ts
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions,ResponseContentType} from '@angular/http';
import { AppConfig } from '../api.config';
import { environment } from '../../environments/environment'
import 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  public config:any={
    domain:'http://10.6.204.6:5011/'
  }
  loader: any;
  constructor(private http: Http) {
 }
 static firstHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'});
 static defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
 static formHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json','Authorization': AppConfig.token});
 static uploadHeasers = new Headers({'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryZpsWTsOiRHI0TBW7','Authorization': AppConfig.token});
 static downHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded;','Authorization': AppConfig.token})
 //
 static firstOptions = new RequestOptions({headers: ProviderService.firstHeaders});
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
    return this.get('swns/base/user/dologin.gaeaway',json,ProviderService.firstOptions)
  }
  
  getResource(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/base/user/getResource.gaeaway',{},defaultOptions)
  }
  depData(){
    return this.get("/swnsServiceManage/service/run.gaeaway?serviceId=56&keys=d35a2d20-dec3-4cef-99b2-d80c7fdedb16")
  }
  getAllAreas(id){
    var param={
      id:id
    }
    console.log(AppConfig.token)
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('/swns/base/basin/area.gaeaway',param,defaultOptions)
  }
  //根据用户id获取对应数据的年份
  getyearByid(id){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var param={
      id:id
    }
    return this.get('/swns/roleData/data.gaeaway',param,defaultOptions)
  }
  /**
   * @description: 获取所有测站站点接口
   * @param {type} 
   * @return: 
   */  
  getStaion(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/stsc/allStations.gaeaway',{},defaultOptions)
  }
  /**
   * @description: 获取水文站点信息
   * @param {type} 
   * @return:
   */  
  getRealStaion(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/real/realStBprpB.gaeaway',json,defaultOptions)
  }
  /**
   * @description: 获取水文实时水位流量信息
   * @param {json} 
   * @return: 
   */  
  getRealStaionSearch(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/real/realStRiverR.gaeaway',json,defaultOptions)
  }
  
  /**
   * @description: 通过站名获取历史同期年份
   * @param {stcd} 
   * @return: 
   */  
  getHisYears(stcd){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/real/realHisYr.gaeaway',{stcd:stcd},defaultOptions)
  }
  /**
   * @description: 获取水文站点历史同期数据
   * @param {url,json} 
   * @return: 
   */  
  getHisSearchData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取水库站点数据
   * @param {json} 
   * @return: 
   */
  async getRealWaterData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return await this.get(url,json,defaultOptions)
  /**
   * @description: 根据分区获取河流
   * @param {type} 
   * @return: 
   */  
  }
  getAllRirver(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/base/river/mod.gaeaway',json,defaultOptions)
  }
  /**
   * @description: 通过河流获取站点
   * @param {type} 
   * @return: 
   */
  getStationByRiver(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/base/section/survey.gaeaway',json,defaultOptions)
  }
  /**
   * @description: 通过河流获取断面
   * @param {type} 
   * @return: 
   */
  getSectionByRiver(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
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
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return await this.get(url,param,defaultOptions)
  }
  /**
   * @description: 获取沿程线数据
   * @param {type} 
   * @return: 
   */
  getAlongData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取关系线数据
   * @param {type} 
   * @return: 
   */
  getRelativeData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取颗粒级配数据
   * @param {param} 
   * @return: 
   */
  getKlJPData(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/stsc/kl/lineChart.gaeaway',json,defaultOptions)
  }
  /**
   * @description: 获取年际变化数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab1PData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取历年变化数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab2PData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取多年平均年内数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab3PData(url,json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,json,defaultOptions)
  }
  /**
   * @description: 获取多年颗数据
   * @param {url,params} 
   * @return: 
   */
  getIntTab4PData(json){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/stsc/kl/averageLineChart.gaeaway',json,defaultOptions)
  }
  /**
   * @description: 获取实时库容站点
   * @param {type} 
   * @return: 
   */
  getRealStaions(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/capacity/queryCapacity.gaeaway',defaultOptions)
  }
  /**
   * @description: 获取实时库容数据
   * @param {param} 
   * @return: 
   */
  getRealKRData(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/capacity/getCapacityForData.gaeaway',param,defaultOptions)
  }
   /**
   * @description:根据断面码获取测次
   * @param {param} 
   * @return: 
   */
  getXscdByMsno(xscd){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/sect/xshd/queryDmxCcAndKljp.gaeaway',{
			xscd: xscd,
		},defaultOptions)
  }
  /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSectionData(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/sect/msxsrs/queryDmxChart.gaeaway',param,defaultOptions)
  }
  /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSixData(xscd,msno,value){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/msxsrs/getSix.gaeaway',pamasix,defaultOptions)
  }
   /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getSixsData(xscd,msno,value){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/msxsrs/getSixs.gaeaway',pamasix,defaultOptions)
  }
  /**
   * @description: 根据距河口里程获取河流
   * @param {type} 
   * @return: 
   */
  getAllRivers(data){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pama = {
			riverMod: data
		};
    return this.get('swns/base/river/mod.gaeaway',pama,defaultOptions)
  }
  getZbTable(url,param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url,param,defaultOptions)
  }
  getklTable(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/stsc/kl/selectDdbByStcdAndTime.gaeaway',param,defaultOptions)
  }
  getDirTree(parse){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/file/directories.gaeaway',parse,defaultOptions)
  }
  getDirChildTree(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/file/listFiles.gaeaway',param,defaultOptions)
  }
  creatDir(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/file/createDir.gaeaway',param,defaultOptions)
  }
  deleteDir(parse){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/file/deleteFiles.gaeaway',parse,defaultOptions)
  }
  upLoadFile(paramObj){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.post('swns/file/upFiles.gaeaway', paramObj, ProviderService.uploadOptions)
  }
  getDownFile(parmobj){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.downget('swns/file/download.gaeaway', parmobj,defaultOptions)
  }
  getRealDetailTable(url,parmObj){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get(url, parmObj,defaultOptions)
  }
  getDsannt(parmObj){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/sect/segracou/getDsannt.gaeaway', parmObj,defaultOptions)
  }
  getDaXscdByMsno(stcd){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    let parmObj={
      stcd:stcd
    }
    return this.get('swns/stsc/getBigSectTime.gaeaway', parmObj,defaultOptions)
  }
  dmxChart(parmObj){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/sect/xsmsrs/chart.gaeaway', parmObj,defaultOptions)
  }
  getAllDxscd(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    let parmObj={
      ndnm:""
    }
    return this.get('swns/stsc/allBdmStcd.gaeaway', parmObj,defaultOptions)
  }
  getdSixData(xscd,msno,value){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/xsmsrs/getSix.gaeaway',pamasix,defaultOptions)
  }
   /**
   * @description:获取断面数据
   * @param {param} 
   * @return: 
   */
  getdSixsData(xscd,msno,value){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pamasix = {
			xscd: xscd,
			msno: msno,
			wt:value
		};
    return this.get('swns/sect/xsmsrs/getSixs.gaeaway',pamasix,defaultOptions)
  }
  getSearchKey(key){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    var pama = {
			keyword: key,
		};
    return this.get('swns/search.gaeaway',pama,defaultOptions)
  }
  getObservictionData(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/special/getWaterByStcdAndTime.gaeaway',param,defaultOptions)
  }
  getDmAndMsno(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/special/getDmAndMsno.gaeaway',param,defaultOptions)
  }
  queryDmxChart(param){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/sect/msxsrs/queryDmxssChart.gaeaway',param,defaultOptions)
  }
  queryGrainCompositionChart(url){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/special/'+url+'.gaeaway',{},defaultOptions)
  }
  updatePsd(params){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/base/user/updatePsd.gaeaway',params,defaultOptions)
  }
//获取河段名称
  getCyhtRiver(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/scouringRiver/riverName.gaeaway',{},defaultOptions)
  }
  //获取冲淤厚度图测次
  getCyhtDataByRirver(key){
    var pama = {
			riverName: key,
    };
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/scouringRiver/data.gaeaway',pama,defaultOptions)
  }
  getcyhdByMod(lon,lat){
    var mod=lon+','+lat
    var pama={
      mod:mod
    }
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/scouringRiver/mod.gaeaway',pama,defaultOptions)
  }
  //获取最新年份时间
  getLastYear(){
    var defaultHeaders = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': AppConfig.token});
    var defaultOptions = new RequestOptions({headers: defaultHeaders});
    return this.get('swns/base/section/presentTime.gaeaway',{},defaultOptions)
  }
}
