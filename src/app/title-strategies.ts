import { environment } from "@/env/environment.development";
import { inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable()
export class DefaultTitleStrategy extends TitleStrategy {
    private title = inject(Title);
    override updateTitle(snapshot: RouterStateSnapshot): void {
        debugger;
        const currentTitle = this.title.getTitle();
        if (currentTitle != environment.appName) {
            this.title.setTitle(`${currentTitle} | ${environment.appName}`)
        }
    }

}
