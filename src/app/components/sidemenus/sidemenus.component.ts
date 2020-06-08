import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-sidemenus',
  templateUrl: './sidemenus.component.html',
  styleUrls: ['./sidemenus.component.scss'],
})
export class SidemenusComponent implements OnInit {

  constructor(private menu: MenuController) { }
 openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  ngOnInit() {}

}
