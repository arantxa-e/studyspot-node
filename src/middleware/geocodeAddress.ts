import Geocodio, { GeocodedResponse } from "geocodio-library-node";
import { RequestHandler } from "express";

const geocoder = new Geocodio(process.env.GEOCODIO_API_KEY);

export const geocodeAddress: RequestHandler = async (req, res, next) => {
  const address = req.body.address;
  if (!address) res.status(400).send("Missing address.");

  try {
    const response = await geocoder.geocode(address);
    const location = (response as GeocodedResponse).results[0].location;
    req.coordinates = [location.lng, location.lat];
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};
