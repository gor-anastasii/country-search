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

export interface CountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  capital?: string[];
  region?: string;
  population: number;
  languages?: Record<string, string>;
  area?: number;
  borders?: string[];
  currencies?: Record<
    string,
    {
      name: string;
      symbol?: string;
    }
  >;
}
