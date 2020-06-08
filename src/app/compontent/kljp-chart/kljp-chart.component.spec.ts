import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KljpChartComponent } from './kljp-chart.component';

describe('KljpChartComponent', () => {
  let component: KljpChartComponent;
  let fixture: ComponentFixture<KljpChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KljpChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KljpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
