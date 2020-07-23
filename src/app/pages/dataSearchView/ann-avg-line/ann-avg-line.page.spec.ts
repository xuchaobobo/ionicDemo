import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnnAvgLinePage } from './ann-avg-line.page';

describe('AnnAvgLinePage', () => {
  let component: AnnAvgLinePage;
  let fixture: ComponentFixture<AnnAvgLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnAvgLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnAvgLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
