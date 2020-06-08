import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KljpTableComponent } from './kljp-table.component';

describe('KljpTableComponent', () => {
  let component: KljpTableComponent;
  let fixture: ComponentFixture<KljpTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KljpTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KljpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
