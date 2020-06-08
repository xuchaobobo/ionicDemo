import { Component, OnInit,ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-ehcart-pie',
  templateUrl: './ehcart-pie.component.html',
  styleUrls: ['./ehcart-pie.component.scss'],
})
export class EhcartPieComponent implements OnInit {
	

  constructor() { }

  ngOnInit() {}
	@ViewChild('chart',null) chart;
	
   
}
