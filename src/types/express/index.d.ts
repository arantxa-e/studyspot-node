import { Document } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      foundUser?: Document;
      token?: string;
    }
  }
}
