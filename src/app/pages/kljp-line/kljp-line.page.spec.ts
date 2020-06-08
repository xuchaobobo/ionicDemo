import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KljpLinePage } from './kljp-line.page';

describe('KljpLinePage', () => {
  let component: KljpLinePage;
  let fixture: ComponentFixture<KljpLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KljpLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KljpLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
