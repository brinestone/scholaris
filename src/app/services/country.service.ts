import { APP_INITIALIZER, EnvironmentProviders, Injectable, makeEnvironmentProviders } from "@angular/core";

const dbName = 'countries-db';
const storeName = 'countries';

function fillDatabase(db: IDBDatabase) {
    return new Promise<void>((resolve, reject) => {
        return fetch('/countries.json', { method: 'GET' }).then(r => r.json()).then(async info => {
            let transactionCompleted = false;
            let stored = 0;
            const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
            store.transaction.onerror = reject;
            const onTransactionCompleted = (err?: any) => {
                transactionCompleted = true;
                if (err) reject(err);
            };

            store.transaction.addEventListener('abort', e => onTransactionCompleted(e));
            store.transaction.addEventListener('complete', () => {
                onTransactionCompleted();
                resolve();
            });
            store.transaction.addEventListener('error', e => onTransactionCompleted(e));

            for (let i = 0; i < info.length && !transactionCompleted; i++) {
                const data = info[i];
                try {
                    await new Promise<string>((resolve, reject) => {
                        const req = store.put(data);
                        req.onsuccess = () => resolve(req.result as string);
                        req.onerror = (e) => {
                            reject(e);
                        };
                    });
                } catch (e) {
                    console.log('failed at', data);
                    reject(e);
                    return;
                }
                stored++;
            }
            store.transaction.commit();
            resolve();
        }).catch(reject);
    })
}

export function provideCountryData(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: () => initializeCountriesDb
        }
    ])
}

function initializeCountriesDb() {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onerror = reject;
        request.onupgradeneeded = (event) => {
            const db = (event.target as unknown as { result: IDBDatabase }).result;
            const objectStore = db.createObjectStore(storeName, { keyPath: ['cca2', 'cca3', 'area'] });
            objectStore.transaction.onerror = reject;
            objectStore.transaction.oncomplete = async () => {
                try {
                    await fillDatabase(db);
                } catch (e) {
                    reject(e);
                }
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const objectStore = db.transaction(storeName).objectStore(storeName);
            const req = objectStore.count();
            req.onerror = reject;
            req.onsuccess = async () => {
                if (req.result == 0) {
                    try {
                        await fillDatabase(db);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                }
                resolve();
            }
        }
    });
}

@Injectable({ providedIn: 'root' })
export class CountryService {
}
