import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const todayDate = new Date();
  console.log(
    `Estas pasando por la ruta: ${req.path}, usando el método ${req.method} en la fecha ${todayDate}`,
  );
  next();
};
