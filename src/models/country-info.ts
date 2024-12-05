// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CountryInfo {
    // To parse this data:
//
//   import { Convert } from "./file";
//
//   const countryData = Convert.toCountryData(json);

export type CountryData = {
    name:           string;
    topLevelDomain: string[];
    alpha2Code:     string;
    alpha3Code:     string;
    callingCodes:   string[];
    capital?:       string;
    altSpellings?:  string[];
    subregion:      string;
    region:         Region;
    population:     number;
    latlng?:        number[];
    demonym:        string;
    area?:          number;
    timezones:      string[];
    borders?:       string[];
    nativeName:     string;
    numericCode:    string;
    flags:          Flags;
    currencies?:    Currency[];
    languages:      Language[];
    translations:   Translations;
    flag:           string;
    regionalBlocs?: RegionalBloc[];
    cioc?:          string;
    independent:    boolean;
    gini?:          number;
}

export type Currency = {
    code:   string;
    name:   string;
    symbol: string;
}

export type Flags = {
    svg: string;
    png: string;
}

export type Language = {
    iso639_1?:   string;
    iso639_2:    string;
    name:        string;
    nativeName?: string;
}

export type Region = "Asia" | "Europe" | "Africa" | "Oceania" | "Americas" | "Polar" | "Antarctic Ocean" | "Antarctic";

export type RegionalBloc = {
    acronym:        Acronym;
    name:           Name;
    otherNames?:    OtherName[];
    otherAcronyms?: OtherAcronym[];
}

export type Acronym = "SAARC" | "EU" | "CEFTA" | "AU" | "AL" | "CARICOM" | "USAN" | "EEU" | "CAIS" | "ASEAN" | "NAFTA" | "PA" | "EFTA";

export type Name = "South Asian Association for Regional Cooperation" | "European Union" | "Central European Free Trade Agreement" | "African Union" | "Arab League" | "Caribbean Community" | "Union of South American Nations" | "Eurasian Economic Union" | "Central American Integration System" | "Association of Southeast Asian Nations" | "North American Free Trade Agreement" | "Pacific Alliance" | "European Free Trade Association";

export type OtherAcronym = "UNASUR" | "UNASUL" | "UZAN" | "EAEU" | "SICA";

export type OtherName = "الاتحاد الأفريقي" | "Union africaine" | "União Africana" | "Unión Africana" | "Umoja wa Afrika" | "جامعة الدول العربية" | "Jāmiʻat ad-Duwal al-ʻArabīyah" | "League of Arab States" | "Comunidad del Caribe" | "Communauté Caribéenne" | "Caribische Gemeenschap" | "Unión de Naciones Suramericanas" | "União de Nações Sul-Americanas" | "Unie van Zuid-Amerikaanse Naties" | "South American Union" | "Sistema de la Integración Centroamericana," | "Tratado de Libre Comercio de América del Norte" | "Accord de Libre-échange Nord-Américain" | "Alianza del Pacífico";

export type Translations = {
    br:  string;
    pt:  string;
    nl:  string;
    hr:  string;
    fa?: string;
    de:  string;
    es:  string;
    fr:  string;
    ja:  string;
    it:  string;
    hu:  string;
}

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
