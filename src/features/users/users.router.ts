import express, { Router, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../types";
import { DBType, UserType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { UserViewModel } from "./models/UserViewModel";
import { QueryUsersModel } from "./models/QueryUsersModel";
import { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";
import { CreateUserModel } from "./models/CreateUserModel";
import { UpdateUserModel } from "./models/UpdateUserModel";

// Information for client (without studentsCount)
export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    };
};

// Router
export const getUsersRouter = (db: DBType) => {
    const router: Router = express.Router();

    // Get all courses or only course by title
    router.get('/', (req: RequestWithQuery<QueryUsersModel>,
                     res: Response<UserViewModel[]>) => {
        let foundEntities = db.users;
        if (req.query.userName) {
            foundEntities = foundEntities.filter(c => c.userName.indexOf(req.query.userName) > -1);
        }

        res.json(foundEntities.map(mapEntityToViewModel));
    });

    // Get course by ID
    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                        res: Response<UserViewModel>) => {
        const foundEntities = db.users.find(c => c.id === +req.params.id);
        if (!foundEntities) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(mapEntityToViewModel(foundEntities));
    });

    // Create new course
    router.post('/', (req: RequestWithBody<CreateUserModel>,
                      res: Response<UserViewModel>) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const createEntity: UserType = {
            id: +(new Date()),
            userName: req.body.userName,
        };

        db.users.push(createEntity);
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityToViewModel(createEntity));
    });

    // Update existing course
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>,
                        res: Response) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundUser = db.users.find(c => c.id === +req.params.id);
        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        foundUser.userName = req.body.userName;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    // Delete existing course
    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>, res: Response) => {
        db.users = db.users.filter(c => c.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};
