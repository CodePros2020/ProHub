import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNewsDialogComponent } from './add-edit-news-dialog.component';

describe('AddEditNewsDialogComponent', () => {
  let component: AddEditNewsDialogComponent;
  let fixture: ComponentFixture<AddEditNewsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditNewsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditNewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
