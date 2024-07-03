import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import {
  checkJwt,
  decodeJwt,
  routesExcludedFromJwtAuthentication,
  requestLogger,
  unless
} from "./src/middleware/index";
import { logger } from "./src/lib/index";

dotenv.config()

// Middleware to log unhandled exceptions
process.on('uncaughtException', (ex) => {
  logger.error(`Uncaught exception: ${ex.message}`, ex);
  process.exit(1); // Exit the process (optional)
});

// Middleware to disable inspector
process.on('SIGUSR1', (ex) => {
  logger.error(`Uncaught exception: ${ex}`, ex)
  process.exit(1)
})

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use(unless(routesExcludedFromJwtAuthentication, checkJwt), decodeJwt);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ message: err.message, code: err.name, name: err.stack });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return res.status(err.status).json({ message: err.message, code: err.code });
});

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
}

app.listen(port, () => {
  logger.info(`Server is up and running at port: ${port}.`);
});

export default app;