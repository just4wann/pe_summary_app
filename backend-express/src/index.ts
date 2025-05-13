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
  origin: 'http://localhost:5173',
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(cookieParser());

const publicRouter = express.Router();
const apiRouter = express.Router();
const port = "3000";
const sequelize = new SequelizeDB();
const routes = new Routes(publicRouter, apiRouter);

routes.setupPublicRouter();

apiRouter.use(authMiddleware);
routes.setupApiRouter();

app.use('/api', publicRouter);
app.use('/api/current', apiRouter);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

sequelize.connectDB();
sequelize.syncDB();