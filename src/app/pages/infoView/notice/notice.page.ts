import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {
titles:any='系统公告';
notes:any=[
{
	label:'三峡公司表彰大会通知',
	time:'2019-03-01'
},
{
	label:'三峡公司表彰大会通知',
	time:'2019-03-01'
},
{
	label:'三峡公司表彰大会通知',
	time:'2019-03-01'
},
{
	label:'升级公告',
	time:'2019-03-01'
}
]
  constructor() { }

  ngOnInit() {
  }

}
