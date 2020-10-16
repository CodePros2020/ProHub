import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsManagementComponent } from './units-management.component';

describe('UnitsManagementComponent', () => {
  let component: UnitsManagementComponent;
  let fixture: ComponentFixture<UnitsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
