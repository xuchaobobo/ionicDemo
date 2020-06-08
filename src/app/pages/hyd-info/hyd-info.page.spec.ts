import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HydInfoPage } from './hyd-info.page';

describe('HydInfoPage', () => {
  let component: HydInfoPage;
  let fixture: ComponentFixture<HydInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HydInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HydInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
