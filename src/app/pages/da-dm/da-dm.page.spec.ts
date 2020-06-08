import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DaDmPage } from './da-dm.page';

describe('DaDmPage', () => {
  let component: DaDmPage;
  let fixture: ComponentFixture<DaDmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaDmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DaDmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
