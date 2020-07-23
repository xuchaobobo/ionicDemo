import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelativeLinePage } from './relative-line.page';

describe('RelativeLinePage', () => {
  let component: RelativeLinePage;
  let fixture: ComponentFixture<RelativeLinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativeLinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelativeLinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
