import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlongLinePage } from './along-line.page';

describe('AlongLinePage', () => {
  let component: AlongLinePage;
  let fixture: ComponentFixture<AlongLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlongLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlongLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
