import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KurongPage } from './kurong.page';

describe('KurongPage', () => {
  let component: KurongPage;
  let fixture: ComponentFixture<KurongPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KurongPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KurongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
