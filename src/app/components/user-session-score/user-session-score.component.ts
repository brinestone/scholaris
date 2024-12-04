import { Component, signal } from '@angular/core';
import { MeterGroup, MeterGroupModule } from 'primeng/metergroup';

@Component({
  selector: 'sc-user-session-score',
  standalone: true,
  imports: [MeterGroupModule],
  templateUrl: './user-session-score.component.html',
  styleUrl: './user-session-score.component.scss'
})
export class UserSessionScoreComponent {
  readonly totalScore = signal([
    { label: 'Current Session <session-label>', value: Math.random() * 100, color: 'green' },
    { label: 'Last Session <last-session-label>', value: Math.random() * 100, color: 'red' },
  ]);
}
