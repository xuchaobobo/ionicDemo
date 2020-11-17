import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {LoginGuardGuard} from './guard/login-guard.guard';
const routes: Routes = [
 {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    // loadChildren:'./tabs/tabs.module#',
    canActivate:[LoginGuardGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'edit-pwd',
    loadChildren: () => import('./pages/infoView/edit-pwd/edit-pwd.module').then( m => m.EditPwdPageModule)
  },  {
    path: 'cyhd',
    loadChildren: () => import('./pages/specialView/cyhd/cyhd.module').then( m => m.CyhdPageModule)
  },

  
 
 
  // {
  //   path: 'file',
  //   loadChildren: () => import('./pages/file/file.module').then( m => m.FilePageModule)
  // },
  // {
  //   path: 'hyd-info',
  //   loadChildren: () => import('./pages/hyd-info/hyd-info.module').then( m => m.HydInfoPageModule)
  // },
  // {
  //   path: 'tabs/tab3/guding-dm',
  //   loadChildren: () => import('./pages/guding-dm/guding-dm.module').then( m => m.GudingDmPageModule)
  // },
   
];
@NgModule({
  imports: [
    // RouterModule.forChild(routes),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers:[LoginGuardGuard]
})
export class AppRoutingModule {}
