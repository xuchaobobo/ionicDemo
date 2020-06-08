import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZbTablePage } from './zb-table.page';

describe('ZbTablePage', () => {
  let component: ZbTablePage;
  let fixture: ComponentFixture<ZbTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZbTablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZbTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
