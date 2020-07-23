import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnnKlLinePage } from './ann-kl-line.page';

describe('AnnKlLinePage', () => {
  let component: AnnKlLinePage;
  let fixture: ComponentFixture<AnnKlLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnKlLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnKlLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
