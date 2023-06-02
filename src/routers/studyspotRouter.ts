import express from "express";
import auth from "../middleware/auth";
import { geocodeAddress } from "../middleware/geocodeAddress";
import StudySpot, { IStudySpot } from "../models/studySpot";
import multer from "multer";
import sharp from "sharp";
import AWS from "aws-sdk";
import path from "path";

const router = express.Router();

router.get("/studyspots", async (req, res) => {
  const { lat, lng, miles } = req.query;

  let studySpots;

  try {
    if (lat && lng && miles) {
      const radius = Number(miles) / 3963.2;
      const coords = [Number(lng), Number(lat)];

      studySpots = await StudySpot.find({
        location: {
          $geoWithin: {
            $centerSphere: [coords, radius],
          },
        },
      });
    } else {
      studySpots = await StudySpot.find();
    }

    res.send(studySpots);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/studyspots/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const { limit, skip, sortBy } = req.query;
    const sort: { [key: string]: 1 | -1 } = {};

    if (sortBy && typeof sortBy === "string") {
      if (sortBy.startsWith("-")) {
        sort[sortBy.slice(1)] = -1;
      } else {
        sort[sortBy] = 1;
      }
    }

    const studySpot = await StudySpot.findById(_id).populate({
      path: "reviews",
      options: {
        limit: Number(limit),
        skip: Number(skip),
        sort,
      },
    });

    if (!studySpot) res.status(404).send();

    res.send(studySpot);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Invalid extension"));
    }

    return cb(null, true);
  },
});

const images = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "photos", maxCount: 8 },
]);

const s3 = new AWS.S3();

router.post("/studyspots/:id/upload", auth, images, async (req, res) => {
  try {
    const studySpot = await StudySpot.findOne({
      _id: req.params.id,
      partner: req.partner?._id,
    });

    if (!studySpot) return res.status(404).send();

    if (!req.files)
      return res.status(401).send("Please provide images to upload");

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
          Key: `${studySpot.name}/logo/${
            path.parse(logo.originalname).name
          }.png`,
        })
        .promise();

      studySpot.logo = upload.Location;
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
                Key: `${studySpot.name}/photos/${
                  path.parse(photo.originalname).name
                }.png`,
              })
              .promise()
          );
        } catch (err) {
          console.error(err);
        }
      }

      const uploads = await Promise.all(uploadPhotosQueue);
      studySpot.photos = uploads.map((upload) => upload.Location);
    }

    await studySpot.save();
    res.send(studySpot);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/studyspots", auth, geocodeAddress, async (req, res) => {
  try {
    const studySpot = new StudySpot({
      partner: req.partner?._id,
      location: {
        type: "Point",
        address: req.body.address,
        coordinates: req.coordinates,
      },
      ...req.body,
    });

    await studySpot.save();
    res.status(201).send(studySpot);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/studyspots/:id", auth, geocodeAddress, async (req, res) => {
  try {
    const validParams = Object.keys(StudySpot.schema.obj).filter(
      (param) => param !== "partner"
    );

    const updates = Object.keys(req.body);
    const isValidRequest = updates.every((param) =>
      validParams.includes(param as keyof IStudySpot)
    );

    if (!isValidRequest)
      return res.status(400).send({ error: "Invalid params" });

    const studySpot = await StudySpot.findOne({
      _id: req.params.id,
      partner: req.partner?._id,
    });

    if (!studySpot) return res.status(404).send();

    updates.forEach(
      // @ts-ignore
      (update) => (studySpot[update] = req.body[update])
    );

    await studySpot.save();

    res.send(studySpot);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/studyspots/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedStudySpot = await StudySpot.findOneAndDelete({
      _id,
      partner: req.partner?._id,
    });
    if (!deletedStudySpot) {
      res.status(404).send();
    }
    res.send(deletedStudySpot);
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
