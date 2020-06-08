import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import  {TabtitleComponent} from './tabtitle.component'



@NgModule({
  declarations: [TabtitleComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[TabtitleComponent]
})
export class TabtitleModule { 

}
