import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDeleteDialogComponent } from './generic-delete-dialog.component';

describe('GenericDeleteDialogComponent', () => {
  let component: GenericDeleteDialogComponent;
  let fixture: ComponentFixture<GenericDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
