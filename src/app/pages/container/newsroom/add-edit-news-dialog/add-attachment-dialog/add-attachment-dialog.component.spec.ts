import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttachmentDialogComponent } from './add-attachment-dialog.component';

describe('AddAttachmentDialogComponent', () => {
  let component: AddAttachmentDialogComponent;
  let fixture: ComponentFixture<AddAttachmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttachmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttachmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
