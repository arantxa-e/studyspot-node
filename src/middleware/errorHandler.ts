import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res) => {
  res.status(error.status || 500).send(error.message);
};
