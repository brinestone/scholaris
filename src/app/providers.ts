import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

export function provideClerk(clerkKey: string): EnvironmentProviders {
    const client = new Clerk(clerkKey);
    return makeEnvironmentProviders([
        {
            provide: Clerk,
            multi: false,
            useFactory: async () => {
                await client.load();
                return client;
            }
        }
    ])
}
