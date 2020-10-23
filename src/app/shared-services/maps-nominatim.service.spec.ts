import { TestBed } from '@angular/core/testing';

import { MapsNominatimService } from './maps-nominatim.service';

describe('MapsNominatimService', () => {
  let service: MapsNominatimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapsNominatimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
