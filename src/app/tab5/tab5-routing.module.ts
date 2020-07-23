import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab5Page } from './tab5.page';
import {LoginGuardGuard} from '../guard/login-guard.guard';
const routes: Routes = [
  {
    path: '',
    component: Tab5Page,
    
     children: [
	     {
	      path: 'myInfo',
         loadChildren: () => import('../pages/infoView/my-info/my-info.module').then( m => m.MyInfoPageModule),
         canActivate:[LoginGuardGuard]
	    },
	    {
	      path: 'notice',
        
	      loadChildren: () => import('../pages/infoView/notice/notice.module').then( m => m.NoticePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'file',
        
	      loadChildren: () => import('../pages/infoView/file/file.module').then( m => m.FilePageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'about',
        
	      loadChildren: () => import('../pages/infoView/about/about.module').then( m => m.AboutPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
	      path: 'app-help',
        
	      loadChildren: () => import('../pages/infoView/app-help/app-help.module').then( m => m.AppHelpPageModule),
        canActivate:[LoginGuardGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/tab5/myInfo',
        component: Tab5Page,
        canActivate:[LoginGuardGuard]
	      //  loadChildren: () => import('../pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
	    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[LoginGuardGuard]
})
export class Tab5PageRoutingModule {}
