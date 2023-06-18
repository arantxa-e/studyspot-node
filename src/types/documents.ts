import { Document } from "mongoose";
import { IUser } from "../models/user";
import { IPartner } from "../models/partner";

export interface UserDocument extends IUser, Document {}
export interface PartnerDocument extends IPartner, Document {}
