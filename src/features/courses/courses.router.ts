import express, { Router, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../types";
import { CreateCourseModel } from "./models/CreateCourseModel";
import { QueryCoursesModel } from "./models/QueryCoursesModel";
import { CourseViewModel } from "./models/CourseViewModel";
import { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel";
import { UpdateCourseModel } from "./models/UpdateCourseModel";
import { CourseType, DBType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";

// Information for client (without studentsCount)
export const getCourseToViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    };
};

// Router
export const getCoursesRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Get all courses or only course by title
    router.get('/', (req: RequestWithQuery<QueryCoursesModel>,
                     res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
        }

        res.json(foundCourses.map(getCourseToViewModel));
    });

    // Get course by ID
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                        res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getCourseToViewModel(foundCourse));
    });

    // Create new course
    router.post('/', (req: RequestWithBody<CreateCourseModel>,
                      res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const createCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };

        db.courses.push(createCourse);
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseToViewModel(createCourse));
    });

    // Update existing course
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
                        res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        foundCourse.title = req.body.title;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    // Delete existing course
    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};
