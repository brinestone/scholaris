export namespace CountryInfo {
    // To parse this data:
    //
    //   import { Convert } from "./file";
    //
    //   const countryData = Convert.toCountryData(json);

    export type CountryData = {
        name: Name;
        tld?: string[];
        cca2: string;
        ccn3?: string;
        cca3: string;
        independent?: boolean;
        status: Status;
        unMember: boolean;
        currencies?: { [key: string]: Currency };
        idd: Idd;
        capital?: string[];
        altSpellings: string[];
        region: Region;
        languages?: { [key: string]: string };
        translations: { [key: string]: Translation };
        latlng: number[];
        landlocked: boolean;
        area: number;
        demonyms?: Demonyms;
        flag: string;
        maps: Maps;
        population: number;
        car: Car;
        timezones: string[];
        continents: Continent[];
        flags: Flags;
        coatOfArms: CoatOfArms;
        startOfWeek: StartOfWeek;
        capitalInfo: CapitalInfo;
        cioc?: string;
        subregion?: string;
        fifa?: string;
        borders?: string[];
        gini?: { [key: string]: number };
        postalCode?: PostalCode;
    }

    export type CapitalInfo = {
        latlng?: number[];
    }

    export type Car = {
        signs?: string[];
        side: Side;
    }

    export type Side = "right" | "left";

    export type CoatOfArms = {
        png?: string;
        svg?: string;
    }

    export type Continent = "Antarctica" | "North America" | "Europe" | "Africa" | "Asia" | "Oceania" | "South America";

    export type Currency = {
        name: string;
        symbol: string;
    }

    export type Demonyms = {
        eng: Eng;
        fra?: Eng;
    }

    export type Eng = {
        f: string;
        m: string;
    }

    export type Flags = {
        png: string;
        svg: string;
        alt?: string;
    }

    export type Idd = {
        root?: string;
        suffixes?: string[];
    }

    export type Maps = {
        googleMaps: string;
        openStreetMaps: string;
    }

    export type Name = {
        common: string;
        official: string;
        nativeName?: { [key: string]: Translation };
    }

    export type Translation = {
        official: string;
        common: string;
    }

    export type PostalCode = {
        format: string;
        regex?: string;
    }

    export type Region = "Antarctic" | "Americas" | "Europe" | "Africa" | "Asia" | "Oceania";

    export type StartOfWeek = "monday" | "sunday" | "saturday";

    export type Status = "officially-assigned" | "user-assigned";

    // Converts JSON strings to/from your types
    export class Convert {
        public static toCountryData(json: string): CountryData[] {
            return JSON.parse(json);
        }

        public static countryDataToJson(value: CountryData[]): string {
            return JSON.stringify(value);
        }
    }

}
