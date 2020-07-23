import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterannualVariationPage } from './interannual-variation.page';

describe('InterannualVariationPage', () => {
  let component: InterannualVariationPage;
  let fixture: ComponentFixture<InterannualVariationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterannualVariationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterannualVariationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
