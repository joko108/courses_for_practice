import express, { Router, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../types";
import {CourseType, DBType, UserCourseBindingType, UserType} from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import {UserCourseBindingViewModel} from "./models/UserCourseBindingViewModel";
import {CreateUserCourseBindingModel} from "./models/CreateUserCourseBindingModel";

// Information for client (without studentsCount)
export const mapEntityToViewModel = (dbEntity: UserCourseBindingType, user: UserType, course: CourseType): UserCourseBindingViewModel => {
    return {
        userId: dbEntity.userId,
        courseId: dbEntity.courseId,
        userName: user.userName,
        courseTitle: course.title
    };
};

// Router
export const getUsersCoursesBindingsRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Create new course
    router.post('/', (req: RequestWithBody<CreateUserCourseBindingModel>,
                      res: Response<UserCourseBindingViewModel>) => {


        const user = db.users.find(u => u.id === +req.body.userId);
        const course = db.courses.find(c => c.id === +req.body.courseId);

        if (!user || !course) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const alresdyExistingBinding = db.userCourseBinding.find(b => b.userId === user.id && b.courseId === course.id);

        if (!!alresdyExistingBinding) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const createEntity: UserCourseBindingType = {
            userId: user.id,
            courseId: course.id,
            date: new Date(),
        };

        db.userCourseBinding.push(createEntity);
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityToViewModel(createEntity, user, course));
    });

    return router;
};
