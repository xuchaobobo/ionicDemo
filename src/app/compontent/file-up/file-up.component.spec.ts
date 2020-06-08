import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FileUpComponent } from './file-up.component';

describe('FileUpComponent', () => {
  let component: FileUpComponent;
  let fixture: ComponentFixture<FileUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
