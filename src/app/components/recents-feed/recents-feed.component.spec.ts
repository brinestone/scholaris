import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentsFeedComponent } from './recents-feed.component';

describe('RecentsFeedComponent', () => {
  let component: RecentsFeedComponent;
  let fixture: ComponentFixture<RecentsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentsFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
