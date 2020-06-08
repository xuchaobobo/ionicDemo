import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EhcartPieComponent } from './ehcart-pie.component';

describe('EhcartPieComponent', () => {
  let component: EhcartPieComponent;
  let fixture: ComponentFixture<EhcartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EhcartPieComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EhcartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
