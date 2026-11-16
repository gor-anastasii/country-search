export interface CountryApiResponse {
  name: string;
  officialName?: string;
  capital: string;
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  flag?: string;
  flags?: {
    svg?: string;
    png?: string;
  };
  borders?: string[];
  currencies?: {
    code: string;
    name: string;
    symbol?: string;
  }[];
  languages?: {
    name: string;
    iso639_1?: string;
    iso639_2?: string;
  }[];
}

export interface Country {
  name: string;
  officialName: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  area: number;
  borders: string[];
  currencies: string[];
  description: string;
}
