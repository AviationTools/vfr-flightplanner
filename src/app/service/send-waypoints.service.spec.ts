import { TestBed } from '@angular/core/testing';

import { SendWaypointsService } from './send-waypoints.service';

describe('SendWaypointsService', () => {
  let service: SendWaypointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendWaypointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
