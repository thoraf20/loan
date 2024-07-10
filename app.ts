import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import {
  checkJwt,
  decodeJwt,
  routesExcludedFromJwtAuthentication,
  requestLogger,
  unless
} from "./src/middleware/index";
import { logger } from "./src/lib/index";
import v1Router from "./url"

dotenv.config()

// Middleware to log unhandled exceptions
process.on('uncaughtException', (reason: Error) => {
  logger.error(`Uncaught exception: ${reason.message}`, reason.message)
});

// Middleware to disable inspector
process.on('SIGUSR1', (reason: Error) => {
  logger.error(`Uncaught exception: ${reason.message}`, reason.message)
})

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use(unless(routesExcludedFromJwtAuthentication, checkJwt), decodeJwt);
app.use('/v1', v1Router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ message: err.message, code: err.name, name: err.stack });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return res.status(err.status).json({ message: err.message, code: err.code });
});

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({ contentSecurityPolicy: false }))
}

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
  retryWrites: true,
  w: 'majority',
})
mongoose.connection.on('error', (error) => {
  logger.error('Database connection error: ', error)
})

app.listen(port, () => {
  logger.info(`Server is up and running at port: ${port}.`);
});

export default app;