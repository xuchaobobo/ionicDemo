import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalYearLinePage } from './cal-year-line.page';

describe('CalYearLinePage', () => {
  let component: CalYearLinePage;
  let fixture: ComponentFixture<CalYearLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalYearLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalYearLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
