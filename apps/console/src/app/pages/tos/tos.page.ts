import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide'
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import { HlmSeparatorDirective } from '@spartan-ng/helm/separator';

@Component({
  selector: 'app-tos',
  viewProviders: [
    provideIcons({
      lucideArrowLeft
    })
  ],
  imports: [
    HlmButtonDirective,
    NgIcon,
    BrnSeparatorComponent,
    HlmSeparatorDirective
  ],
  template: `
    <div class="flex gap-4">
      <button variant="ghost" title="Go back" (click)="location.back()" hlmBtn size="lg">
        <ng-icon name="lucideArrowLeft" size="35"/>
      </button>
      <h1 class="font-extrabold text-3xl">{{ title.getTitle() }}</h1>
    </div>
    <brn-separator hlmSeparator/>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa cumque molestiae nostrum numquam pariatur
      perferendis praesentium quidem, quos saepe voluptatibus. Accusantium blanditiis dolor dolorem dolores ducimus
      eligendi error id, in ipsum iste, libero magnam maxime natus nisi nobis, odio provident quasi quibusdam quidem
      quis ratione similique tempore vitae voluptate voluptatum. Accusantium ad at beatae consectetur error inventore
      maiores nesciunt officia suscipit temporibus! Ab, accusantium ad adipisci, aliquid architecto beatae consequatur
      culpa cumque exercitationem fuga fugit inventore magni necessitatibus nesciunt nisi nostrum quisquam rerum
      sapiente sequi sunt tempore vel voluptate voluptatem! A consequuntur harum impedit, magni nesciunt odit
      similique
      veniam. Molestiae?
    </p>
  `,
  styleUrl: './tos.page.scss'
})
export class TosPage {
  readonly title = inject(Title);
  readonly location = inject(Location);
}
