import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SandWeightPage } from './sand-weight.page';

describe('SandWeightPage', () => {
  let component: SandWeightPage;
  let fixture: ComponentFixture<SandWeightPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandWeightPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SandWeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
