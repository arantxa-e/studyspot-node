import { Request } from "express";
import createError from "http-errors";

export const validateRequest = (req: Request, validParams: string[]) => {
  const isValidRequest = Object.keys(req.body).every((param) =>
    validParams.includes(param)
  );

  if (!isValidRequest) {
    throw createError(400, "Invalid parameters provided.");
  }
};
