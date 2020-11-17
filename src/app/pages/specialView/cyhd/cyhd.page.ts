import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../service/provider.service'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../../../environments/environment'
import * as _ from 'lodash';

@Component({
  selector: 'app-cyhd',
  templateUrl: './cyhd.page.html',
  styleUrls: ['./cyhd.page.scss'],
})
export class CyhdPage implements OnInit {
  titleName='冲淤厚度图'
  rivers:any;
  selectedRiver:any;
  selectedMsno:any;
  msnos:any;
  allData;
  allPdf=[];
  pdfsrc='./../../assets/pdf/1.pdf'
  constructor(public httpService: ProviderService,private geolocation: Geolocation) { }

  ngOnInit() {
    this.getRiver()
  }
  getGps(){
    this.geolocation.getCurrentPosition().then((resp) => {
		
			alert(resp.coords.latitude+'-'+resp.coords.longitude)
		
		
			// resp.coords.latitude
			// resp.coords.longitude
		   }).catch((error) => {
			 console.log('Error getting location', error);
		   });
		   
		   let watch = this.geolocation.watchPosition();
		   watch.subscribe((data) => {
			 
		  //   alert(data.coords.latitude+'-'+data.coords.longitude)
			// data can be a set of coordinates, or an error (if an error occurred).
			// data.coords.latitude
			// data.coords.longitude
		   });
  }
  getRiver(){
    this.httpService.getCyhtRiver().then(res=>{
      let json=JSON.parse(res)
      console.log(json)
      this.rivers=json
      this.selectedRiver=json[0].rinm
      this.getMsno()
    })
  }
  preDm(){
    let index=_.findIndex(this.rivers,{'rinm':this.selectedRiver})
    console.log(index)
    if(index>0){
      this.selectedRiver=this.rivers[index-1].rinm
      this.getMsno()
    }
    
  }
  nextDm(){
    let index=_.findIndex(this.rivers,{'rinm':this.selectedRiver})
    if(index<=this.rivers.length){
      this.selectedRiver=this.rivers[index+1].rinm
      this.getMsno()
    }
  }
  riverChange(e){
    console.log(e)
    this.selectedRiver=e.detail.value
    this.getMsno()
  }
  msnoChange(e){

    this.selectedMsno=e.detail.value

    this.allPdf=this.allData[this.selectedMsno]
    
    let src= this.allPdf[0]
    this.pdfchange(src)
  }
  pdfchange(item){
    // this.httpService.getpdf(src).then(res=>{
      
    //   this.pdfsrc=res
    // })
    let src=item.path;
    this.allData[this.selectedMsno].forEach(element => {
      element.flag=false
      if(element.path==item.path){
        element.flag=true
      }else{
        element.flag=false
      }
    });
    this.allPdf= this.allData[this.selectedMsno]
    var baseUrl=environment.baseUrl+'/file'
    let newsrc=src.replace(/D:\\riverFile/g,baseUrl)
    newsrc=newsrc.replace(/\\/g,'/')

    this.pdfsrc=newsrc
    // console.log(newsrc,src)
  }
  getMsno(){
    this.httpService.getCyhtDataByRirver(this.selectedRiver).then(res=>{
      let json=JSON.parse(res)
      this.allData=json
      
      this.msnos=Object.keys(json)
      this.selectedMsno=Object.keys(json)[0]
      let arr=json[this.selectedMsno]
      arr.forEach(element => {
        element.flag=false
      });
     
      let src= arr[0]
      arr[0].flag=true
      this.pdfchange(src)
    })
  }
}
