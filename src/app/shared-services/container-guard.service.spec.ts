import { TestBed } from '@angular/core/testing';

import { ContainerGuardService } from './container-guard.service';

describe('ContainerGuardService', () => {
  let service: ContainerGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
