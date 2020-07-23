import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
	tabRoots: Object[];
  constructor() {
   this.tabRoots = [
      {
        root: 'tab1',
        tabTitle: '首页',
        tabIcon: 'home'
      },
      {
        root: 'tab2',
        tabTitle: '数据查询',
        tabIcon: 'search-circle'
      },
      {
        root: 'tab3',
        tabTitle: '专题分析',
        tabIcon: 'layers'
      },
      // {
      //   root: 'tab4',
      //   tabTitle: '库容分析',
      //   tabIcon: 'cube'
      // },
      {
        root: 'tab5',
        tabTitle: '我的信息',
        tabIcon: 'person'
      }
    ];
  }

}
