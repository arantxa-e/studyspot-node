import { Document } from "mongoose";
import { GeocodedAddress } from "geocodio-library-node";

declare global {
  namespace Express {
    export interface Request {
      user?: Document;
      partner?: Document;
      token?: string;
      coordinates?: [number, number];
    }
  }
}
