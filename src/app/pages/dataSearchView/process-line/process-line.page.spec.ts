import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProcessLinePage } from './process-line.page';

describe('ProcessLinePage', () => {
  let component: ProcessLinePage;
  let fixture: ComponentFixture<ProcessLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
