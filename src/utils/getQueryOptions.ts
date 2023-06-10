import { Request } from "express";

export const getQueryOptions = (req: Request) => {
  const { limit, skip, sortBy } = req.query;
  const sort: { [key: string]: 1 | -1 } = {};

  if (sortBy && typeof sortBy === "string") {
    if (sortBy.startsWith("-")) {
      sort[sortBy.slice(1)] = -1;
    } else {
      sort[sortBy] = 1;
    }
  }

  const options = {
    limit: Number(limit),
    skip: Number(skip),
    sort,
  };

  return options;
};
