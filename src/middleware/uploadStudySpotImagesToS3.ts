import { RequestHandler } from "express";
import sharp from "sharp";
import AWS from "aws-sdk";
import path from "path";
import createError from "http-errors";

export const uploadStudySpotImagesToS3: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const s3 = new AWS.S3();

    if (!req.files) throw createError(400, "Please provide images to upload.");

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const logo = files.logo[0];
    const photos = files.photos;

    if (logo) {
      const resizedImage = await sharp(logo.buffer)
        .resize(250)
        .png()
        .toBuffer();

      const upload = await s3
        .upload({
          Body: resizedImage,
          Bucket: "studyspot",
          Key: `${req.params.id}/logo/${
            path.parse(logo.originalname).name
          }.png`,
        })
        .promise();

      req.logo = upload.Location;
    }

    if (photos?.length) {
      const uploadPhotosQueue: Promise<any>[] = [];

      for (const photo of photos) {
        try {
          const resizedImage = await sharp(photo.buffer)
            .resize(250)
            .png()
            .toBuffer();

          uploadPhotosQueue.push(
            s3
              .upload({
                Body: resizedImage,
                Bucket: "studyspot",
                Key: `${req.params.id}/photos/${
                  path.parse(photo.originalname).name
                }.png`,
              })
              .promise()
          );
        } catch (err) {
          throw err;
        }
      }

      const uploads = await Promise.all(uploadPhotosQueue);
      req.photos = uploads.map((upload) => upload.Location);
    }

    next();
  } catch (err) {
    next(err);
  }
};
