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
    path: 'kurong',
    loadChildren: () => import('./pages/kurong/kurong.module').then( m => m.KurongPageModule)
  },
  {
    path: 'notice',
    loadChildren: () => import('./pages/notice/notice.module').then( m => m.NoticePageModule)
  },
  {
    path: 'my-info',
    loadChildren: () => import('./pages/my-info/my-info.module').then( m => m.MyInfoPageModule)
  },
  {
    path: 'river-info',
    loadChildren: () => import('./pages/river-info/river-info.module').then( m => m.RiverInfoPageModule)
  },
  {
    path: 'process-line',
    loadChildren: () => import('./pages/process-line/process-line.module').then( m => m.ProcessLinePageModule)
  },
  {
    path: 'along-line',
    loadChildren: () => import('./pages/along-line/along-line.module').then( m => m.AlongLinePageModule)
  },
  {
    path: 'relative-line',
    loadChildren: () => import('./pages/relative-line/relative-line.module').then( m => m.RelativeLinePageModule)
  },
  {
    path: 'kljp-line',
    loadChildren: () => import('./pages/kljp-line/kljp-line.module').then( m => m.KljpLinePageModule)
  },
  {
    path: 'interannual-variation',
    loadChildren: () => import('./pages/interannual-variation/interannual-variation.module').then( m => m.InterannualVariationPageModule)
  },
  {
    path: 'cal-year-line',
    loadChildren: () => import('./pages/cal-year-line/cal-year-line.module').then( m => m.CalYearLinePageModule)
  },
  {
    path: 'ann-avg-line',
    loadChildren: () => import('./pages/ann-avg-line/ann-avg-line.module').then( m => m.AnnAvgLinePageModule)
  },
  {
    path: 'ann-kl-line',
    loadChildren: () => import('./pages/ann-kl-line/ann-kl-line.module').then( m => m.AnnKlLinePageModule)
  },
  {
    path: 'data-search',
    loadChildren: () => import('./pages/data-search/data-search.module').then( m => m.DataSearchPageModule)
  },
  {
    path: 'real-table',
    loadChildren: () => import('./pages/real-table/real-table.module').then( m => m.RealTablePageModule)
  },
  {
    path: 'zb-table',
    loadChildren: () => import('./pages/zb-table/zb-table.module').then( m => m.ZbTablePageModule)
  },
  {
    path: 'da-dm',
    loadChildren: () => import('./pages/da-dm/da-dm.module').then( m => m.DaDmPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
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
