import './env/index.js';

import express from 'express';
import cors from 'cors';

import { SequelizeDB } from '@/db/index.js';
import { Routes } from './routes/index.js';
import { errorMiddleware, authMiddleware } from './middleware/index.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/src/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: process.env.URL_ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());

const publicRouter = express.Router();
const protectedRouter = express.Router();
const sequelize = new SequelizeDB();
const routes = new Routes(publicRouter, protectedRouter);

routes.setupPublicRouter();
protectedRouter.use(authMiddleware);
routes.setupProtectedRouter();

app.use('/api', publicRouter);
app.use('/api/current', protectedRouter);
app.use(errorMiddleware);

app.listen(Number(process.env.SERVER_PORT), process.env.SERVER_HOST!, () => {
  console.log(`server listening on http://${process.env.SERVER_HOST} ${process.env.SERVER_PORT}`);
});

sequelize.connectDB();
sequelize.syncDB();
