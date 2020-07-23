import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DSectionPage } from './d-section.page';

describe('DSectionPage', () => {
  let component: DSectionPage;
  let fixture: ComponentFixture<DSectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DSectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
