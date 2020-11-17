import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../service/provider.service'
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  allPdf;
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
  riverChange(e){
    console.log(e)
  }
  msnoChange(e){
    console.log(e)
  }
  getMsno(){
    this.httpService.getCyhtDataByRirver(this.selectedRiver).then(res=>{
      let json=JSON.parse(res)
      this.allPdf=json
      
      this.msnos=Object.keys(json)
      this.selectedMsno=Object.keys(json)[0]
      
    })
  }
}
