import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
  //   RouterModule.forChild([
  //     { path: '', redirectTo: '/tabs/tab3/guding-dm', component: Tab3Page},
  //   {
	//       path: 'guding-dm',
        
	//       loadChildren: () => import('../pages/guding-dm/guding-dm.module').then( m => m.GudingDmPageModule)
	//     },{
	//       path: 'hyd-info',
	//       loadChildren: () => import('../pages/hyd-info/hyd-info.module').then( m => m.HydInfoPageModule)
	//     },])
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
