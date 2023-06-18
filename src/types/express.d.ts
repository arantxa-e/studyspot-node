import { UserDocument, PartnerDocument } from "./documents";

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument;
      partner?: PartnerDocument;
      logo?: string;
      photos?: Array<string>;
      token?: string;
      coordinates?: [number, number];
    }
  }
}
