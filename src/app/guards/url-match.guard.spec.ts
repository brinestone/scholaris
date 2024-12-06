import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { urlMatchGuard } from './url-match.guard';

describe('urlMatchGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => urlMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
