import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProhubLogoComponent } from './prohub-logo.component';

describe('ProhubLogoComponent', () => {
  let component: ProhubLogoComponent;
  let fixture: ComponentFixture<ProhubLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProhubLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProhubLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
