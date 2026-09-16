import express, { Express } from "express";
import { getCoursesRouter } from "./features/courses/courses.router";
import { getTestsRouter } from "./routes/tests";
import { db } from "./db/db";
import { getInterestingRouter } from "./routes/getInterestingRouter";
import { getUsersRouter } from "./features/users/users.router";
import {getUsersCoursesBindingsRouter} from "./features/users-courses-bindings/users-courses-bindings.router";

export const app: Express = express();

// URL paths
export const RouterPaths = {
    courses: '/courses',
    users: '/users',
    usersCoursesBindings: '/users-courses-bindings',
    __test__: '/__test__'
};

// Parse JSON
app.use(express.json());

// Routers
app.use(RouterPaths.courses, getCoursesRouter(db));
app.use(RouterPaths.users, getUsersRouter(db));
app.use(RouterPaths.usersCoursesBindings, getUsersCoursesBindingsRouter(db));
app.use(RouterPaths.__test__, getTestsRouter(db));
// app.use('/interesting', getInterestingRouter(db));
