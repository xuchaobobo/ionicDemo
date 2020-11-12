import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPwdPage } from './edit-pwd.page';

describe('EditPwdPage', () => {
  let component: EditPwdPage;
  let fixture: ComponentFixture<EditPwdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPwdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPwdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
