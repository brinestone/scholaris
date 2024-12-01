import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';

export function provideDefaultTitleStrategy(): Provider {
    return {
        provide: TitleStrategy,
        useClass: DefaultTitleStrategy,
    }
}

export function provideClerk(clerkKey: string): EnvironmentProviders {
    const client = new Clerk(clerkKey);
    const loadClerkClient = async () => {
        await client.load();
    }
    return makeEnvironmentProviders([
        {
            provide: Clerk,
            multi: false,
            useValue: client
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: () => loadClerkClient
        }
    ])
}
