import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaterAndSedChangePage } from './water-and-sed-change.page';

describe('WaterAndSedChangePage', () => {
  let component: WaterAndSedChangePage;
  let fixture: ComponentFixture<WaterAndSedChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterAndSedChangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaterAndSedChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
