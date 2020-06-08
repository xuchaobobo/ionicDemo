import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Tab4PageRoutingModule } from './tab4-routing.module';

import { Tab4Page } from './tab4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    RouterModule.forChild([{ path: '', redirectTo: '/tabs/tab4/kurong', component: Tab4Page},{
	      path: 'kurong',
        
	      loadChildren: () => import('../pages/kurong/kurong.module').then( m => m.KurongPageModule)
	    },])
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
