import { APP_INITIALIZER, EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

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
