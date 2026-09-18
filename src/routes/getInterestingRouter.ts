import { DBType } from "../db/db";
import express, { Response, Router } from "express";
import { RequestWithParams, RequestWithQuery } from "../types";
import { QueryCoursesModel } from "../features/courses/models/QueryCoursesModel";
import { URIParamsCourseIdModel } from "../features/courses/models/URIParamsCourseIdModel";

export const getInterestingRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Get all courses or only course by title
    router.get('/books', (_req: RequestWithQuery<QueryCoursesModel>,
                          res: Response) => {

        res.json({ title: "it's books handler" });
    });

    // Get course by ID
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                        res: Response) => {

        res.json({ title: "data by id: " + req.params.id });
    });

    return router;
};
