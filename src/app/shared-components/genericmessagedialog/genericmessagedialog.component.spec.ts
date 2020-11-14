import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericmessagedialogComponent } from './genericmessagedialog.component';

describe('GenericmessagedialogComponent', () => {
  let component: GenericmessagedialogComponent;
  let fixture: ComponentFixture<GenericmessagedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericmessagedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericmessagedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
