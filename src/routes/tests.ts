import express, { Request, Response, Router } from "express";
import { DBType } from "../db/db";
import { HTTP_STATUSES } from "../utils";

export const getTestsRouter = (db: DBType) => {
    const router: Router = express.Router();

    router.delete('/data', (_req: Request, res: Response) => {
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};
