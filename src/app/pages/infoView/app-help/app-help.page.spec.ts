import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppHelpPage } from './app-help.page';

describe('AppHelpPage', () => {
  let component: AppHelpPage;
  let fixture: ComponentFixture<AppHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppHelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
