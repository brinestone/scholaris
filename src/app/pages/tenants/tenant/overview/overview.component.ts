import { focusedTenant } from '@/app/state';
import { PlotData } from '@/models/plot-data';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { select } from '@ngxs/store';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
@Component({
  selector: 'sc-overview',
  standalone: true,
  imports: [Tag, Card, CurrencyPipe, PercentPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly tenant = select(focusedTenant);
  readonly randomData = Array(100).fill(0).map(() => [Math.random() * 100, Math.random()] as PlotData);
}
