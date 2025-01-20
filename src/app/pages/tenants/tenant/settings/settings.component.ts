import { focusedTenantSettings, LoadSettings } from '@/app/state';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { dispatch, select } from '@ngxs/store';

@Component({
    selector: 'sc-settings',
    imports: [JsonPipe],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
    private readonly loadSettings = dispatch(LoadSettings);
    readonly settings = select(focusedTenantSettings);

    ngOnInit() {
        this.loadSettings();
    }
}
