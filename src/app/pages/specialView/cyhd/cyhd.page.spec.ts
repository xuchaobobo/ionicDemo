import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CyhdPage } from './cyhd.page';

describe('CyhdPage', () => {
  let component: CyhdPage;
  let fixture: ComponentFixture<CyhdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CyhdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CyhdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
