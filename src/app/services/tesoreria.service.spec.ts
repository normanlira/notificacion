import { TestBed } from '@angular/core/testing';

import { ServicestesoreriaService } from './tesoreria.service';

describe('ServicestesoreriaService', () => {
  let service: ServicestesoreriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicestesoreriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
