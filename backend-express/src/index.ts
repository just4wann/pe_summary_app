import './env/index.js'

import express from "express";
import cors from 'cors';

import { SequelizeDB } from "@/db/index.js";
import { Routes } from "./routes/index.js";
import { errorMiddleware, authMiddleware } from "./middleware/index.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors({
  origin: process.env.URL_ALLOWED_ORIGIN,
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(cookieParser());

const publicRouter = express.Router();
const apiRouter = express.Router();
const sequelize = new SequelizeDB();
const routes = new Routes(publicRouter, apiRouter);

routes.setupPublicRouter();

apiRouter.use(authMiddleware);
routes.setupApiRouter();

app.use('/api', publicRouter);
app.use('/api/current', apiRouter);
app.use(errorMiddleware);

app.listen(Number(process.env.SERVER_PORT), process.env.SERVER_HOST!, () => {
  console.log(`server listening on http://${process.env.SERVER_HOST} ${process.env.SERVER_PORT}`);
});

sequelize.connectDB();
sequelize.syncDB();