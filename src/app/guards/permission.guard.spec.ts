import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tenantPermissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tenantPermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
