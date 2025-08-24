import express from "express";
import { createFeatured } from "../controllers/FeatureController";

const featureRouter = express.Router();

featureRouter.post("/addFeatured", createFeatured);

export default featureRouter;
