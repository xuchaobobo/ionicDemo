import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabtitleComponent } from './tabtitle.component';

describe('TabtitleComponent', () => {
  let component: TabtitleComponent;
  let fixture: ComponentFixture<TabtitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabtitleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
