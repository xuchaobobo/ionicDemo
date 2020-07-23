import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab5Page } from './tab5.page';

const routes: Routes = [
  {
    path: '',
    component: Tab5Page,
    
     children: [
	     {
	      path: 'myInfo',
	       loadChildren: () => import('../pages/infoView/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
	    {
	      path: 'notice',
        
	      loadChildren: () => import('../pages/infoView/notice/notice.module').then( m => m.NoticePageModule)
      },
      {
	      path: 'file',
        
	      loadChildren: () => import('../pages/infoView/file/file.module').then( m => m.FilePageModule)
      },
      {
	      path: 'about',
        
	      loadChildren: () => import('../pages/infoView/about/about.module').then( m => m.AboutPageModule)
      },
      {
	      path: 'app-help',
        
	      loadChildren: () => import('../pages/infoView/app-help/app-help.module').then( m => m.AppHelpPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab5/myInfo',
        component: Tab5Page,
	      //  loadChildren: () => import('../pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab5PageRoutingModule {}
