import { Document } from "mongoose";
import { IUser } from "../models/user";
import { IPartner } from "../models/partner";

interface DocumentUser extends IUser, Document {}
interface DocumentPartner extends IPartner, Document {}

declare global {
  namespace Express {
    export interface Request {
      user?: DocumentUser;
      partner?: DocumentPartner;
      token?: string;
      coordinates?: [number, number];
    }
  }
}
