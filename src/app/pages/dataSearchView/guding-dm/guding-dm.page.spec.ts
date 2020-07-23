import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GudingDmPage } from './guding-dm.page';

describe('GudingDmPage', () => {
  let component: GudingDmPage;
  let fixture: ComponentFixture<GudingDmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GudingDmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GudingDmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
