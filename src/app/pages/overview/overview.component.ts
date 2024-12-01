import { AppWideAlertComponent, ShellComponent } from '@/app/components';
import { Component } from '@angular/core';
import { ShellLeftNavComponent, ShellFooterComponent } from "../../components/shell/shell.component";


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [ShellComponent, AppWideAlertComponent, ShellLeftNavComponent, ShellFooterComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
