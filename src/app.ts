import express from 'express';
import './db/mongoose.js';
import { patientRouter } from './routers/patientRouter.js';
import { medicineRouter } from './routers/medicineRouter.js';
import { staffRouter } from './routers/staffRouter.js';
import { defaultRouter } from './routers/default.router.js';
import { recordRouter } from './routers/recordRouter.js';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

export const app = express();
app.use(express.json());
app.use(patientRouter);
app.use(medicineRouter);
app.use(staffRouter);
app.use(recordRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(defaultRouter);