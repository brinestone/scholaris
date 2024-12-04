import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSessionScoreComponent } from './user-session-score.component';

describe('UserSessionScoreComponent', () => {
  let component: UserSessionScoreComponent;
  let fixture: ComponentFixture<UserSessionScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSessionScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSessionScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
