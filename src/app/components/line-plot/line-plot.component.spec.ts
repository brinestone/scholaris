import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePlot } from './line-plot.component';

describe('LinePlotComponent', () => {
  let component: LinePlot;
  let fixture: ComponentFixture<LinePlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinePlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinePlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
