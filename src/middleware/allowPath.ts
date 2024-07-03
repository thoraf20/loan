import { Request, Response, NextFunction } from "express";

export const unless = (path: string[], middleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (path.includes(req.path)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};
