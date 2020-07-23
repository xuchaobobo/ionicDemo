import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObservationDataPage } from './observation-data.page';

describe('ObservationDataPage', () => {
  let component: ObservationDataPage;
  let fixture: ComponentFixture<ObservationDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
