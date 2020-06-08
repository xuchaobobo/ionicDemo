import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {NavController} from '@ionic/angular'

@Component({
  selector: 'app-tabtitle',
  templateUrl: './tabtitle.component.html',
  styleUrls: ['./tabtitle.component.scss'],
})
export class TabtitleComponent implements OnInit {
	@Input() inpData:any;
	history:any;
  constructor(public navCtrl:NavController) { 
  	// this.history = this.navPramams.get('history')
  }

  ngOnInit() {}
	goBack(){
		// this.navCtrl.pop()
	}

}
