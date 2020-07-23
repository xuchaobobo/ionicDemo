import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrototypeChartPage } from './prototype-chart.page';

describe('PrototypeChartPage', () => {
  let component: PrototypeChartPage;
  let fixture: ComponentFixture<PrototypeChartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeChartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrototypeChartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
