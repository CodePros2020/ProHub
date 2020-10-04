import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationDialogComponent } from './email-verification-dialog.component';

describe('EmailVerificationDialogComponent', () => {
  let component: EmailVerificationDialogComponent;
  let fixture: ComponentFixture<EmailVerificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
