declare module "geocodio-library-node" {
  export interface AddressParts {
    city?: string;
    country?: string;
    postal_code?: string;
    state?: string;
    street?: string;
  }

  export type AddressMap = {
    [key: string]: string;
  };

  export type AddressComponents = {
    city: string;
    country?: string;
    county?: string;
    formatted_street?: string;
    number?: string;
    predirectional?: string;
    secondarynumber?: string;
    secondaryunit?: string;
    state: string;
    street?: string;
    suffix?: string;
    zip: string;
  };

  export interface GeocodedAddress {
    _warnings?: string[];
    accuracy?: number;
    accuracy_type?: string;
    address_components: AddressComponents;
    fields?: { [key: string]: string };
    formatted_address: string;
    location: { lat: number; lng: number };
    source?: string;
  }

  export interface GeocodedResponse {
    _warnings?: string[];
    input: {
      address_components: AddressComponents;
      formatted_address: string;
    };
    results: [GeocodedAddress];
  }

  export interface GeocodedArrayResponse {
    results: Array<{
      query: string;
      response: GeocodedResponse;
      results: [GeocodedAddress];
    }>;
  }

  export interface GeocodedErrorResponse {
    error: string;
  }

  export type AddressParam =
    | string
    | string[]
    | AddressParts
    | AddressParts[]
    | AddressMap;

  export type CoordinatesParam = string | string[] | [number, number];

  export default class Geocodio {
    constructor(apiKey?: string);

    geocode(
      address: AddressParam,
      options?: string[],
      limit?: number
    ): Promise<
      GeocodedResponse | GeocodedArrayResponse | GeocodedErrorResponse
    >;

    reverse(
      coordinates: CoordinatesParam,
      options?: string[],
      limit?: number
    ): Promise<
      GeocodedResponse | GeocodedArrayResponse | GeocodedErrorResponse
    >;
  }
}
