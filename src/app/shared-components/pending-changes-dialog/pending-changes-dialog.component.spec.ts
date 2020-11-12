import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingChangesDialogComponent } from './pending-changes-dialog.component';

describe('PendingChangesDialogComponent', () => {
  let component: PendingChangesDialogComponent;
  let fixture: ComponentFixture<PendingChangesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingChangesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingChangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
