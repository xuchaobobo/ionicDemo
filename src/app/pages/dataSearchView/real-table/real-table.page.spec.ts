import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RealTablePage } from './real-table.page';

describe('RealTablePage', () => {
  let component: RealTablePage;
  let fixture: ComponentFixture<RealTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RealTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
