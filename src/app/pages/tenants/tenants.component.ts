import { ShellComponent } from '@/app/components/shell';
import { subscribedTenants } from '@/app/state';
import { Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { select } from '@ngxs/store';
import { DataView } from 'primeng/dataview';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'sc-tenants',
    standalone: true,
    imports: [InputIcon, FormsModule, DataView, IconField, ShellComponent, RouterLink, Divider, InputText],
    templateUrl: './tenants.component.html',
    styleUrl: './tenants.component.scss'
})
export class TenantsComponent {
    readonly tenants = select(subscribedTenants);
    readonly filterQuery = model('');
    readonly filteredTenants = computed(() => {
        const tenants = this.tenants();
        const query = this.filterQuery();
        if (query.length == 0) {
            return tenants;
        }
        return tenants.filter(({ name }) => name.toLowerCase().includes(query));
    })
}
