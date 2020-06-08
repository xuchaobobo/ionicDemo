import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataSearchPage } from './data-search.page';

describe('DataSearchPage', () => {
  let component: DataSearchPage;
  let fixture: ComponentFixture<DataSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
